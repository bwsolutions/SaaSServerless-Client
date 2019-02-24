import { authHeader } from '../_helpers';
import { API } from "aws-amplify";

import { Debug } from "../_helpers";
var logit = new Debug("orderMgr.service");


export const orderService = {
    getHealth,
    getOrder,
    getOrders,
    update,
    addOrder,
    delete: _delete,
};


//return promise
function getHealth(id) {
    logit.resetPrefix("getHealth");

    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };
    return new Promise( function(resolve, reject) {
        API.get("SaasOrder", '/order/health', requestOptions)
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
function getOrder(name) {
    logit.resetPrefix("getOrder");

    const requestOptions = {
        headers: authHeader()
    };

    return new Promise( function(resolve, reject) {
        API.get("SaasOrder", '/order/'+name,requestOptions)
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

function getOrders() {
    logit.resetPrefix("getOrders");

    const requestOptions = {
        headers: authHeader()
    };

    return new Promise( function(resolve, reject) {
        API.get("SaasOrder", '/orders',requestOptions)
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
function update(order) {
    logit.resetPrefix("update");

    const requestOptions = {
        headers: authHeader(),
        body: JSON.stringify(order)
    };

    return new Promise( function(resolve, reject) {
        API.put("SaasOrder", '/order',requestOptions)
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

function addOrder(order) {
    logit.resetPrefix("addOrder");

    const requestOptions = {
        headers: authHeader(),
        body: JSON.stringify(order)
    };

    return new Promise( function(resolve, reject) {
        API.post("SaasOrder", '/order',requestOptions)
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
        API.del("SaasOrder", '/order/'+name,requestOptions)
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



