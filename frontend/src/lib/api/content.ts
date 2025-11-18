import { apiClient } from './client';

export interface ContentSection {
  id: string;
  section_key: string;
  section_type: 'hero' | 'benefits' | 'testimonials' | 'faq' | 'cta' | 'text' | 'contact';
  content: Record<string, unknown>;
  sort_order: number;
}

export interface ContentPage {
  id: string;
  page_key: string;
  title: string;
  description: string;
  sections: ContentSection[];
}

export async function getBuyerLandingContent(): Promise<ContentPage> {
  return apiClient.get<ContentPage>('/api/v1/content/buyer-landing');
}

export async function getSellerLandingContent(): Promise<ContentPage> {
  return apiClient.get<ContentPage>('/api/v1/content/seller-landing');
}

export async function getAboutContent(): Promise<ContentPage> {
  return apiClient.get<ContentPage>('/api/v1/content/about');
}

export async function getContactContent(): Promise<ContentPage> {
  return apiClient.get<ContentPage>('/api/v1/content/contact');
}

export async function getHomeContent(): Promise<ContentPage> {
  return apiClient.get<ContentPage>('/api/v1/content/home');
}
