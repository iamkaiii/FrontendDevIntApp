export const ROUTES = {
    START: "/",
    HOME: "/milkkitchen",
  }
  export type RouteKeyType = keyof typeof ROUTES;
  export const ROUTE_LABELS: {[key in RouteKeyType]: string} = {
    START: "Старт",
    HOME: "Молочные продукты",
  };