import { apiClient } from './client';

export interface CallbackFormData {
  name: string;
  phone: string;
  email?: string;
  preferred_time?: string;
}

export interface BrokerFormData {
  name: string;
  phone: string;
  email?: string;
  budget?: string;
  property_type?: string;
  location?: string;
}

export interface FormResponse {
  success: boolean;
  message: string;
  data?: Record<string, unknown>;
  redirect_url?: string; // For BrokerForm
}

export async function submitCallbackForm(data: CallbackFormData): Promise<FormResponse> {
  return apiClient.post<FormResponse>('/api/v1/forms/callback', data);
}

export async function submitBrokerForm(data: BrokerFormData): Promise<FormResponse> {
  return apiClient.post<FormResponse>('/api/v1/forms/broker', data);
}
