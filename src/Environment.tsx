export enum Deploy {
    DEV,
    PRO,
    
}

const env_config = { 
    DEV: { status: Deploy.DEV, basename: '/webks', app_root: '/page', url: 'http://localhost:8000/webks/' },
    PRO: { status: Deploy.PRO, basename: '/webks', app_root: '/page', url: '../' }
}

export const env = env_config.PRO; 