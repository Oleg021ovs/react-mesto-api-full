import { useState, useEffect, useCallback } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import Register from "./Register";
import Login from "./Login";
import ProtectedRoute from "./ProtectedRoute";
import InfoTooltip from "./InfoTooltip";
import * as Auth from "../utils/Auth.jsx";
import Content from "./Content";

export default function App() {
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [userData, setUserData] = useState({ email: "", _id: "", });
  //console.log(userData, 'userData')
  const [isTooltipOpened, setIsTooltipOpened] = useState(false);
  const [isSuccessTooltipStatus, setIsSuccessTooltipStatus] = useState(false);

  const navigate = useNavigate();

  function closeLoginPopup() {
    setIsTooltipOpened(false);
  }

  // регистрация
  function handleRegister({ email, password }) {
    Auth.register({ email, password })
      .then((res) => {
        setUserData(res.data);
        navigate("/sign-in");
        setIsSuccessTooltipStatus(true);
        setIsTooltipOpened(true);
      })
      .catch((err) => {
        setIsSuccessTooltipStatus(false);
        setIsTooltipOpened(true);
        if (err === "Ошибка: 400")
          return console.log("некорректно заполнено одно из полей");
        console.log(err);
      });
  }

  //авторизация
  function handleLogin({ email, password }) {
    Auth.autorisation({ email, password })
    
      .then((res) => {
        if (res.token) {
          setUserLoggedIn(true);
          localStorage.setItem("token", res.token);
          setUserData({ email: email });
          navigate("/");
        }
      })
      .catch((err) => {
        setIsSuccessTooltipStatus(false);
        setIsTooltipOpened(true);
        if (err === "Ошибка: 400")
          return console.log("не передано одно из полей");
        if (err === "Ошибка: 401")
          return console.log("пользователь с email не найден");
        console.log(err);
      });
  }

 // вход по токену
  const handleCheckToken = useCallback(() => {
    const token = localStorage.getItem("token");
    Auth.checkToken(token)
      .then((res) => {
        if(res) {
          setUserLoggedIn(true);
          setUserData({ email: res.email });
          navigate("/");          
        } else {
          setUserLoggedIn(false);
          navigate("/sign-in");
        }
      })
      .catch((err) => {
        if (err === "Ошибка: 400")
          return console.log(
            "Токен не передан или передан не в том формате"
          );
        if (err === "Ошибка: 401")
          return console.log("Переданный токен некорректен");
        console.log(err);
      });
  }, [navigate]);

  useEffect(() => {
    handleCheckToken()
  }, [handleCheckToken]);

// выход
  function handleSignOut() {
    localStorage.removeItem("token");
    setUserLoggedIn(false);
    setUserData({});
    navigate("/sign-in");
  }

  return (
    <div className="root">
      <div className="page">
        <Header handleSignOut={handleSignOut} userData={userData} />
        
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute
                userLoggedIn={userLoggedIn}
                component={Content}
               
              ></ProtectedRoute>
            }
          />

          <Route
            path="/sign-in"
            element={<Login handleLogin={handleLogin} />}
          />

          <Route
            path="/sign-up"
            element={<Register handleRegister={handleRegister} />}
          />
        </Routes>

        <Footer />

        <InfoTooltip
          success={isSuccessTooltipStatus}
          isOpen={isTooltipOpened}
          onClose={closeLoginPopup}
        />
      </div>
    </div>
  );
}
//App