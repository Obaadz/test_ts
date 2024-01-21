declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV?: string;
      PORT: string;
      DB_URI: string;
      SECRET: string;
      JWT_EXPIRE_TIME: string;
      DEFAULT_JSON_LIMIT: string;
      DOMAIN: string;
      AUTH_LIMITER_MAX_REQUESTS: string;
      GLOBAL_ROUTES_LIMITER_MAX_REQUESTS: string;
      STATIC_LIMITER_MAX_REQUESTS: string;
      GMAIL_USER: string;
      GMAIL_PASS: string;
      OPEN_STREET_BASE_URL: string;
      STORE_GET_ALL_DISTANCE: string;
      MOBILE_CLINIC_GET_ALL_DISTANCE: string;
      ADMIN_EMAIL: string;
      ADMIN_PASSWORD: string;
      GREEN_COLOR: string;
      RED_COLOR: string;
      BLACK_COLOR: string;
      LOCATION_DOCUMENT_EXPIRES_TIME: string;
      ENV_ALREADY_LOADED: string;
      APP_VERSION: string;
    }
  }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {};
