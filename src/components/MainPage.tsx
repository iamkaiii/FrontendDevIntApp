import { getProductsByName, getAllProducts } from "../modules/ApiProducts";
import { MilkProducts } from "../modules/MyInterface";
import "./MainPage.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTE_LABELS, ROUTES } from "../modules/Routes";
import { OneProduct } from "../components/OneMeal";
import { BreadCrumbs } from "../components/BreadCrumbs";
import { useDispatch, useSelector } from "react-redux";
import { setProductName, setFilteredProducts } from "../modules/searchSlice";
import { RootState } from "../modules/store";
import { HeaderUni } from "./HeaderUni";

export const MainPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Извлекаем данные из Redux
    const { productName, filteredProducts } = useSelector((state: RootState) => state.search);

    // Состояния для продуктов и MilkRequestID
    const [products, setProducts] = useState<MilkProducts[]>(filteredProducts || []);
    const [milkRequestID, setMilkRequestID] = useState<number>(0);
    const [MealsInDraftCount, setMealsInDraftCount] = useState<number>(0);
    // Состояние кнопки вход/выход
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!localStorage.getItem("token"));
    const [login, setLogin] = useState<string>(localStorage.getItem("login") || "");

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                // Если есть фильтрованные продукты, показываем их
                if (filteredProducts.length >= 0 && productName !== "") {
                    setProducts(filteredProducts);
                } else {
                    // Если фильтрованных продуктов нет, загружаем все продукты
                    const result = await getAllProducts();
                    setProducts(result.MilkProducts);
                    setMilkRequestID(result.MilkRequestID); // Устанавливаем MilkRequestID
                    setMealsInDraftCount(result.MealsInDraftCount)
                    console.log(MealsInDraftCount, isAuthenticated, login, setLogin(login), setIsAuthenticated(isAuthenticated))

                    console.log("result.MilkRequestID:", result.MilkRequestID);
                    console.log("milkRequestID после установки:", result.MilkRequestID);
                    console.log(result.MealsInDraftCount)
                }
            } catch (error) {
                console.error("Ошибка при загрузке продуктов:", error);
            }
        };

        fetchProducts(); 
    }, [filteredProducts]); 

    const checkAndUpdateMilkRequestID = async () => {
        if (milkRequestID === 0) {
            try {
                const result = await getAllProducts(); // Или другой API для обновления milkRequestID
                setMilkRequestID(result.MilkRequestID);
                console.log("milkRequestID обновлен:", result.MilkRequestID);
            } catch (error) {
                console.error("Ошибка при обновлении milkRequestID:", error);
            }
        }
    };


    


    const onSubmitFinderHandler = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        dispatch(setProductName(productName));

        if (productName) {
            getProductsByName(productName).then((result) => {
                const productsList = result.MilkProducts || [];
                setProducts(productsList);
                dispatch(setFilteredProducts(productsList));
            }).catch(() => {
                setProducts([]);
                dispatch(setFilteredProducts([]));
            });
        } else {
            getAllProducts().then((result) => {
                const allProducts = result.MilkProducts || [];
                setProducts(allProducts);
                setMilkRequestID(result.MilkRequestID); // Сохраняем MilkRequestID
                dispatch(setFilteredProducts(allProducts));
            }).catch(() => {
                setProducts([]);
                setMilkRequestID(0); // Устанавливаем в 0 в случае ошибки
                dispatch(setFilteredProducts([]));
            });
        }
    };




    const imageClickHandler = (id: number) => {
        navigate(`${ROUTES.HOME}/${id}`);
    };

    

    const handleCartButtonClick = () => {
        if (milkRequestID !== 0) {
            navigate(`${ROUTES.BASKET}/${milkRequestID}`);
        }
    };

    return (
        <>
            <div className="header-backet">
                <HeaderUni />
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
                    <button 
                        className="button-def"
                        type="button"
                        disabled={milkRequestID === 0} // Деактивация кнопки
                        onClick={handleCartButtonClick} // Обработчик клика
                    >
                        Корзина
                    </button>
                </form>
            </div>

            <div className="container-main">
                {Array.isArray(products) && products.map(product => (
                    <OneProduct
                        product={product}
                        key={product.id}
                        imageClickHandler={() => imageClickHandler(product.id)}
                        checkAndUpdateMilkRequestID={checkAndUpdateMilkRequestID}
                    />
                ))}
            </div>
        </>
    );
};
