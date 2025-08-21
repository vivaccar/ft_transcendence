export const updateUsernameSchema = {
  tags: ["User"],
  description: "Update the username of the authenticated user",
  body: {
    type: "object",
    required: ["newUsername"],
    properties: {
      newUsername: {
        type: "string",
      },
    },
  },
  response: {
    200: {
      description: "Username updated successfully",
      type: "object",
      properties: {
        message: { type: "string", example: "Username succesfully updated" },
      },
    },
    400: {
      description: "Invalid input (e.g., username too short)",
      type: "object",
      properties: {
        message: { type: "string", example: "Username must have at least 3 characters" },
      },
    },
    404: {
      description: "User not found",
      type: "object",
      properties: {
        message: { type: "string", example: "User not found" },
      },
    },
    409: {
      description: "Username already taken",
      type: "object",
      properties: {
        message: { type: "string", example: "Username already taken" },
      },
    },
  },
};