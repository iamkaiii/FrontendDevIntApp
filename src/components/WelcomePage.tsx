import "./WelcomePage.css";
import { ROUTES } from "../modules/Routes";
import { Link } from "react-router-dom";
import { Container, Row, Carousel, CarouselItem, CarouselControl, CarouselIndicators, CarouselCaption } from "reactstrap";
import { useState } from "react";

// Функция для замены \n на <br />
const replaceNewlines = (text: string) => {
    return text.split('\n').map((line, index) => (
        <span key={index}>
            {line}
            <br />
        </span>
    ));
};

// Данные для карусели
const items = [
    {
        src: "http://127.0.0.1:9000/bmstulab/ekaterina.png",
        altText: "Молочная кухня",
        caption: "Мера соцподдержки по обеспечению специальным питанием семей с детьми",
        fallbackSrc: "/carousel1.jpg"
    },
    {
        src: "http://127.0.0.1:9000/bmstulab/mgtu.png",
        altText: "Молочная кухня",
        caption: "Пользоваться молочной кухней в Москве могут только люди с московской пропиской",
        fallbackSrc: "/carousel2.jpg"
    },
    {
        src: "http://127.0.0.1:9000/bmstulab/devs.png",
        altText: "Молочная кухня",
        caption: "Перед поездкой на молочную кухню подумайте о том, как вы будете забирать питание",
        fallbackSrc: "/carousel3.jpg"
    }
];

export const WelcomePage = () => {
    const descriptionText = `Услуга позволяет самостоятельно 
(минуя кабинет врача):
- заказывать питание на молочной кухне;
- изменять пункт выдачи продуктов;
- управлять графиком получения продуктов питания;
- просматривать информацию о полученной продукции.`;

    const [activeIndex, setActiveIndex] = useState(0);
    const [animating, setAnimating] = useState(false);

    const next = () => {
        if (animating) return;
        const nextIndex = activeIndex === items.length - 1 ? 0 : activeIndex + 1;
        setActiveIndex(nextIndex);
    };

    const previous = () => {
        if (animating) return;
        const nextIndex = activeIndex === 0 ? items.length - 1 : activeIndex - 1;
        setActiveIndex(nextIndex);
    };

    const goToIndex = (newIndex: number) => {
        if (animating) return;
        setActiveIndex(newIndex);
    };

    const slides = items.map((item) => {
        const [imageSrc, setImageSrc] = useState(item.fallbackSrc);

        return (
            <CarouselItem
                onExiting={() => setAnimating(true)}
                onExited={() => setAnimating(false)}
                key={item.src}
            >
                <img
                    src={imageSrc}
                    alt={item.altText}
                    className="carousel-image"
                    onError={() => setImageSrc(item.fallbackSrc)}
                />
                <CarouselCaption
                    captionHeader={item.altText}
                    captionText={item.caption}
                    className="carousel-caption"
                />
            </CarouselItem>
        );
    });

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

                <Container>
                    <Row>
                        <Carousel activeIndex={activeIndex} next={next} previous={previous}>
                            <CarouselIndicators
                                items={items}
                                activeIndex={activeIndex}
                                onClickHandler={goToIndex}
                            />
                            {slides}
                            <CarouselControl
                                direction="prev"
                                directionText="Previous"
                                onClickHandler={previous}
                            />
                            <CarouselControl
                                direction="next"
                                directionText="Next"
                                onClickHandler={next}
                            />
                        </Carousel>
                    </Row>
                </Container>
            </div>
        </>
    );
};
