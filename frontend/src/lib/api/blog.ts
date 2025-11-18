import { strapiClient } from './client';

export interface StrapiImage {
  id: number;
  documentId: string;
  url: string;
  alternativeText: string;
  width: number;
  height: number;
}

export interface Category {
  id: number;
  documentId: string;
  name: string;
  slug: string;
}

export interface Author {
  id: number;
  documentId: string;
  name: string;
  bio: string;
  avatar: StrapiImage;
}

export interface BlogPost {
  id: number;
  documentId: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  publishedAt: string;
  featured_image: StrapiImage;
  category: Category;
  author: Author;
  seo_title?: string;
  seo_description?: string;
}

export interface StrapiResponse<T> {
  data: T[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export interface StrapiSingleResponse<T> {
  data: T;
  meta: Record<string, unknown>;
}

export async function getBlogPosts(page = 1, pageSize = 10): Promise<StrapiResponse<BlogPost>> {
  const query = new URLSearchParams({
    'pagination[page]': page.toString(),
    'pagination[pageSize]': pageSize.toString(),
    'populate': '*',
    'sort': 'publishedAt:desc',
  });
  return strapiClient.get<StrapiResponse<BlogPost>>(`/api/blog-posts?${query.toString()}`);
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const query = new URLSearchParams({
    'filters[slug][$eq]': slug,
    'populate': '*',
  });
  const response = await strapiClient.get<StrapiResponse<BlogPost>>(`/api/blog-posts?${query.toString()}`);
  return response.data.length > 0 ? response.data[0] : null;
}

export async function getBlogCategories(): Promise<StrapiResponse<Category>> {
  return strapiClient.get<StrapiResponse<Category>>('/api/blog-categories?sort=name:asc');
}

export async function getBlogAuthors(): Promise<StrapiResponse<Author>> {
  return strapiClient.get<StrapiResponse<Author>>('/api/blog-authors?populate=*');
}
