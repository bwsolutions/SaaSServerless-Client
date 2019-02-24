import React from 'react';
import { connect } from 'react-redux';
import { userConstants } from '../_constants';
import { UserForm } from '../_components/UserForm';
import { withRouter} from "react-router-dom";
import {alertActions, userActions} from '../_actions';

import { Debug } from "../_helpers/debug";
import * as Roles from "../_reducers/authentication.reducer";
var logit = new Debug("UserPage");

class UserPage extends React.Component {
    constructor(props) {
        super(props);
        logit.resetPrefix("constructor");
        logit.debug("props =");
        logit.debug(props);

        this.state = {
            name: props.match.params.name,
            action: props.action,
        };

        this.handleSubmitPage = this.handleSubmitPage.bind(this);
        this.props.dispatch(userActions.aUserReset());
    }

    componentDidMount() {
        logit.resetPrefix("componentDidMount");

        const {dispatch } = this.props;
        if (this.state.action === "Edit") {
            logit.debug("in edit mode. check if user needed");
            dispatch(userActions.getUserIfNeeded(this.state.name));
        }
    }

    componentDidUpdate() {
        logit.resetPrefix("componentDidUpdate");
        const {dispatch } = this.props;
        if (this.state.action === "Edit") {
            logit.debug("in edit mode. check if user needed");
            dispatch(userActions.getUserIfNeeded(this.state.name));
        }
    }

    handleSubmitPage(formType, user) {
        logit.resetPrefix("handleSubmitPage");

        logit.debug("user info = ");
        logit.debug(user);

        const { dispatch } = this.props;

        dispatch(alertActions.clear());
        if (formType === "Edit") {
            dispatch(userActions.updateUser(user));
        } else {
            dispatch(userActions.addUser(user));
        }
    }

    render() {
        logit.resetPrefix("render");
        var {aUser, isSystemUser} = this.props;
        const {action} = this.state;

        if (action === "Edit") {
            var isDataValid = aUser ? aUser.status === userConstants.USER_VALID : false;
            return (
                <div className="col-8 offset-2">
                    <h2 className="text-center">{action} User</h2>{isDataValid ?
                    <UserForm values={aUser.user} formType={action}
                              isSystemUser={isSystemUser}
                              onSubmit={this.handleSubmitPage}/>
                    : <div> Loading......</div>
                }
                </div>
            );
        } else {
            return (
                <div className="col-8 offset-2">
                    <h2 className="text-center">{action} User</h2>
                    <UserForm values={aUser.user} formType={action}
                              isSystemUser={isSystemUser}
                              onSubmit={this.handleSubmitPage}/>
                </div>
            );
        }
    }
}

function mapStateToProps(state, ownProps) {
    logit.resetPrefix("mapStateToProps");
    const { aUser } = state;

    return {
        aUser,
        isSystemUser: Roles.isSystemUser(state),
    };
}


const connectedUserPage= connect(mapStateToProps)(UserPage);
const withRouterUserPage= withRouter(connectedUserPage);

export { withRouterUserPage as UserPage };