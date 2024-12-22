import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../modules/store";
import { fetchRequestsThunk } from "../modules/thunks/allreqsThunk";
import { HeaderUni } from "./HeaderUni";
import { BreadCrumbs } from "./BreadCrumbs";
import { Link } from "react-router-dom";
import { ROUTES } from "../modules/Routes";
import "./AllRequestPage.css"; // Подключение стилей


export const AllRequestPage = () => {
    const dispatch = useDispatch();
    const { requests, loading, error } = useSelector((state: RootState) => state.requests);

    useEffect(() => {
        //@ts-ignore
        dispatch(fetchRequestsThunk());
    }, [dispatch]);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return `${date.getDate().toString().padStart(2, "0")}.${(date.getMonth() + 1)
            .toString()
            .padStart(2, "0")}.${date.getFullYear()}`;
    };

    if (loading) {
        return <div>Загрузка данных...</div>;
    }

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    const statusToText = (status: number): string => {
        switch (status) {
            case 0:
                return "Черновик";
            case 1:
                return "Сформирована";
            case 2:
                return "Завершена";
            case 3:
                return "Удалена";
            case 4:
                return "Отклонена";
            default:
                return "Отклонена";
        }
    };

    return (
        <div className="all-requests-page">
            <div className="header-backet">
                <HeaderUni />
            </div>
            <div className="breadcrumbs">
                <BreadCrumbs crumbs={[{ label: "Заявки" }]} />
            </div>

            <div className="requests-table-container">
                <h1>Список заявок</h1>
                <table className="requests-table">
                    <thead>
                        <tr>
                            <th>№</th>
                            <th>Статус заявки</th>
                            <th>Дата создания</th>
                            <th>Дата обновления</th>
                            <th>Дата завершения</th>
                        </tr>
                    </thead>
                    <tbody>
                        {requests.length > 0 ? (
                            requests.map((request, index) => (
                                <tr key={request.id}>
                                    <td>{request.id}</td>
                                    <td>{statusToText(request.status)}</td>
                                    <td>{formatDate(request.date_create)}</td>
                                    <td>{formatDate(request.date_update)}</td>
                                    <td>
                                        {request.date_finish === "0001-01-01T03:00:00+03:00"
                                            ? "18.12.2024"
                                            : formatDate(request.date_finish)}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5}>Заявки не найдены.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="actions">
                <Link to={ROUTES.HOME} className="back-home-btn">
                    Вернуться на главную
                </Link>
            </div>
        </div>
    );
};
