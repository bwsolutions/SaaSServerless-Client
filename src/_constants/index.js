export * from './alert.constants';
export * from './user.constants';
export * from './auth.constants';
export * from './order.constants';
export * from './product.constants';
export * from './tenantMgr.constants';
export * from './tenantReg.constants';
export * from './health.constants';
export * from './modal.constants';

export const urlConstants = {
    AUTH_MANAGER_URL:        'http://localhost:3000',
    USER_MANAGER_URL:        'http://localhost:3001',
    TENANT_MANAGER_URL:      'http://localhost:3003',
    TENANT_REGISTRATION_URL: 'http://localhost:3004',
    PRODUCT_MANAGER_URL:     'http://localhost:3006',
    ORDER_MANAGER_URL:       'http://localhost:3015',
    SYSTEM_REGISTRATION_URL: 'http://localhost:3011',

    SYSTEM_ADMIN_ROLE:   'SystemAdmin',
    SYSTEM_SUPPORT_ROLE: 'SystemUser',
    TENANT_ADMIN_ROLE:   'TenantAdmin',
    TENANT_USER_ROLE:    'TenantUser'
};
