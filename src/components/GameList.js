import { Link } from 'react-router-dom';
import { Tags } from './Tags';
import {
  getDatabase,
  query,
  ref,
  onValue,
  orderByKey,
  push as firebasePush,
  set as firebaseSet,
  update as firebaseUpdate,
  get,
  child,

} from 'firebase/database';
import 'firebase/database';
import { useState, useEffect } from 'react';
import { auth } from "./firebase-config";

function GameCards(props) {
  const gameCards = props.gameData.map((game) => {
    return (
      <GameCard key={game.appid} gameData={game} />
    )
  });
  return (
    <div className="container">
      {gameCards}
    </div>
  );
}

export function GameCard(props) {
  return (
    <Link className="card" to={"/selected/" + props.gameData.name} >
      <img src={props.gameData.img} alt={props.gameData.description} />
    </Link>
  )
}

export function MyGames(props) {
  const { games, currentUser } = props;
  const [userGames, setUserGames] = useState([]);
  const db = getDatabase();
  const dbRef = ref(db, 'gameLists');
  useEffect(() => {
    if (currentUser) {
      const path = currentUser.displayName;
      get(child(dbRef, path)).then((snapshot) => {
        const gameIds = [];
        if (snapshot.exists()) {
          snapshot.forEach((child) => {
            gameIds.push(parseInt(child.key));
          });
        }
        const myGames = games.filter(game => {
          return gameIds.includes(game.appid);
        })
        setUserGames(myGames);
      });
    }
  }, []);
  return (
    <div>
      <h2>My Games</h2>
      <GameCards gameData={userGames} />
    </div>
  );
}

export function Suggestions(props) {
  const { gameData } = props;
  const gameSuggestions = [];
  for (let i = 0; i < 10; i++) {
    const randomNum = Math.round(Math.random() * gameData.length);
    gameSuggestions.push(gameData[randomNum])
  }
  return (
    <div>
      <h2>Suggested Games</h2>
      <GameCards gameData={gameSuggestions} />
    </div>
  );
}





export function StatBox({ currentUser }) {
  let db = getDatabase();
  let counts = StatCounter(db, currentUser);
  return (

    <div className="container">
      <div className="big-card" id="stats">
        <div className="stat-cards">
          <div className="scard">
            <div className="num">{counts[0]}</div>
            <div className="desc">{counts[0] == 1 ? 'game' : 'games'} planned</div>
          </div>
          <div className="scard">
            <div className="num">{counts[1]}</div>
            <div className="desc">{counts[1] == 1 ? 'game' : 'games'} playing</div>
          </div>
          <div className="scard">
            <div className="num">{counts[2]}</div>
            <div className="desc">{counts[2] == 1 ? 'game' : 'games'} stopped</div>
          </div>
        </div>
      </div>
    </div>);
}

function StatCounter(db, currentUser) {
  const [planned, setPlanned] = useState(0);
  const [playing, setPlaying] = useState(0);
  const [stopped, setStopped] = useState(0);
  const dbRef = ref(db, 'gameLists');
  let path = "";
  useEffect(() => {
    if (currentUser) {
      path = currentUser.displayName;
      get(child(dbRef, path)).then((snapshot) => {
        if (snapshot.exists()) {
          snapshot.forEach((child) => {
            let value = child.val()
            if (value == 'planned') {
              setPlanned(count => count + 1);
            }
            else if (value == "playing") {
              setPlaying(count => count + 1);
            }
            else if (value == 'stopped') {
              setStopped(count => count + 1);
            }
          });
        }
      });
    }
  }, []);
  return [planned, playing, stopped];
}
