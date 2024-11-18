import { getProductsByName, getAllProducts } from "../modules/ApiProducts"; // Добавьте getAllProducts
import { MilkProducts } from "../modules/MyInterface";
import "./MainPage.css";
import { SetStateAction, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ROUTE_LABELS, ROUTES } from "../modules/Routes";
import { OneProduct } from "../components/OneMeal";
import { BreadCrumbs } from "../components/BreadCrumbs";

export const MainPage = () => {
    
    const [products, SetProducts] = useState<MilkProducts[]>([]);
    const navigate = useNavigate();
    const [name, setName] = useState('');
    
    useEffect(() => {
        getAllProducts().then((result: { MilkProducts: SetStateAction<MilkProducts[]>; }) => {
            SetProducts(result.MilkProducts);
        });
    }, []);

    const onSubmitFinderHandler = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault(); // Предотвращаем перезагрузку страницы
        if (name) {
            getProductsByName(name).then((result) => {
                SetProducts(result.MilkProducts);
            });
        } else {
            // Если имя пустое, загружаем все товары
            getAllProducts().then((result: { MilkProducts: SetStateAction<MilkProducts[]>; }) => {
                SetProducts(result.MilkProducts);
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
                <div className="MP_breadcrumbs">
                    <BreadCrumbs 
                        crumbs={[{ label: ROUTE_LABELS.HOME}]} 
                    />
                </div>
            </div> 
            <div className="navigation_line">
                <form onSubmit={onSubmitFinderHandler}> {/* Форма для поиска */}
                    <input className="search_field"
                        size ={113} 
                        type="text" 
                        placeholder="Введите название продукта" 
                        value={name}
                        onChange={(e) => setName(e.target.value)} 
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
