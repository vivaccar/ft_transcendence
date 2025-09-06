export const unfriendSwaggerSchema = {
  tags: ["Friendship"],
  summary: "Remove a friendship between two users",
  description: "Deletes an existing friendship if it has been accepted.",
  body: {
    type: "object",
    required: ["friend"],
    properties: {
      friend: {
        type: "string",
        description: "The username of the friend to remove"
      }
    }
  },
  response: {
    201: {
      description: "Friendship removed successfully",
      type: "string",
      example: "Friendship between alice and bob has come to the end"
    },
    400: {
      description: "Invalid request or other client error",
      type: "object",
      properties: {
        error: { type: "string" }
      }
    },
    404: {
      description: "The specified user was not found in the database",
      type: "object",
      properties: {
        error: { type: "string" }
      }
    },
    409: {
      description: "Friendship not found or not yet accepted",
      type: "object",
      properties: {
        error: { type: "string" }
      }
    }
  }
}