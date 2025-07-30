/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   server.ts                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: aconceic <aconceic@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/07/29 18:55:26 by aconceic          #+#    #+#             */
/*   Updated: 2025/07/30 19:25:13 by aconceic         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */


import Fastify from 'fastify';
import httpProxy from '@fastify/http-proxy';
import cors from '@fastify/cors';
import { request } from 'http';


const AUTH_SERVICE_URL = "http://auth-service:3002";
const AUTH_SERVICE_PREFIX = "/auth";

/********************************************/
/*             HEALTH CHECK/SERVER          */
/********************************************/
const fastify = Fastify({
	logger: true,
});

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

