import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import { tenantRegActions } from '../_actions';
import {FormLabel, FormControl, FormGroup} from "react-bootstrap";
import LoaderButton from "../_components/LoaderButton";

import { Debug } from "../_helpers/debug";
var logit = new Debug("RegisterPage");

class RegisterPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            tenant: {
                firstName: '',
                lastName: '',
                email: '',
                companyName: '',
                tier: '',
                userName: ''
            },
            submitted: false
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    validateForm() {
        var tiers = ['Free', 'Standard', 'Professional'];
        return this.state.tenant.email.length > 0 &&
                tiers.indexOf(this.state.tenant.tier) >= 0 &&
                this.state.tenant.companyName.length > 0 &&
                this.state.tenant.firstName.length > 0 &&
                this.state.tenant.lastName.length > 0;
    }

    handleChange(event) {
        const { id, value } = event.target;
        const { tenant } = this.state;
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
        const { tenant } = this.state;

        tenant.userName = this.state.tenant.email
        logit.debug("tenant info = ");
        logit.debug(tenant);

        this.setState({ submitted: true });
        this.setState({ tenant: tenant });

        const { dispatch } = this.props;

        dispatch(tenantRegActions.register(tenant));
    }

    render() {
        const {  tenantRegistering, tenantRegistered  } = this.props;
        const { tenant, submitted } = this.state;
        return (
            <div className="col-8 offset-2">
                <h2 className="text-center">Register</h2>
                <form name="form" onSubmit={this.handleSubmit}>
                    <FormGroup controlId="firstName" >
                        <FormLabel>First Name</FormLabel>
                        <FormControl
                            autoFocus
                            value={tenant.firstName}
                            onChange={this.handleChange}
                            type="text"
                        />
                    </FormGroup>
                    <FormGroup controlId="lastName" >
                        <FormLabel>Last Name</FormLabel>
                        <FormControl
                            value={tenant.lastName}
                            onChange={this.handleChange}
                            type="text"
                        />
                    </FormGroup>
                    <FormGroup controlId="email" >
                        <FormLabel>Email</FormLabel>
                        <FormControl
                            type="email"
                            value={tenant.email}
                            onChange={this.handleChange}
                        />
                    </FormGroup>
                    <FormGroup controlId="companyName" >
                        <FormLabel>Company</FormLabel>
                        <FormControl
                            value={tenant.accountName}
                            onChange={this.handleChange}
                            type="text"
                        />
                    </FormGroup>
                    <FormGroup controlId="tier" >
                        <FormLabel>Plan</FormLabel>
                        <FormControl as="select"
                                     value={this.state.tenant.tier}
                                     placeholder="Select a Plan"
                                     onChange={this.handleChange}>
                            <option value=""></option>
                            <option value="Free">Free Tier</option>
                            <option value="Standard">Standard Tier</option>
                            <option value="Professional">Professional Tier</option>
                        </FormControl>
                    </FormGroup>

                    <div className="form-group">
                        <LoaderButton
                            block
                            disabled={!this.validateForm()}
                            type="submit"
                            isLoading={tenantRegistering}
                            text="Register"
                            loadingText="Registering.…"
                        />
                        <Link to="/login" className="btn btn-link">Cancel</Link>
                    </div>
                </form>
            </div>
        );
    }
}

function mapStateToProps(state) {
    const { tenantRegistering, tenantRegistered } = state.tenantRegistration;
    return {
        tenantRegistering, tenantRegistered
    };
}

const connectedRegisterPage = connect(mapStateToProps)(RegisterPage);
export { connectedRegisterPage as RegisterPage };