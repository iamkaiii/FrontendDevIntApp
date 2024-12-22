import { MilkProducts, ApiResponse, ApiResponseGetAllProds, MilkRequestResponse, MilkRequest } from "./MyInterface";
import { MOCK_DATA_PRODUCTS } from "./MockDataProducts";
import { api } from "../api";
import { createAsyncThunk } from '@reduxjs/toolkit';
import { DsMilkRequests, SchemasChangePassword, SchemasDeleteMealFromMilkReqRequest, SchemasResponseMessage } from "../api/Api";

export const getProductsByName = async (name: string): Promise<ApiResponse> => {
    try {

        const response = await fetch(`/api/secret/get_meal_by_meal_info/${name}`);
        const info = await response.json();
        console.log(info);
        return { MilkProducts: info["meals"]};
      } 


    catch (error) {
        console.error("Ошибка при получении данных из API, используем MOCK_DATA_PRODUCTS", error);

        // Фильтрация MOCK_DATA_PRODUCTS по meal_info
        const filteredProducts = MOCK_DATA_PRODUCTS.MilkProducts.filter(product =>
            product.meal_info.toLowerCase().includes(name.toLowerCase())
        );

        return {MilkProducts: filteredProducts };
    }
};

export const getProductByID = async (
    id: string | number
): Promise<MilkProducts> => {
    try {
        const response = await fetch(`/api/meal/${id}`);
        const info = await response.json();
        console.log(info);
        return info["meal"];

    } catch (error) {
        console.error("Ошибка при получении продукта по ID, используем MOCK_DATA_PRODUCTS", error);
        const productIndex = Number(id) - 1;
        return MOCK_DATA_PRODUCTS.MilkProducts[productIndex] || null;
    }
};

export const getAllProducts = async (): Promise<ApiResponseGetAllProds> => {
    try {
        const token = localStorage.getItem("token");

        // Формируем параметры запроса
        const headers: HeadersInit = token
            ? { Authorization: `Bearer ${token}` }
            : {};

        const response = await fetch(`/api/meals`, {
            method: "GET",
            headers, // Передаем заголовки
        });

        const info = await response.json();
        console.log(info);
        console.log("IN_API_MILK_REQ:",info["milk_req_ID"] )
        return { MilkProducts: info["meals"], MilkRequestID: info["milk_req_ID"], MealsInDraftCount :info["count_meals_in_draft_request"] };
    } catch (error) {
        console.error("Ошибка при получении данных из API, используем MOCK_DATA_PRODUCTS", error);
        return { MilkProducts: MOCK_DATA_PRODUCTS.MilkProducts, MilkRequestID: 0, MealsInDraftCount: 0};
    }
};

// Адаптер для преобразования DsMilkRequests в MilkRequest
const adaptMilkRequest = (dsMilkRequest: DsMilkRequests): MilkRequest => ({
    ...dsMilkRequest,
    Creator: dsMilkRequest.creator,       // Преобразование поля creator в Creator
    Moderator: dsMilkRequest.moderator, // Преобразование поля moderator в Moderatorts
});

export const getMilkRequestByID = async (id: number): Promise<MilkRequestResponse | null> => {
    const token = localStorage.getItem("token"); // Получение токена из localStorage
    if (!token) {
        console.error("Токен отсутствует. Авторизация не выполнена.");
        return null;
    }

    try {
        // Выполнение запроса к API
        const response = await api.api.milkRequestDetail(id, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        // Проверка наличия данных в ответе
        if (response.data) {
            return {
                MilkRequest: adaptMilkRequest(response.data["milk_requests"]), // Адаптация данных
                count: response.data["count"],
                MilkRequesMeals: response.data["milk_request_meals"],
            };
        } else {
            console.error("Данные отсутствуют в ответе.");
            return null;
        }
    } catch (err: any) {
        // Обработка ошибок
        if (err.response?.data?.error) {
            console.error("Ошибка API:", err.response.data.error);
        } else {
            console.error("Произошла ошибка при выполнении запроса:", err);
        }
        return null;
    }
};

export const getProductByIdd= createAsyncThunk<MilkProducts | null, string | number>(
    'products/getByID',
    async (id) => {
        try {
            const response = await fetch(`/api/meal/${id}`);    
            const info = await response.json();
            console.log(info);
            return info["meal"];
        } catch (error) {
            console.error("Ошибка при получении продукта по ID, используем MOCK_DATA_PRODUCTS", error);
            const productIndex = Number(id) - 1;
            return MOCK_DATA_PRODUCTS.MilkProducts[productIndex] || null;
        }
    }
);


export const registerUserThunk = createAsyncThunk<
    SchemasResponseMessage,           
        { login: string; password: string }, 
        { rejectValue: string }         
>(
  'auth/registerUser',
  async ({ login, password }, { rejectWithValue }) => {
    try {
      // Запрос к API для регистрации пользователя
      const response = await api.api.registerUserCreate({ login, password });
      const data = response.data as SchemasResponseMessage;

      return data; // Возвращаем данные ответа
    } catch (err: any) {
      if (err.response?.status === 500 && err.response?.data?.message) {
        return rejectWithValue(err.response.data.message); // Ошибка 500
      } else if (err.response?.data?.error) {
        return rejectWithValue(err.response.data.error); // Другие ошибки
      } else {
        return rejectWithValue("Произошла ошибка. Попробуйте снова."); // Общая ошибка
      }
    }
  }
);


export const changePasswordThunk = createAsyncThunk<
  string, 
  SchemasChangePassword, 
  { rejectValue: string } 
>(
  'auth/changePassword',
  async ({ new_password, old_password }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token'); 
      if (!token) {
        return rejectWithValue('Ошибка авторизации. Токен отсутствует.');
      }

      
      const response = await api.api.changeUserInfoUpdate(
        { old_password: old_password, new_password: new_password },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      
      if (response.data) {
        return 'Пароль успешно изменен.'; 
      } else {
        return rejectWithValue('Неожиданный ответ от сервера.');
      }
    } catch (err: any) {
      if (err.response?.data?.message) {
        return rejectWithValue(err.response.data.message); 
      } else {
        return rejectWithValue('Произошла ошибка при смене пароля.');
      }
    }
  }
);

interface YourStateType {
  auth: {
    token: string | null;
  };
  basket: {
    id: string;
  };
}


export const deleteProductThunk = createAsyncThunk<
  void, 
  number, 
  { rejectValue: string }
>(
  'basket/deleteProduct',
  async (mealId: number, { rejectWithValue, getState }) => {
    try {
      const state = getState() as YourStateType; // Замените на тип вашего состояния
      const token = state.auth.token; // Замените на получение токена из вашего состояния

      if (!token) {
        return rejectWithValue('Ошибка авторизации. Токен отсутствует.');
      }

      const requestBody: SchemasDeleteMealFromMilkReqRequest = {
        meal_id: mealId,
      };

      await api.api.milkReqMealsDelete(state.basket.id, requestBody, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return; // После успешного удаления продукта обновляется состояние корзины в компоненте

    } catch (err) {
      console.error("Ошибка при удалении продукта:", err);
      
    }
  }
);


interface YourStateType1 {
  auth: {
    token: string | null;
  };
  basket: {
    id: number;
  };
}


export const deleteBasketThunk = createAsyncThunk<
  void, 
  void, 
  { rejectValue: string }
>(
  'basket/deleteBasket',
  async (_, { rejectWithValue, getState }) => {
    try {
      const state = getState() as YourStateType1; // Замените на тип вашего состояния
      const token = state.auth.token; // Получение токена из состояния

      if (!token) {
        return rejectWithValue('Ошибка авторизации. Токен отсутствует.');
      }

      await api.api.milkRequestDelete(state.basket.id!, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return; // После успешного удаления заявки происходит перенаправление на главную страницу в компоненте

    } catch (err) {
      console.error("Ошибка при удалении заявки:", err);
      
    }
  }
);



export const confirmBasketThunk = createAsyncThunk<
  void, 
  void, 
  { rejectValue: string }
>(
  'basket/confirmBasket',
  async (_, { rejectWithValue, getState }) => {
    try {
      const state = getState() as YourStateType1; // Замените на тип вашего состояния
      const token = state.auth.token; // Получение токена из состояния

      if (!token) {
        return rejectWithValue('Ошибка авторизации. Токен отсутствует.');
      }

      await api.api.milkRequestFormUpdate(state.basket.id!, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return; // После успешного оформления заявки происходит перенаправление на главную страницу в компоненте

    } catch (err) {
      console.error("Ошибка при оформлении заявки:", err);
      
    }
  }
);