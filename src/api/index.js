// @flow
import apiClient, { apiVersion } from './axios';

export const getRequest = async (endpoint: string, client: 'api' | 'app' = 'api'): Promise<any> => {
  const finalEndpoint = client === 'app' ? endpoint : '/api/' + apiVersion + '/' + endpoint;
  const response = await apiClient.get(finalEndpoint);

  return response.data;
};

export const postRequest = async (endpoint: string, payload: any, client: 'api' | 'app' = 'api'): Promise<any> => {
  const finalEndpoint = client === 'app' ? endpoint : '/api/' + apiVersion + '/' + endpoint;
  const response = await apiClient.post(finalEndpoint, payload);

  return response.data;
};

export const putRequest = async (endpoint: string, payload: any, client: 'api' | 'app' = 'api'): Promise<any> => {
  const finalEndpoint = client === 'app' ? endpoint : '/api/' + apiVersion + '/' + endpoint;
  const response = await apiClient.put(finalEndpoint, payload);

  return response.data;
};

export const deleteRequest = async (endpoint: string, client: 'api' | 'app' = 'api'): Promise<any> => {
  const finalEndpoint = client === 'app' ? endpoint : '/api/' + apiVersion + '/' + endpoint;
  const response = await apiClient.delete(finalEndpoint);

  return response.data;
};

export const orcidOAuth = async (finalEndpoint: string, payload: any): Promise<any> => {
  const authResponse: any = await apiClient.post('/api/' + apiVersion + '/auth/orcid', payload);

  if (authResponse && authResponse.status === 200) {
    const response: any = await apiClient.post('/api/' + apiVersion + finalEndpoint, authResponse.data);

    return response.data;
  }
};

export type ApiHandlerOptions = {
  success?: string,
  showError?: boolean,
};
