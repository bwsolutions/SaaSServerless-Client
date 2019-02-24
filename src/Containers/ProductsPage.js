import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import ReactModal from 'react-modal';

import {productActions, modalActions} from '../_actions';
import ModalContainer from "./ModalContainer";
import {modalConstants} from "../_constants";
import * as Roles from "../_reducers/authentication.reducer";

import DataTable from "../_components/DataTable";

import { Debug } from "../_helpers/debug";
var logit = new Debug("ProductsPage");

class ProductsPage extends React.Component {
    constructor(props) {
        super(props);
        logit.resetPrefix("constructor");
        logit.debug(" props....");
        logit.debug( props);

        this.props.dispatch(productActions.productsReset());
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.openDeleteModal = this.openDeleteModal.bind(this);
        this.deleteProduct = this.deleteProduct.bind(this);
    }
    componentDidMount() {
        logit.resetPrefix("componentDidMount");

        logit.debug("dispatch getProductsIfNeeded....");
        this.props.dispatch(productActions.getProductsIfNeeded());

    }

    componentDidUpdate() {
        logit.resetPrefix("componentDidUpdate");

        logit.debug("dispatch getProductsIfNeeded....");
        this.props.dispatch(productActions.getProductsIfNeeded());
    }

    handleChange(event) {
        const { id, value } = event.target;
        const { tenant } = this.state;
        this.setState({
            testing: {
                ...testing,
                [id]: value
            }
        });
    }

    handleSubmit(event) {
        logit.resetPrefix("handleSubmit");

        event.preventDefault();

        // should not get here. no submits only links??


        logit.error("how did we get here???");
        // throw new Error("ProductsPage: handlesubmit: how did we get here????");
    }


    deleteProduct(name) {
        logit.resetPrefix("deleteProduct");
        logit.debug("name = "+name);
        // close modal
        this.props.dispatch(modalActions.hideModal());
        // delete product
        this.props.dispatch(productActions.delete(name));

    }
    openDeleteModal(param, event) {
        logit.resetPrefix("openDeleteModal");

        event.preventDefault();

        var showModal = (modalProps, modalType) => {
            return this.props.dispatch(modalActions.showModal(modalProps,modalType));
        }
        const closeModal = () => {
            return this.props.dispatch(modalActions.hideModal());
        }

        showModal({
            open: true,
            title: 'Delete Product?',
            message: "Are you sure you want to delete this product?",
            deleteAction: () => {this.deleteProduct(param)},
            deleteText: 'Delete',
            closeModal: closeModal,
        }, modalConstants.DELETE_ITEM);

    }

    render() {
        const { products  } = this.props;
        logit.resetPrefix("render");
        const openDeleteModal = this.openDeleteModal;
        const openEnableModal = this.openEnableModal;

        var headings = ['SKU', 'Title', 'Condition', 'In Stock', 'Unit Cost'];
        const actions = function(id) { return (
            <div className="button-group">
                <Link to={"/product/edit/"+id} ><i className="fas fa-edit"></i></Link>
                <button className="btn icons" onClick={(e) => openDeleteModal(id,e)}>
                    <i className="fas fa-trash-alt"></i></button>
            </div>)};

       const addLink = function(id,sku) { return ( <Link to={"/product/"+id}> {sku} </Link> ); }

        var rows = products.items.map((product) => {
            return [addLink(product.productId,product.sku),
                product.title,
                product.condition ,
                product.numberInStock,
                product.unitCost,
                actions(product.productId)]} );

        return (
            <div className="col-12 ">
                <div align="right">
                    <Link className="btn btn-primary" to="/product/add">
                        <i className="fas fa-plus"> Add Product </i>
                    </Link>
                </div>
                <h2>Current Products</h2>
                {products.isLoading && <em>Loading Products...</em>}
                {products.error && <span className="text-danger">ERROR: {products.error.message}</span>}
                {products.items &&
                <div>
                    <form name="form" onSubmit={this.handleSubmit}>
                        <DataTable headings={headings} rows={rows} />
                    </form>
                    <ModalContainer/>
                </div>
                }
            </div>
        );
    }
}

function mapStateToProps(state, ownProps) {
    const { products,authentication } = state;
    logit.resetPrefix("mapStateToProps");

    return {
        products, authentication
    };
}

const connectedProductsPage = connect(mapStateToProps)(ProductsPage);
export { connectedProductsPage as ProductsPage };