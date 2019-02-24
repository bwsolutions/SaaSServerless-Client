import {productConstants} from '../_constants';
import {productService} from "../_services";
import {checkAuth, history} from "../_helpers";
import {alertActions} from "./alert.actions";
import { Debug } from "../_helpers/debug";
var logit = new Debug("productActions:");


export const productActions = {
    checkHealth,
    productsReset,
    getProduct,
    getProductIfNeeded,
    getProductsIfNeeded,
    getProducts,
    updateProduct,
    addProduct,
    delete: _delete,
};

function checkHealth() {
    return up();

    function check() { return { type: productConstants.HEALTH_REQUEST} }
    function up() { return { type: productConstants.HEALTH_UP} }
    function down() { return { type: productConstants.HEALTH_DOWN} }
}
function productsReset() {
    return { type: productConstants.GETALL_RESET } ;
}


function getProduct(name) {
    logit.resetPrefix("getProduct");
    // get /products
    return dispatch => {
        dispatch(request({name: name }));

        productService.getProduct(name)
            .then(
                response => {
                dispatch(success(response));
                },
                error => {
                    logit.log("getProduct failure. error =  ");
                    logit.log(error);
                    checkAuth(dispatch, error);
                    dispatch(failure(error));
                    var msg = error.message ? error.message : error.toString();
                    dispatch(alertActions.error(msg));
                }
            );
    };
    function request(product) { return { type: productConstants.GET_PRODUCT_REQUEST} }
    function success(product) { return { type: productConstants.GET_PRODUCT_SUCCESS, product} }
    function failure(error) { return { type: productConstants.GET_PRODUCT_FAILURE, error} }
}
function getProductIfNeeded(name) {
    logit.resetPrefix("getProductIfNeeded");
    logit.log(" name =  ");
    logit.log(name);

    return (dispatch, getState) => {
        if (_shouldGetProduct(getState())) {
            return dispatch(getProduct(name));
        }
    }
}
function _shouldGetProduct(state) {
    logit.resetPrefix("_shouldGetProduct");
    const aProduct = state.aProduct;
    if (aProduct.error) {
        logit.debug(" error - return false.  ");
        return false;
    } else if (aProduct.status === productConstants.PRODUCT_VALID) {
        logit.debug(" Valid - return false.  ");
        return false;
    } else if (aProduct.status === productConstants.PRODUCT_INVALID &&
        aProduct.isLoading === false) {
        logit.debug(" invalid - return true.  ");
        return true;
    } else {
        logit.debug(" other - return false.  ");
        return false;
    }
}
function getProductsIfNeeded() {
    logit.resetPrefix("getProductsIfNeeded");

    return (dispatch, getState) => {
        if (_shouldGetProducts(getState())) {
            logit.log(" dispatch getProducts...  ");
            return dispatch(getProducts());
        }
    }
}
function _shouldGetProducts(state) {
    logit.resetPrefix("_shouldGetProducts");
    const products = state.products;
    if (products.error) {
        logit.debug(" return false.  ");
        return false;
    } else if (products.isLoading === true || products.isLoaded === true) {
        logit.debug(" return false.  ");
        return false;
    } else if (products.isLoading === false || products.isLoading === undefined) {
        logit.debug(" return true.  ");
        return true;
    } else {
        logit.debug(" return false.  ");
        return false;
    }
}
function getProducts() {
    logit.resetPrefix("getProducts");
    // get /products
    return dispatch => {
        dispatch(request({ }));

        productService.getProducts()
            .then(
                response => {
                   if (response.status === true) {
                        var products  = {items : response.items ? response.items : []} ;
                         dispatch(success(products));
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
    function request() { return { type: productConstants.GETALL_REQUEST} }
    function success(products) { return { type: productConstants.GETALL_SUCCESS, products} }
    function failure(error) { return { type: productConstants.GETALL_FAILURE, error} }
}

function updateProduct(product) {
    logit.resetPrefix("updateProduct");
    // get /products
    return dispatch => {
        dispatch(request({ product}));

        productService.update(product)
            .then(
                response => {
                  dispatch(success(product));
                    dispatch(alertActions.success("Product Updated."));
                    history.push('/products');
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
    function request(product) { return { type: productConstants.UPDATE_PRODUCT_REQUEST, product} }
    function success(product) { return { type: productConstants.UPDATE_PRODUCT_SUCCESS, product} }
    function failure(error) { return { type: productConstants.UPDATE_PRODUCT_FAILURE, error} }
}
function addProduct(product) {
    logit.resetPrefix("addProduct");
    // get /products
    return dispatch => {
        dispatch(request({ product}));

        productService.addProduct(product)
            .then(
                response => {
                  dispatch(success(product));
                    history.push('/products');
                    dispatch(alertActions.success("Product added."));

                },
                error => {
                    logit.log("failure. error =  ");
                    logit.log(error);
                    dispatch(failure(error));
                    var msg = error.errorMessage ? error.errorMessage : error.toString();
                    dispatch(alertActions.error(msg));
                }
            );
    };
    function request(product) { return { type: productConstants.ADD_PRODUCT_REQUEST, product} }
    function success(product) { return { type: productConstants.ADD_PRODUCT_SUCCESS, product} }
    function failure(error) { return { type: productConstants.ADD_PRODUCT_FAILURE, error} }
}

// prefixed function name with underscore because delete is a reserved word in javascript
function _delete(name) {
    logit.resetPrefix("_delete");
    return dispatch => {
        dispatch(request(name));

        productService.delete(name)
            .then(
                response => {
                    dispatch(success(name))
                    history.push('/products');
                    dispatch(alertActions.success("Product deleted."));
                },
                error => { logit.log("failure. error =  ");
                    logit.log(error);
                    dispatch(failure(error));
                    var msg = error.message ? error.message : error.toString();
                    dispatch(alertActions.error(msg));}

            );
    };

    function request(name) { return { type: productConstants.DELETE_REQUEST, name } }
    function success(name) { return { type: productConstants.DELETE_SUCCESS, name } }
    function failure(error) { return { type: productConstants.DELETE_FAILURE, error } }
}


