import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import {Formik, Field, Form, ErrorMessage} from 'formik';
import { tenantMgrConstants } from '../_constants';
import { TenantForm } from '../_components/TenantForm';
import { withRouter} from "react-router-dom";
import { tenantMgrActions } from '../_actions';
import {FormLabel, FormControl, FormGroup} from "react-bootstrap";
import LoaderButton from "../_components/LoaderButton";

import { Debug } from "../_helpers/debug";
var logit = new Debug("TenantPage");

class TenantPage extends React.Component {
    constructor(props) {
        super(props);
        logit.resetPrefix("constructor");
        logit.debug("props =");
        logit.debug(props);

        this.state = {
            id: props.match.params.id,
            action: props.action,
           // tenant: props.aTenant.status === tenantMgrConstants.TENANT_VALID ?  props.aTenant.tenant : {},
        };

        this.props.dispatch(tenantMgrActions.tenantReset());
        this.props.dispatch(tenantMgrActions.getTenant(this.state.id));
    }

     handleSubmitTP(values, actions) {
        logit.resetPrefix("handleSubmitTP");

        const  tenant = {
            companyName: values.companyName,
            ownerName: values.ownerName,
            email: values.email,
            id: values.id,
            status: values.status,
            tier: values.tier,
        };
        logit.debug("tenant info = ");
        logit.debug(tenant);

        const { dispatch } = actions;

        dispatch(tenantMgrActions.updateTenant(tenant));
        actions.setSubmitting(false);
    }

    render() {
        logit.resetPrefix("render");
        const {aTenant} = this.props;
        const {action} = this.state;

        var isDataValid = aTenant ? aTenant.status === tenantMgrConstants.TENANT_VALID  : false;

        return (
            <div className="col-8 offset-2">
                <h2 className="text-center">{action} Tenent</h2>

                {isDataValid ?
                    <TenantForm values={aTenant.tenant} dispatch={this.props.dispatch}  />
                    : <div>  Loading......</div>
                }
            </div>
        );
    }
}

function mapStateToProps(state) {
    logit.resetPrefix("mapStateToProps");
    const { aTenant } = state;
    return {
        aTenant
    };
}

const connectedTenantPage= withRouter(connect(mapStateToProps)(TenantPage));
export { connectedTenantPage as TenantPage };