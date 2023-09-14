export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      API_URL: string,
      REDIS_ENDPOINT_HOST: string,
      REDIS_ENDPOINT_PORT: number,
      REDIS_PASSWORD: string,
    }
  }
}