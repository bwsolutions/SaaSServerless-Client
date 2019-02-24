import {orderConstants, tenantMgrConstants} from '../_constants';
import {tenantMgrServices} from "../_services";
import {history, checkAuth, Debug} from "../_helpers";
import {alertActions} from "./alert.actions";
var logit = new Debug("tenantActions:");

export const tenantMgrActions = {
    getTenant,
    getTenants,
    getTenantsSystem,
    getTenantsIfNeeded,
    createTenant,
    updateTenant,
    tenantsReset,
    tenantReset,
    deleteTenant,
    removeTenant
};

function checkHealth() {
    return up();

    function check() { return { type: tenantMgrConstants.HEALTH_REQUEST} }
    function up() { return { type: tenantMgrConstants.HEALTH_UP} }
    function down() { return { type: tenantMgrConstants.HEALTH_DOWN} }
}

function tenantReset() {
    return { type: tenantMgrConstants.RESET_TENANT_STATUS } ;
}
function tenantsReset() {
    return { type: tenantMgrConstants.GET_TENANTS_RESET } ;
}

function getTenant(id) {
// get /tenant/:id?
    logit.resetPrefix("getTenant");
    return dispatch => {
        dispatch(request({id: id} ));

        tenantMgrServices.getTenant(id)
            .then(
                response => {
                  // response should be a tenant object.
                        dispatch(success(response));
                },
                error => {
                    logit.log("getTenant failure. error =  ");
                    logit.log(error);
                    checkAuth(dispatch, error);
                    dispatch(failure(error));
                    var msg = error.message ? error.message : error.toString();
                    dispatch(alertActions.error(msg));
                }
            );
    };
    function request(tenant) { return { type: tenantMgrConstants.GET_TENANT_REQUEST,tenant} }
    function success(tenant) { return { type: tenantMgrConstants.GET_TENANT_SUCCESS,tenant} }
    function failure(error) { return { type: tenantMgrConstants.GET_TENANT_FAILURE,error} }
}
function getTenants() {
    logit.resetPrefix("getTenants");
    // get /tenants
    return dispatch => {
        dispatch(request({ }));

        tenantMgrServices.getTenants()
            .then(
                response => {
                    if (response.status === true) {
                            var tenants  = {items : response.items} ;
                          dispatch(success(tenants));
                    }
                },
                error => {
                    logit.log("getTenants failure. error =  ");
                    logit.log(error);
                    checkAuth(dispatch, error);
                    dispatch(failure(error));
                    var msg = error.message ? error.message : error.toString();
                    dispatch(alertActions.error(msg));
                }
            );
    };
        function request() { return { type: tenantMgrConstants.GET_TENANTS_REQUEST} }
    function success(tenants) { return { type: tenantMgrConstants.GET_TENANTS_SUCCESS, tenants} }
    function failure(error) { return { type: tenantMgrConstants.GET_TENANTS_FAILURE, error} }
}
function getTenantsIfNeeded() {
    logit.resetPrefix("getTenantsIfNeeded");


    return (dispatch, getState) => {
        if (_shouldGetTenants(getState())) {
            return dispatch(getTenants());
        }
    }
}
function _shouldGetTenants(state) {
    logit.resetPrefix("_shouldGetTenants");
    const tenants = state.tenants;
    if (tenants.error) {
        logit.debug(" return false.  ");
        return false;
    } else if (tenants.isLoading === true || tenants.isLoaded === true) {
        logit.debug(" return false.  ");
        return false;
    } else if (tenants.isLoading === false || tenants.isLoading === undefined) {
        logit.debug(" return true.  ");
        return true;
    } else {
        logit.debug(" return false.  ");
        return false;
    }
}


function getTenantsSystem() {
    return up();
    // get /tenants/system

        function request() { return { type: tenantMgrConstants.GET_TENANTS_SYSTEM_REQUEST} }
    function success() { return { type: tenantMgrConstants.GET_TENANTS_SYSTEM_SUCCESS} }
    function failure() { return { type: tenantMgrConstants.GET_TENANTS_SYSTEM_FAILURE} }
}
function createTenant() {
    return up();
    // post /tenant

        function request() { return { type: tenantMgrConstants.CREATE_TENANT_REQUEST} }
    function success() { return { type: tenantMgrConstants.CREATE_TENANT_SUCCESS} }
    function failure() { return { type: tenantMgrConstants.CREATE_TENANT_FAILURE} }
}
function updateTenant(tenant) {
    logit.resetPrefix("updateTenant");
    // put /tenant
    return dispatch => {
        dispatch(request(tenant));

        tenantMgrServices.updateTenant(tenant)
            .then(
                response => {
                      var tenant  = response ;
                     dispatch(success(tenant));
                    dispatch(alertActions.success("Tenant Updated."));

                },
                error => {
                    logit.log("updateTenant failure. error =  ");
                    logit.log(error);

                    dispatch(failure(error.toString()));
                    dispatch(alertActions.error(error.toString()));
                }
            );
    };

        function request(tenant) { return { type: tenantMgrConstants.UPDATE_TENANT_REQUEST, tenant} }
    function success(tenant) { return { type: tenantMgrConstants.UPDATE_TENANT_SUCCESS, tenant} }
    function failure(error) { return { type: tenantMgrConstants.UPDATE_TENANT_FAILURE} }
}
function deleteTenant(name) {
    logit.resetPrefix("deleteTenant");
    // put /tenant
    return dispatch => {
        dispatch(request(name));

        tenantMgrServices.deleteTenant(name)
            .then(
                response => {
                  dispatch(success(name));
                    dispatch(alertActions.success("Tenant Deleted."));
                    history.push('/tenants');
                },
                error => {
                    logit.log("deleteTenant failure. error =  ");
                    logit.log(error);

                    dispatch(failure(error.toString()));
                    dispatch(alertActions.error(error.toString()));
                }
            );
    };

        function request() { return { type: tenantMgrConstants.DELETE_TENANT_REQUEST} }
    function success() { return { type: tenantMgrConstants.DELETE_TENANT_SUCCESS} }
    function failure() { return { type: tenantMgrConstants.DELETE_TENANT_FAILURE} }
}
function removeTenant() {
    return up();
    // delete /tenant/remove/:id?

        function request() { return { type: tenantMgrConstants.REMOVE_TENANT_REQUEST} }
    function success() { return { type: tenantMgrConstants.REMOVE_TENANT_SUCCESS} }
    function failure() { return { type: tenantMgrConstants.REMOVE_TENANT_FAILURE} }
}



