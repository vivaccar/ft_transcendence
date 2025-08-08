import { queryObjects } from "node:v8";
import { int } from "zod";

export const getMatchSwaggerSchema = {
  tags: ['Get Matches'],
  summary: 'Get all matches that a user participated in',
  querystring: {
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
            required: ['userId', 'matchId', 'goals', 'match'],
            properties: {
              userId: {
                type: 'number',
                description: 'User ID'
              },
              matchId: {
                type: 'number',
                description: 'Match ID'
              },
              goals: {
                type: 'number',
                description: 'Goals that user scored'
              },
              match: {
                type: 'object',
                required: ['id', 'date'],
                properties: {
                  id: {
                    type: 'number',
                    description: 'ID of the match'
                  },
                  date: {
                    type: 'string',
                    format: 'date-time',
                    description: 'Date of the match'
                  }
                }
              }
            }
          }
        }
      }
    },
    400: {
      description: 'Bad request - invalid query or missing parameters',
      type: 'object',
      properties: {
        message: { type: 'string' },
        error: { type: 'string' }
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