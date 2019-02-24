import { healthConstants } from '../_constants';

export function health(state = {}, action) {

          switch (action.type) {
            case healthConstants.HEALTH_CHECK_ADD:
              return Object.assign({}, state,{
                    [action.name]: {healthy: false}
                  });

            case healthConstants.HEALTH_CHECK_UP:
              return Object.assign({}, state,{
                [action.name]: {healthy: true}
              });

            case healthConstants.HEALTH_CHECK_DOWN:
              return Object.assign({}, state,{
                [action.name]: {healthy: false}
              });

            case healthConstants.HEALTH_CHECK_DELETE:
              var { [action.name]: value, ...restState} = state;
              return restState;

              default:
              return state
          }
}

