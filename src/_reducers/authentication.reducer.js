import { userConstants } from '../_constants';
import { Debug } from "../_helpers/debug";
import { createSelector } from 'reselect';
import { urlConstants } from '../_constants';

var logit = new Debug("authentication.reducer");
const prState = (state, action) => {
  logit.silly("state = ");
  logit.silly(state);
  logit.silly("action = ");
  logit.silly(action);
}
let user = JSON.parse(sessionStorage.getItem('user'));
const initialState = user ? { loggedIn: true, user } : {};

/*********
 *  Description of  State for
 *
 * authentication : {
 *     logginIn?:  true|false
 *     loggedIn?:  true|false
 *     newPasswordRequired?:  true|false
 *     user: Object {username, password}
 * }
 */
export function authentication(state = initialState, action) {
  logit.resetPrefix("authentication");

  switch (action.type) {
    case userConstants.LOGIN_REQUEST:
      logit.debug("set  LOGIN_REQUEST ");
      prState(state,action);
      return {
        loggingIn: true,
        user: action.user
      };
    case userConstants.LOGIN_SUCCESS:
      logit.debug("set  LOGIN_SUCCESS ");
      prState(state,action);
      return {
        loggedIn: true,
        user: action.user
      };
    case userConstants.LOGIN_NEED_NEW_PASSWORD:
      logit.debug("set  LOGIN_NEED_NEW_PASSWORD ");
      prState(state,action);
      return {
        loggedIn: true,
        newPasswordRequired: true,
        user: action.user
      };
    case userConstants.LOGIN_LOST_PASSWORD:
      return {};
    case userConstants.LOGIN_FAILURE:
      return {};
    case userConstants.LOGOUT:
      return {};
    default:
      return state
  }
}

export const isAdminUser = (state) => {
  if (state.authentication === undefined
      || state.authentication.user === undefined
      || state.authentication.user.userRole === undefined) return false;
  return ((state.authentication.user.userRole === urlConstants.SYSTEM_ADMIN_ROLE) || (state.authentication.user.userRole === urlConstants.TENANT_ADMIN_ROLE));
};

export const isSystemAdminUser = (state) => {
  if (state.authentication === undefined
      || state.authentication.user === undefined
      || state.authentication.user.userRole === undefined) return false;
  return (state.authentication.user.userRole === urlConstants.SYSTEM_ADMIN_ROLE);
};

export const isTenantAdminUser = (state) => {
  if (state.authentication === undefined
      || state.authentication.user === undefined
      || state.authentication.user.userRole === undefined) return false;
  return (state.authentication.user.userRole === urlConstants.TENANT_ADMIN_ROLE);
};

export const isSystemUser = (state) =>{
  var systemUser = false;
  if (state.authentication === undefined
      || state.authentication.user === undefined
      || state.authentication.user.userRole === undefined) return false;
  if ((state.authentication.user.userRole === urlConstants.SYSTEM_ADMIN_ROLE) || (state.authentication.user.userRole === urlConstants.SYSTEM_SUPPORT_ROLE))
    systemUser = true;
  return systemUser;
};

export const isTenantUser = (state) => {
  var tenantUser = false;
  if (state.authentication === undefined
      || state.authentication.user === undefined
      || state.authentication.user.userRole === undefined) return false;
  if ((state.authentication.user.userRole === urlConstants.TENANT_ADMIN_ROLE) || (state.authentication.user.userRole === urlConstants.TENANT_USER_ROLE))
    tenantUser = true;
  return tenantUser;
};

export const roleToDisplayName = function(userRole) {
  var displayName = '';
  if (userRole === 'TenantAdmin')
    displayName = 'Administrator';
  else if (userRole === 'TenantUser')
    displayName = 'Order Manager';
  else if (userRole === 'SystemAdmin')
    displayName = 'System Admin';
  else if (userRole === 'SystemUser')
    displayName = 'Customer Support';

  return displayName;
}
