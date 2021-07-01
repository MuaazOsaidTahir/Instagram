import React, { createContext, useReducer } from 'react'
import reducer from './reducer';

const initialState = null;

export const Context = createContext()


function Provider({ children }) {
    const [state, dispatch] = useReducer(reducer, initialState)
    const [username, name] = useReducer(reducer, initialState)
    return (
        <Context.Provider value={{
            state,
            dispatch,
            username,
            name
        }} >
            { children}
        </Context.Provider>
    )
}

export default Provider
