import { authHeader } from '../_helpers';
import { API } from "aws-amplify";

import { Debug } from "../_helpers";
var logit = new Debug("product.service");


export const productService = {
    getHealth,
    getProduct,
    getProducts,
    update,
    addProduct,
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
        API.get("SaasProduct", '/product/health', requestOptions)
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
function getProduct(name) {
    logit.resetPrefix("getProduct");

    const requestOptions = {
        headers: authHeader()
    };

    return new Promise( function(resolve, reject) {
        API.get("SaasProduct", '/product/'+name,requestOptions)
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

function getProducts() {
    logit.resetPrefix("getProducts");

    const requestOptions = {
        headers: authHeader()
    };

    return new Promise( function(resolve, reject) {
        API.get("SaasProduct", '/products',requestOptions)
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
function update(product) {
    logit.resetPrefix("update");

    const requestOptions = {
        headers: authHeader(),
        body: JSON.stringify(product)
    };

    return new Promise( function(resolve, reject) {
        API.put("SaasProduct", '/product',requestOptions)
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

function addProduct(product) {
    logit.resetPrefix("addProduct");

    const requestOptions = {
        headers: authHeader(),
        body: JSON.stringify(product)
    };

    return new Promise( function(resolve, reject) {
        API.post("SaasProduct", '/product',requestOptions)
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
        API.del("SaasProduct", '/product/'+name,requestOptions)
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




