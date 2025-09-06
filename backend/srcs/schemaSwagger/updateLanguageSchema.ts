export const updateLanguageSchema = {
  tags: ["User"],
  description: "Update the language of the authenticated user",
  body: {
    type: "object",
    required: ["newLanguage"],
    properties: {
      newLanguage: {
        type: "string",
      },
    },
  },
  response: {
    200: {
      description: "Language updated successfully",
      type: "object",
      properties: {
        message: { type: "string", example: "Language succesfully updated" },
      },
    },
    400: {
      description: "Invalid Language",
      type: "object",
      properties: {
        message: { type: "string", example: "Language must be EN, PT or FR" },
      },
    },
    404: {
      description: "User not found",
      type: "object",
      properties: {
        message: { type: "string", example: "User not found" },
      },
    },
  },
};