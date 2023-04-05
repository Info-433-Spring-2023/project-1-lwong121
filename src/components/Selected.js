import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  getDatabase,
  ref,
  onValue,
  push as firebasePush,
  set as firebaseSet,
} from 'firebase/database';
import { Tags } from './Tags';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar, faHeart } from '@fortawesome/free-solid-svg-icons'

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
      <ReviewsSection currentUser={currentUser} gameData={gameData} />
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

export function ReviewsSection(props) {
  const { gameData, currentUser } = props;
  const [reviewsHistory, setReviewsHistory] = useState([]);
  const db = getDatabase();
  useEffect(() => {
    const allReviewsRef = ref(db, "allReviews");
    const finalCleanup = onValue(allReviewsRef, (snapshot) => {
      const reviewsSnapshot = snapshot.val();
      const reviewIds = Object.keys(reviewsSnapshot);
      const allReviews = reviewIds.map((reviewId) => {
        return { ...reviewsSnapshot[reviewId], firebaseKey: reviewId };
      });
      const gameReviews = allReviews.filter((review) => {
        return review.game === gameData.name;
      });
      setReviewsHistory(gameReviews);
    });
    return finalCleanup;
  }, []);

  const submitReview = (reviewText, user, game, rating) => {
    const newReview = {
      userId: user.uid,
      userEmail: user.email,
      userName: user.displayName,
      review: reviewText,
      rating: rating,
      timestamp: Date.now(),
      game: game,
      likes: 0
    }
    const reviewsRef = ref(db, "allReviews");
    firebasePush(reviewsRef, newReview);
    setReviewsHistory([...reviewsHistory, newReview]);
  }

  let totalRating = 0;
  reviewsHistory.forEach((review) => {
    totalRating += review.rating;
  });
  let avgRating = totalRating / reviewsHistory.length;
  avgRating = Math.round(avgRating * 10) / 10;

  let gameReviewsToDisplay = null;
  if (reviewsHistory.length > 0) {
    gameReviewsToDisplay = (
      <div>
        <p>Overall: <FontAwesomeIcon className="star-selected" icon={faStar} size="lg"></FontAwesomeIcon>
          &nbsp;&nbsp;{avgRating} out of 5</p>
        <GameReviews reviewsHistory={reviewsHistory} db={db} currentUser={currentUser} />
      </div>
    )
  } else {
    gameReviewsToDisplay = (
      <div>
        <p>Sorry, no reviews yet...</p>
      </div>
    );
  }

  return (
    <section className="container reviews-section">
      <div>
        <h2>Reviews of {gameData.name}</h2>
        {gameReviewsToDisplay}
      </div>
      {currentUser &&
        <div>
          <h2>What did you think about {gameData.name}?</h2>
          <ReviewBox gameData={gameData} currentUsers={currentUser} submitReview={submitReview} />
        </div>
      }
    </section>
  );
}

function ReviewBox(props) {
  const { gameData, currentUsers, submitReview } = props;
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(0);
  const handleInputChanges = (event) => {
    setReviewText(event.target.value);
  }
  const handleSubmit = (event) => {
    event.preventDefault();
    submitReview(reviewText, currentUsers, gameData.name, rating);
    setReviewText('');
    setRating(0);
  }
  return (
    <form>
      <ReviewStars rating={rating} setRating={setRating} />
      <label htmlFor="review">Write your review</label>
      <textarea
        id="review"
        rows="6"
        placeholder="Enter a review"
        value={reviewText}
        onChange={handleInputChanges}
        required
      ></textarea>
      <button className="btn" onClick={handleSubmit}>Submit</button>
    </form>
  )
}

function ReviewStars(props) {
  const { rating, setRating } = props;
  const reviewStars = [0, 1, 2, 3, 4].map((currIndex) => {
    currIndex += 1;
    let reviewStarClass = "active-star";
    if (rating >= currIndex) {
      reviewStarClass += " star-selected";
    } else {
      reviewStarClass = "active-star";
    }
    const handleRating = (event) => {
      event.preventDefault();
      setRating(currIndex);
    }
    return (
      <button className="review-star" key={currIndex} onClick={handleRating} >
        <FontAwesomeIcon className={reviewStarClass} icon={faStar} size="lg"></FontAwesomeIcon>
      </button>
    )
  });
  return (
    <div>
      {reviewStars}
    </div>
  );
}

function GameReviews(props) {
  const { reviewsHistory, db, currentUser } = props;
  const reviews = reviewsHistory.map((review) => {
    return (
      <Review key={review.timestamp} review={review} db={db} currentUser={currentUser} />
    )
  });
  return (
    <div className="review-board">
      {reviews}
    </div>
  )
}

function Review(props) {
  const { review, db, currentUser } = props;
  const reviewStars = [0, 1, 2, 3, 4].map((currIndex) => {
    currIndex += 1;
    let reviewStarClass = "";
    if (review.rating >= currIndex) {
      reviewStarClass += " star-selected";
    } else {
      reviewStarClass = "";
    }
    return (
      <button className="review-star" key={currIndex} >
        <FontAwesomeIcon className={reviewStarClass} icon={faStar} size="lg"></FontAwesomeIcon>
      </button>
    )
  });
  const date = new Date(review.timestamp);
  let timePosted = date.toLocaleString('en-US');
  timePosted = timePosted.split(", ")[0];
  timePosted = timePosted.substring(0, timePosted.length - 4) + timePosted.substring(timePosted.length - 2);
  return (
    <div className="review">
      <div className="review-main">
        <div className="review-header">
          <div>
            <img className="review-profile" src="../img/profile.png" alt="user profile"></img>
            <div>
              <p>{review.userName}</p>
              {reviewStars}
            </div>
          </div>
          {timePosted}
        </div>
        <p>{review.review}</p>
      </div>
      {currentUser && <ReactionsSection db={db} reviewFirebaseKey={review.firebaseKey} />}
    </div>
  )
}

function ReactionsSection(props) {
  const { db, reviewFirebaseKey } = props;
  const [likes, setLikes] = useState(0);

  const reviewLikesRef = ref(db, "allReviews/" + reviewFirebaseKey + "/likes");

  useEffect(() => {
    onValue(reviewLikesRef, (snapshot) => {
      const likes = snapshot.val();
      setLikes(likes);
    })
    return () => {
      setLikes(0);
    }
  }, [])

  const likeReview = () => {
    const updatedLikes = likes + 1;
    firebaseSet(reviewLikesRef, updatedLikes);
    setLikes(updatedLikes);
  }
  return (
    <div className="reactions-section">
      <button onClick={likeReview}>
        <FontAwesomeIcon icon={faHeart} size="lg"></FontAwesomeIcon>
      </button>
      <p>&nbsp;{likes}</p>
    </div>
  )
}
