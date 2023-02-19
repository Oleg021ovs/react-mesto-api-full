import React from "react";
import { Link } from "react-router-dom";

function NavBar({ signOut }) {
  return (
    <nav className="header__NavBar">
      <h2 className="header__email">oo@mail.ru</h2>
      <Link
        to="/sign-in"
        onClick={signOut}
        className="header__btn-link header__btn-NavBar"
      >
        Выйти
      </Link>
    </nav>
  );
}

export default NavBar;

