import { FastifyInstance } from 'fastify'
import speakeasy from 'speakeasy'
import qrcode from 'qrcode'
import {
  setup2faSchema,
  enable2faSchema,
  verify2faSchema,
  disable2faSchema
} from "../../schemaSwagger/2faSchema"

// TURN ON 2FA WHEN USER WANTS AND RETURN QR CODE

export async function setup2fa(app:FastifyInstance) {
    app.post('/2fa/setup', { preHandler: [app.authenticate], schema: setup2faSchema},
    async (request, reply) => {
    const userId = request.user.id;
    const username = request.user.username
    
    const user = await app.prisma.user.findUnique({ where: {id: userId }})

    if (user.has2fa) {
        return reply.status(400).send({message: "User already has 2fa setup"})
    }
    const secret = speakeasy.generateSecret({
        name: `Ft_transcendence (${username})`,
    })

    await app.prisma.user.update({
      where: { id: userId },
      data: {
        secret2fa: secret.base32,
      },
    })

    const qrCodeDataURL = await qrcode.toDataURL(secret.otpauth_url)

    return reply.status(200).send({
      qrCode: qrCodeDataURL,
      otpAuthUrl: secret.otpauth_url,
    });
    })
}

// CHECK THE FIRST TIME CODE AND SET THE HAS2FA TO TRUE
export async function enable2fa(app:FastifyInstance) {
    app.post('/2fa/enable', { preHandler: [app.authenticate], schema: enable2faSchema },
    async (request, reply) => {
        const userId = request.user.id
        const user = await app.prisma.user.findUnique({ where: {id: userId} })

        if (!user || !user.secret2fa) {
            return reply.status(400).send({ message: "2FA not initialized" })
        }

        const code = request.body.code
        const isValid = speakeasy.totp.verify({
        secret: user.secret2fa,
        encoding: 'base32',
        token: code,
        window: 1,
        });

        if (!isValid) {
            return reply.status(401).send({message: "Invalid 2FA code"})
        }

        await app.prisma.user.update({
        where: { id: userId },
        data: {
            has2fa: true,
            },
        })
        reply.setCookie("has2fa", "true", {
            path: "/",
            httpOnly: false,
            secure: true,
            sameSite: "lax", 
        });
        return reply.send({ message: '2FA enabled successfully' });
    })
}

export async function verify2fa(app:FastifyInstance) {
    app.post('/2fa/verify', { preHandler: [app.preAuthenticate], schema: verify2faSchema },
        async (request, reply) => {
        const userId = request.user.id;
        const code = request.body.code

        const user = await app.prisma.user.findUnique({where: {id: userId}})

        if (!user) {return reply.status(400).send({ message: "User does not exist"})}

        if (!user.has2fa) {return reply.status(400).send({ message: "2FA not set for this user"})}

        const isValid = speakeasy.totp.verify({
        secret: user.secret2fa,
        encoding: 'base32',
        token: code,
        window: 1,
        });

        if (!isValid) {
            return reply.status(401).send({message: "Invalid 2FA code"})
        }

        const token = app.jwt.sign(
        {
            id: user.id,
            username: user.username,
            partialToken: false
        },
        { expiresIn: '7d' }
        );

        reply
          .setCookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "lax",
            path: "/",
          });
        
        return reply.status(200).send({ message: "Login successful" });
    })
}

export async function disable2fa(app:FastifyInstance){
    app.post("/2fa/disable", { preHandler: [app.authenticate], schema: disable2faSchema },
        async(request, reply) => {
        const userId = request.user.id
        const user = await app.prisma.user.findUnique({where: {id: userId}})
        
        if (!user) {return reply.status(400).send({ message: "User does not exist"})}

        if (!user.has2fa) {return reply.status(400).send({ message: "2FA not set for this user"})}

        await app.prisma.user.update({
        where: { id: userId },
        data: {
            has2fa: false,
            },
        })

        reply.setCookie("has2fa", "false", {
            path: "/",
            httpOnly: false,
            secure: true,
            sameSite: "lax", 
        });    
        return reply.status(200).send({message: "2FA disabled"})
    })
}