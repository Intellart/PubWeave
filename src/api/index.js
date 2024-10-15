// @flow
import apiClient from './axios';

export const getRequest = async (endpoint: string): Promise<any> => {
  const response = await apiClient.get(endpoint);

  return response.data;
};

export const postRequest = async (endpoint: string, payload: any): Promise<any> => {
  const response = await apiClient.post(endpoint, payload);

  return response.data;
};

export const putRequest = async (endpoint: string, payload: any): Promise<any> => {
  const response = await apiClient.put(endpoint, payload);

  return response.data;
};

export const deleteRequest = async (endpoint: string): Promise<any> => {
  const response = await apiClient.delete(endpoint);

  return response.data;
};

export const orcidOAuth = async (finalEndpoint: string, payload: any): Promise<any> => {
  const authResponse: any = await apiClient.post('auth/orcid', payload);

  if (authResponse && authResponse.status === 200) {
    const response: any = await apiClient.post(finalEndpoint, authResponse.data);

    return response.data;
  }
};

// CardanoOps

export const postTreasury = async (payload: any): Promise<any> => {
  const response: any = await apiClient.post('/pubweave/cardanoops/build_tx', payload);

  return response.data;
};

export const postSpendTreasury = async (payload: any): Promise<any> => {
  const response: any = await apiClient.post('/pubweave/cardanoops/treasury_spend_build_tx', payload);

  return response.data;
};

export const submitTx = async (payload: any): Promise<any> => {
  const response: any = await apiClient.post('/pubweave/cardanoops/submit_tx', payload);

  return response.data;
};

export const submitSpendTx = async (payload: any): Promise<any> => {
  const response: any = await apiClient.post('/pubweave/cardanoops/treasury_spend_submit_tx', payload);

  return response.data;
};

export const fetchTreasury = async (articleId: number): Promise<any> => {
  const response: any = await apiClient.get(`/pubweave/cardanoops/treasury_status?article_id=${articleId}`);

  return response.data;
};
