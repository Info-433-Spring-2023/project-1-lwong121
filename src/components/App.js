import React, {useState} from 'react';
import NavBar from './NavBar';
import { Route, Switch } from 'react-router-dom';
import { LoginPage, Intro } from './Login'
import { IntroSection, InfoCards } from './About';
import { Results } from './Results';
import {SignUpPage} from './SignUp';
import {MyGames, Suggestions, StatBox} from './GameList';
import { SelectedGamePage } from './Selected';
import Footer from './Footer';
import {Tags} from './Tags';
import GAME_DATA from '../data/games-sample.json';
import { auth } from "./firebase-config";
import HUGE_GAME_DATA from '../data/games.json';

export default function App(props) {
  const [selectedGameInfo, setSelectedGameInfo] = useState([]);
  const [currentUser, setCurrentUser] = useState(auth.currentUser);

  auth.onAuthStateChanged((firebaseUser) => {
    setCurrentUser(auth.currentUser);
  });

  return (
    <div>
      <NavBar/>
      <Switch>
        <Route path="/login">
          <div className="login-page">
            <LoginPage />
            <Intro />
          </div>
        </Route>
        <Route path="/about">
          <div className="about-page">
            <IntroSection />
            <InfoCards />
          </div>
        </Route>
        <Route path="/signup">
          <div className="login-page">
            <SignUpPage />
            <Intro />
          </div>
        </Route>
        <Route path="/results">
          <Results games={HUGE_GAME_DATA} />
        </Route>
        <Route exact path={["/gamelist", "/"]}>

          <StatBox currentUser={currentUser} />
          <MyGames games={HUGE_GAME_DATA} currentUser={currentUser} />
          <Suggestions gameData={HUGE_GAME_DATA} setSelectedFunc={setSelectedGameInfo}/>
        </Route>
        <Route path="/selected/:selectedGame">
          <SelectedGamePage allGameData={HUGE_GAME_DATA} currentUser={auth.currentUser}/>
        </Route>
      </Switch>
      <Footer></Footer>
    </div>
  );
}
