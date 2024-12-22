import { FC } from "react";
import { MilkProducts } from "../modules/MyInterface";
import "./MainPage.css";
import { useDispatch } from 'react-redux'; // Используем useDispatch для получения функции dispatch
import { addMealToMilkRequest } from "../modules/thunks/addproducttobasketThunk"; // Импорт вашего thunks

interface OneMilkProduct {
    product: MilkProducts;
    imageClickHandler: () => void;
    checkAndUpdateMilkRequestID: () => Promise<void>;
}

export const OneProduct: FC<OneMilkProduct> = ({ product, imageClickHandler, checkAndUpdateMilkRequestID }) => {
    const token = localStorage.getItem("token");
    const dispatch = useDispatch(); // Используем useDispatch для получения функции dispatch

    const handleAddMeal = async () => {
        if (!token) {
            console.error("Токен отсутствует");
            return;
        }

        try {
            //@ts-ignore
            dispatch(addMealToMilkRequest({ productId: (product.id), token }));
            console.log("Продукт успешно добавлен в запрос");
            await checkAndUpdateMilkRequestID();
        } catch (err) {
            console.error("Произошла ошибка при добавлении продукта:", err);
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
