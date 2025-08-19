import { int } from "zod";

export const registerMatchSwaggerSchema = {
  tags: ['Match'],
  summary: 'Register',
  body: {
    type: 'object',
    required: ['date', 'participants'],
    properties: {
      date: {
        type: 'string',
        format: 'date-time',
        description: 'Match date'
      },
      participants: {
        type: 'array',
        description: 'Exactly two participants with username and goals',
        minItems: 2,
        maxItems: 2,
        items: {
          type: 'object',
          required: ['username', 'goals'],
          properties: {
            username: { type: 'string', description: 'Username of the player' },
            goals: { type: 'integer', minimum: 0, description: 'Goals scored by the user' }
          }
        }
      }
    }
  },
  response: {
    201: {
      description: 'Register OK',
      type: 'object',
      properties: {
        matchId:   { type: 'number', description: 'Match id' },
        playerOne: { type: 'string', description: 'Player One username' },
        playerTwo: { type: 'string', description: 'Player Two username' }
      }
    },
    400: {
      description: 'Validation error: Bad Request',
      type: 'object',
      properties: { message: { type: 'string' } }
    }
  }
}