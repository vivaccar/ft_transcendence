export const updatePasswordSchema = {
  description: "Update the user password",
  tags: ["User"],
  body: {
    type: "object",
    required: ["oldPassword", "newPassword"],
    properties: {
      oldPassword: { type: "string" },
      newPassword: { type: "string",},
    },
  },
  response: {
    200: {
      description: "password updated successfully",
      type: "object",
      properties: {
        message: { type: "string" },
      },
    },
    400: {
      description: "New password must be at least 8 characters long and contain at least one letter and one number",
      type: "object",
      properties: {
        message: { type: "string" },
      },
    },
    401: {
      description: "Old password is incorrect",
      type: "object",
      properties: {
        message: { type: "string" },
      },
    },
    404: {
      description: "user not found",
      type: "object",
      properties: {
        message: { type: "string" },
      },
    },
  },
}