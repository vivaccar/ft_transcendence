
import Fastify from 'fastify';
import httpProxy from '@fastify/http-proxy';
import cors from '@fastify/cors';


const AUTH_SERVICE_URL = "http://auth-service:3002";
const AUTH_SERVICE_PREFIX = "/auth";

const start = async () => {
    const auth_service_url = "http://auth-service:3002";
    const auth_service_prefix = "/auth";

    const fastify = Fastify({
        logger: true,
    });
    
    // Registra o plugin de CORS
    await fastify.register(cors, {
        origin: 'http://localhost:8080',
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
    });

    //routes
    fastify.get('/hello-world', async (request, reply) => {
        return { hello: 'typescript world' };
    });

    //PROXY - REGISTER
    //rota publica registro
    await fastify.register(httpProxy, {
        upstream: auth_service_url,
        prefix: '/register',
        rewritePrefix: '/register', 
    });

    //PROXY - OTHER AUTH SERVICES
    // Registra o plugin de proxy
    await fastify.register(httpProxy, {
        upstream: auth_service_url,
        prefix: auth_service_prefix,
    });

    //start server
    try {
        await fastify.listen({ port: 3000, host: '0.0.0.0' });
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};


start();

