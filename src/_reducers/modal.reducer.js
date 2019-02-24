import { modalConstants } from '../_constants';

import { Debug } from "../_helpers/debug";
var logit = new Debug("modal.reducer");

const prState = (state, action) => {
  logit.silly("state = ");
  logit.silly(state);
  logit.silly("action = ");
  logit.silly(action);
}

const initialState = {
  modalType: null,
  modalProps: {}
}
export function modal(state = initialState, action) {
  logit.resetPrefix("modal");
  switch (action.type) {
    case modalConstants.SHOW_MODAL:
      logit.debug("set - "+action.type);
      prState(state,action);
      return {
        modalProps: action.modalProps,
        modalType: action.modalType,
        type: action.type
      }

    case modalConstants.HIDE_MODAL:
      logit.debug("set - "+action.type);
      prState(state,action);
      return initialState

    default:
      return state
  }
}