import React, { createContext, useReducer } from 'react';

const initialState = 'abonent';
const store = createContext(initialState);
const { Provider } = store;

const TableProvider = ({ children }) => {
    const [state, dispatch] = useReducer((state, action) => {
        return { table: action.table }
    }, initialState);
    return <Provider value={{ state, dispatch }}>{children}</Provider>;
};

export { store, TableProvider }