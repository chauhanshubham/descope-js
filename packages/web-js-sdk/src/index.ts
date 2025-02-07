import { compose } from './enhancers/helpers';
import { withAnalytics } from './enhancers/withAnalytics';
import { withAutoRefresh } from './enhancers/withAutoRefresh';
import { withFingerprint } from './enhancers/withFingerprint';
import { withLastLoggedInUser } from './enhancers/withLastLoggedInUser';
import { withNotifications } from './enhancers/withNotifications';
import withPersistTokens from './enhancers/withPersistTokens';
import createSdk from './sdk';

const decoratedCreateSdk = compose(
  withFingerprint,
  withAutoRefresh,
  withAnalytics,
  withNotifications,
  withLastLoggedInUser, // must be one before last due to TS types
  withPersistTokens // must be last due to TS known limitation https://github.com/microsoft/TypeScript/issues/30727
)(createSdk);

export type { UserResponse } from './types';

export default decoratedCreateSdk;
