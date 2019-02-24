import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import config from "../App/config";

import {tenantMgrActions, modalActions, userActions} from '../_actions';
import ModalContainer from "./ModalContainer";
import {modalConstants} from "../_constants";

import * as Roles from "../_reducers/authentication.reducer";
import { withRouter} from "react-router-dom";

import { Debug} from "../_helpers";
import DataTable from "../_components/DataTable";
var logit = new Debug("TenantsPage");

class TenantsPage extends React.Component {
    constructor(props) {
        super(props);
        logit.resetPrefix("constructor");
        logit.debug(" props....");
        logit.debug( props);

        this.openDeleteModal = this.openDeleteModal.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.props.dispatch(tenantMgrActions.tenantsReset());

    }
    componentDidMount() {
        logit.resetPrefix("componentDidMount");

        logit.debug("dispatch getTenantsIfNeeded....");
        this.props.dispatch(tenantMgrActions.getTenantsIfNeeded());
    }
    componentDidUpdate() {
        logit.resetPrefix("componentDidUpdate");

        logit.debug("dispatch getTenantsIfNeeded....");
        this.props.dispatch(tenantMgrActions.getTenantsIfNeeded());
    }
    handleChange(event) {
        const { id, value } = event.target;
        const { tenant } = this.state;
        logit.debug("handleChange - is this even used?????....");
        this.setState({
            tenant: {
                ...tenant,
                [id]: value
            }
        });
    }

    handleSubmit(event) {
        logit.resetPrefix("handleSubmit");
        event.preventDefault();

        // should not get here. no submits only links??

        logit.error("how did we get here???");
        throw new Error("TenantsPage: handlesubmit: how did we get here????");
    }

    deleteTenant(name) {
        logit.resetPrefix("deleteTenant");
        logit.debug("name = "+name);
        // close modal
        this.props.dispatch(modalActions.hideModal());
        // delete user
        this.props.dispatch(tenantMgrActions.deleteTenant(name));

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

        var message = "Are you sure you want to delete this Tenant?";

        if (param.startsWith(config.systemPrefix)) {
            message = "ALERT:  Deleting this Tenant could leave system unusable. Are you SURE you want to delete this tenant?";
        }

        showModal({
            open: true,
            title: 'Delete Tenant?',
            message: message,
            deleteAction: () => {this.deleteTenant(param)},
            deleteText: 'Delete',
            closeModal: closeModal,
        }, modalConstants.DELETE_ITEM);

    }
    render() {
        const { tenants,isSystemAdminUser  } = this.props;
        logit.resetPrefix("render");
        const openDeleteModal = this.openDeleteModal;

        var headings = ['Company Name', 'Account Name', 'Owner', 'Plan', 'Status'];
        const actions = function(id) {
            return (isSystemAdminUser && <div className="button-group">
                            <Link to={"/tenant/edit/"+id} ><i className="fas fa-edit"></i></Link>
                            <button className="btn icons" onClick={(e) => openDeleteModal(id,e)}>
                                <i className="fas fa-trash-alt"></i></button>
                   </div>)};


        if (isSystemAdminUser) {
            headings.push('Actions');
        }

        var rows = tenants.items.map((tenant) => {
            return [tenant.companyName,
                    tenant.accountName,
                    tenant.ownerName,
                    tenant.tier,
                    tenant.status,
                    actions(tenant.id)]} );

        return (
            <div className="col-10 offset-1">
                <h2>Current Tenants</h2>
                {tenants.isLoading && <em>Loading Tenants...</em>}
                {tenants.error && <span className="text-danger">ERROR: {tenants.error.message}</span>}
                {tenants.items &&
                    <div>
                        <form name="form" onSubmit={this.handleSubmit}>
                            <DataTable headings={headings} rows={rows}/>
                        </form>
                        <ModalContainer/>
                    </div>
                }
            </div>
        );
    }
}

function mapStateToProps(state) {
    const { tenants,authentication } = state;
    logit.resetPrefix("mapStateToProps");

    return {
        isSystemAdminUser: Roles.isSystemAdminUser(state),
        tenants, authentication
    };
}

const connectedTenantsPage = withRouter(connect(mapStateToProps)(TenantsPage));
export { connectedTenantsPage as TenantsPage };