export const uploadAvatarSwaggerSchema = {
  summary: 'Upload user avatar',
  description: 'Uploads an image to be used as user avatar',
  tags: ['User'],
  consumes: ['multipart/form-data'],
  body: {
    type: 'object',
    required: ['avatar'],
    properties: {
      avatar: {
        type: 'string',
        format: 'binary',
        description: 'Avatar Image (jpg, jpeg ou png)'
      }
    }
  },
  response: {
    200: {
      description: 'New avatar uploaded',
      type: 'object',
      properties: {
        message: { type: 'string' }
      }
    },
    400: {
      description: 'Invalid Request',
      type: 'object',
      properties: {
        error: { type: 'string' }
      }
    },
    415: {
      description: 'Unsupported file type',
      type: 'object',
      properties: {
        error: { type: 'string' }
      }
    }
  }
}