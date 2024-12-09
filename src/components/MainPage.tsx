import { getProductsByName, getAllProducts } from "../modules/ApiProducts";
import { MilkProducts } from "../modules/MyInterface";
import "./MainPage.css";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ROUTE_LABELS, ROUTES } from "../modules/Routes";
import { OneProduct } from "../components/OneMeal";
import { BreadCrumbs } from "../components/BreadCrumbs";
import { useDispatch, useSelector } from "react-redux";
import { setProductName, setFilteredProducts } from "../modules/searchSlice";
import { RootState } from "../modules/store";

export const MainPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Извлекаем данные из Redux
    const { productName, filteredProducts } = useSelector((state: RootState) => state.search);

    // Состояние для отображения продуктов
    const [products, setProducts] = useState<MilkProducts[]>(filteredProducts || []);
    
    // Состояние кнопки вход/выход
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!localStorage.getItem("token"));
    const [login, setLogin] = useState<string>(localStorage.getItem("login") || "");

    useEffect(() => {
        // Если фильтрованные продукты уже есть в Redux, их можно сразу отобразить
        if (filteredProducts.length >= 0 && productName != "") {
            setProducts(filteredProducts);
            
        } else {
            // Если нет фильтрованных продуктов, загружаем все
            getAllProducts().then((result) => {
                setProducts(result.MilkProducts);
            });
        }
    }, [filteredProducts]);

    const onSubmitFinderHandler = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    dispatch(setProductName(productName));

    if (productName) {
        getProductsByName(productName).then((result) => {
            const productsList = result.MilkProducts || [];
            setProducts(productsList);
            dispatch(setFilteredProducts(productsList));
        }).catch(() => {
            // Обработка ошибок в случае если API не вернул данных
            setProducts([]);
            dispatch(setFilteredProducts([]));
        });
    } else {
        getAllProducts().then((result) => {
            const allProducts = result.MilkProducts || [];
            setProducts(allProducts);
            dispatch(setFilteredProducts(allProducts));
        }).catch(() => {
            // Обработка ошибок в случае ошибки при получении всех продуктов
            setProducts([]);
            dispatch(setFilteredProducts([]));
        });
    }
};

    const imageClickHandler = (id: number) => {
        navigate(`${ROUTES.HOME}/${id}`);
    };

    const handleAuthButtonClick = () => {
        if (isAuthenticated) {
            // Если пользователь авторизован, очищаем токен и логин
            localStorage.removeItem("token");
            localStorage.removeItem("login");
            setIsAuthenticated(false);
            setLogin("");
        } else {
            // Если пользователь не авторизован, переходим на страницу авторизации
            navigate(ROUTES.AUTHORIZATION);
        }
    };

    const handleProfileClick = () => {
        // Переходим на страницу профиля пользователя
        navigate(ROUTES.PROFILE);
    };

    return (
        <>
            <div className="super-header-main">
                <Link to={ROUTES.START}>
                    <button className="home-button"></button>
                </Link>
                <Link to={ROUTES.HOME} className="no-underline">
                    <button className="profile-button">Продукты</button>
                </Link>
                {isAuthenticated ? (
                    <div className="user-actions">
                        <button
                            className="profile-button"
                            onClick={handleProfileClick}
                        >
                            {login}
                        </button>
                        <button
                            className="auth-button"
                            onClick={handleAuthButtonClick}
                        >
                            Выход
                        </button>
                    </div>
                ) : (
                    <button
                        className="auth-button"
                        onClick={handleAuthButtonClick}
                    >
                        Вход
                    </button>
                )}
            </div>

            <div className="crumbs">
                <div className="MP_breadcrumbs">
                    <BreadCrumbs
                        crumbs={[{ label: ROUTE_LABELS.HOME }]}
                    />
                </div>
            </div>

            <div className="navigation_line">
                <form onSubmit={onSubmitFinderHandler}>
                    <input className="search_field"
                        type="text"
                        placeholder="Введите название продукта"
                        value={productName}
                        onChange={(e) => dispatch(setProductName(e.target.value))}
                    />
                    <button className="button-def" type="submit">Поиск</button>
                    <button className="button-def" type="submit">Корзина</button>
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
