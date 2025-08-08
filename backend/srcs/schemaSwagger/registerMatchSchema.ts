import { int } from "zod";

export const registerMatchSwaggerSchema = {
  tags: ['Match'],
  summary: 'Register',
  body: {
    type: 'object',
    required: ['date', 'matchParticipant'],
    properties: {
      date: {
        type: 'string',
        description: 'match date'
      },
      matchParticipant: {
        type: 'array',
        description: 'Array of objects containing userId, matchId and goals',
        items: {
          type: 'object',
          required: ['userId', 'matchId', 'goals'],
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
            }
		}
	}
    },
  },
},
  response: {
    201: {
      description: 'Register OK',
      type: 'object',
      properties: {
        matchId: {
          type: 'number',
          description: 'Match id',
        },
        playerOne: {
            type: 'string',
            description: 'Player One',
        },
		playerTwo: {
            type: 'string',
            description: 'Player Two',
        }
      },
    },
    400: {
      description: 'Validation error: Bad Request',
      type: 'object',
      properties: {
        message: { type: 'string' },
      },
    },
  },
};