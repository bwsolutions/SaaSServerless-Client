import { authHeader } from '../_helpers';
import { API } from "aws-amplify";

import { Debug } from "../_helpers";
var logit = new Debug("authMgr.service");


export const authMgrServices = {
    getHealth,
    refresh,
};


//return promise
function getHealth(id) {
    logit.resetPrefix("getHealth");

    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };

    return new Promise( function(resolve, reject) {
        API.get("SaasAuth", '/auth/health', requestOptions)
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
function refresh(refreshToken,userName) {
    logit.resetPrefix("refresh");

    var user = {userName: userName,
                password: null,
                refreshToken: refreshToken};

    const requestOptions = {
        headers: authHeader(),
        body: JSON.stringify(user)
    };
    return new Promise( function(resolve, reject) {
        API.post("SaasAuth", '/auth/refresh')
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
                reject(error.response.data);
            });
    });

}
