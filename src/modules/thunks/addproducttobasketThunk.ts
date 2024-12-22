
import { createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../api';

// Интерфейс для входных параметров
interface AddMealPayload {
    productId: string;
    token?: string;
  }
  
  // Интерфейс для ответа
  export interface SchemasAddMealToMilkReqResponse {
    success?: boolean;
    message?: string;
  }
  
  export const addMealToMilkRequest = createAsyncThunk<
    SchemasAddMealToMilkReqResponse,  // Тип ответа
    AddMealPayload,                   // Тип входных параметров
    { rejectValue: string }            // Тип ошибок
  >(
    'meal/addToMilkRequest',
    async ({ productId, token }, { rejectWithValue }) => {
      try {
        const response = await api.api.mealToMilkRequestCreate(productId, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        return response.data as SchemasAddMealToMilkReqResponse;
      } catch (err: any) {
        return rejectWithValue(err.response?.data?.message || 'Ошибка при добавлении продукта');
      }
    }
  );