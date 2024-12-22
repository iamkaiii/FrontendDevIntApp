import { FC, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ROUTES } from "../modules/Routes";
import "./RegisterPage.css";
import { AppDispatch, RootState } from "../modules/store";
import { registerUser } from "../modules/thunks/registerThunk";

export const RegisterPage: FC = () => {
    const [login, setLogin] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [message, setMessage] = useState<string | null>(null);

    const dispatch = useDispatch<AppDispatch>();

    const { loading } = useSelector((state: RootState) => state.auth);

    const handleAuth = () => {
        dispatch(registerUser({ login, password }))
            .unwrap()
            .then((data) => {
                setMessage(data.message || "Успех");
            })
            .catch(() => {
                setMessage("Произошла ошибка. Попробуйте снова."); // Общая ошибка
            });
    };

    return (
        <>
            <div className="space-reg">
                <div className="super-header">
                    <Link to={ROUTES.START}>
                        <button className="home-button"></button>
                    </Link>
                    <Link to={ROUTES.HOME} className="no-underline">
                        <h2 className="h2-auth-prods-auth">Продукты</h2>
                    </Link>
                </div>
                <div className="container-reg">
                    <div className="container-header-reg">
                        <span>Регистрация / </span>
                        <Link to={ROUTES.AUTHORIZATION} className="no-underline-reg">
                            <span className="h2-reg-to-auth">Авторизация</span>
                        </Link>
                    </div>
                    <div className="container-data-reg">
                        <div className="container-data-reg-login">
                            <input
                                type="text"
                                placeholder="Login"
                                value={login}
                                onChange={(e) => setLogin(e.target.value)}
                            />
                        </div>

                        <div className="container-data-reg-password">
                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        {message && <div className="server-message">{message}</div>}

                        <button className="button-auth" onClick={handleAuth} disabled={loading}>
                            {loading ? "Загрузка..." : "Зарегистрироваться"}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};
