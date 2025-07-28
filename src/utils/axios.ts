/**
 * Axios configuration with GitHub API support
 */
import axiosLib, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { logDebug, logError } from './logger.js';

class AxiosWrapper {
  private instance: AxiosInstance;
  private githubApiKey: string | null = null;

  constructor() {
    this.instance = axiosLib.create({
      timeout: 30000,
      headers: {
        'User-Agent': 'Motion-UI-MCP-Server/1.0.0'
      }
    });

    // Request interceptor for logging
    this.instance.interceptors.request.use(
      (config) => {
        logDebug(`Making request to: ${config.url}`);
        return config;
      },
      (error) => {
        logError('Request error', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor for logging
    this.instance.interceptors.response.use(
      (response) => {
        logDebug(`Response received from: ${response.config.url} (${response.status})`);
        return response;
      },
      (error) => {
        if (error.response) {
          logError(`HTTP Error ${error.response.status} from ${error.config?.url}`, error.response.data);
        } else {
          logError('Network error', error);
        }
        return Promise.reject(error);
      }
    );
  }

  setGitHubApiKey(key: string) {
    this.githubApiKey = key;
    this.instance.defaults.headers.common['Authorization'] = `token ${key}`;
  }

  get(url: string, config?: AxiosRequestConfig) {
    return this.instance.get(url, config);
  }

  post(url: string, data?: any, config?: AxiosRequestConfig) {
    return this.instance.post(url, data, config);
  }

  put(url: string, data?: any, config?: AxiosRequestConfig) {
    return this.instance.put(url, data, config);
  }

  delete(url: string, config?: AxiosRequestConfig) {
    return this.instance.delete(url, config);
  }

  getGitHubApiKey(): string | null {
    return this.githubApiKey;
  }
}

export const axios = new AxiosWrapper();