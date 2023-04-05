import { Link, NavLink } from 'react-router-dom';
import { useState } from 'react';
import {
  signOut,
} from "firebase/auth";
import { auth } from "./firebase-config";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserCircle, faInfoCircle, faBars, faTimes } from '@fortawesome/free-solid-svg-icons'

export default function NavBar() {
  const [isMenuOpen, setisMenuOpen] = useState(false);
  const [loginText, setLogInText] = useState('Login');
  const [loginDest, setLogInDest] = useState('/login');

  auth.onAuthStateChanged((firebaseUser) => {
    if (firebaseUser) {
      setLogInText('Log Out');
      setLogInDest('#');
    }
    else {
      setLogInText('Login');
      setLogInDest('/login');
    }
  });

  let navToRender = null;
  if (isMenuOpen) {
    navToRender = (
      <CollapsedNav isMenuOpenCallback={setisMenuOpen} loginText={loginText} loginDest={loginDest} />
    );
  } else {
    navToRender = (
      <DefaultNav isMenuOpenCallback={setisMenuOpen} loginText={loginText} loginDest={loginDest} />
    );
  }

  return (
    <header>
      <h1><Link to="/gamelist">MGL</Link></h1>
      <SearchNav />
      {navToRender}
    </header>
  )
};

// Search bar
// Can search for users or games
function SearchNav() {
  const [options, setOptions] = useState({ value: 'games' });

  const handleChange = function (event) {
    setOptions({ value: event.target.value });
  }

  const searchPlaceholder = 'Search for ' + options.value + '..';
  let queryParams = '';
  if (options.value === 'games') {
    queryParams = 'g';
  } else {
    queryParams = 'u';
  }
  return (
    <div className="nav-search-container">
      <form className="nav-search" action="/results">
        <label className="nav-search-label" htmlFor={queryParams}>Search for {searchPlaceholder}: </label>
        <input className="nav-search-input" name={queryParams} placeholder={searchPlaceholder}
          aria-label="Search bar" autoComplete="off" />
      </form>
      <label className="nav-search-option" htmlFor="search-option">Pick a search option:</label>
      <select className="nav-search-option-button" name="search-option" onChange={handleChange}>
        <option value="games">Games</option>
        <option value="users">Users</option>
      </select>
    </div>
  );
}

function DefaultNav(props) {
  const { isMenuOpenCallback, loginText, loginDest } = props;

  const openMenu = () => {
    isMenuOpenCallback(true);
  }
  return (
    <nav className="default-nav">
      <FontAwesomeIcon className="hamburger-menu" onClick={openMenu} role="button" icon={faBars} size="2x" aria-label="navigation menu"></FontAwesomeIcon>
      <div className="nav-icons">
        <NavLink to="/gamelist"><FontAwesomeIcon className="nav-icon" icon={faUserCircle} size="lg" aria-label="user game list" /></NavLink>
        <NavLink to="/about"><FontAwesomeIcon className="nav-icon" icon={faInfoCircle} size="lg" aria-label="about My Game List" /></NavLink>
        <Link className="btn" to={loginDest} onClick={logout}>
          {loginText}
        </Link>
      </div>
    </nav>
  );
}

function CollapsedNav(props) {
  const { isMenuOpenCallback, loginText, loginDest } = props;
  const closeMenu = () => {
    isMenuOpenCallback(false);
  }
  const closeMenuAndLogout = () => {
    closeMenu();
    logout();
  }
  return (
    <nav className="menu-nav">
      <FontAwesomeIcon className="close-menu" onClick={closeMenu} icon={faTimes} size="2x" aria-label="close menu" role="button"></FontAwesomeIcon>
      <div>
        <NavLink to="/gamelist" onClick={closeMenu}><FontAwesomeIcon className="nav-icon" icon={faUserCircle} size="lg" aria-label="user game list" /> My Games</NavLink>
        <NavLink to="/about" onClick={closeMenu}><FontAwesomeIcon className="nav-icon" icon={faInfoCircle} size="lg" aria-label="about My Game List" /> About</NavLink>
        <Link className="btn" to={loginDest} onClick={closeMenuAndLogout}>{loginText}</Link>
      </div>
    </nav>
  );
}

function logout() {
  signOut(auth).catch(err => console.log(err));
}
