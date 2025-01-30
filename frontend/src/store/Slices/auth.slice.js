import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import axiosInstance from "../../Helpers/axiosInstance";

const initialState = {
    isLoggedIn: JSON.parse(localStorage.getItem("isLoggedIn")) || false,
    data: localStorage.getItem("data") ? JSON.parse(localStorage.getItem("data")) : null,
    role: localStorage.getItem("role") || null,
    users: [],
    coursesToVerify: [],
    userCourses: [],
};

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

export const userSignup = createAsyncThunk("/auth/signup", async (data, { rejectWithValue }) => {
    try {
        const res = axiosInstance.post("/user/register", data);
        toast.promise(res, {
            loading: "Creating account...",
            success: (data) => data.data.message,
        });
        return (await res).data;
    } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to sign up');
        return rejectWithValue(error.response?.data);
    }
});

export const googleSignup = createAsyncThunk("/auth/googleSignup", async (tokenId, { rejectWithValue }) => {
    try {
        const res = axiosInstance.post("/user/auth/google/callback", tokenId, { withCredentials: true });
        toast.promise(res, {
            loading: "Creating account...",
            success: (data) => data.data.message,
        });
        return (await res).data;
    } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to sign up with Google');
        console.log(error.response?.data)
        return rejectWithValue(error.response?.data);
    }
});

export const updateUserProfile = createAsyncThunk(
    '/auth/updateProfile',
    async (formData) => {
        try {
            const config = {
                headers: { 'Content-Type': 'multipart/form-data' },
            };

            const form = new FormData();
            form.append('name', formData.name);
            if (formData.avatar) {
                form.append('avatar', formData.avatar);
            }

            const res = axiosInstance.post(`/user/editUserDetails`, form, config);
            toast.promise(res, {
                loading: 'Updating profile...',
                success: (data) => data.data.message,
            });
            return (await res).data;
        } catch (error) {
            console.log(error.response?.data?.message || error.message);
            toast.error(error.response?.data?.message || 'Failed to update profile');
        }
    }
);


export const addCourse = createAsyncThunk("/admin/addCourse", async (data) => {
    try {
        const res = axiosInstance.post("/admin/addCourse", data);
        toast.promise(res, {
            loading: "Adding course...",
            success: (data) => data.data.message,
        });
        return (await res).data;
    } catch (error) {
        console.log(error.response?.data?.message || error.message);
        toast.error(error.response?.data?.message || "Failed to update profile");
    }
})

export const fetchUsers = createAsyncThunk("/admin/getUserAccount", async () => {
    try {
        const res = axiosInstance.get("/admin/getUserAccount")
        toast.promise(res, {
            loading: "Fetching users...",
            success: "Users fetched successfully!",
        });
        return (await res).data.data;
    } catch (error) {
        console.log(error.response?.data?.message || error.message);
        toast.error(error.response?.data?.message || "Failed to fetch users");
    }
});

export const assignUserRole = createAsyncThunk("/admin/assignRole", async ({ id, role }) => {
    try {
        const res = axiosInstance.post("/admin/assignRole", { id, role });
        toast.promise(res, {
            loading: "Assigning role...",
            success: "Role assigned successfully!",
        });
        return (await res).data.user;
    } catch (error) {
        console.log(error.response?.data?.message || error.message);
        toast.error(error.response?.data?.message || "Failed to assign role");
    }
});

export const deleteUser = createAsyncThunk("/admin/deleteUser", async (id) => {
    try {
        console.log("id in thunk :", id);
        const res = axiosInstance.post("/admin/deleteUser", { id });
        toast.promise(res, {
            loading: "removing user from database",
            success: "User removed"
        })
        console.log((await res).data.data);
        return (await res).data.data
    } catch (error) {
        console.log("Error:", error.response?.data?.message || error.message);
        toast.error(error.response?.data?.message || "Failed to delete user");
        return rejectWithValue({ message: "Failed to delete user", id });
    }
})

export const fetchCoursesToVerify = createAsyncThunk("/admin/coursesToVerify", async () => {
    try {
        const res = axiosInstance.get("/admin/coursesToVerify");
        toast.promise(res, {
            loading: "Fetching courses...",
            success: "Courses fetched successfully!",
        });
        return (await res).data.data;
    } catch (error) {
        console.log(error.response?.data?.message || error.message);
        toast.error(error.response?.data?.message || "Failed to fetch courses");
    }
});

export const verifyCourse = createAsyncThunk("/admin/verifyCourse", async ({ id, verify }) => {
    try {
        const res = axiosInstance.post("/admin/verifyCourse", { id, verify });
        toast.promise(res, {
            loading: "Verifying course...",
            success: verify ? "Course approved!" : "Course disapproved!",
        });
        return (await res).data.courseMap;
    } catch (error) {
        console.log(error.response?.data?.message || error.message);
        toast.error(error.response?.data?.message || "Failed to verify course");
    }
});

export const fetchUserCourses = createAsyncThunk('/user/courses', async (userId) => {
    try {
        const res = axiosInstance.post('/user/getUserCourses', { userId });
        toast.promise(res, {
            loading: 'Fetching user courses...',
            success: 'Courses fetched successfully!',
        });
        return (await res).data.data;
    } catch (error) {
        console.error(error.response?.data?.message || error.message);
        toast.error(error.response?.data?.message || 'Failed to fetch user courses');
    }
});


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
        setLogin(state, action) {
            console.log("called here ", action.payload);
            state.isLoggedIn = action.payload;
            localStorage.setItem("isLoggedIn", action.payload);
        }
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
            .addCase(googleSignup.fulfilled, (state, action) => {
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
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.users = action.payload;
            })
            .addCase(assignUserRole.fulfilled, (state, action) => {
                const updatedUser = action.payload;
                state.users = state.users.map(user =>
                    user._id === updatedUser._id ? updatedUser : user
                );
            })
            .addCase(deleteUser.fulfilled, (state, action) => {
                const updatedUsers = action?.payload;
                state.users = updatedUsers;
            })
            .addCase(deleteUser.rejected, (state, action) => {
                console.error(action.payload?.message || "Error deleting user");
            })
            .addCase(fetchCoursesToVerify.fulfilled, (state, action) => {
                state.coursesToVerify = action.payload || [];
            })
            .addCase(verifyCourse.fulfilled, (state, action) => {
                state.coursesToVerify = state.coursesToVerify.filter(
                    (course) => course._id !== action.payload._id
                );
            })
            .addCase(fetchUserCourses.fulfilled, (state, action) => {
                if (action?.payload) {
                    state.userCourses = action.payload || [];
                }
            })
            .addCase(fetchUserCourses.rejected, (state, action) => {
                console.error("Error fetching user courses:", action.error.message);
            });

    },
});

export const { logout, setLogin } = authSlice.actions;
export default authSlice.reducer;
