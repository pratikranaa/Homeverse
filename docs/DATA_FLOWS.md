# Data Flows

This document details the flow of data within the Homeverse application, covering content retrieval and form submission processes.

## 1. Content Retrieval Flow

### Overview
The frontend fetches page structure and static content from the **Custom Backend** and dynamic blog content from **Strapi**.

### Flow Diagram
```mermaid
sequenceDiagram
    participant User
    participant Frontend as Next.js Frontend
    participant CustomBE as Custom Backend
    participant Strapi as Strapi CMS
    participant DB as PostgreSQL

    User->>Frontend: Requests Page (e.g., /)
    
    par Fetch Page Content
        Frontend->>CustomBE: GET /api/v1/content/home
        CustomBE->>DB: Query ContentPage & ContentSections
        DB-->>CustomBE: Return Page Data
        CustomBE-->>Frontend: Return JSON { sections: [...] }
    and Fetch Blog Content
        Frontend->>Strapi: GET /api/blog-posts
        Strapi->>DB: Query Blog Posts
        DB-->>Strapi: Return Post Data
        Strapi-->>Frontend: Return JSON { data: [...] }
    end

    Frontend->>Frontend: Merge & Render HTML
    Frontend-->>User: Display Page
```

### Data Structures
*   **Page Content (Custom Backend)**:
    ```json
    {
      "success": true,
      "data": {
        "page": "home",
        "sections": [
          {
            "id": "hero-1",
            "type": "hero",
            "title": "Welcome...",
            "sort_order": 1
          },
          ...
        ]
      }
    }
    ```
*   **Blog Content (Strapi)**:
    ```json
    {
      "data": [
        {
          "id": 1,
          "title": "Top 10 Tips...",
          "slug": "top-10-tips",
          ...
        }
      ],
      "meta": { ... }
    }
    ```

## 2. Form Submission Flow

### Overview
When a user submits a form (Callback or Broker Inquiry), the data is sent to the Custom Backend for processing and storage.

### Flow Diagram
```mermaid
sequenceDiagram
    participant User
    participant Frontend as Next.js Frontend
    participant CustomBE as Custom Backend
    participant DB as PostgreSQL

    User->>Frontend: Fills Form & Clicks Submit
    Frontend->>CustomBE: POST /api/v1/forms/callback
    
    Note over Frontend,CustomBE: Payload: { name, phone, email }

    CustomBE->>CustomBE: Validate Input
    
    alt Validation Success
        CustomBE->>DB: INSERT into callback_requests
        DB-->>CustomBE: Return Created Record
        CustomBE-->>Frontend: Return 201 Created
        Frontend-->>User: Show Success Message
    else Validation Failure
        CustomBE-->>Frontend: Return 400 Bad Request
        Frontend-->>User: Show Error Message
    end
```

### Form Payloads

#### Callback Request
*   **Endpoint**: `/api/v1/forms/callback`
*   **Method**: `POST`
*   **Body**:
    ```json
    {
      "name": "John Doe",
      "phone": "+1234567890",
      "email": "john@example.com" // Optional
    }
    ```

#### Broker Inquiry
*   **Endpoint**: `/api/v1/forms/broker`
*   **Method**: `POST`
*   **Body**:
    ```json
    {
      "name": "Jane Smith",
      "phone": "+1987654321",
      "location": "New York",
      "property_type": "Commercial"
    }
    ```
