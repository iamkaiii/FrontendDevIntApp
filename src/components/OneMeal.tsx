import { FC } from "react"
import { MilkProducts } from "../modules/MyInterface"
import "./MainPage.css"

interface OneMilkProduct {
    product : MilkProducts,
    imageClickHandler: () => void;
}

export const OneProduct : FC<OneMilkProduct> = ( {product, imageClickHandler} : OneMilkProduct) => {

    let image : string = ''

    if (!product.image_url) {
        image = "nophoto.png";
    } else {
        image = product.image_url;
    }
    

    return (

        <div className="card">
        <div className="card-image-container">
            <img src={image} className="card-image"></img>
        </div>
        <div className="card-text"> 
            <p className="title-in-card">{product.meal_info}{product.meal_weight}</p> 
            <div className="buttons-in-card">
                <button onClick={() => imageClickHandler()} className="card-button">Подробнее</button> 
            </div>
        </div>
   </div>

    )


}