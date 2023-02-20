class Api {
  constructor({ baseUrl, headers }) {
    // тело конструктора
    this._baseUrl = baseUrl;
    this._headers = headers;
  }

  _checkResponse(res) {
    // тут проверка ответа
    if (res.ok) {
      return res.json();
    }
    return Promise.reject(`Ошибка ${res.status}`);
  }

  getProfile(token) {
    return fetch(`${this._baseUrl}/users/me`, {
      headers: {
        headers: this._headers,
        authorization: `Bearer ${token}`,
      },
    }).then(this._checkResponse);
  }

  getInitialCards(token) {
    return fetch(`${this._baseUrl}/cards`, {
      headers: {
        headers: this._headers,
        authorization: `Bearer ${token}`,
      },
    }).then(this._checkResponse);
  }

  editProfile(name, about, token) {
    return fetch(`${this._baseUrl}/users/me`, {
      method: "PATCH",
      headers: {
        headers: this._headers,
        authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        about,
      }),
    }).then(this._checkResponse);
  }

  addCard(name, link, token) {
    return fetch(`${this._baseUrl}/cards`, {
      method: "POST",
      headers: {
        headers: this._headers,
        authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        link,
      }),
    }).then(this._checkResponse);
  }

  deleteCard(id, token) {
    return fetch(`${this._baseUrl}/cards/${id}`, {
      method: "DELETE",
      headers: {
        headers: this._headers,
        authorization: `Bearer ${token}`,
      },
    }).then(this._checkResponse);
  }

  changeLikeCardStatus(id, isLiked, token) {
    return isLiked
      ? fetch(`${this._baseUrl}/cards/${id}/likes`, {
          method: "PUT",
          headers: {
            headers: this._headers,
            authorization: `Bearer ${token}`,
          },
        }).then(this._checkResponse)
      : fetch(`${this._baseUrl}/cards/${id}/likes`, {
          method: "DELETE",
          headers: {
            headers: this._headers,
            authorization: `Bearer ${token}`,
          },
        }).then(this._checkResponse);
  }

  addAvatar(avatar, token) {
    return fetch(`${this._baseUrl}/users/me/avatar`, {
      method: "PATCH",
      headers: {
        headers: this._headers,
        authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        avatar,
      }),
    }).then(this._checkResponse);
  }
}

const api = new Api({
  //baseUrl: "http://localhost:3000",
  baseUrl: "https://api.oleg021mesto.nomoredomains.work",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
