import {configureStore} from "@reduxjs/toolkit"
import authReducer from "./Slices/auth.slice.js"

const store =  configureStore({
    reducer: {
        auth: authReducer
    },
    devTools: true
})

export default store;