import { tenantRegConstants } from '../_constants';

import { Debug } from "../_helpers/debug";
var logit = new Debug("tenantReg.reducer");
const prState = (state, action) => {
    logit.silly("state = ");
    logit.silly(state);
    logit.silly("action = ");
    logit.silly(action);
}
const initialState =  {  };

export function tenantRegistration(state = initialState, action) {
    logit.resetPrefix("tenantRegistration");


    switch (action.type) {
    case tenantRegConstants.REGISTER_REQUEST:
        logit.debug("set tenantRegistration to "+ action.type );
        prState(state,action);

        return {
          tenantRegistering: true,
      };
    case tenantRegConstants.REGISTER_SUCCESS:
        logit.debug("set tenantRegistration to "+ action.type );
        prState(state,action);

        return {
          tenantRegistered: true,
      };
    case tenantRegConstants.REGISTER_FAILURE:
        logit.error("set tenantRegistration to "+ action.type );
        prState(state,action);

        return initialState;
    default:
        return state
  }
}