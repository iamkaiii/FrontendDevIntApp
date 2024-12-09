import "./WelcomePage.css";
import { ROUTES } from "../modules/Routes";
import { Link } from "react-router-dom";

// Функция для замены \n на <br />
const replaceNewlines = (text: string) => {
    return text.split('\n').map((line, index) => (
        <span key={index}>
            {line}
            <br />
        </span>
    ));
};

export const WelcomePage = () => {
    const descriptionText = `Услуга позволяет самостоятельно 
(минуя кабинет врача):
- заказывать питание на молочной кухне;
- изменять пункт выдачи продуктов;
- управлять графиком получения продуктов питания;
- просматривать информацию о полученной продукции.`;

    return (
        <>
            <div className="space">
                <div className="header-welcome">
                    <Link to={ROUTES.START}>
                        <button className="home-button"></button>
                    </Link>
                    <Link to={ROUTES.HOME} className="no-underline">
                        <h2 className="h1-welcome">Продукты</h2>
                    </Link>
                </div>
                <div className="container">
                    <p className="description">
                        {replaceNewlines(descriptionText)}
                    </p>
                </div>
            </div>
        </>
    );
}
