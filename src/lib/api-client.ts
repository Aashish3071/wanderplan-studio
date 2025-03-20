import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

// Define the standard API response structure
export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  error?: string;
  meta?: {
    pagination?: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

// Custom API error class
export class ApiError extends Error {
  status: number;
  data: any;

  constructor(message: string, status: number, data?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

// Create axios instance with defaults
const axiosInstance = axios.create({
  baseURL: '', // Empty baseURL to ensure relative URLs work correctly
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  timeout: 15000,
});

// Response interceptor for standardized error handling
axiosInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const status = error.response?.status || 500;

    // Safely access error message from response data
    const responseData = (error.response?.data as Record<string, any>) || {};
    const message =
      responseData.message || responseData.error || error.message || 'An unexpected error occurred';

    return Promise.reject(new ApiError(message, status, error.response?.data));
  }
);

// API client methods
export const apiClient = {
  // GET request
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await axiosInstance.get<ApiResponse<T>>(url, config);
      return response.data;
    } catch (error) {
      if (error instanceof ApiError) {
        return {
          success: false,
          data: {} as T,
          error: error.message,
        };
      }
      return {
        success: false,
        data: {} as T,
        error: 'Request failed',
      };
    }
  },

  // POST request
  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await axiosInstance.post<ApiResponse<T>>(url, data, config);
      return response.data;
    } catch (error) {
      if (error instanceof ApiError) {
        return {
          success: false,
          data: {} as T,
          error: error.message,
        };
      }
      return {
        success: false,
        data: {} as T,
        error: 'Request failed',
      };
    }
  },

  // PUT request
  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await axiosInstance.put<ApiResponse<T>>(url, data, config);
      return response.data;
    } catch (error) {
      if (error instanceof ApiError) {
        return {
          success: false,
          data: {} as T,
          error: error.message,
        };
      }
      return {
        success: false,
        data: {} as T,
        error: 'Request failed',
      };
    }
  },

  // PATCH request
  async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await axiosInstance.patch<ApiResponse<T>>(url, data, config);
      return response.data;
    } catch (error) {
      if (error instanceof ApiError) {
        return {
          success: false,
          data: {} as T,
          error: error.message,
        };
      }
      return {
        success: false,
        data: {} as T,
        error: 'Request failed',
      };
    }
  },

  // DELETE request
  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response = await axiosInstance.delete<ApiResponse<T>>(url, config);
      return response.data;
    } catch (error) {
      if (error instanceof ApiError) {
        return {
          success: false,
          data: {} as T,
          error: error.message,
        };
      }
      return {
        success: false,
        data: {} as T,
        error: 'Request failed',
      };
    }
  },
};

// Main export
export default apiClient;
