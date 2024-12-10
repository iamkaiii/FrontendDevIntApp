export const ROUTES = {
    START: "/",
    HOME: "/products",
    REGISTER: "/register",
    AUTHORIZATION: "/auth",
    PROFILE: "/profile",
    BASKET: "/basket"
  }
  export type RouteKeyType = keyof typeof ROUTES;
  export const ROUTE_LABELS: {[key in RouteKeyType]: string} = {
    START: "Старт",
    HOME: "Молочные продукты",
    REGISTER: "Страница регистрации",
    AUTHORIZATION: "Страница авторизации",
    PROFILE: "Профиль",
    BASKET: "Заявка"
  };