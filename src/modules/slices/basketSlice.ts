import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getMilkRequestByID } from "../../modules/ApiProducts"; // Подключаем вашу функцию
import { MilkRequestResponse } from "../../modules/MyInterface";
import { api } from "../../api";
import { SchemasDeleteMealFromMilkReqRequest } from "../../api/Api";

export interface BasketState {
    basketData: MilkRequestResponse | null;
    loading: boolean;
    error: string | null;
}

const initialState: BasketState = {
    basketData: null,
    loading: false,
    error: null,
};

// Thunk: Загрузка данных корзины
export const fetchBasketData = createAsyncThunk<
    MilkRequestResponse,
    number,
    { rejectValue: string }
>("basket/fetchBasketData", async (id, { rejectWithValue }) => {
    try {
        const data = await getMilkRequestByID(id); // Используем вашу функцию
        if (!data) {
            return rejectWithValue("Не удалось загрузить данные корзины");
        }
        return data;
    } catch (err: any) {
        return rejectWithValue(err.message || "Ошибка при загрузке корзины");
    }
});

// Thunk: Оформление заявки
export const confirmBasket = createAsyncThunk<void, number, { rejectValue: string }>(
    "basket/confirmBasket",
    async (id, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) throw new Error("Токен не найден");

            await api.api.milkRequestFormUpdate(
                id,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || "Ошибка при оформлении заявки");
        }
    }
);

// Thunk: Удаление заявки
export const deleteBasket = createAsyncThunk<void, number, { rejectValue: string }>(
    "basket/deleteBasket",
    async (id, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) throw new Error("Токен не найден");

            await api.api.milkRequestDelete(
                id,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || "Ошибка при удалении заявки");
        }
    }
);

// Thunk: Удаление продукта из заявки
export const deleteProductFromBasket = createAsyncThunk<
    number,
    { requestId: number; mealId: number },
    { rejectValue: string }
>("basket/deleteProductFromBasket", async ({ requestId, mealId }, { rejectWithValue }) => {
    try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Токен не найден");

        const requestBody: SchemasDeleteMealFromMilkReqRequest = { meal_id: mealId };
        await api.api.milkReqMealsDelete(requestId.toString(), requestBody, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return mealId; // Возвращаем удалённый mealId для обновления состояния
    } catch (err: any) {
        return rejectWithValue(err.response?.data?.message || "Ошибка при удалении продукта");
    }
});

const basketSlice = createSlice({
    name: "basket",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchBasketData.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchBasketData.fulfilled, (state, action) => {
                state.loading = false;
                state.basketData = action.payload;
            })
            .addCase(fetchBasketData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Ошибка при загрузке корзины";
            })
            .addCase(confirmBasket.rejected, (state, action) => {
                state.error = action.payload || "Ошибка при оформлении заявки";
            })
            .addCase(deleteBasket.rejected, (state, action) => {
                state.error = action.payload || "Ошибка при удалении заявки";
            })
            .addCase(deleteProductFromBasket.fulfilled, (state, action) => {
                if (state.basketData) {
                    state.basketData.MilkRequesMeals = state.basketData.MilkRequesMeals.filter(
                        (meal) => meal.id !== action.payload
                    );
                }
            })
            .addCase(deleteProductFromBasket.rejected, (state, action) => {
                state.error = action.payload || "Ошибка при удалении продукта";
            });
    },
});

export default basketSlice.reducer;
