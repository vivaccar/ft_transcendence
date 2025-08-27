export const getMatchSwaggerSchema = {
  tags: ['Get Matches'],
  summary: 'Get all matches that a user participated in',
  params: {
    type: 'object',
    required: ['username'],
    properties: {
      username: {
        type: 'string',
        description: 'Username to search for matches'
      }
    }
  },
  response: {
    200: {
      description: 'Successful response with matches',
      type: 'object',
      properties: {
        matches: {
          type: 'array',
          items: {
            type: 'object',
            required: ['matchId','opponent', 'result', 'goalsUser', 'touchesUser', 'goalsOpponent','touchesOpponent', 'dateTime'],
            properties: {
              matchId: {
                type: 'number',
                description: 'Match Id'
              },
              opponent: {
                type: 'string',
                description: 'Username of the opponent'
              },
              result: {
                type: 'string',
                enum: ['win', 'loss'],
                description: 'Result of the match'
              },
              goalsUser: {
                type: 'number',
                description: 'Goals scored by the user'
              },
              touchesUser: {
                type: 'number',
                description: 'Number of times the player touched the ball'
              },
              goalsOpponent: {
                type: 'number',
                description: 'Goals scored by the opponent'
              },
              touchesOpponent: {
                type: 'number',
                description: 'Number of times the opponent touched the ball'
              },
              dateTime: {
                type: 'string',
                format: 'date-time',
                description: 'Date and time of the match'
              }
            }
          }
        }
      }
    },
    400: {
      description: 'Bad request - error processing the request',
      type: 'object',
      properties: {
        message: { type: 'string' },
        error: { type: 'object' }
      }
    },
    404: {
      description: 'User not found in database',
      type: 'object',
      properties: {
        error: { type: 'string' }
      }
    },
    500: {
      description: 'Internal Server Error',
      type: 'object',
      properties: {
        message: { type: 'string' },
        error: { type: 'object' }
      }
    }
  }
}