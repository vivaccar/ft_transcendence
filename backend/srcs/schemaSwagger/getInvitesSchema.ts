export const getInvitesSwaggerSchema = {
  tags: ["Friendship"],
  summary: "Get pending friend invites for a user",
  description: "Retrieve all pending friendship invitations where the given user is the invitee (friendB).",
  params: {
    type: "object",
    required: ["username"],
    properties: {
      username: {
        type: "string",
        description: "The username of the user whose pending invites should be retrieved"
      }
    }
  },
  response: {
    200: {
      description: "List of pending friendship invites",
      type: "object",
      properties: {
        invites: {
          type: "array",
          items: {
            type: "object",
            properties: {
              requester: {
                type: "string",
                description: "Username of the user who sent the invite"
              },
              status: {
                type: "string",
                enum: ["pending"],
                description: "Current status of the invite"
              }
            }
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
      description: "The user was not found in the database",
      type: "object",
      properties: {
        error: { type: "string" }
      }
    }
  }
}
