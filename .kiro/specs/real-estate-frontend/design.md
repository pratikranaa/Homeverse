# Design Document

## Overview

This design document outlines the architecture for a modern, SEO-optimized real-estate marketing and blogging website frontend built with Next.js 14+ App Router. The application follows a clean, minimalist design aesthetic with emphasis on performance, accessibility, and user experience.

### Design Principles

- **Modern Minimalism**: Clean layouts with generous whitespace, neutral backgrounds, and vibrant accents
- **Performance First**: Server-side rendering, code splitting, image optimization, and caching
- **Mobile-First**: Responsive design starting from mobile viewports
- **Accessibility**: WCAG AA compliance with semantic HTML and keyboard navigation
- **SEO Optimized**: Dynamic metadata, structured data, and Open Graph tags
- **Component-Driven**: Reusable, composable components with clear separation of concerns
- **Type Safety**: Full TypeScript implementation with strict type checking

## Architecture

### High-Level Architecture Diagram

```mermaid
graph TB
    subgraph "Frontend Application - Next.js 14"
        subgraph "App Router Pages"
            HOME[/ - Buyer Landing]
            SELLER[/seller - Seller Landing]
            BLOGS[/blogs - Blog Listing]
            BLOG_DETAIL[/blogs/[slug] - Blog Detail]
            ABOUT[/about - About Page]
            CONTACT[/contact - Contact Page]
        end
        
        subgraph "Components Layer"
            LAYOUT[Layout Components]
            SECTIONS[Section Components]
            UI[UI Components]
            FORMS[Form Components]
        end
        
        subgraph "Data Layer"
            API_CLIENT[API Client]
            CONTENT_SERVICE[Content Service]
            BLOG_SERVICE[Blog Service]
            FORM_SERVICE[Form Service]
        end
    end
    
    subgraph "Backend Services"
        CUSTOM_BE[Custom Backend]
        STRAPI_BE[Strapi Backend]
    end
    
    HOME --> LAYOUT
    HOME --> SECTIONS
    HOME --> FORMS
    SELLER --> LAYOUT
    SELLER --> SECTIONS
    BLOGS --> LAYOUT
    BLOGS --> UI
    BLOG_DETAIL --> LAYOUT
    BLOG_DETAIL --> UI
    
    SECTIONS --> UI
    FORMS --> UI
    
    HOME --> CONTENT_SERVICE
    SELLER --> CONTENT_SERVICE
    ABOUT --> CONTENT_SERVICE
    CONTACT --> CONTENT_SERVICE
    
    BLOGS --> BLOG_SERVICE
    BLOG_DETAIL --> BLOG_SERVICE
    
    FORMS --> FORM_SERVICE
    
    CONTENT_SERVICE --> API_CLIENT
    BLOG_SERVICE --> API_CLIENT
    FORM_SERVICE --> API_CLIENT
    
    API_CLIENT --> CUSTOM_BE
    API_CLIENT --> STRAPI_BE
```

### Technology Stack

- **Framework**: Next.js 14.2+ (App Router)
- **Language**: TypeScript 5+
- **Styling**: Tailwind CSS 3.4+
- **UI Components**: shadcn/ui (optional, for complex components)
- **Animations**: Framer Motion 11+ (minimal usage)
- **HTTP Client**: Native fetch with Next.js extensions
- **Form Validation**: Zod
- **Icons**: Lucide React
- **Image Optimization**: Next.js Image component


## Project Structure

```
/app
  /(routes)
    /page.tsx                    # Buyer landing (homepage)
    /seller
      /page.tsx                  # Seller landing
    /blogs
      /page.tsx                  # Blog listing
      /[slug]
        /page.tsx                # Blog detail
    /about
      /page.tsx                  # About page
    /contact
      /page.tsx                  # Contact page
    /layout.tsx                  # Root layout
    /loading.tsx                 # Global loading
    /error.tsx                   # Global error
    /not-found.tsx               # 404 page
  /api                           # API routes (if needed)
    
/components
  /layout
    /Header.tsx                  # Global header
    /Footer.tsx                  # Global footer
    /Navigation.tsx              # Navigation menu
    /MobileMenu.tsx              # Mobile navigation
  /sections
    /HeroSection.tsx             # Hero section
    /BenefitsSection.tsx         # Benefits section
    /TestimonialsSection.tsx     # Testimonials
    /FAQSection.tsx              # FAQ accordion
    /FeaturedBrokersSection.tsx  # Broker cards
    /CitySections.tsx            # City listings
  /forms
    /CallbackForm.tsx            # Callback CTA form
    /BrokerForm.tsx              # Broker CTA form
    /FormInput.tsx               # Form input component
    /FormSelect.tsx              # Form select component
  /ui
    /Button.tsx                  # Button component
    /Card.tsx                    # Card component
    /Input.tsx                   # Input component
    /Select.tsx                  # Select component
    /Skeleton.tsx                # Skeleton loader
    /ErrorMessage.tsx            # Error display
  /blog
    /BlogCard.tsx                # Blog post card
    /BlogContent.tsx             # Rich text renderer
    /Pagination.tsx              # Pagination controls
    /AuthorInfo.tsx              # Author display
    /CategoryBadge.tsx           # Category badge

/lib
  /api
    /client.ts                   # Base API client
    /content.ts                  # Content API functions
    /blog.ts                     # Blog API functions
    /forms.ts                    # Form submission functions
  /utils
    /cn.ts                       # Class name utility
    /formatters.ts               # Date, text formatters
    /validators.ts               # Form validators
  /types
    /content.ts                  # Content types
    /blog.ts                     # Blog types
    /forms.ts                    # Form types
  /constants
    /api.ts                      # API endpoints
    /routes.ts                   # Route paths

/styles
  /globals.css                   # Global styles + Tailwind

/public
  /images                        # Static images
  /fonts                         # Custom fonts (if any)
```

## Components and Interfaces

### Layout Components

#### Header Component
```typescript
// components/layout/Header.tsx
interface HeaderProps {
  transparent?: boolean;
}

// Features:
// - Logo with link to home
// - Navigation links (Home, Seller, Blogs, About, Contact)
// - Mobile hamburger menu
// - Sticky positioning on scroll
// - Transparent variant for hero sections
```

#### Footer Component
```typescript
// components/layout/Footer.tsx
interface FooterProps {
  // No props needed
}

// Features:
// - Company information
// - Quick links
// - Social media links
// - Copyright notice
// - Newsletter signup (optional)
```

#### Navigation Component
```typescript
// components/layout/Navigation.tsx
interface NavigationProps {
  items: NavigationItem[];
  activeRoute: string;
}

interface NavigationItem {
  label: string;
  href: string;
  external?: boolean;
}

// Features:
// - Desktop horizontal navigation
// - Active route highlighting
// - Hover effects
// - Smooth transitions
```

#### MobileMenu Component
```typescript
// components/layout/MobileMenu.tsx
interface MobileMenuProps {
  items: NavigationItem[];
  isOpen: boolean;
  onClose: () => void;
}

// Features:
// - Slide-in menu from right
// - Overlay backdrop
// - Close on route change
// - Smooth animations
```

### Section Components

#### HeroSection Component
```typescript
// components/sections/HeroSection.tsx
interface HeroSectionProps {
  title: string;
  subtitle: string;
  ctaText?: string;
  ctaLink?: string;
  backgroundImage?: string;
  variant?: 'buyer' | 'seller' | 'default';
}

// Features:
// - Full-width hero with background image/gradient
// - Large heading with subtitle
// - Primary CTA button
// - Responsive text sizing
// - Parallax effect (optional)
```

#### BenefitsSection Component
```typescript
// components/sections/BenefitsSection.tsx
interface BenefitsSectionProps {
  title: string;
  benefits: Benefit[];
}

interface Benefit {
  icon: string;
  title: string;
  description: string;
}

// Features:
// - Grid layout (3 columns desktop, 1 column mobile)
// - Icon + title + description cards
// - Hover effects
// - Fade-in on scroll
```

#### TestimonialsSection Component
```typescript
// components/sections/TestimonialsSection.tsx
interface TestimonialsSectionProps {
  title: string;
  testimonials: Testimonial[];
}

interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  avatar?: string;
  rating?: number;
}

// Features:
// - Carousel or grid layout
// - Quote styling
// - Avatar images
// - Star ratings
// - Auto-rotate (optional)
```

#### FAQSection Component
```typescript
// components/sections/FAQSection.tsx
interface FAQSectionProps {
  title: string;
  faqs: FAQ[];
}

interface FAQ {
  id: string;
  question: string;
  answer: string;
}

// Features:
// - Accordion-style expand/collapse
// - Smooth animations
// - One open at a time
// - Keyboard accessible
```

### Form Components

#### CallbackForm Component
```typescript
// components/forms/CallbackForm.tsx
interface CallbackFormProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

interface CallbackFormData {
  name: string;
  phone: string;
  city: string;
}

// Features:
// - Client component with useState
// - Zod validation
// - Loading state during submission
// - Success/error messages
// - Form reset on success
```

#### BrokerForm Component
```typescript
// components/forms/BrokerForm.tsx
interface BrokerFormProps {
  onSuccess?: (redirectUrl: string) => void;
  onError?: (error: string) => void;
}

interface BrokerFormData {
  name: string;
  phone: string;
  city: string;
  propertyType: string;
  budget: string;
}

// Features:
// - Client component with useState
// - Zod validation
// - Loading state during submission
// - Redirect to WhatsApp on success
// - Error handling
```

### UI Components

#### Button Component
```typescript
// components/ui/Button.tsx
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  fullWidth?: boolean;
}

// Features:
// - Multiple variants with Tailwind classes
// - Loading spinner state
// - Disabled state styling
// - Hover and focus effects
```

#### Card Component
```typescript
// components/ui/Card.tsx
interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

// Features:
// - Rounded corners
// - Shadow elevation
// - Optional hover lift effect
// - Padding variants
```

#### Input Component
```typescript
// components/ui/Input.tsx
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

// Features:
// - Label with optional indicator
// - Error state styling
// - Helper text below input
// - Focus ring
```

### Blog Components

#### BlogCard Component
```typescript
// components/blog/BlogCard.tsx
interface BlogCardProps {
  post: BlogPost;
}

interface BlogPost {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  featuredImage: string;
  category: Category;
  author: Author;
  publishedAt: string;
}

// Features:
// - Featured image with aspect ratio
// - Title and excerpt
// - Category badge
// - Author info
// - Publication date
// - Hover effects
// - Link to detail page
```

#### BlogContent Component
```typescript
// components/blog/BlogContent.tsx
interface BlogContentProps {
  content: string; // Rich text from Strapi
}

// Features:
// - Render Strapi rich text format
// - Styled headings, paragraphs, lists
// - Embedded images
// - Code blocks (if needed)
// - Responsive typography
```

#### Pagination Component
```typescript
// components/blog/Pagination.tsx
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

// Features:
// - Previous/Next buttons
// - Page numbers
// - Current page highlighting
// - Disabled states
// - Responsive layout
```


## Data Layer

### API Client

```typescript
// lib/api/client.ts
interface APIClientConfig {
  customBackendUrl: string;
  strapiBackendUrl: string;
}

class APIClient {
  private customBackendUrl: string;
  private strapiBackendUrl: string;

  constructor(config: APIClientConfig) {
    this.customBackendUrl = config.customBackendUrl;
    this.strapiBackendUrl = config.strapiBackendUrl;
  }

  async get<T>(endpoint: string, backend: 'custom' | 'strapi'): Promise<T> {
    const baseUrl = backend === 'custom' ? this.customBackendUrl : this.strapiBackendUrl;
    const response = await fetch(`${baseUrl}${endpoint}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      next: { revalidate: 3600 } // Cache for 1 hour
    });
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }
    
    return response.json();
  }

  async post<T>(endpoint: string, data: any, backend: 'custom' | 'strapi'): Promise<T> {
    const baseUrl = backend === 'custom' ? this.customBackendUrl : this.strapiBackendUrl;
    const response = await fetch(`${baseUrl}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      cache: 'no-store'
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Submission failed');
    }
    
    return response.json();
  }
}

export const apiClient = new APIClient({
  customBackendUrl: process.env.NEXT_PUBLIC_CUSTOM_BACKEND_URL || '',
  strapiBackendUrl: process.env.NEXT_PUBLIC_STRAPI_BACKEND_URL || ''
});
```

### Content Service

```typescript
// lib/api/content.ts
import { apiClient } from './client';

export interface ContentPage {
  page: string;
  sections: ContentSection[];
}

export interface ContentSection {
  id: string;
  type: string;
  [key: string]: any; // Dynamic content fields
}

export async function getBuyerLandingContent(): Promise<ContentPage> {
  return apiClient.get<ContentPage>('/api/v1/content/buyer-landing', 'custom');
}

export async function getSellerLandingContent(): Promise<ContentPage> {
  return apiClient.get<ContentPage>('/api/v1/content/seller-landing', 'custom');
}

export async function getAboutContent(): Promise<ContentPage> {
  return apiClient.get<ContentPage>('/api/v1/content/about', 'custom');
}

export async function getContactContent(): Promise<ContentPage> {
  return apiClient.get<ContentPage>('/api/v1/content/contact', 'custom');
}
```

### Blog Service

```typescript
// lib/api/blog.ts
import { apiClient } from './client';

export interface BlogPost {
  id: number;
  attributes: {
    title: string;
    slug: string;
    content: string;
    excerpt: string;
    featured_image: StrapiImage;
    seo_title?: string;
    seo_description?: string;
    published_at: string;
    category: { data: Category };
    author: { data: Author };
  };
}

export interface Category {
  id: number;
  attributes: {
    name: string;
    slug: string;
    description: string;
  };
}

export interface Author {
  id: number;
  attributes: {
    name: string;
    bio: string;
    avatar: StrapiImage;
    social_links?: any;
  };
}

export interface StrapiImage {
  data: {
    attributes: {
      url: string;
      alternativeText?: string;
      width: number;
      height: number;
    };
  };
}

export interface BlogListResponse {
  data: BlogPost[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export async function getBlogPosts(page: number = 1, pageSize: number = 10): Promise<BlogListResponse> {
  return apiClient.get<BlogListResponse>(
    `/api/blogs?populate=*&pagination[page]=${page}&pagination[pageSize]=${pageSize}`,
    'strapi'
  );
}

export async function getBlogPostBySlug(slug: string): Promise<{ data: BlogPost }> {
  return apiClient.get<{ data: BlogPost }>(
    `/api/blogs/${slug}?populate=*`,
    'strapi'
  );
}

export async function getBlogCategories(): Promise<{ data: Category[] }> {
  return apiClient.get<{ data: Category[] }>('/api/blog-categories', 'strapi');
}

export async function getBlogAuthors(): Promise<{ data: Author[] }> {
  return apiClient.get<{ data: Author[] }>('/api/blog-authors', 'strapi');
}
```

### Form Service

```typescript
// lib/api/forms.ts
import { apiClient } from './client';

export interface CallbackFormData {
  name: string;
  phone: string;
  city: string;
}

export interface BrokerFormData {
  name: string;
  phone: string;
  city: string;
  propertyType: string;
  budget: string;
}

export interface FormSubmissionResponse {
  success: boolean;
  data: {
    submission_id: string;
    status: string;
    message?: string;
    redirect_url?: string;
  };
}

export async function submitCallbackForm(data: CallbackFormData): Promise<FormSubmissionResponse> {
  return apiClient.post<FormSubmissionResponse>('/api/v1/forms/callback', data, 'custom');
}

export async function submitBrokerForm(data: BrokerFormData): Promise<FormSubmissionResponse> {
  return apiClient.post<FormSubmissionResponse>('/api/v1/forms/broker', data, 'custom');
}
```

## Page Implementations

### Buyer Landing Page (Homepage)

```typescript
// app/page.tsx
import { getBuyerLandingContent } from '@/lib/api/content';
import { HeroSection } from '@/components/sections/HeroSection';
import { BenefitsSection } from '@/components/sections/BenefitsSection';
import { TestimonialsSection } from '@/components/sections/TestimonialsSection';
import { FAQSection } from '@/components/sections/FAQSection';
import { CallbackForm } from '@/components/forms/CallbackForm';
import { BrokerForm } from '@/components/forms/BrokerForm';

export async function generateMetadata() {
  return {
    title: 'Find Your Dream Home | Real Estate Platform',
    description: 'Connect with top real estate brokers and find your perfect property',
    openGraph: {
      title: 'Find Your Dream Home',
      description: 'Connect with top real estate brokers',
      images: ['/og-buyer.jpg']
    }
  };
}

export default async function BuyerLandingPage() {
  const content = await getBuyerLandingContent();
  
  return (
    <main>
      {content.sections.map((section) => {
        switch (section.type) {
          case 'hero':
            return <HeroSection key={section.id} {...section} />;
          case 'benefits':
            return <BenefitsSection key={section.id} {...section} />;
          case 'testimonials':
            return <TestimonialsSection key={section.id} {...section} />;
          case 'faq':
            return <FAQSection key={section.id} {...section} />;
          default:
            return null;
        }
      })}
      
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            <CallbackForm />
            <BrokerForm />
          </div>
        </div>
      </section>
    </main>
  );
}
```

### Blog Listing Page

```typescript
// app/blogs/page.tsx
import { getBlogPosts } from '@/lib/api/blog';
import { BlogCard } from '@/components/blog/BlogCard';
import { Pagination } from '@/components/blog/Pagination';

export async function generateMetadata() {
  return {
    title: 'Real Estate Blog | Tips & Insights',
    description: 'Read the latest real estate tips, market insights, and property guides',
  };
}

interface BlogListingPageProps {
  searchParams: { page?: string };
}

export default async function BlogListingPage({ searchParams }: BlogListingPageProps) {
  const page = Number(searchParams.page) || 1;
  const { data: posts, meta } = await getBlogPosts(page, 12);
  
  return (
    <main className="py-16">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8">Blog</h1>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {posts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
        
        <Pagination
          currentPage={meta.pagination.page}
          totalPages={meta.pagination.pageCount}
        />
      </div>
    </main>
  );
}
```

### Blog Detail Page

```typescript
// app/blogs/[slug]/page.tsx
import { getBlogPostBySlug } from '@/lib/api/blog';
import { BlogContent } from '@/components/blog/BlogContent';
import { AuthorInfo } from '@/components/blog/AuthorInfo';
import { CategoryBadge } from '@/components/blog/CategoryBadge';
import { notFound } from 'next/navigation';

export async function generateMetadata({ params }: { params: { slug: string } }) {
  try {
    const { data: post } = await getBlogPostBySlug(params.slug);
    
    return {
      title: post.attributes.seo_title || post.attributes.title,
      description: post.attributes.seo_description || post.attributes.excerpt,
      openGraph: {
        title: post.attributes.title,
        description: post.attributes.excerpt,
        images: [post.attributes.featured_image.data.attributes.url],
        type: 'article',
        publishedTime: post.attributes.published_at
      }
    };
  } catch {
    return {
      title: 'Blog Post Not Found'
    };
  }
}

export default async function BlogDetailPage({ params }: { params: { slug: string } }) {
  try {
    const { data: post } = await getBlogPostBySlug(params.slug);
    
    return (
      <main className="py-16">
        <article className="container mx-auto px-4 max-w-4xl">
          <CategoryBadge category={post.attributes.category.data} />
          
          <h1 className="text-5xl font-bold mt-4 mb-6">
            {post.attributes.title}
          </h1>
          
          <AuthorInfo
            author={post.attributes.author.data}
            publishedAt={post.attributes.published_at}
          />
          
          <img
            src={post.attributes.featured_image.data.attributes.url}
            alt={post.attributes.featured_image.data.attributes.alternativeText || post.attributes.title}
            className="w-full rounded-lg my-8"
          />
          
          <BlogContent content={post.attributes.content} />
        </article>
      </main>
    );
  } catch {
    notFound();
  }
}
```

## Design System

### Color Palette

```css
/* styles/globals.css */
:root {
  /* Primary Colors */
  --color-primary-50: #eff6ff;
  --color-primary-100: #dbeafe;
  --color-primary-500: #3b82f6;
  --color-primary-600: #2563eb;
  --color-primary-700: #1d4ed8;
  
  /* Neutral Colors */
  --color-gray-50: #f9fafb;
  --color-gray-100: #f3f4f6;
  --color-gray-200: #e5e7eb;
  --color-gray-300: #d1d5db;
  --color-gray-500: #6b7280;
  --color-gray-700: #374151;
  --color-gray-900: #111827;
  
  /* Semantic Colors */
  --color-success: #10b981;
  --color-error: #ef4444;
  --color-warning: #f59e0b;
}
```

### Typography Scale

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      fontSize: {
        'display': ['4rem', { lineHeight: '1.1', fontWeight: '700' }],
        'h1': ['3rem', { lineHeight: '1.2', fontWeight: '700' }],
        'h2': ['2.25rem', { lineHeight: '1.3', fontWeight: '600' }],
        'h3': ['1.875rem', { lineHeight: '1.4', fontWeight: '600' }],
        'h4': ['1.5rem', { lineHeight: '1.5', fontWeight: '600' }],
        'body-lg': ['1.125rem', { lineHeight: '1.75' }],
        'body': ['1rem', { lineHeight: '1.75' }],
        'body-sm': ['0.875rem', { lineHeight: '1.5' }],
      }
    }
  }
}
```

### Spacing System

```javascript
// Consistent spacing using Tailwind's default scale
// 4px base unit: 1 = 4px, 2 = 8px, 4 = 16px, 8 = 32px, 16 = 64px

// Section padding: py-16 (64px) or py-24 (96px)
// Container padding: px-4 (16px) or px-6 (24px)
// Card padding: p-6 (24px) or p-8 (32px)
// Element gaps: gap-4 (16px), gap-6 (24px), gap-8 (32px)
```

### Component Styling Patterns

```typescript
// Button variants
const buttonVariants = {
  primary: 'bg-primary-600 text-white hover:bg-primary-700 shadow-md',
  secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300',
  outline: 'border-2 border-primary-600 text-primary-600 hover:bg-primary-50',
  ghost: 'text-gray-700 hover:bg-gray-100'
};

// Card styles
const cardStyles = 'bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6';

// Input styles
const inputStyles = 'w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent';
```

## SEO Strategy

### Metadata Generation

```typescript
// app/layout.tsx
export const metadata = {
  metadataBase: new URL('https://yourdomain.com'),
  title: {
    default: 'Real Estate Platform',
    template: '%s | Real Estate Platform'
  },
  description: 'Find your dream home with top real estate brokers',
  keywords: ['real estate', 'property', 'homes', 'brokers'],
  authors: [{ name: 'Real Estate Platform' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://yourdomain.com',
    siteName: 'Real Estate Platform',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@yourdomain'
  },
  robots: {
    index: true,
    follow: true
  }
};
```

### Structured Data

```typescript
// For blog posts
const blogPostSchema = {
  '@context': 'https://schema.org',
  '@type': 'BlogPosting',
  headline: post.title,
  image: post.featuredImage,
  datePublished: post.publishedAt,
  dateModified: post.updatedAt,
  author: {
    '@type': 'Person',
    name: post.author.name
  },
  publisher: {
    '@type': 'Organization',
    name: 'Real Estate Platform',
    logo: {
      '@type': 'ImageObject',
      url: 'https://yourdomain.com/logo.png'
    }
  }
};
```

## Error Handling

### Error Boundaries

```typescript
// app/error.tsx
'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Something went wrong!</h2>
        <p className="text-gray-600 mb-6">{error.message}</p>
        <button
          onClick={reset}
          className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
```

### 404 Page

```typescript
// app/not-found.tsx
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
        <p className="text-gray-600 mb-8">
          The page you're looking for doesn't exist.
        </p>
        <Link
          href="/"
          className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
```

## Performance Optimization

### Image Optimization

```typescript
// Use Next.js Image component everywhere
import Image from 'next/image';

<Image
  src={imageUrl}
  alt={altText}
  width={800}
  height={600}
  className="rounded-lg"
  loading="lazy"
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,..."
/>
```

### Code Splitting

- Automatic route-based code splitting via App Router
- Dynamic imports for heavy components
- Lazy load below-the-fold content

### Caching Strategy

```typescript
// Static content: revalidate every hour
fetch(url, { next: { revalidate: 3600 } });

// Dynamic content: no cache
fetch(url, { cache: 'no-store' });

// Blog posts: revalidate every 5 minutes
fetch(url, { next: { revalidate: 300 } });
```

## Testing Strategy

### Component Testing
- Unit tests for UI components using Jest + React Testing Library
- Test user interactions, form validation, error states
- Snapshot tests for layout components

### Integration Testing
- Test API integration with mocked responses
- Test form submission flows
- Test navigation and routing

### E2E Testing
- Playwright or Cypress for critical user flows
- Test complete form submission to WhatsApp redirect
- Test blog browsing and reading flow

### Accessibility Testing
- Automated testing with axe-core
- Manual keyboard navigation testing
- Screen reader testing

## Deployment

### Environment Variables

```env
NEXT_PUBLIC_CUSTOM_BACKEND_URL=https://api.yourdomain.com
NEXT_PUBLIC_STRAPI_BACKEND_URL=https://blog.yourdomain.com
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

### Build Configuration

```javascript
// next.config.js
module.exports = {
  images: {
    domains: ['api.yourdomain.com', 'blog.yourdomain.com', 's3.amazonaws.com'],
    formats: ['image/avif', 'image/webp']
  },
  experimental: {
    optimizeCss: true
  }
};
```

### Deployment Platform
- Vercel (recommended for Next.js)
- AWS Amplify
- Netlify
- Self-hosted with Docker

