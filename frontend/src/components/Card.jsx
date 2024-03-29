import { useContext } from "react";
import { CurrentUserContext } from "../contexts/CurrentUserContext";
// карточки
function Card({ card, onCardClick, onCardLike, onCardDelete }) {
  const currentUser = useContext(CurrentUserContext);

  // Определяем, являемся ли мы владельцем текущей карточки
  const isOwn = card.owner._id === currentUser._id;

  // Создаём переменную, которую после зададим в `className` для кнопки удаления
  const cardDeleteButtonClassName = isOwn ? "element__btn-delete" : "";

  // Определяем, есть ли у карточки лайк, поставленный текущим пользователем
  const isLiked = card.likes.some((i) => i._id === currentUser._id);

  // Создаём переменную, которую после зададим в `className` для кнопки лайка
  const cardLikeButtonClassName = isLiked
    ? "elements__like-btn_active"
    : "elements__like-btn";

  function handleClick() {
    onCardClick(card);
  }

  function handleDeleteClick() {
    onCardDelete(card);
  }

  function handleLikeClick() {
    onCardLike(card);
  }

  return (
    <section className="elements__item">
      <img
        className="elements__images"
        src={card.link}
        alt={card.name}
        onClick={handleClick}
      />
      {isOwn && (
        <button
          className={cardDeleteButtonClassName}
          type="button"
          onClick={handleDeleteClick}
        ></button>
      )}

      <div className="elements__group">
        <h2 className="elements__title">{card.name}</h2>

        <div className="elements__like">
          <button
            className={cardLikeButtonClassName}
            onClick={handleLikeClick}
            type="button"
          ></button>
          <span className="elements__like-counter">{card.likes.length}</span>
        </div>
      </div>

    </section>
  );
}

export default Card;
