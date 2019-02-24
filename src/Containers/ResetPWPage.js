import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import { userActions } from '../_actions';
import {Debug} from "../_helpers";

var logit = new Debug("UsersPage");

class ResetPWPage extends React.Component {
    constructor(props) {
        super(props);

       const {loggingIn, loggedIn, user, newPasswordRequired } = this.props;
        logit.debug("resetPWPage: constructor: props =");
        logit.debug(this.props);

        this.state = {
            username: user.username,
            password: '',
            newpassword: '',
            confirmpassword: '',
            passwordsmatch: false,
            submitted: false
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(e) {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    }

    handleSubmit(e) {
        e.preventDefault();

        this.setState({ submitted: true });
        const { username, password, newpassword, confirmpassword, submitted  } = this.state;
        const { dispatch } = this.props;
        var passwordsmatch = this.state.passwordsmatch;

        if (username === undefined) {
            //should not be here
            history.push('/login');
            return;
        }

        if (newpassword.length > 0 && newpassword == confirmpassword) {
            passwordsmatch = true;
            logit.debug("resetPWPage: handleSubmit: set passwordsmatch = ("+passwordsmatch+")");
            this.setState({ passwordsmatch: true });
        }

        if ( (username) && (password.length > 0) && (newpassword.length > 0) && (confirmpassword.length > 0) && (passwordsmatch) ) {
            logit.debug("resetPWPage: handleSubmit: call userActions.resetPW");
            dispatch(userActions.resetPW(username, password, newpassword));
        }
    }

    render() {
        const { loggingIn } = this.props;
        const { username, password, newpassword, confirmpassword, submitted,passwordsmatch } = this.state;
        return (
            <div className="col-6-6 offset-3">
                <h2>Reset your password</h2>
                <form name="form" onSubmit={this.handleSubmit}>
                    <div className={'form-group' + (submitted && !password ? ' has-error' : '')}>
                        <label htmlFor="password">Current Password</label>
                        <input type="password" className="form-control" name="password" value={password} onChange={this.handleChange} />
                        {submitted && !password &&
                        <div className="help-block">Please enter your current password!</div>
                        }
                    </div>
                    <div className={'form-group' + (submitted && !newpassword ? ' has-error' : '')}>
                        <label htmlFor="newpassword">Password</label>
                        <input type="password" className="form-control" name="newpassword" value={newpassword} onChange={this.handleChange} />
                        {submitted && !newpassword &&
                        <div className="help-block">Please enter New password</div>
                        }
                    </div>
                    <div className={'form-group' + (submitted && !confirmpassword ? ' has-error' : '')}>
                        <label htmlFor="confirmpassword">Password</label>
                        <input type="password" className="form-control" name="confirmpassword" value={confirmpassword} onChange={this.handleChange} />
                        {submitted && !confirmpassword &&
                        <div className="help-block">Please re-enter New password</div>
                        }
                        {submitted && !passwordsmatch &&
                        <div className="help-block">New Passwords don't match. Please reenter.</div>
                        }
                    </div>
                    <div className="form-group">
                        <button className="btn btn-primary">Change Password</button>
                        {loggingIn &&
                        <img src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==" />
                        }
                    </div>
                </form>
            </div>
        );
    }
}

function mapStateToProps(state) {
    const { loggingIn, loggedIn, user, newPasswordRequired } = state.authentication;
    return {
        loggingIn, loggedIn, user, newPasswordRequired
    };
}

const connectedResetPWPag = connect(mapStateToProps)(ResetPWPage);
export { connectedResetPWPag as ResetPWPage };