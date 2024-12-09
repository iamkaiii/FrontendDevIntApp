import { MilkProducts, ApiResponse } from "./MyInterface";
import { MOCK_DATA_PRODUCTS } from "./MockDataProducts";

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

export const getAllProducts = async (): Promise<ApiResponse> => {
    try {
        const response = await fetch(`/api/meals`);
        const info = await response.json();
        console.log(info);
        return { MilkProducts: info["meals"]};
    } catch (error) {
        console.error("Ошибка при получении данных из API, используем MOCK_DATA_PRODUCTS", error);
        return {MilkProducts: MOCK_DATA_PRODUCTS.MilkProducts};
    }
};