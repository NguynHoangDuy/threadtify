import axios from 'axios';
import type { AxiosRequestConfig } from 'axios';

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

const httpClient = axios.create({
     baseURL: import.meta.env.VITE_API_BASE_URL,
     timeout: 10000,
     headers: {
          'Content-Type': 'application/json',
     },
});
export const callAPI = async (method: HttpMethod, url: string, data?: object) => {
     try {
          const config: AxiosRequestConfig = {
               method,
               url,
               data,
          };
          const response = await httpClient.request(config);
          return response.data;
     } catch (error) {
          console.error('API Error:', error);
          throw error;
     }
};
