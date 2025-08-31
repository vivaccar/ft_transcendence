export const getGoalsSwaggerSchema = {
  tags: ['User Statistics'],
  summary: 'Get goals scored and conceded by a specific user',
  params: {
    type: 'object',
    required: ['username'],
    properties: {
      username: {
        type: 'string',
        description: 'Username to search for goal statistics'
      }
    }
  },
  response: {
    200: {
      description: 'Successful response with user goals statistics',
      type: 'object',
      properties: {
        goalsPro: {
          type: 'number',
          description: 'Total number of goals scored by the user'
        },
        goalsCon: {
          type: 'number',
          description: 'Total number of goals conceded by the user'
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
