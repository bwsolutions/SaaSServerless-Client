import { sysRegConstants } from '../_constants';
import { sysRegServices } from '../_services/sysReg.service';
import { alertActions } from './';
import {Debug, history} from '../_helpers';
var logit = new Debug("userActions:");

export const sysRegActions = {
    register,
    delete: _delete
};

function register(admin) {
    return dispatch => {
        dispatch(request(admin));

        sysRegServices.register(admin)
            .then(
                admin => {
                    dispatch(success(admin));
                    history.push('/install');
                    dispatch(alertActions.success('Admin Registration successful'));
                },
                error => {
                    dispatch(failure(error.toString()));
                    dispatch(alertActions.error(error.toString()));
                }
            );
    };

    function request(admin) { return { type: sysRegConstants.REGISTER_REQUEST, admin } }
    function success(admin) { return { type: sysRegConstants.REGISTER_SUCCESS, admin } }
    function failure(error) { return { type: sysRegConstants.REGISTER_FAILURE, error } }
}

// prefixed function name with underscore because delete is a reserved word in javascript
function _delete(id) {
    return dispatch => {
        dispatch(request(id));

        sysRegServices.delete(id)
            .then(
                admin => dispatch(success(id)),
                error => dispatch(failure(id, error.toString()))
            );
    };

    function request(id) { return { type: sysRegConstants.DELETE_REQUEST, id } }
    function success(id) { return { type: sysRegConstants.DELETE_SUCCESS, id } }
    function failure(id, error) { return { type: sysRegConstants.DELETE_FAILURE, id, error } }
}