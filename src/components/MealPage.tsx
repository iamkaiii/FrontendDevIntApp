import { FC, useEffect, useState } from 'react';
import { ROUTE_LABELS, ROUTES } from '../modules/Routes';
import { getProductByID } from '../modules/ApiProducts';
import { MilkProducts } from '../modules/MyInterface';
import { Link, useParams } from 'react-router-dom';
import { BreadCrumbs } from "../components/BreadCrumbs"

import './MealPage.css';

export const MealPage: FC = () => {
    const [mealInfo, setMealInfo] = useState<MilkProducts>();
    const { id } = useParams();
    let image: string = '';

    useEffect(() => {
        if (id) {
            getProductByID(id)
                .then((result) => {
                    console.log("result");
                    console.log(result);
                    setMealInfo(result);
                });
        }

        if (id) {
            console.log(id);
        }

    }, [id]);

    if (mealInfo?.image_url === undefined || mealInfo?.image_url === "" || !mealInfo?.image_url) {
        image = "../nophoto.png";

    } else {
        image = mealInfo.image_url; 
    }
    


    const replaceNewlines = (text: string) => {
        return text.split('/n').map((line, index) => (
            <span key={index}>
                {line}
                <br />
            </span>
        ));
    };

    return (
        <div className="space1">
            <div className="header1">
                <Link to={ROUTES.START}>
                    <button name="home-button"></button>
                </Link>
            </div>

            <div className="crumbs1">
                <div className="MP_breadcrumbs1">
                        <BreadCrumbs 
                        crumbs={[
                            { label: ROUTE_LABELS.HOME, path: ROUTES.HOME },
                            { label: mealInfo?.meal_info || "Продукт" },
                        ]} 
                        />
            </div>
            </div>
                <div className="card1">
                    <div className="card-image-container1">
                        <img src={image} className="card-image1" alt={mealInfo?.meal_brand} />
                    </div>
                    <div className="card-text1">
                        <p className="title-in-card1">{mealInfo?.meal_info} {mealInfo?.meal_weight}</p>
                        {/* Обернули meal_detail в функцию replaceNewlines */}
                        <p>{mealInfo && replaceNewlines(mealInfo.meal_detail)}</p>
                    </div>
                </div>
        </div>
    );
}
