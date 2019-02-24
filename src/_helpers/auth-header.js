import {Debug} from "./debug";

var jwtDecode = require('jwt-decode');
var logit = new Debug("authHeader");

export function authHeader() {
    // return authorization header with jwt token
    let user = JSON.parse(sessionStorage.getItem('user'));

    if (user && user.token) {
        return { 'Authorization': 'Bearer ' + user.token };
    } else {
        return {};
    }
}
export function tokenNeedsRefresh() {
    logit.resetPrefix("tokenNeedsRefresh");
    let user = JSON.parse(sessionStorage.getItem('user'));
    var {username, access, token, refresh } = user;
    var status = false;
    logit.log("check token  ");
    var decodedToken = jwtDecode(token);
    var decodedAccess = jwtDecode(access);
    var today = new Date();
    logit.log("current time = ")

    var now = today.getTime();
    var expires = decodedToken.exp - now;

    logit.log("token expires in - ", expires);
    status = (expires <= 0);

    logit.log("return - "+status);
    return status;

}