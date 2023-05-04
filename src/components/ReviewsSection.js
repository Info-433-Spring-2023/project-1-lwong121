// use ref when creating database reference
import { useState, useEffect } from "react";
import { ref, onValue, push as firebasePush, set as firebaseSet } from "firebase/database";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faStar, faHeart } from "@fortawesome/free-solid-svg-icons"

const NUM_STARS = 5;

export function ReviewsSection(props) {
  const { gameData, currentUser, db } = props;
  const [reviewsHistory, setReviewsHistory] = useState([]);
  useEffect(() => {
    const allReviewsRef = ref(db, "allReviews");

    // onValue is used to retrieve data from Firebase
    const setReviewsHistoryOnChange = onValue(allReviewsRef, (snapshot) => {
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

    return setReviewsHistoryOnChange;
  }, [gameData, db]);

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

    // using firebasePush to add data onto firebase database
    firebasePush(reviewsRef, newReview);
    setReviewsHistory([...reviewsHistory, newReview]);
  }

  return (
    <section className="container reviews-section">
      <GameReviewsSection reviewsHistory={reviewsHistory} db={db} currentUser={currentUser} />
      {currentUser &&
        <div>
          <h2>What did you think about {gameData.name}?</h2>
          <ReviewForm gameData={gameData} currentUsers={currentUser} submitReview={submitReview} />
        </div>
      }
    </section>
  );
}

function getAverageRating(reviewsHistory) {
  let totalRating = 0;
  reviewsHistory.forEach((review) => {
    totalRating += review.rating;
  });

  let avgRating = totalRating / reviewsHistory.length;
  avgRating = Math.round(avgRating * 10) / 10;

  return avgRating;
}

function GameReviewsSection(props) {
  const { reviewsHistory, db, currentUser } = props;

  let gameReviewsToDisplay = null;
  if (reviewsHistory.length > 0) {
    gameReviewsToDisplay = (
      <div>
        <div>
          <FontAwesomeIcon className="star-selected" icon={faStar} size="lg"></FontAwesomeIcon>
          <p className="average-rating">
            Overall: {getAverageRating(reviewsHistory)} out of {NUM_STARS}
          </p>
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
    <div>
        <h2>Reviews</h2>
        {gameReviewsToDisplay}
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

function formatReviewTimePosted(timeStamp) {
  const options = {year:"2-digit", month:"2-digit", day:"2-digit"};
  const timePosted = new Date(timeStamp).toLocaleString("en-US", options);
  return timePosted;
}

function Review(props) {
  const { review, db, currentUser } = props;

  return (
    <div data-testid="reviewCard" className="review">
      <div className="review-main">
        <ReviewHeader review={review} />
        <p>{review.review}</p>
      </div>
      {currentUser &&
      <ReactionsSection
        data-testid="reaction-section"
        db={db}
        reviewFirebaseKey={review.firebaseKey} />}
    </div>
  )
}

function ReviewHeader(props) {
  const { review } = props;

  return (
    <div className="review-header">
      <div>
        <img className="review-profile" src="../img/profile.png" alt="user profile"></img>
        <div>
          <p>{review.userName}</p>
          <ReviewCardStars review={review} />
        </div>
      </div>
      {formatReviewTimePosted(review.timestamp)}
    </div>
  )
}

function ReviewCardStars(props) {
  const { review } = props;

    const reviewCardStars = [...Array(NUM_STARS).keys()].map((currStar) => {
    currStar += 1;
    let reviewStarClass = "";
    if (review.rating >= currStar) {
      reviewStarClass += " star-selected";
    } else {
      reviewStarClass = "";
    }

    return (
      <span className="review-star" key={currStar} >
        <FontAwesomeIcon
          title="reviewStar"
          role="img"
          className={reviewStarClass}
          icon={faStar}
          size="lg">
        </FontAwesomeIcon>
      </span>
    )
  });

  return (
    <div>
      {reviewCardStars}
    </div>
  );
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

    const cleanup = () => {
      isMounted = false;
      setLikes(0);
    };

    return cleanup;
  }, [reviewLikesRef])

  const likeReview = () => {
    const updatedLikes = likes + 1;
    firebaseSet(reviewLikesRef, updatedLikes);
    setLikes(updatedLikes);
  }

  return (
    <div className="reactions-section">
      <button aria-label="likeButton" onClick={likeReview}>
        <FontAwesomeIcon icon={faHeart} size="lg"></FontAwesomeIcon>
      </button>
      <p data-testid="like-count">&nbsp;{likes}</p>
    </div>
  )
}

export function ReviewForm(props) {
  const { gameData, currentUsers, submitReview } = props;
  const [reviewText, setReviewText] = useState("");
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
    setReviewText("");
    setRating(0);
  }

  return (
    <form onSubmit={handleSubmit}>
      <FormReviewStars rating={rating} setRating={setRating} />
      <label htmlFor="review">Write your review</label>
      <textarea
        type="textarea"
        id="review"
        rows="6"
        placeholder="Enter a review"
        value={reviewText}
        onChange={handleInputChanges}
        required>
      </textarea>
      <button type="submit" className="btn">Submit</button>
    </form>
  )
}

function FormReviewStars(props) {
  const { rating, setRating } = props;

  const reviewStars = [...Array(NUM_STARS).keys()].map((currIndex) => {
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
      <button type="button"
        aria-label="reviewStar"
        className="review-star"
        key={currIndex}
        onClick={handleRating}>
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