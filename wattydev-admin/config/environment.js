/* jshint node: true */

module.exports = function(environment) {
  var ENV = {
    modulePrefix: 'wattydev-admin',
    environment: environment,
    baseURL: '/',
    locationType: 'auto',
    contentSecurityPolicy: {
        'font-src': "'self' http://maxcdn.bootstrapcdn.com",
        'style-src': "'self' 'unsafe-inline' https://maxcdn.bootstrapcdn.com ",
        'img-src': "'self' data: http://wattydev.com",
        'connect-src': "'self' ws://localhost:49152 ws://0.0.0.0:49152 http://0.0.0.0:4200/csp-report http://wattydev.com"
    },
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
      }
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
    }
  };

  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.baseURL = '/';
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
  }

  if (environment === 'production') {
      ENV.baseURL = '/admin/';
  }

  return ENV;
};
