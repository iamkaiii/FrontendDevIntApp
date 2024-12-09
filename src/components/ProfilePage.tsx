import "./ProfilePage.css";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ROUTES } from "../modules/Routes";
import { api } from "../api"; // Импорт API

export const ProfilePage = () => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!localStorage.getItem("token"));
    const [login, setLogin] = useState<string>(localStorage.getItem("login") || "");
    const [oldPassword, setOldPassword] = useState<string>("");
    const [newPassword, setNewPassword] = useState<string>("");
    const [message, setMessage] = useState<string>("");

    const navigate = useNavigate();

    // Проверка авторизации
    const token = localStorage.getItem("token");

    if (!token) {
        return (
            <div style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh",
                fontSize: "24px",
                fontWeight: "bold"
            }}>
                403, доступ запрещен
            </div>
        );
    }

    const handleAuthButtonClick = () => {
        if (isAuthenticated) {
            localStorage.removeItem("token");
            localStorage.removeItem("login");
            setIsAuthenticated(false);
            setLogin("");
            navigate(ROUTES.HOME); // Перенаправление на главную страницу
        } else {
            navigate(ROUTES.AUTHORIZATION);
        }
    };

    const handleProfileClick = () => {
        navigate(ROUTES.PROFILE);
    };

    const handleChangePassword = async () => {
        if (!oldPassword || !newPassword) {
            setMessage("Пожалуйста, заполните оба поля.");
            return;
        }

        try {
            const response = await api.api.changeUserInfoUpdate(
                {
                    old_password: oldPassword,
                    new_password: newPassword,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.data) {
                setMessage("Пароль успешно изменен.");
                setOldPassword("");
                setNewPassword("");
            }
        } catch (err: any) {
            if (err.response?.data?.message) {
                setMessage(err.response.data.message);
            } else {
                setMessage("Произошла ошибка при смене пароля.");
            }
        }
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
            <div className="container-profile">
                <h1 className="change-pass-h1">В личном кабинете есть возможность смены пароля</h1>
                <div className="change-password-form">
                    <input
                        type="password"
                        placeholder="Старый пароль"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        className="password-input"
                    />
                    <input
                        type="password"
                        placeholder="Новый пароль"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="password-input"
                    />
                    <button
                        className="change-password-button"
                        onClick={handleChangePassword}
                    >
                        Сменить пароль
                    </button>
                    {message && <p className="message">{message}</p>}
                </div>
            </div>
        </>
    );
};
