export const getFriendsSwaggerSchema = {
  tags: ["Friendship"],
  summary: "Get all accepted friends for a user",
  description: "Retrieve a list of all accepted friends for the specified user, including their online status.",
  params: {
    type: "object",
    required: ["username"],
    properties: {
      username: {
        type: "string",
        description: "The username of the user whose friends should be retrieved"
      }
    }
  },
  response: {
    200: {
      description: "List of friends",
      type: "object",
      properties: {
        friendships: {
          type: "array",
          items: {
            type: "object",
            properties: {
              friend: { type: "string", description: "Username of the friend" },
              status: { type: "string", enum: ["accepted"], description: "Status of the friendship" },
              isOnline: { type: "boolean", description: "Whether the friend is currently online (last ping within 20s)" }
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