import { MilkProducts, ApiResponse, ApiResponseGetAllProds, MilkRequestResponse, MilkRequest, User } from "./MyInterface";
import { MOCK_DATA_PRODUCTS } from "./MockDataProducts";
import { api } from "../api";

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

export const getMilkRequestByID = async (id: number): Promise<MilkRequestResponse | null> => {
    const token = localStorage.getItem("token"); // Получение токена из localStorage
    if (!token) {
        console.error("Токен отсутствует. Авторизация не выполнена.");
        return null;
    }

    try {
        const response = await api.api.milkRequestDetail(id, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (response.data) {
            return {MilkRequest: response.data["milk_requests"], count: response.data["count"], MilkRequesMeals: response.data["milk_request_meals"]}; // Возвращаем успешный ответ
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