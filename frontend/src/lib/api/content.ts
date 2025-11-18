import { apiClient } from './client';

export interface ContentSection {
  id: string;
  type: 'hero' | 'benefits' | 'testimonials' | 'faq' | 'cta' | 'text' | 'contact' | 'features' | 'banner' | 'team';
  sort_order?: number;
  [key: string]: unknown;
}

export interface ContentPage {
  id: string;
  page_key: string;
  title: string;
  description: string;
  sections: ContentSection[];
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export async function getBuyerLandingContent(): Promise<ContentPage> {
  const response = await apiClient.get<ApiResponse<ContentPage>>('/api/v1/content/buyer-landing');
  return response.data;
}

export async function getSellerLandingContent(): Promise<ContentPage> {
  const response = await apiClient.get<ApiResponse<ContentPage>>('/api/v1/content/seller-landing');
  return response.data;
}

export async function getAboutContent(): Promise<ContentPage> {
  const response = await apiClient.get<ApiResponse<ContentPage>>('/api/v1/content/about');
  return response.data;
}

export async function getContactContent(): Promise<ContentPage> {
  const response = await apiClient.get<ApiResponse<ContentPage>>('/api/v1/content/contact');
  return response.data;
}

export async function getHomeContent(): Promise<ContentPage> {
  const response = await apiClient.get<ApiResponse<ContentPage>>('/api/v1/content/home');
  return response.data;
}
