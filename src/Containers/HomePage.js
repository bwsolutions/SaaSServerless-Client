import React from 'react';
import {Link, withRouter} from 'react-router-dom';
import { connect } from 'react-redux';
import  HealthCheck from '../_components/HealthCheck';
import  { authMgrServices,orderService,productService,tenantMgrServices,tenantRegServices,userService } from '../_services';

import  { healthActions } from '../_actions';
import * as Roles from "../_reducers/authentication.reducer";
import {Debug} from "../_helpers";
var logit = new Debug("UsersPage");

class HomePage extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            checks: [],
            interval: 30000,
        };

        this.addChecks = this.addChecks.bind(this);
        this.addChecks();

        this.getAllHealth = this.getAllHealth.bind(this);

    }

    componentDidMount() {
        logit.resetPrefix("componentDidMount");
        logit.debug("componentDidMount: call getAllHealth....");
        this.getAllHealth();
    //    setInterval(this.getAllHealth,this.state.interval);
    }
    addChecks() {
         this.props.dispatch(healthActions.addHealth("authMgr"));
         this.props.dispatch(healthActions.addHealth("orderMgr"));
         this.props.dispatch(healthActions.addHealth("productMgr"));
         this.props.dispatch(healthActions.addHealth("tenantMgr"));
         this.props.dispatch(healthActions.addHealth("tenantReg"));
         this.props.dispatch(healthActions.addHealth("userMgr"));
    }

     getAllHealth() {
         logit.resetPrefix("getAllHealth");
         try {
            this.props.dispatch(healthActions.getHealth("authMgr",authMgrServices));
            this.props.dispatch(healthActions.getHealth("orderMgr",orderService));
            this.props.dispatch(healthActions.getHealth("productMgr",productService));
            this.props.dispatch(healthActions.getHealth("tenantMgr",tenantMgrServices));
            this.props.dispatch(healthActions.getHealth("tenantReg",tenantRegServices));
            this.props.dispatch(healthActions.getHealth("userMgr",userService));
        } catch (e) {
            logit.error("getAllHealth: Catch error = "+e);
        }
    }

    handleDeleteUser(id) {
        return (e) => this.props.dispatch(userActions.getHealth());
    }

    render() {
        const { user, users, health, isSystemUser } = this.props;
        const authManagerHealthy = () => {return health.authMgr ? health.authMgr.healthy : false; };
        const tenantManagerHealthy = () => {return health.tenantMgr ? health.tenantMgr.healthy : false; };
        const tenantRegHealthy = () => {return health.tenantReg ? health.tenantReg.healthy : false; };
        const userManagerHealthy = () => {return health.userMgr ? health.userMgr.healthy : false; };
        const orderManagerHealthy = () => {return health.orderMgr ? health.orderMgr.healthy : false; };
        const productManagerHealthy = () => {return health.productMgr ? health.productMgr.healthy : false; };
        //const isSystemUser = () => {return user.systemUser ? user.systemUser : false};

        return (
            <div className="home">
                {isSystemUser  &&
                    <div className="card health" >
                        <div className="card-header" >
                            <img
                                style={{width:28 + 'px', float: 'left', 'marginRight': 5 + 'px'}}
                                src="/images/monitor.png" />
                                <h3 className="text-left">Service Health</h3>
                        </div>
                        <hr style={{marginTop: 0+'px', marginBottom: 8+'px', padding: 0+'px'}} />
                            <div className="row">
                                <HealthCheck text="Authentication Manager" isUp={authManagerHealthy()} />
                                <HealthCheck text="Tenant Manager" isUp={tenantManagerHealthy()} />
                                <HealthCheck text="Tenant Registration" isUp={tenantRegHealthy()} />
                            </div>
                            <br/>
                            <div className="row">
                                <HealthCheck text="User Manager" isUp={userManagerHealthy()} />
                                <HealthCheck text="Order Manager" isUp={orderManagerHealthy()} />
                                <HealthCheck text="Product Manager" isUp={productManagerHealthy()} />
                            </div>
                    </div>
                }
                <div className="card metrics" >
                        <div className="card-header" >
                            <img
                                style={{width:28+'px', float: 'left', 'marginRight': 5+'px'}}
                                src="/images/chart.png" />
                                <h3 className="text-left">System Metrics</h3>
                        </div>
                            <div className="row">
                                <div className="col-sm-6">
                                    <div className="card text-center ">
                                        <div className="card-header text-white bg-primary">
                                            <strong>Total Product Count</strong>
                                        </div>
                                        <div className="card-text ">
                                            1,414
                                        </div>
                                    </div>
                                </div>
                                <div className="col-sm-6">
                                    <div className="card text-center ">
                                        <div className="card-header text-white bg-primary">
                                            <strong>Total Order Count</strong>
                                        </div>
                                        <div className="card-text">
                                            9,934
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-sm-6">
                                    <div className="card text-center ">
                                        <div className="card-header text-white bg-primary">
                                            <strong>Average Sale Price</strong>
                                        </div>
                                        <div className="card-text">
                                            $193.12
                                        </div>
                                    </div>
                                </div>
                                <div className="col-sm-6">
                                    <div className="card text-center ">
                                        <div className="card-header text-white bg-primary">
                                        <strong>Today's Order Count</strong>
                                        </div>
                                        <div className="card-text">
                                            123
                                        </div>
                                    </div>
                                </div>
                            </div>
                            { isSystemUser && <div className="row">
                                <div className="col-sm-6">
                                    <div className="card text-center ">
                                        <div className="card-header text-white bg-primary">
                                        <strong >Tenant Count</strong>
                                        </div>
                                        <div className="card-text">
                                            5
                                        </div>
                                    </div>
                                </div>
                                <div className="col-sm-6">
                                    <div className="card text-center ">
                                        <div className="card-header text-white bg-primary">
                                        <strong >User Count</strong>
                                        </div>
                                        <div className="card-text">
                                            29
                                        </div>
                                    </div>
                                </div>
                            </div>}
                    </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    const { users, authentication, health } = state;
    const { user } = authentication;

    return {
        user,
        users,
        isSystemUser: Roles.isSystemUser(state),
        health
    };
}

const connectedHomePage = withRouter(connect(mapStateToProps)(HomePage));
export { connectedHomePage as HomePage };