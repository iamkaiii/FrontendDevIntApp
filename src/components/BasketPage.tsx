import { FC, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./AuthPage.css";
import "./BasketPage.css"; // Подключаем стили корзины
import { HeaderUni } from "./HeaderUni";
import { BreadCrumbs } from "../components/BreadCrumbs";
import { MilkRequestResponse } from "../modules/MyInterface";
import { getMilkRequestByID } from "../modules/ApiProducts";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../modules/Routes";
import { api } from '../api';  // Путь к сгенерированному Api
import { SchemasDeleteMealFromMilkReqRequest } from "../api/Api";

export const BasketPage: FC = () => {
    const { id } = useParams<{ id: string }>();
    const [basketData, setBasketData] = useState<MilkRequestResponse | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const calculateDeliveryDate = (): string => {
        const today = new Date();
        today.setDate(today.getDate() + 5); // Прибавляем 5 дней
        const day = today.getDate().toString().padStart(2, '0');
        const month = (today.getMonth() + 1).toString().padStart(2, '0'); // Месяц от 1 до 12
        const year = today.getFullYear();
        return `${day}.${month}.${year}`; // Форматируем дату как ДД.ММ.ГГГГ
    };


    useEffect(() => {
        const fetchBasketData = async () => {
            if (!id) {
                setError("ID заявки отсутствует в URL.");
                setLoading(false);
                return;
            }

            try {
                const data = await getMilkRequestByID(parseInt(id));
                console.log("Данные, полученные от нашего API по заявке", data);
                if (data) {
                    setBasketData(data);
                } else {
                    setError("Не удалось получить данные корзины.");
                }
            } catch (err) {
                console.error("Ошибка при загрузке данных корзины:", err);
                setError("Произошла ошибка при загрузке данных.");
            } finally {
                setLoading(false);
            }
        };

        fetchBasketData();
    }, [id]);

    // Получаем токен из localStorage
    const token = localStorage.getItem('token');

    // Обработчик оформления заявки
    const handleConfirm = async () => {
        try {
            // Вызовите метод API для оформления заявки с Bearer Auth
            await api.api.milkRequestFormUpdate(parseInt(id!), {}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            // После успешного выполнения запроса, перенаправим на домашнюю страницу
            navigate(ROUTES.HOME);
        } catch (err) {
            console.error("Ошибка при оформлении заявки:", err);
            alert("Произошла ошибка при оформлении заявки.");
        }
    };

    // Обработчик удаления заявки
    const handleDeleteBasket = async () => {
        try {
            // Вызовите метод API для удаления заявки с Bearer Auth
            await api.api.milkRequestDelete(parseInt(id!), {}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            // После успешного выполнения запроса, перенаправим на домашнюю страницу
            navigate(ROUTES.HOME);
        } catch (err) {
            console.error("Ошибка при удалении заявки:", err);
            alert("Произошла ошибка при удалении заявки.");
        }
    };

    // Обработчик удаления блюда
    const handleDeleteProduct = async (mealId: number) => {
        try {
            const requestBody: SchemasDeleteMealFromMilkReqRequest = {
                meal_id: mealId,
            };
            // Вызовите метод API для удаления блюда с Bearer Auth
            await api.api.milkReqMealsDelete(id!, requestBody, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            // После успешного удаления блюда обновим корзину
            setBasketData((prevData) => {
                if (prevData) {
                    const updatedMeals = prevData.MilkRequesMeals.filter(meal => meal.id !== mealId);
                    return { ...prevData, MilkRequesMeals: updatedMeals };
                }
                return prevData;
            });

            alert("Продукт успешно удален.");
        } catch (err) {
            console.error("Ошибка при удалении продукта:", err);
            alert("Произошла ошибка при удалении продукта.");
        }
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
                <div className="MP_breadcrumbs">
                    <BreadCrumbs crumbs={[{ label: "Заявка" }]} />
                </div>
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
                    <p><strong>Дата доставки:</strong> {calculateDeliveryDate() || "Не указана"}</p>
                    <p><strong>Адрес:</strong> {basketData?.MilkRequest.address || "Не указан"}</p>
                    <div className="basket-actions">
                        <button onClick={handleConfirm} className="action-btn confirm-btn">Оформить заявку</button>
                        <button onClick={handleDeleteBasket} className="action-btn delete-btn">Удалить заявку</button>
                    </div>
                </div>
            </div>
        </>
    );
};
