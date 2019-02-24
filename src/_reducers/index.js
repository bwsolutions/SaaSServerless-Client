import { combineReducers } from 'redux';

import { authentication } from './authentication.reducer';
import { users, aUser } from './users.reducer';
import { alert } from './alert.reducer';
import { systemRegistration } from './sysReg.reducer';
import { tenantRegistration } from "./tenantReg.reducer";
import { tenants, aTenant } from "./tenantMgr.reducer";
import { health } from './health.reducer';
import { modal } from './modal.reducer';
import { products, aProduct } from './product.reducer';
import { orders, aOrder } from './order.reducer';

const rootReducer = combineReducers({
    authentication,
    systemRegistration,
    users,aUser,
    alert,
    tenants,aTenant,
    tenantRegistration,
    health,
    modal,
    products,aProduct,
    orders,aOrder,
});

export default rootReducer;