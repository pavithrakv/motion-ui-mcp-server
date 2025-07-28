/**
 * Circuit breaker implementation for external API calls
 */
import { logError, logWarning, logInfo } from './logger.js';

export class CircuitBreaker {
  private failures: number = 0;
  private lastFailTime: number = 0;
  private state: 'CLOSED' | 'OPEN' | 'HALF_OPEN' = 'CLOSED';
  
  constructor(
    private readonly failureThreshold: number = 5,
    private readonly timeout: number = 60000, // 1 minute
    private readonly monitoringPeriod: number = 10000 // 10 seconds
  ) {}

  async execute<T>(operation: () => Promise<T>): Promise<T> {
    if (this.state === 'OPEN') {
      if (Date.now() - this.lastFailTime < this.timeout) {
        throw new Error('Circuit breaker is OPEN');
      } else {
        this.state = 'HALF_OPEN';
        logInfo('Circuit breaker moving to HALF_OPEN');
      }
    }

    try {
      const result = await operation();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  private onSuccess(): void {
    this.failures = 0;
    if (this.state === 'HALF_OPEN') {
      this.state = 'CLOSED';
      logInfo('Circuit breaker CLOSED after successful operation');
    }
  }

  private onFailure(): void {
    this.failures++;
    this.lastFailTime = Date.now();

    if (this.failures >= this.failureThreshold) {
      this.state = 'OPEN';
      logWarning(`Circuit breaker OPEN after ${this.failures} failures`);
    }
  }

  getState(): string {
    return this.state;
  }

  getFailures(): number {
    return this.failures;
  }
}

// Create circuit breakers for different types of operations
export const circuitBreakers = {
  external: new CircuitBreaker(5, 60000, 10000), // For external API calls
  github: new CircuitBreaker(3, 30000, 5000)     // For GitHub API specifically
};