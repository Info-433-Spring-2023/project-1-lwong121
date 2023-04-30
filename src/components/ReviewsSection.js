import { useState, useEffect } from 'react';
import {
  ref,
  onValue,
  push as firebasePush,
  set as firebaseSet,
} from 'firebase/database';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar, faHeart } from '@fortawesome/free-solid-svg-icons'

export function ReviewsSection(props) {
  const { gameData, currentUser, db } = props;
  const [reviewsHistory, setReviewsHistory] = useState([]);
  useEffect(() => {
    const allReviewsRef = ref(db, "allReviews");
    const setReviewsHistoryOnRender = onValue(allReviewsRef, (snapshot) => {
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
    return setReviewsHistoryOnRender;
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
        <div>
          <FontAwesomeIcon className="star-selected" icon={faStar} size="lg"></FontAwesomeIcon>
          <p className="average-rating">Overall: {avgRating} out of 5</p>
        </div>
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

export function ReviewBox(props) {
  const { gameData, currentUsers, submitReview } = props;
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(0);
  const handleInputChanges = (event) => {
    event.preventDefault();
    setReviewText(event.target.value);
  }
  const handleSubmit = (event) => {
    event.preventDefault();
    if (reviewText === "" && rating === 0) {
      return;
    }
    submitReview(reviewText, currentUsers, gameData.name, rating);
    setReviewText('');
    setRating(0);
  }
  return (
    <form onSubmit={handleSubmit}>
      <ReviewStars rating={rating} setRating={setRating} />
      <label htmlFor="review">Write your review</label>
      <textarea
        type="textarea"
        id="review"
        rows="6"
        placeholder="Enter a review"
        value={reviewText}
        onChange={handleInputChanges}
        required
      ></textarea>
      <button type="submit" className="btn">Submit</button>
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
      <button type="button" aria-label="reviewStar" className="review-star" key={currIndex} onClick={handleRating} >
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
      <span className="review-star" key={currIndex} >
        <FontAwesomeIcon title="reviewStar" role="img" className={reviewStarClass} icon={faStar} size="lg"></FontAwesomeIcon>
      </span>
    )
  });
  const date = new Date(review.timestamp);
  let timePosted = date.toLocaleString('en-US');
  timePosted = timePosted.split(", ")[0];
  timePosted = timePosted.substring(0, timePosted.length - 4) + timePosted.substring(timePosted.length - 2);
  return (
    <div data-testid="reviewCard" className="review">
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
      {currentUser && <ReactionsSection data-testid="reaction-section" db={db} reviewFirebaseKey={review.firebaseKey} />}
    </div>
  )
}

function ReactionsSection(props) {
  const { db, reviewFirebaseKey } = props;
  const [likes, setLikes] = useState(0);

  const reviewLikesRef = ref(db, "allReviews/" + reviewFirebaseKey + "/likes");

  useEffect(() => {
    let isMounted = true
    onValue(reviewLikesRef, (snapshot) => {
      if (isMounted) {
        const likes = snapshot.val();
        setLikes(likes);
      }
    })
    return () => {
      isMounted = false;
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
      <button role="button" aria-label="likeButton" onClick={likeReview}>
        <FontAwesomeIcon icon={faHeart} size="lg"></FontAwesomeIcon>
      </button>
      <p>&nbsp;{likes}</p>
    </div>
  )
}
