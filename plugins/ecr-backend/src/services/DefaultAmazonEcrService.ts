import { DescribeImagesCommand, ECRClient, ImageDetail, ScanningConfigurationFailureCode } from "@aws-sdk/client-ecr";
import { AmazonECRService, AwsEcrImagesResponse } from "./types";
import { coreServices, createServiceFactory, createServiceRef, LoggerService } from '@backstage/backend-plugin-api';
import { Config } from '@backstage/config';

export class DefaultAmazonEcrService implements AmazonECRService {
    private config: Config;
    private logger: LoggerService;

    constructor(config: Config, options: { logger: LoggerService }) {
        this.config = config;
        this.logger = options.logger;
    }

    static async fromConfig(
        config: Config,
        options: {
            logger: LoggerService;
        }
    ) {
        return new DefaultAmazonEcrService(config, options);
    }

    async getListImages(region: string, repositoryName: string): Promise<AwsEcrImagesResponse> {

        const ecrClient = new ECRClient({ region: region });

        try {
            const command = new DescribeImagesCommand({ repositoryName });
            const response = await ecrClient.send(command);

            const items: ImageDetail[] = response.imageDetails || [];

            return { items };
        } catch (error) {
            console.error("Error fetching ECR images: ", error);
            const errorMessage = (error as any).message || "Unknown error";
            throw new Error(`Failed to fetch images for repository "${repositoryName}": ${errorMessage}`);
        }
    }
}

export const amazonEcrServiceRef = createServiceRef<AmazonECRService>({
    id: 'amazon-ecr.api',
    defaultFactory: async service =>
        createServiceFactory({
            service,
            deps: {
                logger: coreServices.logger,
                config: coreServices.rootConfig,

            },
            async factory({ logger, config }) {
                const impl = await DefaultAmazonEcrService.fromConfig(config, {
                    logger,
                });

                return impl;
            }
        })
});
