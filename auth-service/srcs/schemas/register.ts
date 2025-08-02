import { int } from "zod";

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
        description: 'User password',
      },
        username: {
        type: 'string',
        description: 'Username',
      },
    },
  },
  response: {
    201: {
      description: 'Register OK',
      type: 'object',
      properties: {
        Id: {
          type: 'number',
          description: 'User id',
        },
        Email: {
            type: 'string',
            description: 'User email',
        }
      },
    },
    400: {
      description: 'Validation error: Email or Username conflict; Incorrect type of email, username or password',
      type: 'object',
      properties: {
        message: { type: 'string' },
      },
    },
  },
};