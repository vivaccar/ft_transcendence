export const registerSwaggerSchema = {
  tags: ['Auth'],
  summary: 'Register',
  body: {
    type: 'object',
    required: ['email', 'password', 'username'],
    properties: {
      email: {
        type: 'string',
        description: 'User email'
      },
      password: {
        type: 'string',
        description: 'User password'
      },
      username: {
        type: 'string',
        description: 'Username'
      },
    },
  },
  response: {
    201: {
      description: 'Register OK',
      type: 'object',
      properties: {
        id: {
          type: 'number',
          description: 'User id'
        },
        email: {
          type: 'string',
          description: 'User email'
        }
      },
    },
    400: {
      description: 'Validation error or email/username already registered',
      type: 'object',
      oneOf: [
        {
          description: 'Zod validation error',
          type: 'object',
          properties: {
            message: { type: 'string' },
            errors: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  path: { type: 'string' },
                  message: { type: 'string' }
                }
              }
            }
          }
        },
        {
          description: 'Email or username already exists',
          type: 'object',
          properties: {
            message: {
              type: 'string'
            }
          }
        }
      ]
    },
    500: {
      description: 'Internal server error',
      type: 'object',
      properties: {
        message: { type: 'string' }
      }
    }
  },
}