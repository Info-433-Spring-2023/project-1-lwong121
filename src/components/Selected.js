import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { getDatabase, ref, onValue } from 'firebase/database';
import { Tags } from './Tags';
import { ReviewsSection } from './ReviewsSection.js';

export function SelectedGamePage(props) {
  const { currentUser, allGameData } = props;
  const urlParams = useParams();
  const gameName = urlParams.selectedGame;
  let gameData = allGameData.filter((game) => {
    return game.name === gameName;
  });
  gameData = gameData[0];
  const db = getDatabase();

  return (
    <div>
      <GameInfo gameData={gameData} currentUser={currentUser} db={db} />
      <ReviewsSection currentUser={currentUser} gameData={gameData} db={db} />
    </div>
  )
}

export function GameInfo(props) {
  const { gameData, currentUser, db } = props;

  let startingTagState = 'playing';
  const [tagSelected, setTagState] = useState(startingTagState);
  const genresArr = gameData.genres.split(";");
  let genres = genresArr[0];
  for (let i = 1; i < genresArr.length; i++) {
    genres += ", " + genresArr[i];
  }
  if (currentUser) {
    const dbRef = ref(db, 'gameLists/' + currentUser.displayName + "/" + gameData.appid);
    onValue(dbRef, (snapshot) => {
      const data = snapshot.val();
      startingTagState = (data);
    });
  }

  return (
    <div>
      <div className="container mobile">
        <div className="card">
          <img src={gameData.img} alt={gameData.name}></img>
        </div>
      </div>
      <div className="container">
        <div className="card desktop">
          <img src={gameData.img} alt={gameData.name}></img>
        </div>
        <div className="gamedata">
          <div className="border">
            <h2 className="game-header">{gameData.name}</h2>
          </div>
          <h3>Publisher: {gameData.publisher}</h3>
          <h3>Summary: </h3>
          <p>{gameData.description}</p>
          <h3>Genres: {genres}</h3>
          <h3>Tags:</h3>
          {currentUser &&
            <Tags responsive='false' userID={currentUser.displayName} gameID={gameData.appid}
              tagState={tagSelected} setFunc={setTagState} />}
        </div>
      </div>
    </div>
  );
}