import {
    createLegacyAuthAdapters,
    errorHandler,
} from '@backstage/backend-common';
import {
    AuthService,
    DiscoveryService,
    HttpAuthService,
    LoggerService,
} from '@backstage/backend-plugin-api';
import { AmazonECRService } from './types';
import Router from 'express-promise-router';
import express from 'express';

export interface RouterOptions {
    logger: LoggerService;
    amazonEcrApi: AmazonECRService;
    discovery: DiscoveryService;
    auth?: AuthService;
    httpAuth?: HttpAuthService;
}

export async function createRouter(
    options: RouterOptions,
): Promise<express.Router> {
    const { logger, amazonEcrApi } = options;
    const credentials = { token: 'mock-token' }
    const { httpAuth } = createLegacyAuthAdapters(options);

    const router = Router();

    router.use((req, res, next) => {
        req.user = { identity: { userEntityRef: 'user:default/test-user' } };
        next();
    });

    router.get('/test', (req, res) => {
        res.status(200).send('Router is working');
    });

    router.get(
        '/v1/entity/:region/:repositoryName/services',
        async (request, response) => {
            const { region, repositoryName } = request.params;

            const services = await amazonEcrApi.getListImages(
                region,
                repositoryName,
                // await httpAuth.credentials(request),
            );
            response.status(200).json(services);
        });

    return router;
}

export * from './DefaultAmazonEcrService';