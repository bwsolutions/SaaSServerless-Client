import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import ReactModal from 'react-modal';

import {orderActions, modalActions} from '../_actions';
import ModalContainer from "./ModalContainer";
import {modalConstants} from "../_constants";

import DataTable from "../_components/DataTable";

import { Debug } from "../_helpers/debug";
var logit = new Debug("OrdersPage");

class OrdersPage extends React.Component {
    constructor(props) {
        super(props);
        logit.resetPrefix("constructor");
        logit.debug(" props....");
        logit.debug( props);

        this.props.dispatch(orderActions.ordersReset());
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.openDeleteModal = this.openDeleteModal.bind(this);
        this.deleteOrder = this.deleteOrder.bind(this);
    }
    componentDidMount() {
        logit.resetPrefix("componentDidMount");

        logit.debug("dispatch getOrdersIfNeeded....");
        this.props.dispatch(orderActions.getOrdersIfNeeded());

    }

    componentDidUpdate() {
        logit.resetPrefix("componentDidUpdate");

        logit.debug("dispatch getOrdersIfNeeded....");
        this.props.dispatch(orderActions.getOrdersIfNeeded());
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


        logit.debug("how did we get here???");
        // throw new Error("OrdersPage: handlesubmit: how did we get here????");
    }


    deleteOrder(name) {
        logit.resetPrefix("deleteOrder");
        logit.debug("name = "+name);
        // close modal
        this.props.dispatch(modalActions.hideModal());
        // delete order
        this.props.dispatch(orderActions.delete(name));

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
            title: 'Delete Order?',
            message: "Are you sure you want to delete this order?",
            deleteAction: () => {this.deleteOrder(param)},
            deleteText: 'Delete',
            closeModal: closeModal,
        }, modalConstants.DELETE_ITEM);

    }

    render() {
        const { orders  } = this.props;
        logit.resetPrefix("render");
        const openDeleteModal = this.openDeleteModal;
        const openEnableModal = this.openEnableModal;

        var headings = ['Product SKU', 'Product Title', 'Ordered By', 'Order Date', 'Quantity', 'Unit Cost', 'Total Cost'];
        const actions = function(id) { return (
            <div className="button-group">
                <Link to={"/order/edit/"+id} ><i className="fas fa-edit"></i></Link>
                <button className="btn icons" onClick={(e) => openDeleteModal(id,e)}>
                    <i className="fas fa-trash-alt"></i></button>
            </div>)};

        const addLink = function(id,sku) { return ( <Link to={"/order/"+id}> {sku} </Link> ); }

        var rows = orders.items.map((order) => {
            return [order.productSKU,
                order.productDescription,
                order.orderedBy,
                order.dateOrdered ,
                order.quantity,
                order.unitCost,
                order.quantity * order.unitCost,
                actions(order.orderId)]} );

        return (
            <div className="col-12 ">
                <div align="right">
                    <Link className="btn btn-primary" to="/order/add">
                        <i className="fas fa-plus"> Add Order </i>
                    </Link>
                </div>
                <h2>Current Orders</h2>
                {orders.isLoading && <em>Loading Orders...</em>}
                {orders.error && <span className="text-danger">ERROR: {orders.error.message}</span>}
                {orders.items &&
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
    const { orders,authentication } = state;
    logit.resetPrefix("mapStateToProps");

    return {
        orders, authentication
    };
}

const connectedOrdersPage = connect(mapStateToProps)(OrdersPage);
export { connectedOrdersPage as OrdersPage };