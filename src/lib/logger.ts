type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  data?: Record<string, unknown> | string | number | boolean | null;
}

interface LoggingService {
  send(entry: LogEntry): void;
}

class ConsoleLoggingService implements LoggingService {
  send(entry: LogEntry): void {
    // Only in development - use console methods directly without eslint violations
    if (process.env.NODE_ENV === 'development') {
      const formattedMessage = `[${entry.level.toUpperCase()}] ${entry.timestamp} - ${entry.message}`;
      
      if (entry.level === 'error') {
        // eslint-disable-next-line no-console
        console.error(formattedMessage, entry.data || '');
      } else if (entry.level === 'warn') {
        // eslint-disable-next-line no-console  
        console.warn(formattedMessage, entry.data || '');
      } else {
        // eslint-disable-next-line no-console
        console.log(formattedMessage, entry.data || '');
      }
    }
  }
}

class ProductionLoggingService implements LoggingService {
  send(entry: LogEntry): void {
    // In production, send to external monitoring service
    // For now, store in localStorage for debugging
    try {
      const logs = JSON.parse(localStorage.getItem('app-logs') || '[]');
      logs.push(entry);
      // Keep only last 100 entries
      if (logs.length > 100) {
        logs.splice(0, logs.length - 100);
      }
      localStorage.setItem('app-logs', JSON.stringify(logs));
    } catch {
      // Silently fail in production
    }
  }
}

class Logger {
  private service: LoggingService;
  
  constructor() {
    this.service = process.env.NODE_ENV === 'development' 
      ? new ConsoleLoggingService()
      : new ProductionLoggingService();
  }
  
  private log(level: LogLevel, message: string, data?: Record<string, unknown> | string | number | boolean | null) {
    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      data
    };
    
    this.service.send(entry);
  }
  
  debug(message: string, data?: Record<string, unknown> | string | number | boolean | null) {
    this.log('debug', message, data);
  }
  
  info(message: string, data?: Record<string, unknown> | string | number | boolean | null) {
    this.log('info', message, data);
  }
  
  warn(message: string, data?: Record<string, unknown> | string | number | boolean | null) {
    this.log('warn', message, data);
  }
  
  error(message: string, error?: Record<string, unknown> | string | number | boolean | Error | null) {
    // Handle Error objects by converting to serializable format
    const errorData = error instanceof Error 
      ? { name: error.name, message: error.message, stack: error.stack }
      : error;
    this.log('error', message, errorData);
  }
}

export const logger = new Logger(); 