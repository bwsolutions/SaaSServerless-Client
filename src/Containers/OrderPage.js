import React from 'react';
import { connect } from 'react-redux';
import { orderConstants } from '../_constants';
import { OrderForm } from '../_components/OrderForm';
import {Link, Redirect, withRouter} from "react-router-dom";
import { alertActions, orderActions,productActions } from '../_actions';

import { Debug } from "../_helpers/debug";
var logit = new Debug("OrderPage");

class OrderPage extends React.Component {
    constructor(props) {
        super(props);
        logit.resetPrefix("constructor");
        logit.debug("props =");
        logit.debug(props);

        this.state = {
            orderId: props.match.params.id,
            action: props.action,
        };
        this.handleSubmitPage = this.handleSubmitPage.bind(this);

        if (props.products.error) {
            logit.debug("possible old error in products reset to force reload.");
            this.props.dispatch(productActions.productsReset());
        }
    }

    componentDidMount() {
        logit.resetPrefix("componentDidMount");
        logit.debug("props =");
        logit.debug(this.props);
        var {action} = this.state;

        const {dispatch, products } = this.props;

        if (action === "Edit" ) {
            logit.debug("in edit mode. check if order needed");
            dispatch(orderActions.getOrderIfNeeded(this.state.orderId));
        } else if (action === "Add" && products.isLoading === false) {
            logit.debug("in add mode. load products");
            dispatch(productActions.getProductsIfNeeded());
        }
    }

    componentDidUpdate() {
        logit.resetPrefix("componentDidUpdate");
        logit.debug("props =");
        logit.debug(this.props);
        var {action} = this.state;
        const {dispatch,products } = this.props;
        if (action === "Edit"  ) {
            logit.debug("in edit mode. check if order needed");
            dispatch(orderActions.getOrderIfNeeded(this.state.orderId));
            dispatch(productActions.getProductsIfNeeded());

        } else if (action === "Add" ) {
            logit.debug("in add mode. load products");
            dispatch(productActions.getProductsIfNeeded());
        }
    }

    handleSubmitPage(formType, order) {
        logit.resetPrefix("handleSubmitTP");

        var userName = this.props.userName;
        order.orderedBy = userName;

        logit.debug("order info = ");
        logit.debug(order);

        const { dispatch } = this.props;

        dispatch(alertActions.clear());
        if (formType === "Edit") {
           dispatch(orderActions.updateOrder(order));
        } else {
           dispatch(orderActions.addOrder(order));
        }
    }

    render() {
        logit.resetPrefix("render");
        const {aOrder, products,userName } = this.props;
        const {action, orderId} = this.state;

        var productMap = {};
        products.items.forEach(function(it) {productMap[it.productId] = it;});

        if (action === "Add") {
            return (
                <div className="col-8 offset-2">
                    <h2 className="text-center">{action} Order</h2>
                    <OrderForm values={aOrder.order} products={products} formType={action}
                                onSubmit={this.handleSubmitPage} />
                </div>
            );
        } else {
            var isDataValid = aOrder ? aOrder.status === orderConstants.ORDER_VALID : false;
            return (
                <div className="col-8 offset-2">
                    <h2 className="text-center">{action} Order</h2>
                    {isDataValid ?
                        <OrderForm values={aOrder.order} formType={action}
                                   onSubmit={this.handleSubmitPage} products={products}  />
                    : <div> Loading......</div>
                }
                </div>
            );

        }
    }
}

function mapStateToProps(state, ownProps) {
    logit.resetPrefix("mapStateToProps");
    const { aOrder, products, authentication } = state;

    return {
        aOrder, products,
        userName: authentication.user.username,
    };
}

function mapDispatchToProps(dispatch, ownProps) {
    logit.resetPrefix("mapDispatchToProps");
    return {
        dispatch
    };
}

const connectedOrderPage= connect(mapStateToProps,mapDispatchToProps)(OrderPage);
const withRouterOrderPage= withRouter(connectedOrderPage);

    export { withRouterOrderPage as OrderPage };