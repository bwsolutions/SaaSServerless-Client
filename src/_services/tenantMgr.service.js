import { authHeader } from '../_helpers';
import { API } from "aws-amplify";

import { Debug } from "../_helpers";
var logit = new Debug("tenantMgr.service");


export const tenantMgrServices = {
    getHealth,
    getTenant,
    getTenants,
    updateTenant,
    deleteTenant
};


//return promise
function getHealth(id) {
    logit.resetPrefix("getHealth");

    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };
    return new Promise( function(resolve, reject) {
        API.get("SaasTenantMgr", '/tenant/health', requestOptions)
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

function getTenant(id) {
    logit.resetPrefix("getTenant");

    const requestOptions = {
        headers: authHeader()
    };

    return new Promise( function(resolve, reject) {
        API.get("SaasTenantMgr", '/tenant/'+id,requestOptions)
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
function     getTenants() {
    logit.resetPrefix("getTenants");

    const requestOptions = {
        headers: authHeader()
    };

    return new Promise( function(resolve, reject) {
        API.get("SaasTenantMgr", '/tenants',requestOptions)
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
function     updateTenant(tenant) {
    logit.resetPrefix("updateTenant");

    const requestOptions = {
        headers: authHeader(),
        body: JSON.stringify(tenant)
    };

    return new Promise( function(resolve, reject) {
        API.put("SaasTenantMgr", '/tenant',requestOptions)
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
function     deleteTenant(name) {
    logit.resetPrefix("deleteTenant");

    const requestOptions = {
        headers: authHeader(),
    };

    return new Promise( function(resolve, reject) {
        API.del("SaasTenantMgr", '/tenant/'+name,requestOptions)
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