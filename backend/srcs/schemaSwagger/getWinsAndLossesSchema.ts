export const getWinsAndLossesSwaggerSchema = {
  tags: ['User Statistics'],
  summary: 'Get wins and losses count for a specific user',
  params: {
    type: 'object',
    required: ['username'],
    properties: {
      username: {
        type: 'string',
        description: 'Username to search for statistics'
      }
    }
  },
  response: {
    200: {
      description: 'Successful response with user wins and losses',
      type: 'object',
      properties: {
        wins: {
          type: 'number',
          description: 'Total number of matches won by the user'
        },
        losses: {
          type: 'number',
          description: 'Total number of matches lost by the user'
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
    }
  }
}
