import React, { Component } from "react";
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { FormGroup, FormControl, FormLabel, Table } from "react-bootstrap";
import LoaderButton from "../_components/LoaderButton";

import { sysRegActions } from '../_actions';
import {Debug} from "../_helpers";
var logit = new Debug("UsersPage");

class InstallPage extends React.Component {
    constructor(props) {
        logit.resetPrefix("constructor");
        super(props);

        this.state = {
            admin: {
                userName: "",
                accountName: "",
                firstName: "",
                lastName: "",
                ownername:  ""
              },
            isLoading: false,
            systemRegistration : false
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.renderInstallComplete = this.renderInstallComplete.bind(this);
        this.renderForm = this.renderForm.bind(this);
    }

    validateForm() {
        return this.state.admin.userName.length > 0 && this.state.admin.accountName.length > 0 && this.state.admin.firstName.length > 0 && this.state.admin.lastName.length > 0;
    }

    handleChange(event) {
        const { id, value } = event.target;
        const { admin } = this.state;

        this.setState({
            admin: {
                ...admin,
                [id]: value
            }
        });
     }

    handleSubmit(event) {
        event.preventDefault();

        this.setState({ isLoading: true});
        const { admin } = this.state;
        admin.ownername = this.state.admin.accountName;

        this.setState({ admin: admin });

        const { dispatch } = this.props;

        dispatch(sysRegActions.register(admin));

    }
    renderInstallComplete() {
        return (
            <div className="InstallComplete">
                <h2>Installation Successful</h2>
                <Table bordered >
                    <tbody>
                    <tr><td>Account Name</td><td>{this.state.admin.accountName}</td></tr>
                    <tr><td>Owner Name</td><td>{this.state.admin.accountName}</td></tr>
                    <tr><td>Admin Email/Username</td><td>{this.state.admin.userName}</td></tr>
                    <tr><td>Admin First Name</td><td>{this.state.admin.firstName}</td></tr>
                    <tr><td>Admin Last Name</td><td>{this.state.admin.lastName}</td></tr>
                    <tr><td>Install Status</td><td>{this.state.admin.installed}</td></tr>
                    <tr><td>Install Message</td><td>{this.state.admin.installmsg}</td></tr>
                    </tbody>
                </Table>

            </div>
        );
    }
    renderForm() {
        const { installing, installed  } = this.props;
        const { admin, submitted } = this.state;

        return (
            <div className="col-6-6 offset-3">
                <h2>Install</h2>
                <form name="form" onSubmit={this.handleSubmit}>
                    <FormGroup controlId="userName" >
                        <FormLabel>Admin Email</FormLabel>
                        <FormControl
                            autoFocus
                            type="email"
                            value={admin.userName}
                            onChange={this.handleChange}
                        />
                    </FormGroup>
                    <FormGroup controlId="accountName" >
                        <FormLabel>Company</FormLabel>
                        <FormControl
                            value={admin.accountName}
                            onChange={this.handleChange}
                            type="text"
                        />
                    </FormGroup>
                    <FormGroup controlId="firstName" >
                        <FormLabel>First Name</FormLabel>
                        <FormControl
                            value={admin.firstName}
                            onChange={this.handleChange}
                            type="text"
                        />
                    </FormGroup>
                    <FormGroup controlId="lastName" >
                        <FormLabel>Last Name</FormLabel>
                        <FormControl
                            value={admin.lastName}
                            onChange={this.handleChange}
                            type="text"
                        />
                    </FormGroup>
                    <div className="form-group">
                        <LoaderButton
                            block
                            disabled={!this.validateForm()}
                            type="submit"
                            isLoading={installing}
                            text="Install"
                            loadingText="Installing.…"
                        />
                        <Link to="/login" className="btn btn-link">Cancel</Link>
                    </div>
                </form>
            </div>
        );
    }
    render() {
       return (
            <div className="Intall">
                {this.state.systemRegistration.installed === true
                    ? this.renderInstallComplete()
                    : this.renderForm()}
            </div>
        );
    }
}

function mapStateToProps(state) {
    const { installing, installed } = state.systemRegistration;
    return {
        installing, installed
    };
}

const connectedInstallPage = connect(mapStateToProps)(InstallPage);
export { connectedInstallPage as InstallPage };