// @flow
import bunyan, { INFO } from 'bunyan';
import bunyanFormat from 'bunyan-format';
import bunyanLoggly from 'bunyan-loggly';
import bunyanMiddleware from 'koa-bunyan-logger';

const config = {
  level: INFO,
  name: 'application',
  origin: 'BahnhofsAbfahrten',
  streams: [
    {
      stream: bunyanFormat({
        outputMode: 'short',
      }),
    },
  ],
  serializers: bunyan.stdSerializers,
};

const logglyConfig = {
  token: process.env.LOGGLY_TOKEN,
  subdomain: process.env.LOGGLY_SUBDOMAIN,
};

// istanbul ignore next
if (
  process.env.NODE_ENV === 'production' &&
  logglyConfig.token &&
  logglyConfig.subdomain
) {
  // eslint-disable-next-line
  console.log('Using loggly to log');
  config.streams.push({
    stream: new bunyanLoggly(logglyConfig),
    type: 'raw',
  });
}

export const logger = bunyan.createLogger(config);
export const middlewares = [bunyanMiddleware(logger)];
if (process.env.NODE_ENV !== 'test') {
  middlewares.push(bunyanMiddleware.requestLogger());
}
