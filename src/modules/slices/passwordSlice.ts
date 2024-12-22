import { createSlice } from "@reduxjs/toolkit";
import { changePasswordThunk } from "../ApiProducts";


export interface UserState {
    loading: boolean;
    message: string | null;
    error: string | null;
}

const initialState: UserState = {
    loading: false,
    message: null,
    error: null,
};

const passwordSlice = createSlice({
    name: "password",
    initialState,
    reducers: {
        clearMessage: (state) => {
            state.message = null;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(changePasswordThunk.pending, (state) => {
                state.loading = true;
                state.message = null;
                state.error = null;
            })
            .addCase(changePasswordThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.message = action.payload;
            })
            .addCase(changePasswordThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Неизвестная ошибка";
            });
    },
});

export const { clearMessage } = passwordSlice.actions;
export default passwordSlice.reducer;