import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';
import { get, values } from 'lodash';
import { isProdEnv } from '../tokens';
import type { Store } from '../store';
import type { User } from '../store/userStore';

export const initSentry = () => {
  Sentry.init({
    dsn: get(process.env, 'REACT_APP_SENTRY_DSN'),
    integrations: [new BrowserTracing()],
    environment: get(process.env, 'REACT_APP_SENTRY_ENVIRONMENT', 'development'),
    tracesSampleRate: 0.0,
    release: isProdEnv ? 'commit_' + get(process.env, 'REACT_APP_GIT_COMMIT') : 'development',
    enabled: isProdEnv,
  });
};

export function logError(error: Error, errorInfo: any = null, user: User | null = null) {
  Sentry.withScope((scope) => {
    if (errorInfo) {
      scope.setExtras(errorInfo);

      if (user) scope.setUser({ id: String(user.id) });
    }

    Sentry.captureException(error);
  });
}

export const setupStoreState = (store: Store) => {
  const getStoreState = (key: string): any => get(store, key);
  const isPending = (key: string): boolean => getStoreState(key) === 'pending';

  return {
    courses: isPending('courses.courses') ? getStoreState('courses.courses') : values(getStoreState('courses.courses')).length,
    globals: {
      permissions: isPending('globals.permissions') ? getStoreState('globals.permissions') : values(getStoreState('globals.permissions')).length,
      products: isPending('globals.products') ? getStoreState('globals.products') : values(getStoreState('globals.products')).length,
      news: values(store.globals.news).length,
      webinars: values(store.globals.webinars).length,
      selectedCourseId: store.globals.selectedCourse?.id || null,
      selectedProductId: store.globals.selectedProduct?.id || null,
    },
  };
};
