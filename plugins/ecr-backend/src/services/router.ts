import {
    LoggerService,
} from '@backstage/backend-plugin-api';
import { AmazonECRService } from './types';
import Router from 'express-promise-router';
import express from 'express';

export interface RouterOptions {
    logger: LoggerService;
    amazonEcrApi: AmazonECRService;
}

export async function createRouter(
    options: RouterOptions,
): Promise<express.Router> {
    const router = Router();
    const { logger, amazonEcrApi } = options;
    router.get('/v1/entity/:region/:repositoryName/services', async (request, response) => {
        const { region, repositoryName } = request.params;

        try {
            const images = await amazonEcrApi.getListImages(region, repositoryName);
            response.status(200).json(images);
        } catch (error) {
            logger.error(`Failed to fetch ECR images for repository ${repositoryName}: ${error}`);
            response.status(500).json({ error: 'Failed to fetch ECR images' });
        }
    });

    return router;
}

export * from './DefaultAmazonEcrService';