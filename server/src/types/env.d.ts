declare global {
    namespace NodeJS {
        interface ProcessEnv {
            PORT: number;
            MONGODB_STRING: string;
            JWT_SECRET_KEY: string;
            KHALTI_AUTH_KEY: string;
        }
    }
}

export {};
