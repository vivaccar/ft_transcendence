export const loginSwaggerSchema = {
  tags: ['Auth'],
  summary: 'Login',
  body: {
    type: 'object',
    required: ['username', 'password'],
    properties: {
      username: {
        type: 'string',
        description: 'Username',
      },
      password: {
        type: 'string',
        description: 'User password',
      },
    },
  },
  response: {
    200: {
      description: 'Login OK',
      type: 'object',
      properties: {
        token: {
          type: 'string',
          description: 'JWT token'},
        has2fa: {
          type: 'boolean',
          description: 'User has 2fa'
        },
      },
    },
    400: {
      description: 'Invalid Username',
      type: 'object',
      properties: {
        message: { type: 'string' },
      },
    },
    401: {
      description: 'Incorrect Password',
      type: 'object',
      properties: {
        error: { type: 'string' },
      },
    },
  },
};
