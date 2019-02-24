import { healthConstants } from '../_constants';
import Services  from '../_services/';
import {Debug} from "../_helpers";
var logit = new Debug("healthActions:");

export const healthActions = {
    getHealth,
    addHealth,
    deleteHealth
};

function getHealth(name, services) {
    logit.resetPrefix("getHealth");
    logit.log("getHealth: name = ");
    logit.log(name);

    return dispatch => {
        dispatch(check(name));
        logit.log("getHealth: calling services.getHealth ");

        services.getHealth()
            .then(
                response => dispatch(up(name)),
                error => dispatch(down(name) )
            );
    }
    function check(name) { return { type: healthConstants.HEALTH_CHECK_REQUEST, name} }
    function up(name) { return { type: healthConstants.HEALTH_CHECK_UP, name} }
    function down(name) { return { type: healthConstants.HEALTH_CHECK_DOWN, name} }
}

function addHealth(name) {
    return {type: healthConstants.HEALTH_CHECK_ADD, name: name};
}

function deleteHealth(name) {
    return {type: healthConstants.HEALTH_CHECK_DELETE, name: name};
}