// Simple CSS to Tailwind class converter
// This is a basic implementation - in production, consider using a library like windicss

const cssToTailwindMap: Record<string, string> = {
  // Display
  'display: flex': 'flex',
  'display: block': 'block',
  'display: inline-block': 'inline-block',
  'display: grid': 'grid',
  'display: none': 'hidden',

  // Flexbox
  'flex-direction: row': 'flex-row',
  'flex-direction: column': 'flex-col',
  'justify-content: center': 'justify-center',
  'justify-content: space-between': 'justify-between',
  'justify-content: space-around': 'justify-around',
  'align-items: center': 'items-center',
  'align-items: start': 'items-start',
  'align-items: end': 'items-end',

  // Spacing
  'margin: 0': 'm-0',
  'padding: 0': 'p-0',
  'margin-top: 1rem': 'mt-4',
  'margin-bottom: 1rem': 'mb-4',
  'padding: 1rem': 'p-4',
  'padding: 2rem': 'p-8',

  // Typography
  'text-align: center': 'text-center',
  'text-align: left': 'text-left',
  'text-align: right': 'text-right',
  'font-weight: bold': 'font-bold',
  'font-weight: 600': 'font-semibold',
  'font-weight: 500': 'font-medium',

  // Colors
  'color: white': 'text-white',
  'background-color: white': 'bg-white',
  'background-color: black': 'bg-black',

  // Sizing
  'width: 100%': 'w-full',
  'height: 100%': 'h-full',
  'max-width: 100%': 'max-w-full',

  // Position
  'position: relative': 'relative',
  'position: absolute': 'absolute',
  'position: fixed': 'fixed',
  'position: sticky': 'sticky',
}

export function cssToTailwind(cssClasses: string): string {
  // This is a simplified converter
  // In a real implementation, you'd parse actual CSS rules

  const classes = cssClasses.split(' ').filter(Boolean)
  const tailwindClasses: string[] = []

  // Map common Bootstrap/CSS framework classes
  const frameworkMap: Record<string, string> = {
    container: 'container mx-auto',
    row: 'flex flex-wrap',
    col: 'flex-1',
    btn: 'px-4 py-2 rounded',
    'btn-primary': 'bg-blue-500 text-white hover:bg-blue-600',
    'btn-secondary': 'bg-gray-500 text-white hover:bg-gray-600',
    card: 'rounded-lg shadow-md p-4',
    navbar: 'flex items-center justify-between p-4',
    'nav-link': 'px-3 py-2 hover:text-blue-500',
  }

  classes.forEach((cls) => {
    if (frameworkMap[cls]) {
      tailwindClasses.push(frameworkMap[cls])
    } else if (cls.includes('col-')) {
      // Handle grid columns
      const match = cls.match(/col-(\d+)/)
      if (match) {
        const cols = parseInt(match[1])
        tailwindClasses.push(`w-${cols}/12`)
      }
    } else if (cls.includes('text-')) {
      // Handle text sizes
      if (cls === 'text-lg') tailwindClasses.push('text-lg')
      else if (cls === 'text-sm') tailwindClasses.push('text-sm')
      else if (cls === 'text-xl') tailwindClasses.push('text-xl')
    } else if (cls.includes('m-') || cls.includes('p-')) {
      // Handle spacing utilities
      const match = cls.match(/(m|p)([trblxy]?)-(\d+)/)
      if (match) {
        const [, prefix, direction, size] = match
        const sizeMap: Record<string, string> = {
          '1': '1',
          '2': '2',
          '3': '3',
          '4': '4',
          '5': '5',
        }
        tailwindClasses.push(`${prefix}${direction}-${sizeMap[size] || size}`)
      }
    }
  })

  return tailwindClasses.join(' ')
}

export function styleObjectToTailwind(styles: Record<string, string>): string {
  const tailwindClasses: string[] = []

  Object.entries(styles).forEach(([prop, value]) => {
    const cssRule = `${prop}: ${value}`
    if (cssToTailwindMap[cssRule]) {
      tailwindClasses.push(cssToTailwindMap[cssRule])
    } else {
      // Handle dynamic values
      if (prop === 'padding' && value.includes('px')) {
        const px = parseInt(value)
        const rem = Math.round(px / 16)
        tailwindClasses.push(`p-${rem * 4}`)
      } else if (prop === 'margin' && value.includes('px')) {
        const px = parseInt(value)
        const rem = Math.round(px / 16)
        tailwindClasses.push(`m-${rem * 4}`)
      }
    }
  })

  return tailwindClasses.join(' ')
}
