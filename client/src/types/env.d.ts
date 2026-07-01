declare global {
    namespace NodeJS {
        interface ProcessEnv {
            VITE_KHALTI_SECRET_KEY: string;
        }
    }
}

export {};
