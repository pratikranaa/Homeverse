export class APIClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async get<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const res = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      next: { revalidate: 60, ...options?.next },
      ...options,
    });

    if (!res.ok) {
      // Try to parse error message from JSON response
      let errorMessage = `API Error: ${res.status} ${res.statusText}`;
      try {
        const errorData = await res.json();
        if (errorData.message) {
          errorMessage = errorData.message;
        } else if (errorData.error && errorData.error.message) {
          errorMessage = errorData.error.message;
        }
      } catch {
        // Ignore JSON parse error
      }
      throw new Error(errorMessage);
    }

    return res.json();
  }

  async post<T>(endpoint: string, body: unknown, options?: RequestInit): Promise<T> {
    const res = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      body: JSON.stringify(body),
      cache: 'no-store',
      ...options,
    });

    if (!res.ok) {
       // Try to parse error message from JSON response
       let errorMessage = `API Error: ${res.status} ${res.statusText}`;
       try {
         const errorData = await res.json();
         if (errorData.message) {
           errorMessage = errorData.message;
         } else if (errorData.error && errorData.error.message) {
           errorMessage = errorData.error.message;
         }
       } catch {
         // Ignore JSON parse error
       }
       throw new Error(errorMessage);
    }

    return res.json();
  }
}

export const apiClient = new APIClient(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000');
export const strapiClient = new APIClient(process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337');
