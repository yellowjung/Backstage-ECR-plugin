import {
  coreServices,
  createBackendPlugin,
} from '@backstage/backend-plugin-api';
import { catalogServiceRef } from '@backstage/plugin-catalog-node/alpha';
import { amazonEcrServiceRef, createRouter } from './services/router';

/**
 * ecrPlugin backend plugin
 *
 * @public
 */
export const ecrPlugin = createBackendPlugin({
  pluginId: 'amazon-ecr',
  register(env) {

    env.registerInit({
      deps: {
        logger: coreServices.logger,
        auth: coreServices.auth,
        // httpAuth: coreServices.httpAuth,
        httpRouter: coreServices.httpRouter,
        amazonEcrApi: amazonEcrServiceRef,
        discovery: coreServices.discovery,
        // catalog: catalogServiceRef,
      },
      async init({ logger, httpRouter, amazonEcrApi, auth, discovery }) {
        logger.info('Initializing amazon-ecr plugin...');
        logger.info('Setting up amazon-ecr ourtes...');
        httpRouter.use(
          await createRouter({
            logger,
            amazonEcrApi: amazonEcrApi,
            auth,
            // httpAuth,
            discovery
          })
        )
      },
    });
  },
});
