export const registerMatchSwaggerSchema = {
  tags: ['Match'],
  summary: 'Register match with possible local player',
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
        description: 'Exactly two participants, each can be a registered user or a local player',
        minItems: 2,
        maxItems: 2,
        items: {
          type: 'object',
          required: ['username', 'goals', 'touches'],
          properties: {
            username: { type: 'string', description: 'Username or name of the player' },
            goals: { type: 'integer', minimum: 0, description: 'Goals scored by the player' },
            touches: { type: 'integer', minimum: 0, description: 'Number of times the player touched the ball' },
            isLocal: { type: 'boolean', description: 'True if the player is local (not registered)', default: false }
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
        playerOne: { type: 'string', description: 'Player One username or local name' },
        playerTwo: { type: 'string', description: 'Player Two username or local name' }
      }
    },
    400: {
      description: 'Validation error: Bad Request',
      type: 'object',
      properties: { message: { type: 'string' } }
    }
  }
}