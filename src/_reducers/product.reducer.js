import {tenantMgrConstants, productConstants} from '../_constants';
import { Debug } from "../_helpers/debug";
var logit = new Debug("productMgr.reducer");
const prState = (state, action) => {
  logit.silly("state = ");
  logit.silly(state);
  logit.silly("action = ");
  logit.silly(action);
}
const products_initialstate = {isLoading:false, items:[]};
export function products(state = products_initialstate, action) {
  logit.resetPrefix("products");

  switch (action.type) {
    case productConstants.GETALL_RESET:
    case productConstants.DELETE_SUCCESS:  // product should be deleted, so old data is invalid. return to initialstate.
      logit.debug("set products to "+ action.type );
      return products_initialstate;

    case productConstants.GETALL_REQUEST:
      logit.debug("set products to "+ action.type );
      prState(state,action);
      return {
        isLoading: true,
        items: []
      };
    case productConstants.GETALL_SUCCESS:
      logit.debug("set products to "+ action.type );
      prState(state,action);

      return {
        isLoaded: true,
        items: action.products.items
      };
    case productConstants.GETALL_FAILURE:
      logit.error("set products to "+ action.type );
      prState(state,action);

      return { error: action.error, items:[] };

    case productConstants.DELETE_REQUEST:
      // add 'deleting:true' property to product being deleted
      logit.debug("set products to "+ action.type );
      prState(state,action);
      return {
        ...state,
        items: state.items.map(product =>
          product.id === action.id
            ? { ...product, deleting: true }
            : product
        )
      };
    case productConstants.DELETE_SUCCESS:
      logit.debug("set products to "+ action.type );
      prState(state,action);
// remove deleted product from state
      return {
        items: state.items.filter(product => product.id !== action.id),
        ...state
      };
    case productConstants.DELETE_FAILURE:
      logit.error("set products to "+ action.type );
      prState(state,action);
      // remove 'deleting:true' property and add 'deleteError:[error]' property to product
      return {
        ...state,
        items: state.items.map(product => {
          if (product.id === action.id) {
            // make copy of product without 'deleting:true' property
            const { deleting, ...productCopy } = product;
            // return copy of product with 'deleteError:[error]' property
            return { ...productCopy, deleteError: action.error };
          }

          return product;
        })
      };


    default:
      return state
  }
}

const aProductInitialState = {status:productConstants.PRODUCT_INVALID, isLoading: false};
export function aProduct(state = aProductInitialState, action) {
  logit.resetPrefix("aProduct");


  switch (action.type) {
    case productConstants.GET_PRODUCT_REQUEST:
    case productConstants.ADD_PRODUCT_REQUEST:
    case productConstants.DELETE_REQUEST:
      logit.debug("set aProduct "+ action.type);
      prState(state,action);

      return {
        isLoading: true,
        product: [],
        status:productConstants.PRODUCT_INVALID,
      };

    case productConstants.GET_PRODUCT_SUCCESS:
    case productConstants.ADD_PRODUCT_SUCCESS:
      logit.debug("set aProduct "+ action.type);
      prState(state,action);

      return {
        status:productConstants.PRODUCT_VALID,
        isLoading: false,
        product: action.product
      };
    case productConstants.GET_PRODUCT_FAILURE:
    case productConstants.ADD_PRODUCT_FAILURE:
    case productConstants.DELETE_FAILURE:
      logit.debug("set aProduct "+ action.type);
      prState(state,action);

      return {
        error: action.error,
        isLoading: false,
        status:productConstants.PRODUCT_INVALID,
        ...state
      };

    case productConstants.RESET_PRODUCT_STATUS:
    case productConstants.GETALL_SUCCESS:   // if reload list then any single product information is invalid - clear it.
    case productConstants.DELETE_SUCCESS:  // product should be deleted, so old data is invalid. return to initialstate.
      logit.debug("set aProduct "+ action.type);
      prState(state,action);
      return aProductInitialState;

    case productConstants.UPDATE_PRODUCT_REQUEST:
      logit.debug("set aProduct "+ action.type);
      prState(state,action);

      return {
        status:productConstants.PRODUCT_INVALID,
        isLoading: true,
        update: "requested",
        product: action.product
      };

    case productConstants.UPDATE_PRODUCT_SUCCESS:
      logit.debug("set aProduct "+ action.type);
      prState(state,action);

      // leave state invalid, set isLoading to false, will trigger reload of data in component
      return {
        status:productConstants.PRODUCT_INVALID,
        isLoading: false,
        update: "success",
        product: action.product,
      };

    case productConstants.UPDATE_PRODUCT_FAILURE:
      logit.debug("set aProduct "+ action.type);
      prState(state,action);
      return {
        error: action.error,
        isloading: false,
        update:"error",
        status:productConstants.PRODUCT_INVALID,
        ...state
      };

    default:
      return state
  }
}

