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
                <header>
                    <Link to={ROUTES.START}>
                        <button className="home-button"></button>
                    </Link>
                    <h1>Заказ питания на молочную кухню для детей</h1>
                </header>
                <div className="container">
                    <p className="description">
                        {replaceNewlines(descriptionText)}
                    </p>
                    <Link to={ROUTES.HOME}>
                        <button className="to-home-button">Получить услугу</button>
                    </Link>
                </div>
            </div>
        </>
    );
}
