import { FC } from "react";
import { MilkProducts } from "../modules/MyInterface";
import "./MainPage.css";
import { api } from "../api"; // Импорт API


interface OneMilkProduct {
    product: MilkProducts;
    imageClickHandler: () => void;
    checkAndUpdateMilkRequestID: () => Promise<void>; // Новый проп для проверки milkRequestID
}

export const OneProduct: FC<OneMilkProduct> = ({ product, imageClickHandler, checkAndUpdateMilkRequestID }) => {
    const token = localStorage.getItem("token");

    const handleAddMeal = async () => {
        if (!token) {
            console.error("Токен отсутствует");
            return;
        }

        try {
            // Проверяем и обновляем milkRequestID, если нужно

            const response = await api.api.mealToMilkRequestCreate(
                String(product.id),
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            console.log("Продукт успешно добавлен в запрос:", response.data);
            await checkAndUpdateMilkRequestID();
        } catch (err: any) {
            if (err.response?.data?.message) {
                console.error("Ошибка при добавлении продукта:", err.response.data.message);
            } else {
                console.error("Произошла неизвестная ошибка:", err);
            }
        }
    };

    return (
        <div className="card">
            <div className="card-image-container">
                <img src={product.image_url || "nophoto.png"} className="card-image" alt="product" />
            </div>
            <div className="card-text">
                <p className="title-in-card">{product.meal_info} {product.meal_weight}</p>
                <div className="buttons-in-card">
                    <button onClick={imageClickHandler} className="card-button">Подробнее</button>
                    {token && (
                        <button onClick={handleAddMeal} className="card-button" type="button">+</button>
                    )}
                </div>
            </div>
        </div>
    );
};