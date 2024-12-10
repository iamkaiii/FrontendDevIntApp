import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ROUTES } from "./modules/Routes";
import { WelcomePage } from './components/WelcomePage';
import { MainPage } from "./components/MainPage"
import { MealPage } from "./components/MealPage";
import { RegisterPage } from "./components/RegisterPage";
import { AuthPage } from "./components/AuthPage";
import { ProfilePage } from "./components/ProfilePage";
import { BasketPage } from "./components/BasketPage"

function App() {
  return (
    <BrowserRouter basename="/FrontendDevIntApp">
    <Routes>
      <Route path={ROUTES.START} index element={<WelcomePage />} />
      <Route path={ROUTES.HOME} index element={<MainPage />} />
      <Route path={`${ROUTES.HOME}/:id`} element={<MealPage />} />
      <Route path={`${ROUTES.REGISTER}`} element={<RegisterPage />} />
      <Route path={`${ROUTES.AUTHORIZATION}`} element={<AuthPage />} />
      <Route path={`${ROUTES.PROFILE}`} element={<ProfilePage />} />
      <Route path={`${ROUTES.BASKET}/:id`} element={<BasketPage />} />
    </Routes>
  </BrowserRouter>
  );  
}

export default App
