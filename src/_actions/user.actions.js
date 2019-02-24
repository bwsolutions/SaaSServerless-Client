import { userConstants} from '../_constants';
import { userService} from '../_services';
import { alertActions } from './';
import {checkAuth, history} from '../_helpers';

import { Debug } from "../_helpers/debug";
var logit = new Debug("userActions:");

var jwtDecode = require('jwt-decode');

export const userActions = {
    login,
    logout,
    getUsers,
    getUsersIfNeeded,
    usersReset,
    aUserReset,
    getUser,
    getUserIfNeeded,
    updateUser,
    addUser,
    resetPW,
    delete: _delete,
    enable
};
function usersReset() {
    return { type: userConstants.GETALL_RESET } ;
}
function aUserReset() {
    return { type: userConstants.RESET_USER_STATUS } ;
}
function login(username, password) {
    logit.resetPrefix("login");
    return dispatch => {
        dispatch(request({ username }));

        userService.login(username, password)
            .then(
                response => {
                   var user = { username, password };
                    if (response.newPasswordRequired == undefined) {
                        logit.log("login resolved. set success and go to / ");
                        user = decodeJwt(response,user);
                        sessionStorage.setItem('user', JSON.stringify(user));
                        dispatch(success(user));
                        history.push('/');
                    } else {
                        if (response.newPasswordRequired == true) {
                            logit.log("newPasswordRequired: displatch newpassword and go to /resetpw ");
                            var userinfo = { ...response,
                                        username: username,
                                        password
                            }
                           sessionStorage.setItem('user', JSON.stringify(userinfo));
                            dispatch(newpassword(userinfo));
                            history.push('/resetpw');
                        }
                    }
                },
                error => {
                    logit.log("login failure. error =  ");
                    logit.log(error);

                    dispatch(failure(error.toString()));
                    dispatch(alertActions.error(error.toString()));
                }
            );
    };

    function request(user) { return { type: userConstants.LOGIN_REQUEST, user } }
    function success(user) { return { type: userConstants.LOGIN_SUCCESS, user } }
    function newpassword(user) { return { type: userConstants.LOGIN_NEED_NEW_PASSWORD, user } }
    function lostpassword(error) { return { type: userConstants.LOGIN_LOST_PASSWORD, error } }
    function failure(error) { return { type: userConstants.LOGIN_FAILURE, error } }
}
function decodeJwt(response, user = {}) {
    logit.resetPrefix("decodeJwt");

    if (response.token) {
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        var bearerToken = response.token;
        var decodedToken = jwtDecode(bearerToken);

        user.userDisplayName = decodedToken['given_name'] + ' ' + decodedToken['family_name'];
        user.userRole = decodedToken['custom:role'];
        delete user.password;
        delete user.newPassword;
        user.token = response.token;
        user.access = response.access;
        user.refresh = response.refresh;
    }
    return user;
}
function resetPW(username, password, newPassword) {
    logit.resetPrefix("resetPW");
    return dispatch => {
        //dispatch(request({ username }));

        userService.resetPW(username, password, newPassword)
            .then(
                response => {
                    var user = { username };
                    user = decodeJwt(response,user);
                    sessionStorage.setItem('user', JSON.stringify(user));
                    dispatch(success(user));
                    history.push('/');
                },
                error => {
                    logit.log("resetPW failuer. error =  ");
                    logit.log(error);
                    dispatch(failure(error.toString()));
                    dispatch(alertActions.error(error.toString()));
                }
            );
    };

    function request(user) { return { type: userConstants.LOGIN_REQUEST, user } }
    function success(user) { return { type: userConstants.LOGIN_SUCCESS, user } }
    function failure(error) { return { type: userConstants.LOGIN_FAILURE, error } }
}

function logout() {
    logit.resetPrefix("logout");
    userService.logout();
    sessionStorage.removeItem('user');

    return { type: userConstants.LOGOUT };
}


function getUser(name) {
    logit.resetPrefix("getUser");
    // get /users
    return dispatch => {
        dispatch(request({name: name }));

        userService.getUser(name)
            .then(
                response => {
                    dispatch(success(response));
                },
                error => {
                    logit.log("getUser failure. error =  ");
                    logit.log(error);
                    checkAuth(dispatch, error);
                    dispatch(failure(error));
                    var msg = error.message ? error.message : error.toString();
                    dispatch(alertActions.error(msg));
                }
            );
    };
    function request(user) { return { type: userConstants.GET_USER_REQUEST} }
    function success(user) { return { type: userConstants.GET_USER_SUCCESS, user} }
    function failure(error) { return { type: userConstants.GET_USER_FAILURE, error} }
}
function getUserIfNeeded(name) {
    logit.resetPrefix("getUserIfNeeded");

    return (dispatch, getState) => {
        if (_shouldGetUser(getState())) {
            return dispatch(getUser(name));
        }
    }
}
function _shouldGetUser(state) {
    logit.resetPrefix("_shouldGetUser");
    const aUser = state.aUser;
    if (aUser.error) {
        logit.debug(" return false.  ");
        return false;
    } else if (aUser.status === userConstants.USER_VALID) {
        logit.debug(" return false.  ");
        return false;
    } else if (aUser.status === userConstants.USER_INVALID &&
                aUser.isLoading === false) {
        logit.debug(" return true.  ");
        return true;
    } else {
        logit.debug(" return false.  ");
        return false;
    }
}
function getUsersIfNeeded() {
    logit.resetPrefix("getUsersIfNeeded");

    return (dispatch, getState) => {
        if (_shouldGetUsers(getState())) {
            return dispatch(getUsers());
        }
    }
}
function _shouldGetUsers(state) {
    logit.resetPrefix("_shouldGetUsers");
    const users = state.users;
    if (users.error) {
        logit.debug(" return false.  ");
        return false;
    } else if (users.isLoading === true || users.isLoaded === true) {
        logit.debug(" return false.  ");
        return false;
    } else if (users.isLoading === false || users.isLoading === undefined) {
        logit.debug(" return true.  ");
        return true;
    } else {
        logit.debug(" return false.  ");
        return false;
    }
}
function getUsers() {
    logit.resetPrefix("getUsers");
    // get /users
    return dispatch => {
        dispatch(request({ }));

        userService.getUsers()
            .then(
                response => {
                    if (response.status === true) {
                        var users  = {items : response.items} ;
                       dispatch(success(users));
                    }
                },
                error => {
                    logit.log("failure. error =  ");
                    logit.log(error);
                    checkAuth(dispatch, error);
                    dispatch(failure(error));
                    var msg = error.message ? error.message : error.toString();
                    dispatch(alertActions.error(msg));
                }
            );
    };
    function request() { return { type: userConstants.GETALL_REQUEST} }
    function success(users) { return { type: userConstants.GETALL_SUCCESS, users} }
    function failure(error) { return { type: userConstants.GETALL_FAILURE, error} }
}

function updateUser(user) {
    logit.resetPrefix("updateUser");
    // get /users
    return dispatch => {
        dispatch(request({ user}));

        userService.update(user)
            .then(
                response => {
                     dispatch(success(user));
                    dispatch(alertActions.success("User Updated."));
                    history.push('/users');
                },
                error => {
                    logit.log("failure. error =  ");
                    logit.log(error);
                    dispatch(failure(error));
                    var msg = error.message ? error.message : error.toString();
                    dispatch(alertActions.error(msg));
                }
            );
    };
    function request(user) { return { type: userConstants.UPDATE_USER_REQUEST, user} }
    function success(user) { return { type: userConstants.UPDATE_USER_SUCCESS, user} }
    function failure(error) { return { type: userConstants.UPDATE_USER_FAILURE, error} }
}
function addUser(user) {
    logit.resetPrefix("addUser");
    // get /users
    return dispatch => {
        dispatch(request({ user}));

        userService.addUser(user)
            .then(
                response => {
                   dispatch(success(user));
                    history.push('/users');
                    dispatch(alertActions.success("User added."));

                },
                error => {
                    logit.log("failure. error =  ");
                    logit.log(error);
                    dispatch(failure(error));
                    var msg = error.message ? error.message : error.toString();
                    dispatch(alertActions.error(msg));
                }
            );
    };
    function request(user) { return { type: userConstants.ADD_USER_REQUEST, user} }
    function success(user) { return { type: userConstants.ADD_USER_SUCCESS, user} }
    function failure(error) { return { type: userConstants.ADD_USER_FAILURE, error} }
}

/*****
 * enable - toggle stauts of enabled flag.  so user is either Active or Inactive
 *
 * @param user
 * @param enabled
 * @returns {Function}
 */
function enable(user) {
    logit.resetPrefix("enable");
    //
    return dispatch => {
        dispatch(request( user));

        userService.enable(user)
            .then(
                response => {
                 dispatch(success(user));
                    history.push('/users');
                    dispatch(alertActions.success("User updated."));

                },
                error => {
                    logit.log("failure. error =  ");
                    logit.log(error);
                    dispatch(failure(error));
                    var msg = error.message ? error.message : error.toString();
                    dispatch(alertActions.error(msg));
                }
            );
    };
    function request(user) { return { type: userConstants.ENABLE_USER_REQUEST, user} }
    function success(user) { return { type: userConstants.ENABLE_USER_SUCCESS, user} }
    function failure(error) { return { type: userConstants.ENABLE_USER_FAILURE, error} }
}
// prefixed function name with underscore because delete is a reserved word in javascript
function _delete(name) {
    logit.resetPrefix("_delete");
    return dispatch => {
        dispatch(request(name));

        userService.delete(name)
            .then(
                response => {
                   dispatch(success(name))
                    history.push('/users');
                    dispatch(alertActions.success("User deleted."));
                },
                error => { logit.log("failure. error =  ");
                    logit.log(error);
                    dispatch(failure(error));
                    var msg = error.message ? error.message : error.toString();
                    dispatch(alertActions.error(msg));}

            );
    };

    function request(name) { return { type: userConstants.DELETE_REQUEST, name } }
    function success(name) { return { type: userConstants.DELETE_SUCCESS, name } }
    function failure(error) { return { type: userConstants.DELETE_FAILURE, error } }
}