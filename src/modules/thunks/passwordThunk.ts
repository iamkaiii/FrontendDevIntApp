import { createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../api";


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

// Thunk для смены пароля
export const changePasswordThunk = createAsyncThunk<
    string, // Возвращаемый тип
    { oldPassword: string; newPassword: string }, // Тип параметра
    { rejectValue: string } // Тип ошибки
>("user/changePassword", async ({ oldPassword, newPassword }, { rejectWithValue }) => {
    try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Не авторизован");

        const response = await api.api.changeUserInfoUpdate(
            {
                old_password: oldPassword,
                new_password: newPassword,
            },
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );
        console.log(response, initialState)
        return "Пароль успешно изменен"; // Возвращаем сообщение об успехе
    } catch (err: any) {
        return rejectWithValue(err.response?.data?.message || "Ошибка при смене пароля");
    }
});
