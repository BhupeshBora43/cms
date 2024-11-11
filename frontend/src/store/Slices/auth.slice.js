import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import axiosInstance from "../../Helpers/axiosInstance";

const initialState = {
    isLoggedIn: localStorage.getItem("isLoggedIn") || false,
    data: localStorage.getItem("data") ? JSON.parse(localStorage.getItem("data")) : null,
    role: localStorage.getItem("role") || null,
};

// Thunk for User Login
export const userLogin = createAsyncThunk("/auth/login", async (data) => {
    try {
        const res = axiosInstance.post("/user/login", data);
        toast.promise(res, {
            loading: "Please wait, logging you in...",
            success: (data) => data.data.message,
        });
        return (await res).data;
    } catch (error) {
        console.log(error.response.data.message);
        toast.error(error.response.data.message);
    }
});

// Thunk for User Signup
export const userSignup = createAsyncThunk("/auth/signup", async (data) => {
    try {
        const res = axiosInstance.post("/user/register", data);
        toast.promise(res, {
            loading: "Creating account...",
            success: (data) => data.data.message,
        });
        return (await res).data;
    } catch (error) {
        toast.error(error.response.data.message);
    }
});


export const updateUserProfile = createAsyncThunk(
    "/auth/updateProfile",
    async (formData, { getState }) => {
        try {

            const config = {
                headers: { "Content-Type": "multipart/form-data" },
            };
            const res = axiosInstance.post(`/user/editUserDetails`, formData, config);
            console.log("res.data in update: ",res);
            toast.promise(res, {
                loading: "Updating profile...",
                success: (data) => data.data.message,
            });
            return (await res).data;
        } catch (error) {
            console.log(error.response?.data?.message || error.message);
            toast.error(error.response?.data?.message || "Failed to update profile");
        }
    }
);

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        logout(state) {
            state.isLoggedIn = false;
            state.data = null;
            localStorage.clear();
            toast.success("Logged out successfully");
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(userLogin.fulfilled, (state, action) => {
                if (action?.payload) {
                    state.isLoggedIn = true;
                    localStorage.setItem("isLoggedIn", true);
                    localStorage.setItem("data", JSON.stringify(action?.payload?.data));
                    localStorage.setItem("role", action?.payload?.data.role);
                    state.data = action?.payload?.data;
                    state.role = action?.payload?.data.role;
                }
            })
            .addCase(updateUserProfile.fulfilled, (state, action) => {
                if (action?.payload) {
                    state.data = action.payload.data;
                    localStorage.setItem("data", JSON.stringify(action.payload.data));
                }
            });
    },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
