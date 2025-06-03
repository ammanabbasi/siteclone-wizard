import { NextRequest, NextResponse } from 'next/server'
import { spawn } from 'child_process'
import * as path from 'path'
import * as fs from 'fs/promises'
import { createServer } from 'net'

// Configuration
const MAX_CONCURRENT_PREVIEWS = parseInt(process.env.MAX_CONCURRENT_PREVIEWS || '5')

// Store running processes
const runningProcesses = new Map<
  string,
  {
    process: any
    port: number
    url: string
    killed: boolean
    startedAt: Date
  }
>()

// Find an available port
async function findAvailablePort(startPort = 3100): Promise<number> {
  return new Promise((resolve) => {
    const server = createServer()
    server.listen(startPort, () => {
      const port = (server.address() as any).port
      server.close(() => resolve(port))
    })
    server.on('error', () => {
      resolve(findAvailablePort(startPort + 1))
    })
  })
}

// Kill oldest process if needed
function killOldestProcessIfNeeded() {
  if (runningProcesses.size >= MAX_CONCURRENT_PREVIEWS) {
    // Find the oldest process
    let oldestId: string | null = null
    let oldestTime = new Date()

    // Convert to array to iterate
    Array.from(runningProcesses.entries()).forEach(([id, info]) => {
      if (!info.killed && info.startedAt < oldestTime) {
        oldestTime = info.startedAt
        oldestId = id
      }
    })

    if (oldestId) {
      const info = runningProcesses.get(oldestId)
      if (info) {
        console.log(`Killing oldest process ${oldestId} to make room`)
        try {
          info.process.kill()
          info.killed = true
        } catch (error) {
          console.error(`Failed to kill process ${oldestId}:`, error)
        }
        runningProcesses.delete(oldestId)
      }
    }
  }
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const outputId = params.id

    // Validate output ID format (UUID)
    if (!/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i.test(outputId)) {
      return NextResponse.json({ error: 'Invalid output ID format' }, { status: 400 })
    }

    const outputDir = path.join(process.cwd(), 'output', outputId)

    // Check if output directory exists
    try {
      await fs.access(outputDir)
    } catch {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    // Check if already running
    if (runningProcesses.has(outputId)) {
      const existingProcess = runningProcesses.get(outputId)
      if (existingProcess && !existingProcess.killed) {
        return NextResponse.json({
          success: true,
          url: existingProcess.url,
          port: existingProcess.port,
          message: 'Project is already running',
        })
      }
      // Remove dead process from map
      runningProcesses.delete(outputId)
    }

    // Kill oldest process if we're at the limit
    killOldestProcessIfNeeded()

    // Find available port
    const port = await findAvailablePort()
    const url = `http://localhost:${port}`

    console.log(`Launching project ${outputId} on port ${port}`)

    // Install dependencies if needed
    const nodeModulesPath = path.join(outputDir, 'node_modules')
    try {
      await fs.access(nodeModulesPath)
      console.log('Dependencies already installed')
    } catch {
      console.log('Installing dependencies...')

      // Check which package manager to use
      let packageManager = 'npm'
      try {
        await fs.access(path.join(outputDir, 'pnpm-lock.yaml'))
        packageManager = 'pnpm'
      } catch {
        try {
          await fs.access(path.join(outputDir, 'yarn.lock'))
          packageManager = 'yarn'
        } catch {
          // Default to npm
        }
      }

      // Run install
      const installProcess = spawn(packageManager, ['install'], {
        cwd: outputDir,
        shell: true,
        env: { ...process.env },
      })

      await new Promise((resolve, reject) => {
        let errorOutput = ''

        installProcess.stderr?.on('data', (data) => {
          errorOutput += data.toString()
        })

        installProcess.on('close', (code) => {
          if (code === 0) {
            resolve(null)
          } else {
            reject(new Error(`Install failed with code ${code}: ${errorOutput}`))
          }
        })
        installProcess.on('error', reject)
      })
    }

    // Start the development server
    const devProcess = spawn('npm', ['run', 'dev', '--', '--port', port.toString()], {
      cwd: outputDir,
      shell: true,
      env: { ...process.env, PORT: port.toString() },
    })

    // Store the process
    runningProcesses.set(outputId, {
      process: devProcess,
      port,
      url,
      killed: false,
      startedAt: new Date(),
    })

    // Handle process output
    devProcess.stdout?.on('data', (data) => {
      console.log(`[${outputId}] ${data}`)
    })

    devProcess.stderr?.on('data', (data) => {
      console.error(`[${outputId}] ${data}`)
    })

    devProcess.on('close', (code) => {
      console.log(`[${outputId}] Process exited with code ${code}`)
      const processInfo = runningProcesses.get(outputId)
      if (processInfo) {
        processInfo.killed = true
      }
    })

    devProcess.on('error', (error) => {
      console.error(`[${outputId}] Process error:`, error)
      const processInfo = runningProcesses.get(outputId)
      if (processInfo) {
        processInfo.killed = true
      }
    })

    // Wait a bit for the server to start
    await new Promise((resolve) => setTimeout(resolve, 5000))

    return NextResponse.json({
      success: true,
      url,
      port,
      message: 'Project launched successfully',
      activeProcesses: runningProcesses.size,
    })
  } catch (error) {
    console.error('Launch error:', error)
    return NextResponse.json(
      {
        error: 'Failed to launch project',
        details: error instanceof Error ? error.message : String(error),
        suggestion:
          error instanceof Error && error.message.includes('Install failed')
            ? 'Try running npm install manually in the output directory'
            : undefined,
      },
      { status: 500 }
    )
  }
}

// Stop a running project
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const outputId = params.id

    // Validate output ID format
    if (!/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i.test(outputId)) {
      return NextResponse.json({ error: 'Invalid output ID format' }, { status: 400 })
    }

    const processInfo = runningProcesses.get(outputId)

    if (!processInfo || processInfo.killed) {
      return NextResponse.json({ error: 'Project is not running' }, { status: 404 })
    }

    // Kill the process
    try {
      // On Windows, we need to kill the entire process tree
      if (process.platform === 'win32') {
        spawn('taskkill', ['/pid', processInfo.process.pid.toString(), '/f', '/t'], { shell: true })
      } else {
        processInfo.process.kill('SIGTERM')
      }
      processInfo.killed = true
      runningProcesses.delete(outputId)
    } catch (error) {
      console.error(`Failed to kill process ${outputId}:`, error)
      return NextResponse.json({ error: 'Failed to stop process properly' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'Project stopped successfully',
      activeProcesses: runningProcesses.size,
    })
  } catch (error) {
    console.error('Stop error:', error)
    return NextResponse.json(
      {
        error: 'Failed to stop project',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    )
  }
}

// Cleanup on process exit
process.on('exit', () => {
  Array.from(runningProcesses.entries()).forEach(([id, info]) => {
    if (!info.killed) {
      try {
        info.process.kill()
      } catch (error) {
        console.error(`Failed to kill process ${id} on exit:`, error)
      }
    }
  })
})
