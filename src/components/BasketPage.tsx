// @ts-nocheck

import { FC, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import "./BasketPage.css";
import { HeaderUni } from "./HeaderUni";
import { BreadCrumbs } from "../components/BreadCrumbs";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../modules/store";
import {
    fetchBasketData,
    confirmBasket,
    deleteBasket,
    deleteProductFromBasket,
} from "../modules/slices/basketSlice";
import { ROUTES } from "../modules/Routes";

    
export const BasketPage: FC = () => {
    const { id } = useParams<{ id: string }>();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { basketData, loading, error } = useSelector((state: RootState) => state.basket);

    useEffect(() => {
        console.log(navigate)
        if (id) {
            dispatch(fetchBasketData(Number(id)));
        }
    }, [id, dispatch]);

    const calculateDeliveryDate = (): string => {
        const today = new Date();
        today.setDate(today.getDate() + 5);
        const day = today.getDate().toString().padStart(2, "0");
        const month = (today.getMonth() + 1).toString().padStart(2, "0");
        const year = today.getFullYear();
        return `${day}.${month}.${year}`;
    };

    const handleConfirm = () => {
        if (id) dispatch(confirmBasket(Number(id)));
    };

    const handleDeleteBasket = () => {
        if (id) dispatch(deleteBasket(Number(id)));
    };

    const handleDeleteProduct = (mealId: number) => {
        if (id) dispatch(deleteProductFromBasket({ requestId: Number(id), mealId }));
    };

    if (loading) {
        return <div>Загрузка данных...</div>;
    }

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    return (
        <>
            <div className="header-backet">
                <HeaderUni />
            </div>
            <div className="crumbs">
                <BreadCrumbs crumbs={[{ label: "Заявка" }]} />
            </div>
            <div className="container-basket">
                <div className="basket-cards">
                    {basketData?.MilkRequesMeals.map((meal) => (
                        <div key={meal.id} className="basket-card">
                            <img src={meal.image_url} alt={meal.meal_info} className="basket-image" />
                            <div className="basket-info">
                                <h3>{meal.meal_info}</h3>
                                <p>{meal.meal_weight}</p>
                            </div>
                            <button
                                onClick={() => handleDeleteProduct(meal.id)}
                                className="delete-product-btn"
                            >
                                Удалить
                            </button>
                        </div>
                    ))}
                </div>
                <div className="basket-summary">
                    <p><strong>Дата доставки:</strong> {calculateDeliveryDate()}</p>
                    <p><strong>Адрес:</strong> {basketData?.MilkRequest.address || "Не указан"}</p>
                    <Link to={ROUTES.HOME} className="no-underline">
                        <div className="basket-actions">
                            <button onClick={handleConfirm} className="action-btn confirm-btn">
                                    Оформить заявку
                            </button>
                            <button onClick={handleDeleteBasket} className="action-btn delete-btn">
                                    Удалить заявку
                            </button>
                        </div>
                    </Link>
                </div>
            </div>
        </>
    );
};
