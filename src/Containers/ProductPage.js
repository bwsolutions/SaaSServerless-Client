import React from 'react';
import { connect } from 'react-redux';
import { productConstants } from '../_constants';
import { ProductForm } from '../_components/ProductForm';
import {Link, Redirect, withRouter} from "react-router-dom";
import {alertActions, orderActions, productActions} from '../_actions';

import { Debug } from "../_helpers/debug";
var logit = new Debug("ProductPage");

class ProductPage extends React.Component {
    constructor(props) {
        super(props);
        logit.resetPrefix("constructor");
        logit.debug("props =");
        logit.debug(props);

        this.state = {
            productId: props.match.params.id,
            action: props.action,
        };
        this.handleSubmitPage = this.handleSubmitPage.bind(this);

        //this.props.dispatch(productActions.getProduct(this.state.name));
    }

    componentDidMount() {
        logit.resetPrefix("componentDidMount");
        logit.debug("props =");
        logit.debug(this.props);
        var {action} = this.state;

        const {dispatch } = this.props;

        if (action === "Edit" || action === "View" ) {
            logit.debug("in edit/view mode. check if product needed");
            dispatch(productActions.getProductIfNeeded(this.state.productId));
        }
    }

    componentDidUpdate() {
        logit.resetPrefix("componentDidUpdate");
        logit.debug("props =");
        logit.debug(this.props);
        var {action} = this.state;
        const {dispatch } = this.props;
        if (action === "Edit" || action === "View" ) {
            logit.debug("in edit/view mode. check if product needed");
            dispatch(productActions.getProductIfNeeded(this.state.productId));
        }
    }

    handleSubmitPage(formType, product) {
        logit.resetPrefix("handleSubmitTP");

        logit.debug("product info = ");
        logit.debug(product);

        const { dispatch } = this.props;

        dispatch(alertActions.clear());
        if (formType === "Edit") {
            dispatch(productActions.updateProduct(product));
        } else {
            dispatch(productActions.addProduct(product));
        }

    }

    render() {
        logit.resetPrefix("render");
        const {aProduct, ...restProps} = this.props;
        const {action, productId} = this.state;

        if (action === "Add") {
            return (
                <div className="col-8 offset-2">
                    <h2 className="text-center">{action} Product</h2>
                    <ProductForm values={aProduct.product} formType={action}
                                 onSubmit={this.handleSubmitPage}/>
                </div>
            );
        } else {
            var isDataValid = aProduct ? aProduct.status === productConstants.PRODUCT_VALID : false;
            var addLink = () => { return (<Link className="btn btn-primary pull-right" to="/product/add">
                            <i className="fas fa-plus"> Add Product </i>
                        </Link>)};
            var editLink = (id) => { return (<Link className="btn btn-primary justify-content-end" to={"/product/edit/"+id}>
                <i className="fas fa-plus"> Edit Product </i>
            </Link>)};
            var inputProps = action === "View" ? {readOnly:"readonly"} : '';

            return (
                <div className="col-8 offset-2">
                    <h2 className="text-center">{action} Product</h2>
                    {isDataValid && <div align="right">
                        {(action === "View" ? editLink(aProduct.product.productId) : addLink())}
                    </div>}
                    {isDataValid ?
                        <ProductForm values={aProduct.product}
                                     formType={action}
                                     inputProps={inputProps}
                                     onSubmit={this.handleSubmitPage}/>
                    : <div> Loading......</div>
                }
                </div>
            );

        }
    }
}

function mapStateToProps(state, ownProps) {
    logit.resetPrefix("mapStateToProps");
    const { aProduct } = state;
    return {
        aProduct
    };
}

function mapDispatchToProps(dispatch, ownProps) {
    logit.resetPrefix("mapDispatchToProps");
     return {
        dispatch
    };
}

const connectedProductPage= connect(mapStateToProps,mapDispatchToProps)(ProductPage);
const withRouterProductPage= withRouter(connectedProductPage);

    export { withRouterProductPage as ProductPage };