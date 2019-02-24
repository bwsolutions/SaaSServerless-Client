import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import {Formik, Field, Form, ErrorMessage, withFormik} from 'formik';

import { tenantMgrActions } from '../_actions';
import {FormLabel, FormControl, FormGroup, Row, Col} from "react-bootstrap/lib";

import LoaderButton from "../_components/LoaderButton";

import { Debug } from "../_helpers/debug";
import Container from "react-bootstrap/es/Container";
var logit = new Debug("TenantForm");

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

class TenantForm extends React.Component {
    constructor(props) {
        super(props);
        logit.resetPrefix("constructor");
        logit.debug("props =");
        logit.debug(props);

       // this.handleSubmitTF = this.handleSubmitTF.bind(this);

    }


    render() {
        logit.resetPrefix("render");

        logit.debug("props = ");
        logit.debug(this.props);

        //var isDataValid = aTenant ? aTenant.status === tenantMgrConstants.TENANT_VALID  : false;
        let {  handleSubmit,
            aTenant,
                handleChange,
                isSubmitting,
                isValid,
                values,
                errors
            } = this.props;

        return (
            <div >
                <form onSubmit={handleSubmit}>
                    <input type="hidden" name="id" value={values.id} />
                    <Field type="text" name="companyName" label="Company Name" component={FieldComponentWithLabel}/>
                    <ErrorMessage name="companyName" component="div"/>

                    <Field type="text" name="accountName" label="Account Name" component={FieldComponentWithLabel}/>
                    <ErrorMessage name="accountName" component="div"/>

                    <Field type="email" name="ownerName" label="Owner" component={FieldComponentWithLabel}/>
                    <ErrorMessage name="ownerName" component="div"/>

                    <Row>
                        <Col sm={6}>
                            <label className="mr-3" htmlFor="tier">Plan</label>
                            <Field component="select" name="tier">
                                <option value="Free">Free Tier</option>
                                <option value="Standard">Standard Tier</option>
                                <option value="Professional">Professional Tier</option>
                            </Field>
                             <ErrorMessage name="tier" component="div"/>
                        </Col>
                        <Col sm={6}>
                            <label className="mr-3" htmlFor="status">Status</label>
                            <Field component="select" name="status">
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                            </Field>
                            <ErrorMessage name="status" component="div"/>
                        </Col>
                    </Row>

                    <div className="form-group mt-3">
                        <LoaderButton
                            disabled={!isValid}
                            type="submit"
                            isLoading={isSubmitting}
                            text="Update"
                            loadingText="Updating.…"
                        />
                        <Link to="/tenants" className="btn btn-link">Cancel</Link>
                    </div>
                </form>
            </div>
        );
    }

}

function handleSubmitTF(values, actions) {
    logit.resetPrefix("handleSubmitTF");

    const  tenant = {
        companyName: values.companyName,
        accountName: values.accountName,
        ownerName: values.ownerName,
        email: values.email,
        id: values.id,
        status: values.status,
        tier: values.tier,
    };
    logit.debug("tenant info = ");
    logit.debug(tenant);

    const  dispatch  = actions.props.dispatch;
    dispatch(tenantMgrActions.updateTenant(tenant));
    actions.setSubmitting(false);
}

const handleSubmitHOF = (values, actions) => (hs) => {
    logit.resetPrefix("handleSubmitHOF");
    logit.log("actions = ");
    logit.log(actions);
    logit.log("props = ");
    logit.log(props);

    hs(values,{actions,dispatch:props.dispatch});
};

function mapStateToProps(state, ownProps) {
    logit.resetPrefix("mapStateToProps");
    const { aTenant } = state;

    return {
        aTenant
    };
}

//const connectedHandleSubmit = connect(mapStateToProps)(handleSubmitTF);
const connectedTenantForm = connect(mapStateToProps)(TenantForm);

const EnhancedTenantForm = withFormik( {
    mapPropsToValues: props => { return props.values;},
    handleSubmit: handleSubmitTF,
    displayName: "TenantForm"
})(connectedTenantForm);

export {EnhancedTenantForm as TenantForm};