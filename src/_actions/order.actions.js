import {orderConstants} from '../_constants';
import {orderService, productService} from "../_services";
import {checkAuth, history} from "../_helpers";
import {alertActions} from "./alert.actions";
import { Debug } from "../_helpers/debug";
var logit = new Debug("orderActions:");


export const orderActions = {
    checkHealth,
    ordersReset,
    getOrder,
    getOrderIfNeeded,
    getOrdersIfNeeded,
    getOrders,
    updateOrder,
    addOrder,
    delete: _delete,
};

function checkHealth() {
    return up();

    function check() { return { type: orderConstants.HEALTH_REQUEST} }
    function up() { return { type: orderConstants.HEALTH_UP} }
    function down() { return { type: orderConstants.HEALTH_DOWN} }
}

function ordersReset() {
    return { type: orderConstants.GETALL_RESET } ;
}

function loadProducts(name) {
    logit.resetPrefix("loadProducts");
    // get /orders
    return dispatch => {
        dispatch(request({name: name }));

        productService.getProducts()
            .then(
                response => {
                    logit.log("getOrder resolved. check response = ");
                    logit.log(response);
                    if (response.status === true) {
                        var products  = {items : response.items ? response.items : []} ;
                        dispatch(success(products));
                    }
                },
                error => {
                    logit.log("getOrder failure. error =  ");
                    logit.log(error);
                    checkAuth(dispatch, error);
                    dispatch(failure(error));
                    var msg = error.message ? error.message : error.toString();
                    dispatch(alertActions.error(msg));
                }
            );
    };
    function request(order) { return { type: orderConstants.LOAD_PRODUCTS_REQUEST} }
    function success(order) { return { type: orderConstants.LOAD_PRODUCTS_SUCCESS, order} }
    function failure(error) { return { type: orderConstants.LOAD_PRODUCTS_FAILURE, error} }
}

function getOrder(name) {
    logit.resetPrefix("getOrder");
    // get /orders
    return dispatch => {
        dispatch(request({name: name }));

        orderService.getOrder(name)
            .then(
                response => {
                    logit.log("getOrder resolved. check response = ");
                    logit.log(response);
                    logit.log("set Success,,,,");
                    dispatch(success(response));
                },
                error => {
                    logit.log("getOrder failure. error =  ");
                    logit.log(error);
                    checkAuth(dispatch, error);
                    dispatch(failure(error));
                    var msg = error.message ? error.message : error.toString();
                    dispatch(alertActions.error(msg));
                }
            );
    };
    function request(order) { return { type: orderConstants.GET_ORDER_REQUEST} }
    function success(order) { return { type: orderConstants.GET_ORDER_SUCCESS, order} }
    function failure(error) { return { type: orderConstants.GET_ORDER_FAILURE, error} }
}
function getOrderIfNeeded(name) {
    logit.resetPrefix("getOrderIfNeeded");
    logit.log(" name =  ");
    logit.log(name);

    return (dispatch, getState) => {
        if (_shouldGetOrder(getState())) {
            return dispatch(getOrder(name));
        }
    }
}
function _shouldGetOrder(state) {
    logit.resetPrefix("_shouldGetOrder");
    const aOrder = state.aOrder;
    if (aOrder.error) {
        logit.debug(" error - return false.  ");
        return false;
    } else if (aOrder.status === orderConstants.ORDER_VALID) {
        logit.debug(" Valid - return false.  ");
        return false;
    } else if (aOrder.status === orderConstants.ORDER_INVALID &&
        aOrder.isLoading === false) {
        logit.debug(" invalid - return true.  ");
        return true;
    } else {
        logit.debug(" other - return false.  ");
        return false;
    }
}
function getOrdersIfNeeded() {
    logit.resetPrefix("getOrdersIfNeeded");

    return (dispatch, getState) => {
        if (_shouldGetOrders(getState())) {
            return dispatch(getOrders());
        }
    }
}
function _shouldGetOrders(state) {
    logit.resetPrefix("_shouldGetOrders");
    const orders = state.orders;
    if (orders.error) {
        logit.debug(" return false.  ");
        return false;
    } else if (orders.isLoading === true || orders.isLoaded === true) {
        logit.debug(" return false.  ");
        return false;
    } else if (orders.isLoading === false || orders.isLoading === undefined) {
        logit.debug(" return true.  ");
        return true;
    } else {
        logit.debug(" return false.  ");
        return false;
    }
}
function getOrders() {
    logit.resetPrefix("getOrders");
    // get /orders
    return dispatch => {
        dispatch(request({ }));

        orderService.getOrders()
            .then(
                response => {
                    if (response.status === true) {
                        var orders  = {items : response.items ? response.items : []} ;
                        dispatch(success(orders));
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
    function request() { return { type: orderConstants.GETALL_REQUEST} }
    function success(orders) { return { type: orderConstants.GETALL_SUCCESS, orders} }
    function failure(error) { return { type: orderConstants.GETALL_FAILURE, error} }
}

function updateOrder(order) {
    logit.resetPrefix("updateOrder");
    // get /orders
    return dispatch => {
        dispatch(request({ order}));

        orderService.update(order)
            .then(
                response => {
                    dispatch(success(order));
                    dispatch(alertActions.success("Order Updated."));
                    history.push('/orders');
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
    function request(order) { return { type: orderConstants.UPDATE_ORDER_REQUEST, order} }
    function success(order) { return { type: orderConstants.UPDATE_ORDER_SUCCESS, order} }
    function failure(error) { return { type: orderConstants.UPDATE_ORDER_FAILURE, error} }
}
function addOrder(order) {
    logit.resetPrefix("addOrder");
    // get /orders
    return dispatch => {
        dispatch(request({ order}));

        orderService.addOrder(order)
            .then(
                response => {
                    dispatch(success(order));
                    history.push('/orders');
                    dispatch(alertActions.success("Order added."));

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
    function request(order) { return { type: orderConstants.ADD_ORDER_REQUEST, order} }
    function success(order) { return { type: orderConstants.ADD_ORDER_SUCCESS, order} }
    function failure(error) { return { type: orderConstants.ADD_ORDER_FAILURE, error} }
}

// prefixed function name with underscore because delete is a reserved word in javascript
function _delete(name) {
    logit.resetPrefix("_delete");
    return dispatch => {
        dispatch(request(name));

        orderService.delete(name)
            .then(
                response => {
                    dispatch(success(name))
                    history.push('/orders');
                    dispatch(alertActions.success("Order deleted."));
                },
                error => { logit.log("failure. error =  ");
                    logit.log(error);
                    dispatch(failure(error));
                    var msg = error.message ? error.message : error.toString();
                    dispatch(alertActions.error(msg));}

            );
    };

    function request(name) { return { type: orderConstants.DELETE_REQUEST, name } }
    function success(name) { return { type: orderConstants.DELETE_SUCCESS, name } }
    function failure(error) { return { type: orderConstants.DELETE_FAILURE, error } }
}


