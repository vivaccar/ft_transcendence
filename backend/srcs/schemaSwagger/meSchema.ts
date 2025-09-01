export const meSwaggerSchema = {
  description: "Return logged in user data",
  tags: ["User"],
  response: {
    200: {
      description: "OK",
      type: "object",
      properties: {
        id: { type: "number"},
        username: { type: "string"},
        email: { type: "string"},
        language: { type: "string" },
        avatar: { type: "string", format: "url"},
        googleUser: { type: "string"},
      },
    },
    400: {
      description: "User not found",
      type: "object",
      properties: {
        message: { type: "string", example: "User not found" },
      },
    },
    401: {
      description: "Invalid Token",
      type: "object",
      properties: {
        message: { type: "string" },
      },
    },
  },
};