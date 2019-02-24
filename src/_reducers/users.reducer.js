import {tenantMgrConstants, userConstants} from '../_constants';
import { Debug } from "../_helpers/debug";
var logit = new Debug("userMgr.reducer");
const prState = (state, action) => {
  logit.silly("state = ");
  logit.silly(state);
  logit.silly("action = ");
  logit.silly(action);
}
const users_initialstate = {isLoading:false, items:[]};
export function users(state = users_initialstate, action) {
  logit.resetPrefix("users");

  switch (action.type) {
    case userConstants.GETALL_RESET:
    case userConstants.ENABLE_USER_FAILURE: // something happened - so request a list
    case userConstants.ENABLE_USER_SUCCESS: // information updated - request new list
    case userConstants.DELETE_SUCCESS:
      logit.debug("set users to "+ action.type );

      return users_initialstate;

    case userConstants.GETALL_REQUEST:
      logit.debug("set users to "+ action.type );
      prState(state,action);
      return {
        isLoading: true,
        items: []
      };
    case userConstants.GETALL_SUCCESS:
      logit.debug("set users to "+ action.type );
      prState(state,action);

      return {
        isLoaded: true,
        items: action.users.items
      };
    case userConstants.GETALL_FAILURE:
      logit.error("set users to "+ action.type );
      prState(state,action);

      return { error: action.error, items:[] };

    case userConstants.DELETE_REQUEST:
      // add 'deleting:true' property to user being deleted
      logit.debug("set users to "+ action.type );
      prState(state,action);
      return {
        ...state,
        items: state.items.map(user =>
          user.id === action.id
            ? { ...user, deleting: true }
            : user
        )
      };

    case userConstants.DELETE_FAILURE:
      logit.error("set users to "+ action.type );
      prState(state,action);
      // remove 'deleting:true' property and add 'deleteError:[error]' property to user
      return {
        ...state,
        items: state.items.map(user => {
          if (user.id === action.id) {
            // make copy of user without 'deleting:true' property
            const { deleting, ...userCopy } = user;
            // return copy of user with 'deleteError:[error]' property
            return { ...userCopy, deleteError: action.error };
          }

          return user;
        })
      };


    case userConstants.ENABLE_USER_REQUEST:  // don't need to do anything
    default:
      return state
  }
}

const aUserInitialState = {status:userConstants.USER_INVALID, isLoading: false};
export function aUser(state = aUserInitialState, action) {
  logit.resetPrefix("aUser");

  switch (action.type) {
    case userConstants.GET_USER_REQUEST:
    case userConstants.ADD_USER_REQUEST:
    case userConstants.DELETE_REQUEST:
      logit.debug("set user "+ action.type);
      prState(state,action);

      return {
        isLoading: true,
        user: [],
        status:userConstants.USER_INVALID,
      };

    case userConstants.GET_USER_SUCCESS:
    case userConstants.ADD_USER_SUCCESS:
      logit.debug("set user "+ action.type);
      prState(state,action);

      return {
        status:userConstants.USER_VALID,
        isLoading: false,
        user: action.user
      };
    case userConstants.GET_USER_FAILURE:
    case userConstants.ADD_USER_FAILURE:
    case userConstants.DELETE_FAILURE:
      logit.debug("set user "+ action.type);
      prState(state,action);

      return {
        error: action.error,
        isLoading: false,
        status:userConstants.USER_INVALID,
        ...state
      };

    case userConstants.RESET_USER_STATUS:
    case userConstants.DELETE_SUCCESS:  // user should be deleted, so old data is invalid. return to initialstate.
      logit.debug("set user "+ action.type);
      prState(state,action);
      return aUserInitialState;

    case userConstants.UPDATE_USER_REQUEST:
      logit.debug("set user "+ action.type);
      prState(state,action);

      return {
        status:userConstants.USER_INVALID,
        isLoading: true,
        update: "requested",
        user: action.user
      };

    case userConstants.UPDATE_USER_SUCCESS:
      logit.debug("set user "+ action.type);
      prState(state,action);

      // leave state invalid, set isLoading to false, will trigger reload of data in component
      return {
        status:userConstants.USER_INVALID,
        isLoading: false,
        update: "success",
        user: action.user,
      };

    case userConstants.UPDATE_USER_FAILURE:
      logit.debug("set user "+ action.type);
      prState(state,action);
      return {
        error: action.error,
        isloading: false,
        update:"error",
        status:userConstants.USER_INVALID,
        ...state
      };

    default:
      return state
  }
}

