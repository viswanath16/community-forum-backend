# Community Forum API

A comprehensive backend API for connecting local communities across cities in the Netherlands. This platform enables residents to engage in community events, marketplace transactions, and neighborhood discussions.

[block:api-header]
{
  "title": "Quick Start"
}
[/block]

## Base URLs

- **Development**: `http://localhost:3000`
- **Production**: `https://community-forum-backend.vercel.app`

## Authentication

[block:callout]
{
  "type": "info",
  "title": "JWT Authentication",
  "body": "This API uses JWT Bearer token authentication. Include the token in the Authorization header for protected endpoints."
}
[/block]

```bash
Authorization: Bearer YOUR_JWT_TOKEN
```

## Test Accounts

[block:parameters]
{
  "data": {
    "h-0": "Role",
    "h-1": "Email",
    "h-2": "Password",
    "h-3": "Description",
    "0-0": "**Admin**",
    "0-1": "`admin@communityforum.com`",
    "0-2": "`admin123`",
    "0-3": "Full administrative access",
    "1-0": "**User**",
    "1-1": "`john.doe@example.com`",
    "1-2": "`password123`",
    "1-3": "Standard verified user"
  },
  "cols": 4,
  "rows": 2
}
[/block]

[block:api-header]
{
  "title": "Authentication"
}
[/block]

## Login User

[block:code]
{
  "codes": [
    {
      "code": "POST /api/auth/login",
      "language": "text",
      "name": "Endpoint"
    }
  ]
}
[/block]

Authenticate user and receive JWT token.

[block:code]
{
  "codes": [
    {
      "code": "{\n  \"email\": \"admin@communityforum.com\",\n  \"password\": \"admin123\"\n}",
      "language": "json",
      "name": "Request Body"
    }
  ]
}
[/block]

[block:code]
{
  "codes": [
    {
      "code": "{\n  \"success\": true,\n  \"message\": \"Login successful\",\n  \"data\": {\n    \"user\": {\n      \"id\": \"550e8400-e29b-41d4-a716-446655440000\",\n      \"email\": \"admin@communityforum.com\",\n      \"username\": \"admin\",\n      \"fullName\": \"Admin User\",\n      \"isAdmin\": true,\n      \"neighborhood\": {\n        \"id\": \"550e8400-e29b-41d4-a716-446655440001\",\n        \"name\": \"Centrum\",\n        \"city\": \"Amsterdam\"\n      }\n    },\n    \"token\": \"eyJhbGciOiJIUzI1NiIs...\"\n  }\n}",
      "language": "json",
      "name": "Response"
    }
  ]
}
[/block]

## Register User

[block:code]
{
  "codes": [
    {
      "code": "POST /api/auth/register",
      "language": "text",
      "name": "Endpoint"
    }
  ]
}
[/block]

Create a new user account.

[block:parameters]
{
  "data": {
    "h-0": "Field",
    "h-1": "Type",
    "h-2": "Required",
    "h-3": "Description",
    "0-0": "`email`",
    "0-1": "string",
    "0-2": "✅",
    "0-3": "Valid email address",
    "1-0": "`password`",
    "1-1": "string",
    "1-2": "✅",
    "1-3": "Minimum 8 characters",
    "2-0": "`username`",
    "2-1": "string",
    "2-2": "✅",
    "2-3": "3-20 chars, alphanumeric + underscore",
    "3-0": "`fullName`",
    "3-1": "string",
    "3-2": "✅",
    "3-3": "User's full name",
    "4-0": "`neighborhoodId`",
    "4-1": "uuid",
    "4-2": "❌",
    "4-3": "Neighborhood association"
  },
  "cols": 4,
  "rows": 5
}
[/block]

[block:api-header]
{
  "title": "User Management"
}
[/block]

## Get User Profile

[block:code]
{
  "codes": [
    {
      "code": "GET /api/users/profile",
      "language": "text",
      "name": "Endpoint"
    }
  ]
}
[/block]

[block:callout]
{
  "type": "warning",
  "title": "Authentication Required",
  "body": "This endpoint requires a valid JWT token in the Authorization header."
}
[/block]

Get current user's profile information including recent event registrations and created events.

[block:code]
{
  "codes": [
    {
      "code": "curl -X GET https://community-forum-backend.vercel.app/api/users/profile \\\n  -H \"Authorization: Bearer YOUR_JWT_TOKEN\"",
      "language": "bash",
      "name": "cURL"
    },
    {
      "code": "const response = await fetch('/api/users/profile', {\n  headers: {\n    'Authorization': `Bearer ${token}`\n  }\n});\n\nconst profile = await response.json();",
      "language": "javascript",
      "name": "JavaScript"
    }
  ]
}
[/block]

[block:api-header]
{
  "title": "Events"
}
[/block]

## Get Events

[block:code]
{
  "codes": [
    {
      "code": "GET /api/events",
      "language": "text",
      "name": "Endpoint"
    }
  ]
}
[/block]

Retrieve community events with pagination and filtering options.

### Query Parameters

[block:parameters]
{
  "data": {
    "h-0": "Parameter",
    "h-1": "Type",
    "h-2": "Default",
    "h-3": "Description",
    "0-0": "`page`",
    "0-1": "integer",
    "0-2": "1",
    "0-3": "Page number for pagination",
    "1-0": "`limit`",
    "1-1": "integer",
    "1-2": "10",
    "1-3": "Items per page (max 100)",
    "2-0": "`category`",
    "2-1": "enum",
    "2-2": "-",
    "2-3": "Filter by event category",
    "3-0": "`neighborhoodId`",
    "3-1": "uuid",
    "3-2": "-",
    "3-3": "Filter by neighborhood",
    "4-0": "`search`",
    "4-1": "string",
    "4-2": "-",
    "4-3": "Search in title and description"
  },
  "cols": 4,
  "rows": 5
}
[/block]

### Event Categories

[block:callout]
{
  "type": "info",
  "title": "Available Categories",
  "body": "`SPORTS` • `CULTURAL` • `EDUCATIONAL` • `VOLUNTEER` • `SOCIAL` • `BUSINESS` • `HEALTH` • `ENVIRONMENT` • `TECHNOLOGY` • `OTHER`"
}
[/block]

[block:code]
{
  "codes": [
    {
      "code": "# Get health events\nGET /api/events?category=HEALTH&limit=5\n\n# Search events\nGET /api/events?search=yoga&neighborhoodId=550e8400-e29b-41d4-a716-446655440001",
      "language": "bash",
      "name": "Examples"
    }
  ]
}
[/block]

## Create Event

[block:code]
{
  "codes": [
    {
      "code": "POST /api/events",
      "language": "text",
      "name": "Endpoint"
    }
  ]
}
[/block]

[block:callout]
{
  "type": "danger",
  "title": "Admin Only",
  "body": "Only users with admin privileges can create events."
}
[/block]

[block:code]
{
  "codes": [
    {
      "code": "{\n  \"title\": \"Community Yoga Session\",\n  \"description\": \"Join us for a relaxing yoga session in the park\",\n  \"category\": \"HEALTH\",\n  \"startDate\": \"2025-06-01T09:00:00Z\",\n  \"endDate\": \"2025-06-01T10:30:00Z\",\n  \"location\": \"Vondelpark, Amsterdam\",\n  \"capacity\": 20,\n  \"neighborhoodId\": \"550e8400-e29b-41d4-a716-446655440001\",\n  \"coordinates\": {\n    \"lat\": 52.3579946,\n    \"lng\": 4.8686671\n  }\n}",
      "language": "json",
      "name": "Request Body"
    }
  ]
}
[/block]

## Event Registration

### Register for Event

[block:code]
{
  "codes": [
    {
      "code": "POST /api/events/{id}/register",
      "language": "text",
      "name": "Endpoint"
    }
  ]
}
[/block]

Register current user for an event. Automatically adds to waitlist if capacity is reached.

[block:code]
{
  "codes": [
    {
      "code": "{\n  \"notes\": \"Looking forward to this event!\"\n}",
      "language": "json",
      "name": "Request Body (Optional)"
    }
  ]
}
[/block]

### Unregister from Event

[block:code]
{
  "codes": [
    {
      "code": "DELETE /api/events/{id}/register",
      "language": "text",
      "name": "Endpoint"
    }
  ]
}
[/block]

[block:callout]
{
  "type": "success",
  "title": "Smart Waitlist Management",
  "body": "When a user unregisters, the system automatically promotes the next person from the waitlist if capacity allows."
}
[/block]

## Get Event Categories

[block:code]
{
  "codes": [
    {
      "code": "GET /api/events/categories",
      "language": "text",
      "name": "Endpoint"
    }
  ]
}
[/block]

Returns all available event categories with formatted labels.

[block:api-header]
{
  "title": "Marketplace"
}
[/block]

## Get Marketplace Listings

[block:code]
{
  "codes": [
    {
      "code": "GET /api/marketplace",
      "language": "text",
      "name": "Endpoint"
    }
  ]
}
[/block]

Retrieve marketplace listings with advanced filtering and sorting options.

### Query Parameters

[block:parameters]
{
  "data": {
    "h-0": "Parameter",
    "h-1": "Type",
    "h-2": "Description",
    "h-3": "Values",
    "0-0": "`categoryId`",
    "0-1": "uuid",
    "0-2": "Filter by category",
    "0-3": "-",
    "1-0": "`isFree`",
    "1-1": "boolean",
    "1-2": "Show only free items",
    "1-3": "`true` / `false`",
    "2-0": "`condition`",
    "2-1": "enum",
    "2-2": "Item condition",
    "2-3": "`NEW` `LIKE_NEW` `GOOD` `USED` `WORN`",
    "3-0": "`status`",
    "3-1": "enum",
    "3-2": "Listing status",
    "3-3": "`ACTIVE` `RESERVED` `SOLD` `CLOSED`",
    "4-0": "`minPrice`",
    "4-1": "number",
    "4-2": "Minimum price filter",
    "4-3": "-",
    "5-0": "`maxPrice`",
    "5-1": "number",
    "5-2": "Maximum price filter",
    "5-3": "-",
    "6-0": "`sortBy`",
    "6-1": "enum",
    "6-2": "Sort field",
    "6-3": "`createdAt` `price` `title` `views`",
    "7-0": "`q`",
    "7-1": "string",
    "7-2": "Search query",
    "7-3": "Searches title and description"
  },
  "cols": 4,
  "rows": 8
}
[/block]

[block:code]
{
  "codes": [
    {
      "code": "# Free items only\nGET /api/marketplace?isFree=true\n\n# Price range with condition\nGET /api/marketplace?minPrice=50&maxPrice=500&condition=GOOD\n\n# Search with sorting\nGET /api/marketplace?q=bicycle&sortBy=price&sortOrder=asc",
      "language": "bash",
      "name": "Examples"
    }
  ]
}
[/block]

## Create Listing

[block:code]
{
  "codes": [
    {
      "code": "POST /api/marketplace",
      "language": "text",
      "name": "Endpoint"
    }
  ]
}
[/block]

Create a new marketplace listing.

[block:code]
{
  "codes": [
    {
      "code": "{\n  \"title\": \"Vintage Racing Bicycle\",\n  \"description\": \"Beautiful vintage racing bicycle from the 1980s. Recently serviced with new tires.\",\n  \"price\": 250.00,\n  \"isFree\": false,\n  \"condition\": \"GOOD\",\n  \"images\": [\n    \"https://example.com/bike-front.jpg\",\n    \"https://example.com/bike-side.jpg\"\n  ],\n  \"categoryId\": \"550e8400-e29b-41d4-a716-446655440100\",\n  \"neighborhoodId\": \"550e8400-e29b-41d4-a716-446655440001\",\n  \"tagIds\": [\"550e8400-e29b-41d4-a716-446655440200\"]\n}",
      "language": "json",
      "name": "Request Body"
    }
  ]
}
[/block]

### Validation Rules

[block:callout]
{
  "type": "warning",
  "title": "Validation Requirements",
  "body": "• Title: 3-100 characters\n• Description: 10-2000 characters\n• Images: 1-10 URLs required\n• Price required if not free\n• Category must exist and be active"
}
[/block]

## Marketplace Requests

### Create Purchase Request

[block:code]
{
  "codes": [
    {
      "code": "POST /api/marketplace/{id}/request",
      "language": "text",
      "name": "Endpoint"
    }
  ]
}
[/block]

Create a purchase request for a listing.

[block:code]
{
  "codes": [
    {
      "code": "{\n  \"message\": \"Is this item still available? Can we meet this weekend?\"\n}",
      "language": "json",
      "name": "Request Body"
    }
  ]
}
[/block]

[block:callout]
{
  "type": "info",
  "title": "Business Rules",
  "body": "• Cannot request your own listing\n• One request per user per listing\n• Only active listings accept requests"
}
[/block]

### Update Request Status

[block:code]
{
  "codes": [
    {
      "code": "PUT /api/marketplace/{id}/request/{requestId}",
      "language": "text",
      "name": "Endpoint"
    }
  ]
}
[/block]

[block:callout]
{
  "type": "danger",
  "title": "Seller Only",
  "body": "Only the listing owner can update request status."
}
[/block]

[block:code]
{
  "codes": [
    {
      "code": "{\n  \"status\": \"ACCEPTED\"\n}",
      "language": "json",
      "name": "Request Body"
    }
  ]
}
[/block]

### Request Status Flow

[block:callout]
{
  "type": "success",
  "title": "Automated Status Updates",
  "body": "• `ACCEPTED` → Sets listing to RESERVED\n• `COMPLETED` → Sets listing to SOLD\n• `REJECTED` → No listing status change"
}
[/block]

## Marketplace Search

[block:code]
{
  "codes": [
    {
      "code": "GET /api/marketplace/search",
      "language": "text",
      "name": "Endpoint"
    }
  ]
}
[/block]

Advanced search with full-text search capabilities.

[block:parameters]
{
  "data": {
    "h-0": "Parameter",
    "h-1": "Required",
    "h-2": "Description",
    "0-0": "`query`",
    "0-1": "✅",
    "0-2": "Search term (minimum 2 characters)",
    "1-0": "`category`",
    "1-1": "❌",
    "1-2": "Category UUID filter",
    "2-0": "`minPrice`",
    "2-1": "❌",
    "2-2": "Minimum price filter",
    "3-0": "`maxPrice`",
    "3-1": "❌",
    "3-2": "Maximum price filter",
    "4-0": "`condition`",
    "4-1": "❌",
    "4-2": "Item condition filter",
    "5-0": "`neighborhood`",
    "5-1": "❌",
    "5-2": "Neighborhood UUID filter"
  },
  "cols": 3,
  "rows": 6
}
[/block]

[block:code]
{
  "codes": [
    {
      "code": "GET /api/marketplace/search?query=bicycle&category=sports&minPrice=100&maxPrice=300",
      "language": "bash",
      "name": "Example"
    }
  ]
}
[/block]

## Get User Activity

[block:code]
{
  "codes": [
    {
      "code": "GET /api/marketplace/activity",
      "language": "text",
      "name": "Endpoint"
    }
  ]
}
[/block]

Get current user's marketplace activity including their listings and purchase requests.

## Get Categories

[block:code]
{
  "codes": [
    {
      "code": "GET /api/marketplace/categories",
      "language": "text",
      "name": "Endpoint"
    }
  ]
}
[/block]

Returns hierarchical category structure with listing counts.

[block:api-header]
{
  "title": "Response Format"
}
[/block]

## Success Response

[block:code]
{
  "codes": [
    {
      "code": "{\n  \"success\": true,\n  \"data\": { ... },\n  \"message\": \"Operation successful\",\n  \"pagination\": {\n    \"page\": 1,\n    \"limit\": 10,\n    \"total\": 100,\n    \"totalPages\": 10\n  }\n}",
      "language": "json",
      "name": "Success"
    }
  ]
}
[/block]

## Error Response

[block:code]
{
  "codes": [
    {
      "code": "{\n  \"success\": false,\n  \"error\": \"Error message describing what went wrong\"\n}",
      "language": "json",
      "name": "Error"
    }
  ]
}
[/block]

## HTTP Status Codes

[block:parameters]
{
  "data": {
    "h-0": "Code",
    "h-1": "Meaning",
    "h-2": "Description",
    "0-0": "`200`",
    "0-1": "**Success**",
    "0-2": "Request completed successfully",
    "1-0": "`201`",
    "1-1": "**Created**",
    "1-2": "Resource created successfully",
    "2-0": "`400`",
    "2-1": "**Bad Request**",
    "2-2": "Invalid request data or validation error",
    "3-0": "`401`",
    "3-1": "**Unauthorized**",
    "3-2": "Authentication required or token invalid",
    "4-0": "`403`",
    "4-1": "**Forbidden**",
    "4-2": "Insufficient permissions",
    "5-0": "`404`",
    "5-1": "**Not Found**",
    "5-2": "Resource not found",
    "6-0": "`409`",
    "6-1": "**Conflict**",
    "6-2": "Resource already exists",
    "7-0": "`500`",
    "7-1": "**Server Error**",
    "7-2": "Internal server error"
  },
  "cols": 3,
  "rows": 8
}
[/block]

[block:api-header]
{
  "title": "Code Examples"
}
[/block]

## Authentication Flow

[block:code]
{
  "codes": [
    {
      "code": "// Login and store token\nconst login = async () => {\n  const response = await fetch('/api/auth/login', {\n    method: 'POST',\n    headers: { 'Content-Type': 'application/json' },\n    body: JSON.stringify({\n      email: 'admin@communityforum.com',\n      password: 'admin123'\n    })\n  });\n  \n  const data = await response.json();\n  if (data.success) {\n    localStorage.setItem('token', data.data.token);\n    return data.data.token;\n  }\n};\n\n// Use token for authenticated requests\nconst makeAuthenticatedRequest = async (url, options = {}) => {\n  const token = localStorage.getItem('token');\n  return fetch(url, {\n    ...options,\n    headers: {\n      ...options.headers,\n      'Authorization': `Bearer ${token}`\n    }\n  });\n};",
      "language": "javascript",
      "name": "JavaScript"
    },
    {
      "code": "# Login\ncurl -X POST https://community-forum-backend.vercel.app/api/auth/login \\\n  -H \"Content-Type: application/json\" \\\n  -d '{\"email\":\"admin@communityforum.com\",\"password\":\"admin123\"}'\n\n# Use token for authenticated requests\ncurl -X GET https://community-forum-backend.vercel.app/api/users/profile \\\n  -H \"Authorization: Bearer YOUR_JWT_TOKEN\"",
      "language": "bash",
      "name": "cURL"
    }
  ]
}
[/block]

## Event Management

[block:code]
{
  "codes": [
    {
      "code": "// Create event (admin only)\nconst createEvent = async (eventData) => {\n  const response = await makeAuthenticatedRequest('/api/events', {\n    method: 'POST',\n    headers: { 'Content-Type': 'application/json' },\n    body: JSON.stringify(eventData)\n  });\n  return response.json();\n};\n\n// Register for event\nconst registerForEvent = async (eventId, notes) => {\n  const response = await makeAuthenticatedRequest(`/api/events/${eventId}/register`, {\n    method: 'POST',\n    headers: { 'Content-Type': 'application/json' },\n    body: JSON.stringify({ notes })\n  });\n  return response.json();\n};\n\n// Get events with filtering\nconst getEvents = async (filters = {}) => {\n  const params = new URLSearchParams(filters);\n  const response = await fetch(`/api/events?${params}`);\n  return response.json();\n};",
      "language": "javascript",
      "name": "JavaScript"
    }
  ]
}
[/block]

## Marketplace Operations

[block:code]
{
  "codes": [
    {
      "code": "// Create listing\nconst createListing = async (listingData) => {\n  const response = await makeAuthenticatedRequest('/api/marketplace', {\n    method: 'POST',\n    headers: { 'Content-Type': 'application/json' },\n    body: JSON.stringify(listingData)\n  });\n  return response.json();\n};\n\n// Search marketplace\nconst searchMarketplace = async (searchQuery, filters = {}) => {\n  const params = new URLSearchParams({\n    query: searchQuery,\n    ...filters\n  });\n  const response = await fetch(`/api/marketplace/search?${params}`);\n  return response.json();\n};\n\n// Request item\nconst requestItem = async (listingId, message) => {\n  const response = await makeAuthenticatedRequest(`/api/marketplace/${listingId}/request`, {\n    method: 'POST',\n    headers: { 'Content-Type': 'application/json' },\n    body: JSON.stringify({ message })\n  });\n  return response.json();\n};",
      "language": "javascript",
      "name": "JavaScript"
    }
  ]
}
[/block]

[block:api-header]
{
  "title": "Database Schema"
}
[/block]

## Core Models

[block:parameters]
{
  "data": {
    "h-0": "Model",
    "h-1": "Description",
    "h-2": "Key Relationships",
    "0-0": "**User**",
    "0-1": "User accounts with authentication",
    "0-2": "Belongs to Neighborhood, creates Events/Listings",
    "1-0": "**Neighborhood**",
    "1-1": "Geographic areas within cities",
    "1-2": "Has many Users, Events, Listings",
    "2-0": "**Event**",
    "2-1": "Community events with registration",
    "2-2": "Created by User, has many Registrations",
    "3-0": "**EventRegistration**",
    "3-1": "User event registrations with status",
    "3-2": "Links User to Event with status tracking",
    "4-0": "**MarketListing**",
    "4-1": "Marketplace items for sale/free",
    "4-2": "Belongs to User/Category, has Requests/Reviews",
    "5-0": "**MarketRequest**",
    "5-1": "Purchase requests from buyers",
    "5-2": "Links Buyer to Listing with status",
    "6-0": "**Category**",
    "6-1": "Hierarchical marketplace categories",
    "6-2": "Has parent/child relationships",
    "7-0": "**Tag**",
    "7-1": "Marketplace item tags",
    "7-2": "Many-to-many with Listings"
  },
  "cols": 3,
  "rows": 8
}
[/block]

[block:api-header]
{
  "title": "Business Logic"
}
[/block]

## Event Registration System

[block:callout]
{
  "type": "info",
  "title": "Smart Registration Management",
  "body": "• Users register for events with optional notes\n• Automatic waitlist when capacity reached\n• Waitlist promotion when spots become available\n• Admin-only event creation and management"
}
[/block]

## Marketplace Request System

[block:callout]
{
  "type": "info",
  "title": "Request Workflow",
  "body": "• Buyers create requests with optional messages\n• Sellers can accept, reject, or mark as completed\n• Status changes automatically update listing status\n• One request per user per listing"
}
[/block]

## User Permission System

[block:parameters]
{
  "data": {
    "h-0": "Role",
    "h-1": "Events",
    "h-2": "Marketplace",
    "h-3": "Users",
    "0-0": "**Regular User**",
    "0-1": "View, Register",
    "0-2": "Create listings, Make requests",
    "0-3": "View own profile",
    "1-0": "**Admin**",
    "1-1": "Full CRUD access",
    "1-2": "Moderate all content",
    "1-3": "View all profiles"
  },
  "cols": 4,
  "rows": 2
}
[/block]

[block:api-header]
{
  "title": "Development"
}
[/block]

## Interactive Documentation

[block:callout]
{
  "type": "success",
  "title": "Swagger UI Available",
  "body": "Visit `/api-docs` for interactive API testing interface with live examples."
}
[/block]

## Environment Setup

[block:code]
{
  "codes": [
    {
      "code": "# Clone repository\ngit clone <repository-url>\ncd community-forum-backend\n\n# Install dependencies\nnpm install\n\n# Setup database\nnpm run db:generate\nnpm run db:push\nnpm run db:seed\n\n# Start development server\nnpm run dev",
      "language": "bash",
      "name": "Setup"
    }
  ]
}
[/block]

## Required Environment Variables

[block:code]
{
  "codes": [
    {
      "code": "PRISMA_DATABASE_URL=postgresql://...\nDIRECT_URL=postgresql://...\nJWT_SECRET=your-secret-key\nADMIN_PASSWORD=admin123\nNEXT_PUBLIC_SUPABASE_URL=https://...\nNEXT_PUBLIC_SUPABASE_ANON_KEY=...\nSUPABASE_SERVICE_ROLE_KEY=...",
      "language": "bash",
      "name": "Environment"
    }
  ]
}
[/block]

[block:api-header]
{
  "title": "Security Features"
}
[/block]

## Authentication & Authorization

[block:callout]
{
  "type": "info",
  "title": "Security Measures",
  "body": "• JWT-based authentication with 7-day expiration\n• Role-based access control (Admin/User)\n• Input validation with Zod schemas\n• SQL injection prevention via Prisma ORM\n• XSS protection and sanitization\n• CORS configuration for safe cross-origin requests"
}
[/block]

## Rate Limiting

[block:callout]
{
  "type": "warning",
  "title": "Rate Limits",
  "body": "• Login attempts: 5 per 15 minutes\n• Registration: 3 per hour\n• General API: 100 requests per 15 minutes\n• Event creation: 10 per hour (Admin only)"
}
[/block]

[block:api-header]
{
  "title": "Error Handling"
}
[/block]

## Common Error Scenarios

[block:parameters]
{
  "data": {
    "h-0": "Scenario",
    "h-1": "Status Code",
    "h-2": "Error Message",
    "h-3": "Solution",
    "0-0": "Invalid JWT token",
    "0-1": "401",
    "0-2": "Authentication required",
    "0-3": "Login again to get new token",
    "1-0": "Missing required fields",
    "1-1": "400",
    "1-2": "Validation error: field is required",
    "1-3": "Check request body format",
    "2-0": "Duplicate email/username",
    "2-1": "409",
    "2-2": "User already exists",
    "2-3": "Use different email/username",
    "3-0": "Resource not found",
    "3-1": "404",
    "3-2": "Event/Listing not found",
    "3-3": "Verify the ID exists",
    "4-0": "Permission denied",
    "4-1": "403",
    "4-2": "Admin access required",
    "4-3": "Use admin account",
    "5-0": "Already registered",
    "5-1": "400",
    "5-2": "Already registered for event",
    "5-3": "Cannot register twice"
  },
  "cols": 4,
  "rows": 6
}
[/block]

## Validation Error Format

[block:code]
{
  "codes": [
    {
      "code": "{\n  \"success\": false,\n  \"error\": \"Validation error: title: Title must be at least 3 characters, price: Price is required for non-free items\"\n}",
      "language": "json",
      "name": "Validation Error"
    }
  ]
}
[/block]

[block:api-header]
{
  "title": "Testing & Integration"
}
[/block]

## Postman Collection

[block:callout]
{
  "type": "success",
  "title": "Import Ready",
  "body": "Download the Postman collection with pre-configured requests and environment variables for easy testing."
}
[/block]

[block:code]
{
  "codes": [
    {
      "code": "{\n  \"info\": {\n    \"name\": \"Community Forum API\",\n    \"description\": \"Complete API collection\"\n  },\n  \"auth\": {\n    \"type\": \"bearer\",\n    \"bearer\": [\n      {\n        \"key\": \"token\",\n        \"value\": \"{{jwt_token}}\",\n        \"type\": \"string\"\n      }\n    ]\n  }\n}",
      "language": "json",
      "name": "Postman Config"
    }
  ]
}
[/block]

## Integration Testing

[block:code]
{
  "codes": [
    {
      "code": "// Complete integration test example\nconst testApiIntegration = async () => {\n  // 1. Login\n  const loginResponse = await fetch('/api/auth/login', {\n    method: 'POST',\n    headers: { 'Content-Type': 'application/json' },\n    body: JSON.stringify({\n      email: 'admin@communityforum.com',\n      password: 'admin123'\n    })\n  });\n  \n  const { data: { token } } = await loginResponse.json();\n  \n  // 2. Create event\n  const eventResponse = await fetch('/api/events', {\n    method: 'POST',\n    headers: {\n      'Content-Type': 'application/json',\n      'Authorization': `Bearer ${token}`\n    },\n    body: JSON.stringify({\n      title: 'Test Event',\n      description: 'Integration test event',\n      category: 'HEALTH',\n      startDate: '2025-06-01T10:00:00Z',\n      location: 'Test Location',\n      neighborhoodId: '550e8400-e29b-41d4-a716-446655440001'\n    })\n  });\n  \n  const { data: event } = await eventResponse.json();\n  \n  // 3. Register for event\n  const registerResponse = await fetch(`/api/events/${event.id}/register`, {\n    method: 'POST',\n    headers: {\n      'Authorization': `Bearer ${token}`,\n      'Content-Type': 'application/json'\n    },\n    body: JSON.stringify({ notes: 'Test registration' })\n  });\n  \n  // 4. Create marketplace listing\n  const listingResponse = await fetch('/api/marketplace', {\n    method: 'POST',\n    headers: {\n      'Content-Type': 'application/json',\n      'Authorization': `Bearer ${token}`\n    },\n    body: JSON.stringify({\n      title: 'Test Item',\n      description: 'Test marketplace item',\n      price: 100,\n      isFree: false,\n      condition: 'GOOD',\n      images: ['https://example.com/test.jpg'],\n      categoryId: '770e8400-e29b-41d4-a716-446655440001'\n    })\n  });\n  \n  console.log('Integration test completed successfully');\n};",
      "language": "javascript",
      "name": "Integration Test"
    }
  ]
}
[/block]

[block:api-header]
{
  "title": "Performance & Optimization"
}
[/block]

## Database Optimization

[block:callout]
{
  "type": "info",
  "title": "Performance Features",
  "body": "• Indexed fields for fast queries\n• Pagination for large datasets\n• Selective field loading with Prisma\n• Connection pooling\n• Query optimization for relationships"
}
[/block]

## Caching Strategy

[block:parameters]
{
  "data": {
    "h-0": "Resource",
    "h-1": "Cache Duration",
    "h-2": "Strategy",
    "0-0": "Categories",
    "0-1": "1 hour",
    "0-2": "Static data, rarely changes",
    "1-0": "Event List",
    "1-1": "5 minutes",
    "1-2": "Short cache for dynamic content",
    "2-0": "User Profile",
    "2-1": "15 minutes",
    "2-2": "User-specific data",
    "3-0": "Marketplace Search",
    "3-1": "2 minutes",
    "3-2": "Fast-changing search results"
  },
  "cols": 3,
  "rows": 4
}
[/block]

[block:api-header]
{
  "title": "Future Enhancements"
}
[/block]

## Planned Features

[block:callout]
{
  "type": "info",
  "title": "Roadmap v2.0",
  "body": "• Community Posts module for discussions\n• Direct messaging between users\n• Advanced search with Elasticsearch\n• Real-time notifications via WebSocket\n• Image upload and processing\n• Payment integration for marketplace\n• Mobile app APIs\n• Analytics dashboard"
}
[/block]

## API Versioning

[block:callout]
{
  "type": "warning",
  "title": "Version Management",
  "body": "• Current: v1.0.0\n• Backward compatibility maintained\n• 6 months deprecation notice\n• Migration guides provided\n• Version header support planned"
}
[/block]

[block:api-header]
{
  "title": "Support & Resources"
}
[/block]

## Getting Help

[block:parameters]
{
  "data": {
    "h-0": "Resource",
    "h-1": "URL",
    "h-2": "Description",
    "0-0": "**Interactive Docs**",
    "0-1": "`/api-docs`",
    "0-2": "Swagger UI for testing",
    "1-0": "**GitHub Issues**",
    "1-1": "Repository issues",
    "1-2": "Bug reports and feature requests",
    "2-0": "**Email Support**",
    "2-1": "`support@communityforum.com`",
    "2-2": "Direct technical support",
    "3-0": "**API Status**",
    "3-1": "`/api/health`",
    "3-2": "Service health check"
  },
  "cols": 3,
  "rows": 4
}
[/block]

## Community Guidelines

[block:callout]
{
  "type": "success",
  "title": "Best Practices",
  "body": "• Use descriptive error handling in your applications\n• Implement proper rate limiting on your frontend\n• Cache responses where appropriate\n• Follow RESTful principles in your integrations\n• Test with the provided test accounts\n• Report security issues responsibly"
}
[/block]

## Webhook Support (Coming Soon)

[block:code]
{
  "codes": [
    {
      "code": "// Webhook payload example\n{\n  \"event\": \"listing.created\",\n  \"timestamp\": \"2025-06-01T10:00:00Z\",\n  \"data\": {\n    \"listing\": {\n      \"id\": \"uuid\",\n      \"title\": \"New Listing\",\n      \"seller\": { ... }\n    }\n  }\n}",
      "language": "json",
      "name": "Webhook Payload"
    }
  ]
}
[/block]

[block:callout]
{
  "type": "info",
  "title": "Platform Information",
  "body": "Built with Next.js 15, Prisma ORM, PostgreSQL, and deployed on Vercel. Designed to strengthen neighborhood communities across the Netherlands."
}
[/block]

---

*Last updated: January 2025 • API Version: 1.0.0*