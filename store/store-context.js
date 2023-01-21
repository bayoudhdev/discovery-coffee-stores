import {createContext, useContext, useReducer} from 'react';

const AppContext = createContext();

export const ACTION_TYPES = {
    SET_LAT_LONG: 'SET_LAT_LONG',
    SET_COFFEE_STORES: 'SET_COFFEE_STORES',
}

const storeReducer = (state, action) => {
    switch (action.type) {
        case ACTION_TYPES.SET_LAT_LONG : {
            return {...state, latLong: action.payload.latLong}
        }
        case ACTION_TYPES.SET_COFFEE_STORES : {
            return {...state, coffeeStores: action.payload.coffeeStores}
        }
        default:
            throw new Error(`Unhandled action type: ${action.type}`);
    }
}

export function AppWrapper({children}) {
    let sharedState = {
        latLong: "", coffeeStores: [],
    }

    const [state, dispatch] = useReducer(storeReducer, sharedState);
    return (<AppContext.Provider value={{state, dispatch}}>
        {children}
    </AppContext.Provider>);
}

export function useAppContext() {
    return useContext(AppContext);
}

export default AppWrapper;
