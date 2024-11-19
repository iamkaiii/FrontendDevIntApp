import { getProductsByName, getAllProducts } from "../modules/ApiProducts"; // Добавьте getAllProducts
import { MilkProducts } from "../modules/MyInterface";
import "./MainPage.css";
import {  useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ROUTE_LABELS, ROUTES } from "../modules/Routes";
import { OneProduct } from "../components/OneMeal";
import { BreadCrumbs } from "../components/BreadCrumbs";
import { useDispatch, useSelector } from "react-redux";
import { setProductName, setFilteredProducts  } from "../modules/searchSlice"; // Путь к файлу searchSlice
import { RootState } from "../modules/store"; // Путь к файлу store

export const MainPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Извлекаем данные из Redux
    const { productName, filteredProducts } = useSelector((state: RootState) => state.search);
    
    // Состояние для отображения продуктов
    const [products, setProducts] = useState<MilkProducts[]>(filteredProducts || []); // Изначально используем filteredProducts

    useEffect(() => {
        // Если фильтрованные продукты уже есть в Redux, их можно сразу отобразить
        if (filteredProducts.length > 0) {
            setProducts(filteredProducts);
        } else {
            // Если нет фильтрованных продуктов, загружаем все
            getAllProducts().then((result) => {
                setProducts(result.MilkProducts); // Заменяем на правильный тип данных
            });
        }
    }, [filteredProducts]); // Перезапускаем useEffect, если filteredProducts изменились

    const onSubmitFinderHandler = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault(); // Предотвращаем перезагрузку страницы
        dispatch(setProductName(productName)); // Сохраняем состояние поиска в Redux

        if (productName) {
            getProductsByName(productName).then((result) => {
                setProducts(result.MilkProducts); // Теперь передаем сам массив данных
                dispatch(setFilteredProducts(result.MilkProducts)); // Сохраняем отфильтрованные продукты в Redux
            });
        } else {
            getAllProducts().then((result) => {
                setProducts(result.MilkProducts); // Теперь передаем сам массив данных
                dispatch(setFilteredProducts(result.MilkProducts)); // Загружаем все продукты в Redux
            });
        }
    };

    const imageClickHandler = (id: number) => {
        navigate(`${ROUTES.HOME}/${id}`);
    };

    return (
        <>
            <div className="header">
                <Link to={ROUTES.START}>
                    <button name="home-button"></button>
                </Link>
            </div>

            <div className="crumbs">
                <div className="MP_breadcrumbs">
                        <BreadCrumbs
                            crumbs={[{ label: ROUTE_LABELS.HOME }]}
                        />
                </div>
            </div>
            
            <div className="navigation_line">
                <form onSubmit={onSubmitFinderHandler}> {/* Форма для поиска */}
                    <input className="search_field"
                        type="text"
                        placeholder="Введите название продукта"
                        value={productName} // Используем значение из Redux
                        onChange={(e) => dispatch(setProductName(e.target.value))} // Обновляем состояние в Redux
                    />
                    <button type="submit">Поиск</button> {/* Кнопка поиска */}
                </form>
            </div>

            <div className="container-main">
                {Array.isArray(products) && products.map(product => (
                    <OneProduct
                        product={product}
                        key={product.id}
                        imageClickHandler={() => imageClickHandler(product.id)}
                    />
                ))}
            </div>
        </>
    );
};