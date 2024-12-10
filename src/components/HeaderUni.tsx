import { FC } from "react"
import "./HeaderUni.css"
import { getProductsByName, getAllProducts } from "../modules/ApiProducts";
import { MilkProducts } from "../modules/MyInterface";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ROUTE_LABELS, ROUTES } from "../modules/Routes";
import { useDispatch, useSelector } from "react-redux";



export const HeaderUni: FC = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!localStorage.getItem("token"));
    const [login, setLogin] = useState<string>(localStorage.getItem("login") || "");


    const handleAuthButtonClick = () => {
        if (isAuthenticated) {
            localStorage.removeItem("token");
            localStorage.removeItem("login");
            setIsAuthenticated(false);
            setLogin("");
            navigate(ROUTES.HOME);
        } else {
            navigate(ROUTES.AUTHORIZATION);
        }
    };

    const handleProfileClick = () => {
        navigate(ROUTES.PROFILE);
    };
    return(


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
        
    

        </>
    )
}