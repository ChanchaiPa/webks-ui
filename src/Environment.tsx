export enum Deploy {
    DEV,
    PRO,
    
}

const env_config = { 
    DEV: { status: Deploy.DEV, app_root: '/app', basename: '/webks', url: 'http://localhost:8000/webks' },
    PRO: { status: Deploy.PRO, app_root: '/app', basename: '/webks', url: 'http://192.168.107.88:8082/webks' }
}

export const env = env_config.DEV; 