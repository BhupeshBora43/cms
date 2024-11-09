import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import toast from "react-hot-toast"
import axiosInstance from "../../Helpers/axiosInstance"

const initialState = {
    isLoggedIn: localStorage.getItem("isLoggedIn") || false,
    data: localStorage.getItem("data") ? JSON.parse(localStorage.getItem("data")) : null
}


export const userLogin = createAsyncThunk("/auth/login", async (data) => {
    try {
        const res = axiosInstance.post("/user/login", data);
        toast.promise(res, {
            loading: "please wait logging you in ",
            success: (data) => data.data.message
        });
        return (await res).data


    } catch (error) {
        console.log(error.response.data.message);
        toast.error(error.response.data.message)
    }

})
export const userSignup = createAsyncThunk("/auth/signup", async (data) => {
    try {
        const res = axiosInstance.post("/user/register", data);

        toast.promise(res, {
            loading: "creating account... ",
            success: (data) => data.data.message
        });

        return (await res).data


    } catch (error) {
        toast.error(error.response.data.message)
    }

})

const authSlice = createSlice(
    {
        name: "auth",
        initialState,
        reducers: {

        },
        extraReducers: (builder) => {
            builder
                .addCase(userLogin.fulfilled, (state, action) => {
                    if (action?.payload) {
                        state.isLoggedIn = true,
                        localStorage.setItem("isLoggedIn", true);
                        localStorage.setItem("data", JSON.stringify(action?.payload?.data))
                        state.data = action?.payload?.data

                    }
                })
        }
    }
)

export default authSlice.reducer;