
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';


interface InitialStateAuthType {
    user: any,
    token: string
    isLogin: boolean,
    email: string,
    id: string,
    loading: boolean
    response: {
        statusCode: number,    
        error: string | undefined
    },
}

const initialStateAuth: InitialStateAuthType = {
    user: {},
    token: "",
    isLogin: false,
    loading: false,
    email: "",
    id: "",
    response: {
        statusCode: 400,
        error: undefined
    },
}

interface Register {
    email: string,
    password: string,
    name: string,
    id: string,
    surname:string
}

const axiosInstance = axios.create({
    baseURL: 'https://movieappi.onrender.com',
    headers: {
        'Content-Type': 'application/json',
    }
})


export const register = createAsyncThunk(
    '/signup',
    async (data: Register) => {
        const response = await axiosInstance.post('/signup', data);
        return response.data;
    })

export const login = createAsyncThunk(
  '/login',
  async ({ email, password, id }: { email: string, password: string, id: string }) => {
    console.log('login thunk called with:', email, password, id);
    const response = await axiosInstance.post('/login', { email, password , id});
    console.log('login thunk response:', response.data);
    return response.data;
  }
);

      

const authSlice = createSlice({
    initialState: initialStateAuth,
    name: 'auth',
    reducers: {
        login(state, action) {
          state.token = action.payload.token;
          state.email = action.payload.email;
          state.id = action.payload.id;
          state.isLogin = true;
          state.loading = false;
          state.response.statusCode = 200;
          state.response.error = undefined;
        },
        logout(state) {
          state.user = {};
          state.token = "";
          state.isLogin = false;
          state.loading = false;
          state.email = "";
          state.id = "";
          state.response.statusCode = 400;
          state.response.error = undefined;
        },
      },
    extraReducers: (builder) => {
       

        //#region Register thunk
        builder.addCase(register.fulfilled, (state, action) => {
            console.log("Register fulfilled")
            state.email = action.payload.email
            state.response.statusCode = 200;
            state.loading = false;
        });
        builder.addCase(register.pending, (state, action) => {
            console.log("Register pending")
            state.loading = true;
        })
        builder.addCase(register.rejected, (state, action) => {
            console.log("Register rejected")
            state.response.statusCode = 400;
            state.loading = false;
            state.response.error = action.error.message;
        });
        //#endregion

        //#region Login thunk
        builder.addCase(login.fulfilled, (state, action) => {
            console.log("Login fulfilled");
            state.token = action.payload.token;
            state.email = action.payload.email;
            state.id = action.payload.id;
            state.isLogin = true;
            state.response.statusCode = 200;
            state.loading = false;
          });
        builder.addCase(login.pending, (state, action) => {
            console.log("Login pending");
            state.loading = true;
        });
        builder.addCase(login.rejected, (state, action) => {
            state.response.statusCode = 400;
            state.loading = false;
            state.response.error = action.error.message;
        })
        //#endregion
    }

})
export const selectToken = (state: { login: { token: any; }; }) => state.login.token;
export const selectEmail = (state: { login: { response: { email: any } } }) => state.login?.response?.email;

export default authSlice.reducer;
export const loginAction = authSlice.actions