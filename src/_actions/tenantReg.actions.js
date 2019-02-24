import { tenantRegConstants } from '../_constants';
import { tenantRegServices } from '../_services/tenantReg.service';
import { alertActions } from './';
import {Debug, history} from '../_helpers';
var logit = new Debug("userActions:");

export const tenantRegActions = {
    register,
    delete: _delete
};

function register(tenant) {
    return dispatch => {
        dispatch(request(tenant));

        tenantRegServices.register(tenant)
            .then(
                admin => {
                    dispatch(success(tenant));
                    history.push('/login');
                    dispatch(alertActions.success('Tenant Registration successful'));
                },
                error => {
                    dispatch(failure(error.toString()));
                    dispatch(alertActions.error(error.toString()));
                }
            );
    };

    function request(tenant) { return { type: tenantRegConstants.REGISTER_REQUEST, tenant } }
    function success(tenant) { return { type: tenantRegConstants.REGISTER_SUCCESS, tenant } }
    function failure(error) { return { type: tenantRegConstants.REGISTER_FAILURE, error } }
}

// prefixed function name with underscore because delete is a reserved word in javascript
function _delete(id) {
    return dispatch => {
        dispatch(request(id));

        tenantRegServices.delete(id)
            .then(
                admin => dispatch(success(id)),
                error => dispatch(failure(id, error.toString()))
            );
    };

    function request(id) { return { type: tenantRegConstants.DELETE_REQUEST, id } }
    function success(id) { return { type: tenantRegConstants.DELETE_SUCCESS, id } }
    function failure(id, error) { return { type: tenantRegConstants.DELETE_FAILURE, id, error } }
}