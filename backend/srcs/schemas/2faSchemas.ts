//POST /2fa/setup
export const setup2faSchema = {
  summary: 'Setup 2FA',
  description: 'Gera o segredo TOTP, salva no usuário e retorna QR Code + OTP Auth URL',
  tags: ['2FA'],
  response: {
    200: {
      type: 'object',
      properties: {
        qrCode: { type: 'string' },
        otpAuthUrl: { type: 'string' },
      },
    },
    400: {
      type: 'object',
      description: "User already has 2fa setup",
      properties: {
        message: { type: 'string' }
      }
    }
  }
}

// POST /2fa/enable
export const enable2faSchema = {
  summary: 'Enable 2FA',
  description: 'Verifica o código TOTP e ativa o 2FA para o usuário logado',
  tags: ['2FA'],
  body: {
    type: 'object',
    required: ['code'],
    properties: {
      code: { type: 'string' }
    }
  },
  response: {
    200: {
      type: 'object',
      description: "2FA Enabled",
      properties: {
        message: { type: 'string' }
      }
    },
    400: {
      type: 'object',
      description: "2FA not initialized",
      properties: {
        message: { type: 'string' }
      }
    }
  }
}

// POST /2fa/verify
export const verify2faSchema = {
  summary: 'Verify 2FA',
  description: 'Verifica código TOTP e retorna token JWT se válido',
  tags: ['2FA'],
  body: {
    type: 'object',
    required: ['code'],
    properties: {
      code: { type: 'number' }
    }
  },
  response: {
    200: {
      type: 'object',
      description: "2FA OK",
      properties: {
        token: { type: 'string' },
      }
    },
    400: {
      type: 'object',
      description: "User does not exist or 2fa disabled",
      properties: {
        message: { type: 'string' }
      }
    },
    401: {
      type: 'object',
      description: "Wrong 2fa code",
      properties: {
        message: { type: 'string' }
      }
    }
  }
}

// POST /2fa/disable
export const disable2faSchema = {
  summary: 'Disable 2FA',
  description: 'Desativa o 2FA para o usuário logado',
  tags: ['2FA'],
  response: {
    200: {
      type: 'object',
      description: "2FA succesfully disabled",
      properties: {
        message: { type: 'string' }
      }
    },
    400: {
      type: 'object',
      description: "2FA already disabled",
      properties: {
        message: { type: 'string' }
      }
    }
  }
}
