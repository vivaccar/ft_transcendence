export const inviteFriendSwaggerSchema = {
  tags: ["Friendship"],
  summary: "Invite a user to be your friend",
  description: "Authenticated user can invite another user (by username) to become a friend. The friendship will be created with status 'pending'.",
  body: {
    type: "object",
    required: ["friend"],
    properties: {
      friend: {
        type: "string",
        description: "Username of the user you want to invite"
      }
    }
  },
  response: {
    201: {
      description: "Friendship successfully created",
      type: "object",
      properties: {
        friendA: { type: "string", description: "Username of the requester" },
        friendB: { type: "string", description: "Username of the invited friend" },
        status: { type: "string", enum: ["pending"] }
      }
    },
    400: {
      description: "Invalid request body or other client error",
      type: "object",
      properties: {
        error: { type: "string" }
      }
    },
    404: {
      description: "The invited user was not found in the database",
      type: "object",
      properties: {
        error: { type: "string" }
      }
    },
    409: {
      description: "Friendship already exists between these users",
      type: "object",
      properties: {
        error: { type: "string" }
      }
    }
  }
}