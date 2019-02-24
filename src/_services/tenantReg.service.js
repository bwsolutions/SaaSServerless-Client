import { authHeader } from '../_helpers';
import { API } from "aws-amplify";

import { Debug } from "../_helpers";
var logit = new Debug("tenantReg.service");

export const tenantRegServices = {
    register,
    getHealth,
};
//return promise
function getHealth(id) {
    logit.resetPrefix("getHealth");

    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };
    return new Promise( function(resolve, reject) {
        API.get("SaasTenantReg", '/reg/health', requestOptions)
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
// return promise
function register(tenant) {
    logit.resetPrefix("register");

    const params = {
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tenant)
    };

    return new Promise( function(resolve, reject){

        API.post("SaasTenantReg",'/reg',params)
            .then( response => {
                logit.debug("response= ");
                logit.debug(response);
                if (response.status === true) {
                    logit.debug("resolve msg = ");
                    logit.debug(JSON.stringify(response.msg));
                    resolve(JSON.stringify(response.msg));
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

