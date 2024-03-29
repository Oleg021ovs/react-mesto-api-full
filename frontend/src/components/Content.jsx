import { useState, useEffect } from "react";
import api from "../utils/Api";
import Main from "./Main";
import EditProfilePopup from "./EditProfilePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import AddPlacePopup from "./AddPlacePopup";
import ImagePopup from "./ImagePopup";
import { CurrentUserContext } from "../contexts/CurrentUserContext";

function Content({ userLoggedIn }) {
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [imagePopupOpen, setImagePopupOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState({});
  const [currentUser, setCurrentUser] = useState({});
  const [cards, setCards] = useState([]);

  const token = localStorage.getItem("token");
//лайк карточки
  function handleCardLike(card) {
    // Снова проверяем, есть ли уже лайк на этой карточке
    const isLiked = card.likes.some((i) => i._id === currentUser._id);

    // Отправляем запрос в API и получаем обновлённые данные карточки
    api
      .changeLikeCardStatus(card._id, !isLiked, token)
      .then((newCard) => {
        setCards((state) =>
          state.map((item) => (item._id === card._id ? newCard : item))
        );
      })
      .catch((err) => {
        console.log(err);
      });
  }
//удаление карточки
  function handleDeleteCard(card) {
    api
      .deleteCard(card._id, token)
      .then(() => {
        setCards((state) => state.filter((item) => item._id !== card._id));
      })
      .catch((err) => {
        console.log(err);
      });
  }
//запрос информации и данных пользователя и карточек с сервера по токену
  useEffect(() => {
    if (userLoggedIn) {
      console.log(userLoggedIn);
      Promise.all([api.getProfile(token), api.getInitialCards(token)])
        .then(([res, cards]) => {
          setCurrentUser(res);
          setCards(cards);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [userLoggedIn, token]);

  // попап аватар
  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true);
  }
  // попап профиля
  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true);
  }
  // попап добавление карточки
  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true);
  }

  // открытие попап карточки
  function handleCardClick({ name, link }) {
    setSelectedCard({ name, link });
    setImagePopupOpen(true);
  }

  //закрытие попапов на крестик
  function closeAllPopups() {
    setIsEditAvatarPopupOpen(false);
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setImagePopupOpen(false);
    setSelectedCard({});
  }
// изменить пользователя
  function handleEditUser({ name, about }) {
    api
      .editProfile(name, about, token)
      .then((res) => {
        setCurrentUser(res);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
      });
  }
// добавить карточку
  function handleAddPlaceSubmit({ name, link }) {
    api
      .addCard(name, link, token)
      .then((newCard) => {
        setCards([newCard, ...cards]);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
      });
  }
// изменить аватар пользователя
  function handleUpdateAvatar({ avatar }) {
    api
      .addAvatar(avatar, token)
      .then((res) => {
        setCurrentUser(res);
        closeAllPopups();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="page">
        <>
          <Main
            onEditProfile={handleEditProfileClick}
            onAddPlace={handleAddPlaceClick}
            onEditAvatar={handleEditAvatarClick}
            onCardClick={handleCardClick}
            cards={cards}
            onCardLike={handleCardLike}
            onCardDelete={handleDeleteCard}
          />

          <EditProfilePopup
            isOpen={isEditProfilePopupOpen}
            onClose={closeAllPopups}
            onUpdateUser={handleEditUser}
          />
          <AddPlacePopup
            isOpen={isAddPlacePopupOpen}
            onClose={closeAllPopups}
            onAddPlace={handleAddPlaceSubmit}
          />

          <EditAvatarPopup
            isOpen={isEditAvatarPopupOpen}
            onClose={closeAllPopups}
            onUpdateAvatar={handleUpdateAvatar}
          />

          <ImagePopup
            card={selectedCard}
            onClose={closeAllPopups}
            isOpen={imagePopupOpen}
          />
        </>
      </div>
    </CurrentUserContext.Provider>
  );
}

export default Content;