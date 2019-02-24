/*******
 *
 * set of functions to check authentication or authorization status and dispatch new actions
 *
 */
import {userActions} from "../_actions";
import {Debug} from "./debug";
var logit = new Debug("authHeader");

/****
 *
 * @param dispatch   - dispatch function to use to call action
 * @param error      - error object to check for status
 */
export function checkAuth(dispatch,error) {
    logit.resetPrefix("checkAuth");
    logit.log("checkAuth: check error = ");
    logit.log(error);
    if (error.statusCode === 400 && error.code == "NotAuthorizedException") {
        logit.log("got error code - " + error.code);
        const expired = "Invalid login token. Token expired:";
        if (error.message.length >= expired.length
            && error.message.substring(0,expired.length) == expired) {
            // expired token - we need to refresh login
            dispatch(userActions.logout());
        }
    }

}


