import {tenantMgrConstants, userConstants} from '../_constants';

import { Debug } from "../_helpers/debug";
var logit = new Debug("tenantMgr.reducer");
const prState = (state, action) => {
    logit.silly("state = ");
    logit.silly(state);
    logit.silly("action = ");
    logit.silly(action);
}
const tenants_initialstate = {isLoading:false, items:[]};

export function tenants(state = tenants_initialstate, action) {
    logit.resetPrefix("tenants");

    switch (action.type) {

        case tenantMgrConstants.GET_TENANTS_RESET:
        case tenantMgrConstants.DELETE_TENANT_SUCCESS:
        case tenantMgrConstants.DELETE_TENANT_FAILURE:
            logit.debug("handle action: "+ action.type );
            return tenants_initialstate;

        case tenantMgrConstants.GET_TENANTS_REQUEST:
            logit.debug("handle action: "+ action.type );
            prState(state,action);

            return {
                isLoading: true,
                items: []
            };

        case tenantMgrConstants.GET_TENANTS_SUCCESS:
            logit.debug("handle action: "+ action.type );
            prState(state,action);

            return {
                isLoaded: true,
                items: action.tenants.items
            };
        case tenantMgrConstants.GET_TENANTS_FAILURE:
            logit.debug("handle action: "+ action.type );
            logit.error(action.error);
            prState(state,action);

            return { error: action.error, items:[] };
        default:
            return state
    }
}

    const aTenantInitialState = {status:tenantMgrConstants.TENANT_INVALID};
export function aTenant(state = aTenantInitialState, action) {
    logit.resetPrefix("aTenant");

    switch (action.type) {
        case tenantMgrConstants.GET_TENANT_REQUEST:
            logit.debug("handle action: "+ action.type );
            prState(state,action);

            return {
                isLoading: true,
                tenant: [],
                ...state,  //status should still be invalid
            };

        case tenantMgrConstants.GET_TENANT_SUCCESS:
            logit.debug("handle action: "+ action.type );
            prState(state,action);

            return {
                status:tenantMgrConstants.TENANT_VALID,
                tenant: action.tenant
            };
        case tenantMgrConstants.GET_TENANT_FAILURE:
            logit.debug("handle action: "+ action.type );
            prState(state,action);

            return {
                error: action.error,
                isLoading: false,
                status:tenantMgrConstants.TENANT_INVALID,
                ...state
            };

        case tenantMgrConstants.RESET_TENANT_STATUS:
            logit.debug("handle action: "+ action.type );
            prState(state,action);
            return aTenantInitialState;

        case tenantMgrConstants.UPDATE_TENANT_REQUEST:
            logit.debug("handle action: "+ action.type );
            prState(state,action);

            return {
                status:tenantMgrConstants.TENANT_INVALID,
                isUpdating: true,
                tenant: action.tenant
            };

        case tenantMgrConstants.UPDATE_TENANT_SUCCESS:
            logit.debug("handle action: "+ action.type );
            prState(state,action);

            return {
                status:tenantMgrConstants.TENANT_VALID,
                tenant: action.tenant,
            };

        case tenantMgrConstants.UPDATE_TENANT_FAILURE:
            logit.debug("handle action: "+ action.type );
            prState(state,action);
            return {
                error: action.error,
                isUpdating: false,
                status:tenantMgrConstants.TENANT_INVALID,
                ...state
            };

        default:
            return state
    }
}



