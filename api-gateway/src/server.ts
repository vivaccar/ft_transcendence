/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   server.ts                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: aconceic <aconceic@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/07/29 18:55:26 by aconceic          #+#    #+#             */
/*   Updated: 2025/07/29 19:21:27 by aconceic         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */


import Fastify from 'fastify';
import httpProxy from '@fastify/http-proxy';
import { request } from 'http';

/********************************************/
/*             HEALTH CHECK/SERVER          */
/********************************************/
const fastify = Fastify({
	logger: true,
});

fastify.get('/hello-world', async (request, reply) => {
	return { hello: 'typescript world' };
});

fastify.register(httpProxy, {
	upstream: 'http://auth-service:3002',
	prefix: '/auth', 
  });

// 4. Função para iniciar o servidor
// É uma boa prática usar variáveis de ambiente para a porta
// Nao estou usando aqui, mas precisamos mudar isso.
const start = async () => {
	try {
		await fastify.listen({ port: 3000, host: '0.0.0.0' });
	} catch (err) {
		fastify.log.error(err);
		process.exit(1);
	}
};




start();

