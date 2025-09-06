export const declineInviteSwaggerSchema = {
  tags: ["Friendship"],
  summary: "Decline a pending friend invitation",
  description: "Deletes a pending friendship invite that was sent to the authenticated user.",
  body: {
    type: "object",
    required: ["friend"],
    properties: {
      friend: {
        type: "string",
        description: "The username of the user whose friend invitation should be declined"
      }
    }
  },
  response: {
    201: {
      description: "Friendship invite declined and removed successfully",
      type: "string",
      example: "Friendship between alice and bob was declined and deleted from database"
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