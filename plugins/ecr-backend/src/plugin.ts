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
        httpAuth: coreServices.httpAuth,
        httpRouter: coreServices.httpRouter,
        amazonEcrApi: amazonEcrServiceRef,
        catalog: catalogServiceRef,
      },
      async init({ logger, auth, httpAuth, httpRouter, catalog, amazonEcrApi }) {
        httpRouter.use(
          await createRouter({
            logger,
            amazonEcrApi: amazonEcrApi
          })
        )
      },
    });
  },
});
