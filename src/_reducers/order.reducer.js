import {tenantMgrConstants, orderConstants} from '../_constants';
import { Debug } from "../_helpers/debug";
var logit = new Debug("orderMgr.reducer");
const prState = (state, action) => {
  logit.silly("state = ");
  logit.silly(state);
  logit.silly("action = ");
  logit.silly(action);
}
const orders_initialstate = {isLoading:false, items:[]};
export function orders(state = orders_initialstate, action) {
  logit.resetPrefix("orders");

  switch (action.type) {
    case orderConstants.GETALL_RESET:
    case orderConstants.DELETE_SUCCESS:  // order should be deleted, so old data is invalid. return to initialstate.
      logit.debug("set orders to "+ action.type );
      return orders_initialstate;

    case orderConstants.GETALL_REQUEST:
      logit.debug("set orders to "+ action.type );
      prState(state,action);
      return {
        isLoading: true,
        items: []
      };
    case orderConstants.GETALL_SUCCESS:
      logit.debug("set orders to "+ action.type );
      prState(state,action);

      return {
        isLoaded: true,
        items: action.orders.items
      };
    case orderConstants.GETALL_FAILURE:
      logit.error("set orders to "+ action.type );
      prState(state,action);

      return { error: action.error, items:[] };

    case orderConstants.DELETE_REQUEST:
      // add 'deleting:true' property to order being deleted
      logit.debug("set orders to "+ action.type );
      prState(state,action);
      return {
        ...state,
        items: state.items.map(order =>
          order.id === action.id
            ? { ...order, deleting: true }
            : order
        )
      };
    case orderConstants.DELETE_SUCCESS:
      logit.debug("set orders to "+ action.type );
      prState(state,action);
// remove deleted order from state
      return {
        items: state.items.filter(order => order.id !== action.id),
        ...state
      };
    case orderConstants.DELETE_FAILURE:
      logit.error("set orders to "+ action.type );
      prState(state,action);
      // remove 'deleting:true' property and add 'deleteError:[error]' property to order
      return {
        ...state,
        items: state.items.map(order => {
          if (order.id === action.id) {
            // make copy of order without 'deleting:true' property
            const { deleting, ...orderCopy } = order;
            // return copy of order with 'deleteError:[error]' property
            return { ...orderCopy, deleteError: action.error };
          }

          return order;
        })
      };


    default:
      return state
  }
}

const aOrderInitialState = {status:orderConstants.ORDER_INVALID, isLoading: false};
export function aOrder(state = aOrderInitialState, action) {
  logit.resetPrefix("aOrder");


  switch (action.type) {
    case orderConstants.GET_ORDER_REQUEST:
    case orderConstants.ADD_ORDER_REQUEST:
    case orderConstants.DELETE_REQUEST:
      logit.debug("set aOrder "+ action.type);
      prState(state,action);

      return {
        isLoading: true,
        order: [],
        status:orderConstants.ORDER_INVALID,
      };

    case orderConstants.GET_ORDER_SUCCESS:
    case orderConstants.ADD_ORDER_SUCCESS:
      logit.debug("set aOrder "+ action.type);
      prState(state,action);

      return {
        status:orderConstants.ORDER_VALID,
        isLoading: false,
        order: action.order
      };
    case orderConstants.GET_ORDER_FAILURE:
    case orderConstants.ADD_ORDER_FAILURE:
    case orderConstants.DELETE_FAILURE:
      logit.debug("set aOrder "+ action.type);
      prState(state,action);

      return {
        error: action.error,
        isLoading: false,
        status:orderConstants.ORDER_INVALID,
        ...state
      };

    case orderConstants.RESET_ORDER_STATUS:
    case orderConstants.GETALL_SUCCESS:   // if reload list then any single order information is invalid - clear it.
    case orderConstants.DELETE_SUCCESS:  // order should be deleted, so old data is invalid. return to initialstate.
      logit.debug("set aOrder "+ action.type);
      prState(state,action);
      return aOrderInitialState;

    case orderConstants.UPDATE_ORDER_REQUEST:
      logit.debug("set aOrder "+ action.type);
      prState(state,action);

      return {
        status:orderConstants.ORDER_INVALID,
        isLoading: true,
        update: "requested",
        order: action.order
      };

    case orderConstants.UPDATE_ORDER_SUCCESS:
      logit.debug("set aOrder "+ action.type);
      prState(state,action);

      // leave state invalid, set isLoading to false, will trigger reload of data in component
      return {
        status:orderConstants.ORDER_INVALID,
        isLoading: false,
        update: "success",
        order: action.order,
      };

    case orderConstants.UPDATE_ORDER_FAILURE:
      logit.debug("set aOrder "+ action.type);
      prState(state,action);
      return {
        error: action.error,
        isloading: false,
        update:"error",
        status:orderConstants.ORDER_INVALID,
        ...state
      };

    default:
      return state
  }
}

