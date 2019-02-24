import {authConstants} from '../_constants';
//import { authMgrServices } from '../_services/authMgr.service';

export const authActions = {
    checkHealth,
};

function checkHealth() {
    return up();

    function check() { return { type: authConstants.HEALTH_REQUEST} }
    function up() { return { type: authConstants.HEALTH_UP} }
    function down() { return { type: authConstants.HEALTH_DOWN} }
}
