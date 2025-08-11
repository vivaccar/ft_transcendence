export const googleCallbackSwaggerSchema = {
  tags: ['Auth'],
  summary: 'Google OAuth Callback',
  description: 'Handles Google OAuth2 callback, logs in or creates a user, and returns a JWT token.',
  querystring: {
    type: 'object',
    properties: {
      code: {
        type: 'string',
        description: 'Authorization code returned by Google OAuth2',
      },
      scope: {
        type: 'string',
        description: 'Scope of the access request',
      },
      authuser: {
        type: 'string',
        description: 'User ID for multi-user accounts',
      },
      prompt: {
        type: 'string',
        description: 'Prompt type (e.g., consent)',
      },
    },
    required: ['code'],
  },
  response: {
    200: {
      description: 'Successful login or account creation via Google OAuth2',
      type: 'object',
      properties: {
        token: {
          type: 'string',
          description: 'JWT token (short or full-lived)',
        },
        has2fa: {
          type: 'boolean',
          description: 'Indicates whether the user has 2FA enabled',
        },
      },
    },
    500: {
      description: 'Internal server error during OAuth callback',
      type: 'object',
      properties: {
        error: { type: 'string' },
      },
    },
  },
};