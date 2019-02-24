import { sysRegConstants } from '../_constants';

import { Debug } from "../_helpers/debug";
var logit = new Debug("sysReg.reducer");
const prState = (state, action) => {
    logit.silly("state = ");
    logit.silly(state);
    logit.silly("action = ");
    logit.silly(action);
}
const initialState = { installed: true };

export function systemRegistration(state = initialState, action) {
    logit.resetPrefix("systemRegistration");

    switch (action.type) {
    case sysRegConstants.REGISTER_REQUEST:
        logit.debug("set systemRegistration to "+ action.type );
        prState(state,action);
        return {
          installing: true,
      };
    case sysRegConstants.REGISTER_SUCCESS:
        logit.debug("set systemRegistration to "+ action.type );
        prState(state,action);
        return {
          installed: true,
      };
    case sysRegConstants.REGISTER_FAILURE:
        logit.error("set systemRegistration to "+ action.type );
        prState(state,action);
        return {};
    default:
      return state
  }
}