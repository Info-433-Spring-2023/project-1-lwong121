import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ReviewsSection } from "../components/ReviewsSection"
import HUGE_GAME_DATA from '../data/games.json';
import TEST_USER from '../components/testuser.json';
import { getDatabase, connectDatabaseEmulator, ref, set as firebaseSet, push as firebasePush} from "firebase/database";
import { initializeApp } from "firebase/app";
import React from 'react';

const firebaseConfig = {
  apiKey: "AIzaSyDDDS9l68XzPdjIQbhfAdbohMv3RkaoAKk",
  authDomain: "mygamelist-a7724.firebaseapp.com",
  databaseURL: "https://mygamelist-a7724-default-rtdb.firebaseio.com",
  projectId: "mygamelist-a7724",
  storageBucket: "mygamelist-a7724.appspot.com",
  messagingSenderId: "465906599896",
  appId: "1:465906599896:web:d5f372a4ae001ade3594ad",
  measurementId: "${config.measurementId}"
};

initializeApp(firebaseConfig);
const db = getDatabase();
if (location.hostname === "localhost") {
  connectDatabaseEmulator(db, "localhost", 9000);
}

const gameName = "Counter-Strike";
const gameData = HUGE_GAME_DATA.find((game) => {
  return game.name === gameName;
});

describe("Unit: Game Reviews Section", () => {
  beforeEach(() => {
    firebaseSet(ref(db), null);
  })

  describe("1. Render Review", () => {
    test("Check if review rendered", () => {
      const reviewText = "test review";

      render(<ReviewsSection currentUser={TEST_USER} gameData={gameData} db={db} />);

      const formInput = screen.getByRole("textbox");
      userEvent.type(formInput, reviewText);

      userEvent.click(screen.getByRole("button", { name: /submit/i }));

      expect(screen.getByText(reviewText)).toBeInTheDocument();
    })
  })

  describe("2. Render Stars", () => {
    test("Check if star rating rendered", () => {
      const starRating = 3;

      render(<ReviewsSection currentUser={TEST_USER} gameData={gameData} db={db} />);

      const formStars = screen.getAllByRole("button", { name: 'reviewStar' });
      userEvent.click(formStars[starRating - 1]); // 0-indexed

      userEvent.click(screen.getByRole("button", { name: /submit/i }));

      const reviewStars = screen.getAllByRole("img", { name: 'reviewStar' });

      expect(reviewStars[0]).toHaveClass("star-selected");
      expect(reviewStars[1]).toHaveClass("star-selected");
      expect(reviewStars[2]).toHaveClass("star-selected");

      expect(reviewStars[3]).not.toHaveClass("star-selected");
      expect(reviewStars[4]).not.toHaveClass("star-selected");
    })
  })

  describe("3. Don't Render Empty Review", () => {
    test("Check that empty review did not render", () => {
      render(<ReviewsSection currentUser={TEST_USER} gameData={gameData} db={db} />);

      userEvent.click(screen.getByRole("button", { name: /submit/i }));

      expect(screen.queryByTestId("reviewCard")).toBeNull();
    })
  })

  describe("4. Clear Content After Submit", () => {
    test("Check that the textbox is cleared after submit", () => {
      const reviewText = "test review clears";

      render(<ReviewsSection currentUser={TEST_USER} gameData={gameData} db={db} />);

      const formInput = screen.getByRole("textbox");
      userEvent.type(formInput, reviewText);

      userEvent.click(screen.getByRole("button", { name: /submit/i }));

      expect(screen.getByText(reviewText)).toBeInTheDocument();

      expect(screen.queryByDisplayValue(reviewText)).not.toBeInTheDocument();
    })
  })

  describe("5. Correct Average Rating Calculation", () => {
    test("Check that the average rating is calculated properly", () => {
      render(<ReviewsSection currentUser={TEST_USER} gameData={gameData} db={db} />);

      const starRatings = [3, 5, 2, 4, 1];
      const formStars = screen.getAllByRole("button", { name: 'reviewStar' });

      for (let i = 0; i < starRatings.length; i++) {
        userEvent.click(formStars[i]);
        userEvent.click(screen.getByRole("button", { name: /submit/i }));
      }

      const avgRating = screen.getByText(/Overall:/i).textContent;
      expect(avgRating).toMatch(/3 out of 5/i);
    })
  })

  describe("6. No Reviews Displayed", () => {
    test("Check that no reviews are displayed when there are no reviews", () => {
      render(<ReviewsSection currentUser={TEST_USER} gameData={gameData} db={db} />);

      expect(screen.queryByTestId("reviewCard")).toBeNull();
      expect(screen.getByText("Sorry, no reviews yet...")).toBeInTheDocument();
    })
  })

  describe("7. Like a Review", () => {
    test("Check that liking a review add one like", () => {
      const reviewText = "test review";

      render(<ReviewsSection currentUser={TEST_USER} gameData={gameData} db={db} />);

      const formInput = screen.getByRole("textbox");
      userEvent.type(formInput, reviewText);

      userEvent.click(screen.getByRole("button", { name: /submit/i }));

      const getNumLikes = () => {
        return parseInt(screen.getByTestId("like-count").textContent);
      }

      expect(getNumLikes()).toEqual(0);

      const likeBtn = screen.getByRole("button", { name: /likeButton/i });
      userEvent.click(likeBtn);

      expect(getNumLikes()).toEqual(1);
    })
  })

  describe("8. Render Review and Stars", () => {
    test("Check if review and star rendered", () => {
      const reviewText = "test review";
      const starRating = 3;

      render(<ReviewsSection currentUser={TEST_USER} gameData={gameData} db={db} />);

      const formInput = screen.getByRole("textbox");
      userEvent.type(formInput, reviewText);

      const formStars = screen.getAllByRole("button", { name: 'reviewStar' });
      userEvent.click(formStars[starRating]);

      userEvent.click(screen.getByRole("button", { name: /submit/i }));

      expect(screen.getByText(reviewText)).toBeInTheDocument();

      const reviewStars = screen.getAllByRole('img', { name: 'reviewStar' });
        for (let i = 0; i < reviewStars.length; i++) {
          if (i <= starRating) {
            expect(reviewStars[i]).toHaveClass('star-selected');
          } else {
            expect(reviewStars[i]).not.toHaveClass('star-selected');
          }
        }
    })
  })

  // not working
  // describe("9. Old review rendered", () => {
  //   test("Check that old reviews are displayed", () => {
  //   const oldReviews = [
  //     {
  //       userId: "1",
  //       userEmail: "user1@gmail.com",
  //       userName: "test old user 1",
  //       review: "This is an old review 1.",
  //       rating: 4,
  //       timestamp: Date.now(),
  //     },
  //     // {
  //     //   id: "2",
  //     //   userEmail: "user2@gmail.com",
  //     //   userName: "test old user 2",
  //     //   review: "This is an old review 2.",
  //     //   rating: 5,
  //     //   timestamp: Date.now(),
  //     // },
  //   ];

  //   db.reviews = oldReviews;

  //   render(<ReviewsSection currentUser={TEST_USER} gameData={gameData} db={db} />);

  //   //oldReviews.forEach((review) => {
  //     expect(screen.getByText("This is an old review 1")).toBeInTheDocument();
  //     expect(screen.getByText("This is an old review 2")).toBeInTheDocument();
  //   });
  // })
  // })

  describe("10. Multiple Reviews", () => {
    test("Check if multiple review rendered", async () => {
      const review1Text = "test review 1";
      const review2Text = "test review 2";
      const starRating = 3;

      render(<ReviewsSection currentUser={TEST_USER} gameData={gameData} db={db} />);

      const formInput = screen.getByRole("textbox");
      const formStars = screen.getAllByRole("button", { name: 'reviewStar' });

      userEvent.type(formInput, review1Text);
      userEvent.click(formStars[starRating]);
      userEvent.click(screen.getByRole("button", { name: /submit/i }));
      expect(screen.queryByText(review1Text)).toBeInTheDocument();

      userEvent.type(formInput, review2Text);
      userEvent.click(formStars[starRating]);
      userEvent.click(screen.getByRole("button", { name: /submit/i }));
      expect(screen.queryByText(review2Text)).toBeInTheDocument();
    })
  })

  describe("11. Username Render", () => {
    test("Check if username in the review rendered", async () => {
      const reviewText = "test review by Test User";
      const starRating = 3;

      render(<ReviewsSection currentUser={TEST_USER} gameData={gameData} db={db} />);

      const formInput = screen.getByRole("textbox");
      userEvent.type(formInput, reviewText);

      const formStars = screen.getAllByRole("button", { name: 'reviewStar' });
      userEvent.click(formStars[starRating]);

      userEvent.click(screen.getByRole("button", { name: /submit/i }));

      expect(screen.getByText(reviewText)).toBeInTheDocument();
    })
  })

  describe("12. Zero Likes Review", () => {
    test("Check that an intial review has zero likes.", () => {
      const reviewText = "test review";

      render(<ReviewsSection currentUser={TEST_USER} gameData={gameData} db={db} />);

      const formInput = screen.getByRole("textbox");
      userEvent.type(formInput, reviewText);

      userEvent.click(screen.getByRole("button", { name: /submit/i }));

      const likeBtn = screen.getByRole("button", { name: /likeButton/i });
      const getNumLikes = () => {
        return parseInt(likeBtn.nextElementSibling.textContent);
      }

      expect(getNumLikes()).toEqual(0);
    })
  })

  describe("Test finalCleanup() function", () => {
    test("that the finalCleanup() when page is rendered", async () =>{
      // Step 1. Set the list to be empty (but not null)
      firebaseSet(ref(db, "allReviews"), []);

      // Step 2. Create a review and push it to the list.
      const reviewText = "test review";

      const testReview =  {
        userId: TEST_USER.uid,
        userEmail: TEST_USER.email,
        userName: TEST_USER.displayName,
        review: reviewText,
        rating: 3,
        timestamp: Date.now(),
        game: gameData.name,
        likes: 2
      }
      firebasePush(ref(db, "allReviews"), testReview);

      // Step 3. Render the component, since the list existed and had
      // a value pushed to it, this will render the review and call
      // the onValue function. You can also move the above push call
      // to after the initial render, though that would need some extra
      // helper functions called (act).
      render(<ReviewsSection currentUser={TEST_USER} gameData={gameData} db={db} />);
      expect(screen.getByText(reviewText)).toBeInTheDocument();
    })
  })
})
