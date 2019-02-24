import 'bootstrap/dist/css/bootstrap.min.css';
import '../../css/app.css';
import React, { Component, Fragment } from "react";
import { connect } from 'react-redux';
import {authHeader, Debug, history} from '../_helpers';
import {alertActions, userActions} from '../_actions';
import { PrivateRouteOld } from '../_components/PrivateRoute';
import { HomePage } from '../Containers/HomePage';
import { LoginPage } from '../Containers/LoginPage';
import { RegisterPage } from '../Containers/RegisterPage';
import { InstallPage } from '../Containers/InstallPage';
import { ResetPWPage } from '../Containers/ResetPWPage';
import { OrdersPage } from '../Containers/OrdersPage';
import { OrderPage } from '../Containers/OrderPage';
import { ProductsPage } from '../Containers/ProductsPage';
import { ProductPage } from '../Containers/ProductPage';
import { UsersPage } from '../Containers/UsersPage';
import { UserPage } from '../Containers/UserPage';
import { TenantsPage } from '../Containers/TenantsPage';
import {TenantPage} from "../Containers/TenantPage";
import config from "./config";
import  Amplify  from "aws-amplify";
import { API } from "aws-amplify";
import {async } from 'async'

import Modal from 'react-modal'
import * as Roles from "../_reducers/authentication.reducer";

import { Router, Route, Redirect } from 'react-router-dom';
import { Link, withRouter, NavLink } from "react-router-dom";

import { Nav, Navbar, NavItem } from "react-bootstrap/lib";
import NavbarBrand from "react-bootstrap/lib/NavbarBrand";
import NavbarToggle from "react-bootstrap/lib/NavbarToggle";
import NavbarCollapse from "react-bootstrap/lib/NavbarCollapse";
var logit = new Debug("App");

logit.log("config =");
logit.log(config);
var ampConfig = {
    Auth:    {
        mandatorySignIn:     true,
        region:              config.cognito.REGION,
    },
    API:     {
        endpoints: [
            {
                name:     "ServiceDiscovery",
                endpoint: config.SERVICE_URL,
                region:   config.apiGateway.REGION
            },
            {
                name:     "SaasSysReg",
                endpoint: config.SYSTEM_REGISTRATION_URL,
                region:   config.apiGateway.REGION
            },
            {
                name:     "SaasAuth",
                endpoint: config.AUTH_MANAGER_URL,
                region:   config.apiGateway.REGION
            },
            {
                name:     "SaasUser",
                endpoint: config.USER_MANAGER_URL,
                region:   config.apiGateway.REGION
            },
            {
                name:     "SaasTenantMgr",
                endpoint: config.TENANT_MANAGER_URL,
                region:   config.apiGateway.REGION
            },
            {
                name:     "SaasTenantReg",
                endpoint: config.TENANT_REGISTRATION_URL,
                region:   config.apiGateway.REGION
            },
            {
                name:     "SaasProduct",
                endpoint: config.PRODUCT_MANAGER_URL,
                region:   config.apiGateway.REGION
            },
            {
                name:     "SaasOrder",
                endpoint: config.ORDER_MANAGER_URL,
                region:   config.apiGateway.REGION
            },
        ]
    }
};

Amplify.configure(ampConfig);

if (config.SERVICE_URL) {
    logit.debug("updateAPI endpoints from serviceDiscovery")
    logit.debug(ampConfig);
    updateAPIendpoints(ampConfig,config.SERVICE_URL)
        .then((ampConfig) => {
            logit.debug("new Amplify config file");
            logit.debug(ampConfig);
            Amplify.configure(ampConfig);
        })
        .catch((err) => {
            logit.debug("eddor getting endpoints, use default")
        })

}

Modal.setAppElement('#app')

class App extends React.Component {
    constructor(props) {
        super(props);
        logit.log("starting App!!!!!");
        const { dispatch } = this.props;
        history.listen((location, action) => {
            // clear alert on location change
            logit.log("history.listen location & action =");
            logit.log(location);
            logit.log(action);

            dispatch(alertActions.clear());
        });

        this.handleLogout = this.handleLogout.bind(this);

    }
/*****  from serverless-stack  --- Needed? or already handled????
    async componentDidMount() {
        try {
            await Auth.currentSession();
            this.userHasAuthenticated(true);
        }
        catch(e) {
            if (e !== 'No current user') {
                alert(e);
            }
        }

        this.setState({ isAuthenticating: false });
    }

    userHasAuthenticated = authenticated => {
        this.setState({ isAuthenticated: authenticated });
    }
*******
 * */

    handleLogout(event) {
        //await Auth.signOut();

        logit.log("handleLogout: event = ");
        logit.log(event);
    logit.log("handleLogout: this.props = ");
    logit.log(this.props);
    logit.log("handleLogout: this = ");
    logit.log(this);

    //this.userHasAuthenticated(false);
        this.props.dispatch(userActions.logout());
    logit.log("handleLogout: before history = ");
    logit.log(history);

    history.push("/login");
    logit.log("handleLogout: after history = ");
    logit.log(history);

}

    render() {
        const { alert, authentication,
                  isSystemAdminUser, isAdminUser, isTenantUser, } = this.props;
        logit.log("starting App render....");
        logit.log(this.props);
        logit.log(history.location);


        return (
            <div className="App container">
                <Router history={history}>
                    <div className="container">
                        {history.location.pathname === '/logout' && <Redirect to="/login" /> }
                        <Navbar className="nav" collapseOnSelect expand="lg" >
                                <NavbarBrand>
                                    <Nav className="nav-brand">
                                        <img className="logo" src="/images/matt-icons_package-300px.png" />
                                        <Link to="/" > OrderNext </Link>

                                    </Nav>
                                </NavbarBrand>
                                <NavbarToggle/>
                            <NavbarCollapse className="justify-content-end">
                                <Nav >
                                    {authentication.loggedIn
                                        ? <Fragment>
                                                    <NavLink exact to="/">Home</NavLink>
                                            {isSystemAdminUser && <NavLink to="/tenants">Tenants</NavLink> }
                                            {isTenantUser &&  <NavLink to="/products">Catalog</NavLink> }
                                            {isTenantUser &&  <NavLink to="/orders">Orders</NavLink> }
                                            {isAdminUser &&  <NavLink to="/users">Users</NavLink> }
                                            <NavLink to="/logout" onClick={this.handleLogout}>Logout</NavLink>
                                        </Fragment>
                                        : <Fragment>
                                                    <NavLink  to="/register" className="nav-item" >Register</NavLink>
                                                    <NavLink to="/login" className="nav-item" >Login</NavLink>
                                        </Fragment>
                                    }
                                </Nav>
                            </NavbarCollapse>
                        </Navbar>
                        <div className="jumbotron">
                            <div className="container ">
                                <div className="col-12 ">
                                    {alert.message &&
                                        <div className={`alert ${alert.type}`}>{alert.message}</div>
                                    }
                                        <div className="justify-content-center">
                                            {logit.log('calling PrivateRouteOld with authentication = ')}
                                            {logit.log(authentication)}
                                            {logit.log('history = ')}
                                            {logit.log(history)}

                                            <PrivateRouteOld exact path="/" auth={authentication} component={HomePage} />
                                            <Route path="/login" component={LoginPage} />
                                            <Route path="/register" component={RegisterPage} />
                                            <Route path="/install" component={InstallPage} />
                                            <Route path="/resetpw" component={ResetPWPage} />
                                            <PrivateRouteOld exact path="/orders" auth={authentication} component={OrdersPage} />
                                            <PrivateRouteOld exact path="/order/add" auth={authentication}
                                                             render={props => <OrderPage action="Add" {...props} /> } />
                                            <PrivateRouteOld exact path="/order/edit/:id?" auth={authentication}
                                                             render={props => <OrderPage action="Edit" {...props} /> } />

                                            <PrivateRouteOld exact path="/products" auth={authentication} component={ProductsPage} />

                                            <PrivateRouteOld exact path="/product/add" auth={authentication}
                                                             render={props => <ProductPage action="Add" {...props} /> } />
                                            <PrivateRouteOld exact path="/product/view/:id?" auth={authentication}
                                                             render={props => <ProductPage action="View" {...props} /> } />
                                            <PrivateRouteOld exact path="/product/edit/:id?" auth={authentication}
                                                             render={props => <ProductPage action="Edit" {...props} /> } />
                                            <PrivateRouteOld exact path="/users" auth={authentication} component={UsersPage} />
                                            <PrivateRouteOld exact path="/user/add" auth={authentication}
                                                             render={props => <UserPage action="Add" {...props} /> } />
                                            <PrivateRouteOld exact path="/user/edit/:name?" auth={authentication}
                                                         render={props => <UserPage action="Edit" {...props} /> } />
                                            <PrivateRouteOld exact path="/tenants" auth={authentication} component={TenantsPage} />
                                            <PrivateRouteOld exact path="/tenant/edit/:id?" auth={authentication}
                                                             render={props => <TenantPage action="Edit" {...props} />} />
                                            <PrivateRouteOld exact path="/tenant/delete/:id?" auth={authentication} component={TenantsPage} />
                                        </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Router>
            </div>
        );
    }
}
async function updateAPIendpoints(amplifyConfig) {

    const requestOptions = {
        headers: {},
    };
    const prefix = config.SERVICE_PROJECT_NAME;
    var urlLists = {
            "SaasSysReg":       prefix + '-SysReg-dev-sysReg/1.0.0',
             "SaasAuth":        prefix + '-AuthMgr-dev-authMgr/1.0.0',
             "SaasUser":        prefix + '-UserMgr-dev-userMgr/1.0.0',
             "SaasTenantMgr":   prefix + '-TenantMgr-dev-tenantMgr/1.0.0',
             "SaasTenantReg":   prefix + '-TenantReg-dev-tenantReg/1.0.0',
             "SaasProduct":     prefix + '-ProductMgr-dev-productMgr/1.0.0',
             "SaasOrder":       prefix + '-OrderMgr-dev-orderMgr/1.0.0'
    };
    var endpoints = [
        {
            name:     "ServiceDiscovery",
            endpoint: config.SERVICE_URL,
            region:   config.apiGateway.REGION
        }
    ];
    var basePath = '/catalog/';
    var path ='';
    var keys = Object.keys(urlLists);

    var promises = [];
    for (const key of keys) {
        path = basePath + urlLists[key];
        promises.push(  API.get("ServiceDiscovery", path, requestOptions)
            .then((data) => {
               if (data) {
                    var ep = {
                        name:     key,
                        endpoint: data.endpoint_url,
                        region:   config.apiGateway.REGION
                    };
                    endpoints.push(ep);
                    return ep;
                }
            }));
    }
    await Promise.all(promises)
        .then((data) => {
           amplifyConfig.API.endpoints = endpoints;
       })
        .catch((err) => {
            logit.error("failed getting endpoints");
            logit.error(err);
            //dont change amplifyConfig;
        });
    return amplifyConfig;
}
function mapStateToProps(state) {
    const { alert, authentication } = state;
     return {
        alert, authentication,
        isSystemAdminUser: Roles.isSystemAdminUser(state),
        isAdminUser: Roles.isAdminUser(state),
        isTenantUser: Roles.isTenantUser(state),
    };
}

const connectedApp = connect(mapStateToProps)(App);
export { connectedApp as App }; 