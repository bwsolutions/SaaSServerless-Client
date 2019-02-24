import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import ReactModal from 'react-modal';

import { userActions, modalActions} from '../_actions';
import ModalContainer from "./ModalContainer";
import {modalConstants} from "../_constants";
import * as Roles from "../_reducers/authentication.reducer";
import { withRouter} from "react-router-dom";

import DataTable from "../_components/DataTable";

import { Debug } from "../_helpers/debug";
var logit = new Debug("UsersPage");


class UsersPage extends React.Component {
    constructor(props) {
        super(props);
        logit.resetPrefix("constructor");
        logit.debug(" props....");
        logit.debug( props);

        this.props.dispatch(userActions.usersReset());
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.openDeleteModal = this.openDeleteModal.bind(this);
        this.openEnableModal = this.openEnableModal.bind(this);
        this.deleteUser = this.deleteUser.bind(this);
    }
    componentDidMount() {
        logit.resetPrefix("componentDidMount");

        logit.debug("dispatch getUsersIfNeeded....");
        this.props.dispatch(userActions.getUsersIfNeeded());
    }

    componentDidUpdate() {
        logit.resetPrefix("componentDidUpdate");

        logit.debug("dispatch getUsersIfNeeded....");
        this.props.dispatch(userActions.getUsersIfNeeded());
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


        logit.debug("how did we get here???");
       // throw new Error("UsersPage: handlesubmit: how did we get here????");
    }

    enableUser(user) {
        logit.resetPrefix("enableUser");

        logit.debug("name = "+name);
// close modal
        this.props.dispatch(modalActions.hideModal());
        // toggle enable flag for user
        this.props.dispatch(userActions.enable(user));

    }
    openEnableModal (param, event) {
        logit.resetPrefix("openEnableModal");

        event.preventDefault();
        const { users  } = this.props;

        var user = users.items.find(obj => obj.userName === param);

        var showModal = (modalProps, modalType) => {
            return this.props.dispatch(modalActions.showModal(modalProps,modalType));
        }
        const closeModal = () => {
            return this.props.dispatch(modalActions.hideModal());
        }

        var newStatus = user.enabled ? "Disable" : "Enable";

        showModal({
            open: true,
            title: newStatus + ' User?',
            message: "Are you sure you want to "+newStatus+" this user?",
            enableAction: () => {this.enableUser(user)},
            enableText: newStatus,
            closeModal: closeModal,
        }, modalConstants.ENABLE_USER);

    }
    deleteUser(name) {
        logit.resetPrefix("deleteUser");
        logit.debug("name = "+name);
        // close modal
        this.props.dispatch(modalActions.hideModal());
        // delete user
        this.props.dispatch(userActions.delete(name));

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
            title: 'Delete User?',
            message: "Are you sure you want to delete this user?",
            deleteAction: () => {this.deleteUser(param)},
            deleteText: 'Delete',
            closeModal: closeModal,
        }, modalConstants.DELETE_ITEM);

    }

    render() {
        const { users  } = this.props;
        logit.resetPrefix("render");
        const openDeleteModal = this.openDeleteModal;
        const openEnableModal = this.openEnableModal;

        var headings = ['First Name', 'Last Name', 'User Name', 'Role', 'Active', 'Date Created'];
        const actions = function(id) { return (
            <div className="button-group">
            <Link to={"/user/edit/"+id} ><i className="fas fa-edit"></i></Link>
                <button className="btn icons" onClick={(e) => openDeleteModal(id,e)}>
                    <i className="fas fa-trash-alt"></i></button>
                <button className="btn icons " onClick={(e) => openEnableModal(id,e)}>
                    <i className="fas fa-check-square"></i></button>
        </div>)};

        var rows = users.items.map((user) => {
                return [user.firstName,
                        user.lastName,
                        user.userName ,
                        Roles.roleToDisplayName(user.role),
                        user.enabled ? 'Active' : 'Inactive',
                        user.dateCreated,
                        actions(user.userName)]} );

        return (
            <div className="col-12 ">
                <div align="right">
                    <Link className="btn btn-primary" to="/user/add">
                        <i className="fas fa-plus"> Add User </i>
                    </Link>
                </div>
                <h2>Current Users</h2>
                {users.isLoading && <em>Loading Users...</em>}
                {users.error && <span className="text-danger">ERROR: {users.error.message}</span>}
                {users.items &&
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

function mapStateToProps(state, ownProps) {
    const { users,authentication } = state;
    logit.resetPrefix("mapStateToProps");

    return {
        users, authentication
    };
}

const connectedUsersPage = connect(mapStateToProps)(UsersPage);
export { connectedUsersPage as UsersPage };