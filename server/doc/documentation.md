# Game Server API Documentation

## Base URL
```
http://localhost:{PORT}/api
```

## Authentication
Most endpoints require JWT authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your_token>
```

## Rate Limiting
- Window: 15 minutes
- Max requests: 100 per window

## Endpoints

### User Management

#### Register User
```http
POST /register
```

**Request Body:**
```json
{
  "username": "string",
  "pin": "string",
  "avatarUrl": "string" (optional)
}
```

**Constraints:**
- Username: 3-30 characters, alphanumeric with underscore and hyphen
- PIN: 4-6 digits
- AvatarUrl: Valid URL if provided

**Response (201):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "string",
      "username": "string",
      "avatarUrl": "string",
      "createdAt": "string"
    },
    "token": "string"
  }
}
```

#### Login
```http
POST /login
```

**Request Body:**
```json
{
  "username": "string",
  "pin": "string"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "string",
      "username": "string",
      "avatarUrl": "string",
      "lastLogin": "string"
    },
    "token": "string"
  }
}
```

**Notes:**
- Account locks after 5 failed attempts for 15 minutes
- Remaining attempts are returned on failed login

### Player Management

### Create Player Profile
```http
POST /players
```
**Auth Required:** Yes

**Request Body:**
```json
{
  "name": "string"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "string",
    "name": "string",
    "totalGames": 0,
    "highestScore": 0,
    "levelsPlayed": 0,
    "lastPlayed": null,
    "levelStats": []
  }
}
```

You could implement this in one of two ways:
1. Create the Player automatically when the user registers (by modifying the /register endpoint)
2. Keep it as a separate endpoint that must be called after registration

The choice depends on your application flow:
- If every user must have a player profile, do it in registration
- If player profiles are optional or need additional input, keep it separate

Would you like me to show you how to implement either of these approaches?

#### Update Gameplay Score
```http
POST /gameplay
```
**Auth Required:** Yes

**Request Body:**
```json
{
  "level": "integer",
  "score": "integer"
}
```

**Constraints:**
- Level: Positive integer
- Score: Non-negative integer

**Response (200):**
```json
{
  "stats": {
    "totalGames": "integer",
    "highestScore": "integer",
    "levelsPlayed": "integer",
    "lastPlayed": "string",
    "levelStats": [
      {
        "level": "integer",
        "highestScore": "integer",
        "lastPlayed": "string"
      }
    ]
  },
  "gameplay": {
    "level": "integer",
    "highestScore": "integer",
    "timestamp": "string"
  }
}
```

#### Get Player Profile
```http
GET /profile
```
**Auth Required:** Yes

**Response (200):**
```json
{
  "id": "string",
  "name": "string",
  "totalGames": "integer",
  "highestScore": "integer",
  "levelsPlayed": "integer",
  "lastPlayed": "string",
  "levelStats": [
    {
      "level": "integer",
      "highestScore": "integer",
      "lastPlayed": "string"
    }
  ]
}
```

#### Get Global Leaderboard
```http
GET /leaderboard
```
**Auth Required:** No

**Query Parameters:**
- page (optional): Page number (default: 1)
- limit (optional): Results per page (default: 10, max: 100)

**Response (200):**
```json
{
  "leaderboard": [
    {
      "name": "string",
      "highestOverallScore": "integer"
    }
  ],
  "pagination": {
    "page": "integer",
    "pages": "integer",
    "total": "integer"
  }
}
```

#### Get Level Leaderboard
```http
GET /leaderboard/:level
```
**Auth Required:** No

**Parameters:**
- level: Level number (positive integer)

**Response (200):**
```json
{
  "level": "integer",
  "leaderboard": [
    {
      "name": "string",
      "score": "integer"
    }
  ]
}
```

## Error Responses

### Common Error Structure
```json
{
  "success": false,
  "message": "string",
  "error": "string" (only in development)
}
```

### HTTP Status Codes
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 404: Not Found
- 423: Locked (Account temporarily locked)
- 500: Internal Server Error

## Health Check

```http
GET /health
```

**Response (200):**
```json
{
  "status": "ok",
  "timestamp": "string",
  "service": "api",
  "mongodb": "string" // "connected" or "disconnected"
}
```

## CORS
- Origins: Configurable via ALLOWED_ORIGINS environment variable
- Methods: GET, POST, PUT, DELETE, PATCH
- Allowed Headers: Content-Type, Authorization

## Security Features
- Helmet.js for secure headers
- Rate limiting
- Payload size limit (10kb)
- PIN hashing with bcrypt
- MongoDB indexing for optimal performance