import {authHeader, tokenNeedsRefresh} from '../_helpers';
import { API } from "aws-amplify";

import { Debug } from "../_helpers";
var logit = new Debug("user.service");

export const userService = {
    login,
    getHealth,
    resetPW,
    logout,
    getUser,
    getUsers,
    update,
    addUser,
    delete: _delete,
    enable
};
//return promise
function getHealth(id) {
    logit.resetPrefix("getHealth");

    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };

    return new Promise( function(resolve, reject) {
        API.get("SaasUser", '/user/health', requestOptions)
            .then(response => {
                logit.debug("success: response =");
                logit.debug(response);
                if (response.isAlive) {
                    resolve(response);
                } else {
                    reject(response);
                }
            })
            .catch(error => {
                logit.error("error: error =");
                logit.error(error);
                reject(error);
            });
    });

}

function login(username, password) {
    logit.resetPrefix("login");

    const user = {
        userName: username,
        password: password
    };
    const params = {
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
    };

    return new Promise( function(resolve, reject){

        API.post("SaasAuth",'/auth', params)
            .then( response => {
                logit.debug("response= ");
                logit.debug(response);
                if (response.status === true) {
                    // response {status: true, newPasswordRequired: true}
                    // or response {status: true, token: Object, access: Object
                    resolve(response);
                } else {
                    logit.error("bad response - build error");
                    if (response.status) {
                        logit.error("bad response - use response.status = " + response.status);
                        var error = {
                            Error: response.status,
                            msg:   JSON.stringify(response)
                        };
                    } else {
                        logit.error("bad response - use response.errorMessage = ");
                        logit.error(response.errorMessage);

                        var error = {
                            Error: response.errorType,
                            msg: response.errorMessage
                        }
                    }
                    logit.error("reject error = ");
                    logit.error(error);
                    reject(error);
                }
            }).catch(error => {
                logit.error(" catch error reject error = ");
                logit.error(error);
                logit.error("catch error reject error.response = ");
                logit.error(error.response);
                var resp = error.response;
                var data = null;
                var msg = null;
                if (resp) {
                    data = error.response.data;
                    msg = data.msg ? data.msg : error.response.statusText;
                }
                if (msg) {
                    logit.error("catch error reject data = ");
                    logit.error(data);
                    logit.error("catch error reject msg = ");
                    logit.error(msg);
                    reject(msg);
                } else {
                    reject("unknown error");
                }
            });
    });
}
function resetPW(username, password, newpassword) {
    logit.resetPrefix("resetPW");

    const user = {
        userName: username,
        password: password,
        newPassword: newpassword
    };
    const params = {
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
    };

    return new Promise( function(resolve, reject){

        API.post("SaasAuth",'/auth', params)
            .then( response => {
                logit.debug("response= ");
                logit.debug(response);
                if (response.status === true) {
                    // response {status: true, token: Object}  TODO:
                    resolve(response);
                } else {
                    logit.error("bad response - build error");
                    if (response.status) {
                        logit.error("bad response - use response.status = " + response.status);
                        var error = {
                            Error: response.status,
                            msg:   JSON.stringify(response)
                        };
                    } else {
                        logit.error("bad response - use response.errorMessage = ");
                        logit.error(response.errorMessage);

                        var error = {
                            Error: response.errorType,
                            msg: response.errorMessage
                        }
                    }
                    logit.error("reject error = ");
                    logit.error(error);
                    reject(error);
                }
            }).catch(error => {
            logit.error(" catch error reject error = ");
            logit.error(error);
            logit.error("catch error reject error.response = ");
            logit.error(error.response);
            var resp = error.response;
            var data = null;
            var msg = null;
            var message = null;
            if (resp) {
                data = error.response.data;
                message = data.message ? data.message : error.response.statusText;
                msg = data.msg ? data.msg : error.response.statusText;
                message = message ? message : msg;
            }
            if (message) {
                logit.error("catch error reject data = ");
                logit.error(data);
                logit.error("catch error reject message = ");
                logit.error(message);
                reject(message);
            } else {
                reject("unknown error");
            }
        });
    });
}
function logout() {
    // remove user from local storage to log user out
    //localStorage.removeItem('user');
}

function getUser(name) {
    logit.resetPrefix("getUser");

    const requestOptions = {
        headers: authHeader()
    };

    return new Promise( function(resolve, reject) {
        API.get("SaasUser", '/user/'+name,requestOptions)
            .then(response => {
                logit.debug("success: response =");
                logit.debug(response);
                if (response.status) {
                    resolve(response);
                } else {
                    reject(response);
                }
            })
            .catch(error => {
                logit.error("error: error =");
                logit.error(error);
                logit.error(error.response);

                reject(error.response.data);
            });
    });
}

function getUsers() {
    logit.resetPrefix("getUsers");

    const requestOptions = {
        headers: authHeader()
    };

    return new Promise( function(resolve, reject) {
        API.get("SaasUser", '/users',requestOptions)
            .then(response => {
                logit.debug("success: response =");
                logit.debug(response);
                if (response.status) {
                    resolve(response);
                } else {
                    reject(response);
                }
            })
            .catch(error => {
                logit.error("error: error =");
                logit.error(error);
                logit.error(error.response);

                reject(error.response.data);
            });
    });
}




function update(user) {
    logit.resetPrefix("update");

    const requestOptions = {
        headers: authHeader(),
        body: JSON.stringify(user)
    };

    return new Promise( function(resolve, reject) {
        API.put("SaasUser", '/user',requestOptions)
            .then(response => {
                logit.debug("success: response =");
                logit.debug(response);
                if (response.status) {
                    resolve(response);
                } else {
                    reject(response);
                }
            })
            .catch(error => {
                logit.error("error: error =");
                logit.error(error);
                logit.error(error.response);

                reject(error.response.data);
            });
    });
}

function addUser(user) {
    logit.resetPrefix("addUser");

    const requestOptions = {
        headers: authHeader(),
        body: JSON.stringify(user)
    };

    return new Promise( function(resolve, reject) {
        API.post("SaasUser", '/user',requestOptions)
            .then(response => {
                logit.debug("success: response =");
                logit.debug(response);
                if (response.status) {
                    resolve(response);
                } else {
                    reject(response);
                }
            })
            .catch(error => {
                logit.error("error: error =");
                logit.error(error);
                logit.error(error.response);

                reject(error.response.data);
            });
    });
}

// prefixed function name with underscore because delete is a reserved word in javascript
function _delete(name) {
    logit.resetPrefix("_delete");

    const requestOptions = {
        headers: authHeader(),
    };

    return new Promise( function(resolve, reject) {
        API.del("SaasUser", '/user/'+name,requestOptions)
            .then(response => {
                logit.debug("success: response =");
                logit.debug(response);
                if (response.status) {
                    resolve(response);
                } else {
                    reject(response);
                }
            })
            .catch(error => {
                logit.error("error: error =");
                logit.error(error);
                logit.error(error.response);

                reject(error.response.data);
            });
    });
}
function enable(user) {
    logit.resetPrefix("enable");

    const requestOptions = {
        headers: authHeader(),
        body: JSON.stringify(user)
    };
    var enabled = user.enabled;
    // we are toggling the currenct status
    // enabled is current status - so newStatus will be new status
    var newStatus = enabled ? "disable" : "enable";

    return new Promise( function(resolve, reject) {
        API.put("SaasUser", '/user/'+newStatus,requestOptions)
            .then(response => {
                logit.debug("success: response =");
                logit.debug(response);
                if (response.status) {
                    resolve(response);
                } else {
                    reject(response);
                }
            })
            .catch(error => {
                logit.error("error: error =");
                logit.error(error);
                logit.error(error.response);

                reject(error.response.data);
            });
    });
}
