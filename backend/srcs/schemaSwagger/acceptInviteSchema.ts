export const acceptInviteSwaggerSchema = {
  tags: ["Friendship"],
  summary: "Accept a pending friend invitation",
  description: "Updates a pending friendship invite to accepted status for the authenticated user.",
  body: {
    type: "object",
    required: ["friend"],
    properties: {
      friend: {
        type: "string",
        description: "The username of the user whose friend invitation should be accepted"
      }
    }
  },
  response: {
    201: {
      description: "Friendship invite accepted successfully",
      type: "object",
      properties: {
        newFriendship: {
          type: "object",
          properties: {
            friendshipId: { type: "number", description: "ID of the friendship record" },
            friendA: { type: "string", description: "Username of one friend" },
            friendB: { type: "string", description: "Username of the other friend" },
            status: { type: "string", enum: ["accepted"], description: "Status of the friendship" }
          }
        }
      }
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
      description: "Friendship not found or already accepted",
      type: "object",
      properties: {
        error: { type: "string" }
      }
    }
  }
}