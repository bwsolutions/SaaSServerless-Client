import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import {Formik, Field, Form, ErrorMessage, withFormik} from 'formik';

import {alertActions, userActions} from '../_actions';
import {FormLabel, FormControl, FormGroup, Row, Col} from "react-bootstrap/lib";

import LoaderButton from "../_components/LoaderButton";

import { Debug } from "../_helpers/debug";
import Container from "react-bootstrap/es/Container";
import * as Roles from "../_reducers/authentication.reducer";
import {userConstants} from "../_constants";
var logit = new Debug("UserForm");

const FieldComponentWithLabel = ({
    field,
    form: {values, errors},
    ...props
}) => (
    <div className="form-group">
        <label htmlFor={field.name} className="control-label">{props.label} </label>
        <input type={props.type} id={field.name} className="form-control"
            value={field.value}
            onChange={field.onChange}
        />
    </div>
);

class UserForm extends React.Component {
    constructor(props) {
        super(props);
        logit.resetPrefix("constructor");
        logit.debug("props =");
        logit.debug(props);
        this.state = {
            backTo: props.backTo ? props.backTo : '/users',
            formType: props.formType,
        }
    }

    componentDidUpdate() {
        logit.resetPrefix("componentDidUpdate");
     }
    render() {
        logit.resetPrefix("render");

        logit.debug("props = ");
        logit.debug(this.props);

        let {  handleSubmit,
                handleChange,
                isSubmitting,
                isValid,
                values,
                errors,
                isSystemUser
            } = this.props;

        let {backTo, formType } = this.state;

        return (
            <div >
                <form onSubmit={handleSubmit}>
                    <Field type="email" name="userName" label="User Name (Email)" component={FieldComponentWithLabel}/>
                    <ErrorMessage name="userName" component="div"/>

                    <Field type="text" name="firstName" label="First Name" component={FieldComponentWithLabel}/>
                    <ErrorMessage name="firstName" component="div"/>

                    <Field type="text" name="lastName" label="Last Name" component={FieldComponentWithLabel}/>
                    <ErrorMessage name="lastName" component="div"/>

                    <Row>
                        <Col sm={6}>
                            <label className="mr-3" htmlFor="role">Role</label>
                            <Field component="select" name="role">
                                <option value=''></option>}
                                {isSystemUser && <option value='SystemAdmin'>System Administrator</option>}
                                {isSystemUser && <option value='SystemUser'>Customer Support</option>}
                                {!isSystemUser && <option value='TenantAdmin'>Administrator</option>}
                                {!isSystemUser && <option value='TenantUser'>Order Manager</option>}
                            </Field>
                             <ErrorMessage name="role" component="div"/>
                        </Col>

                    </Row>

                    <div className="form-group mt-3">
                        <LoaderButton
                            disabled={!isValid}
                            type="submit"
                            isLoading={isSubmitting}
                            text={formType == "Add" ? formType : "Update"}
                            loadingText="Updating.…"
                        />
                        <Link to={backTo} className="btn btn-link">Cancel</Link>
                    </div>
                </form>
            </div>
        );
    }

}

function handleSubmitTF(values, actions) {
    logit.resetPrefix("handleSubmitTF");

    const  user = {
        userName: values.userName,
        firstName: values.firstName,
        lastName: values.lastName,
        status: values.status,
        role: values.role,
    };
    logit.debug("user info = ");
    logit.debug(user);

    const  onSubmit  = actions.props.onSubmit;
    const formType = actions.props.formType;

    onSubmit(formType,user);
    actions.setSubmitting(false);
}



//const connectedHandleSubmit = connect(mapStateToProps)(handleSubmitTF);
//const connectedUserForm = connect(mapStateToProps)(UserForm);

const EnhancedUserForm = withFormik( {
    mapPropsToValues: props => { return props.values;},
    handleSubmit: handleSubmitTF,
    displayName: "UserForm"
})(UserForm);

export {EnhancedUserForm as UserForm};