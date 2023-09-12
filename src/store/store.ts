import { configureStore } from "@reduxjs/toolkit";

import authReducer from "./redux/authSlice";
import userReducer from "./redux/userSlice";
import categoryReducer from "./redux/categorySlice";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        user: userReducer,
        category: categoryReducer,
    }
})

export type StoreType = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch



