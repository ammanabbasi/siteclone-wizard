type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  data?: any;
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development';
  
  private log(level: LogLevel, message: string, data?: any) {
    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      data
    };
    
    // In production, send to monitoring service instead
    if (this.isDevelopment) {
      const consoleMethod = level === 'error' ? console.error : 
                          level === 'warn' ? console.warn : 
                          console.log;
      
      consoleMethod(`[${level.toUpperCase()}]`, message, data || '');
    } else {
      // In production, you would send to a logging service
      // For now, only log errors and warnings
      if (level === 'error' || level === 'warn') {
        console[level](entry);
      }
    }
  }
  
  debug(message: string, data?: any) {
    this.log('debug', message, data);
  }
  
  info(message: string, data?: any) {
    this.log('info', message, data);
  }
  
  warn(message: string, data?: any) {
    this.log('warn', message, data);
  }
  
  error(message: string, error?: any) {
    this.log('error', message, error);
  }
}

export const logger = new Logger(); 