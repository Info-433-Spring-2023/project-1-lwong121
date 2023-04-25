import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ReviewsSection } from "./ReviewsSection";
import HUGE_GAME_DATA from '../data/games.json';
import TEST_USER from './testuser.json';
import { getDatabase, connectDatabaseEmulator} from "firebase/database";
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

const app = initializeApp(firebaseConfig);
const db = getDatabase();
if (location.hostname === "localhost") {
  connectDatabaseEmulator(db, "localhost", 9000);
}

const gameName = "Counter-Strike";
const gameData = HUGE_GAME_DATA.find((game) => {
  return game.name === gameName;
});

describe("Unit: Review Forms", () => {
  describe("Render Review", () => {
    test("Check if review rendered", () => {
      const reviewText = "test review";

      render(<ReviewsSection currentUser={TEST_USER} gameData={gameData} db={db} />);

      const formInput = screen.getByRole("textbox");
      userEvent.type(formInput, reviewText);

      userEvent.click(screen.getByRole("button", { name: /submit/i }));

      expect(screen.getByText(reviewText)).toBeInTheDocument();
    })
  }),
    describe("Render Stars", () => {
      test("Check if star rating rendered", () => {
        const starRating = 3;

        render(<ReviewsSection currentUser={TEST_USER} gameData={gameData} db={db} />);

        const formStars = screen.getAllByRole("button", { name: 'reviewStar' });
        userEvent.click(formStars[starRating]);

        userEvent.click(screen.getByRole("button", { name: /submit/i }));

        const reviewStars = screen.getAllByRole("img", { name: 'reviewStar' });
        for (let i = 0; i < reviewStars.length; i++) {
          if (i <= starRating) {
            expect(reviewStars[i].classList).toContain("star-selected");
          } else {
            expect(reviewStars[i].classList).not.toContain("star-selected");
          }
        }
      })
    }),
    describe("Don't Render Empty Review", () => {
      test("Check that empty review did not render", () => {
        render(<ReviewsSection currentUser={TEST_USER} gameData={gameData} db={db} />);

        userEvent.click(screen.getByRole("button", { name: /submit/i }));

        expect(screen.queryByTestId("reviewCard")).toBeNull();
      })
    }),
    describe("Clear Content After Submit", () => {
      test("Check that the textbox is cleared after submit", () => {
        const reviewText = "test review clears";

        render(<ReviewsSection currentUser={TEST_USER} gameData={gameData} db={db} />);

        const formInput = screen.getByRole("textbox");
        userEvent.type(formInput, reviewText);

        userEvent.click(screen.getByRole("button", { name: /submit/i }));

        expect(screen.getByText(reviewText)).toBeInTheDocument();

        expect(screen.queryByDisplayValue(reviewText)).not.toBeInTheDocument();
      })
    }),
    describe("Correct Average Rating Calculation", () => {
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
    }),
    describe("No Reviews Displayed", () => {
      test("Check that no reviews are displayed when there are no reviews", () => {
        render(<ReviewsSection currentUser={TEST_USER} gameData={gameData} db={db} />);

        expect(screen.queryByTestId("reviewCard")).toBeNull();
        expect(screen.getByText("Sorry, no reviews yet...")).toBeInTheDocument();
      })
    }),
    describe("Like a Review", () => {
      test("Check that liking a review add one like", () => {
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

        userEvent.click(likeBtn);

        expect(getNumLikes()).toEqual(1);
      })
    }),
    // attempt to test the missing lines (17-25 in ReviewsSection.js for the
    // finalCleanup() method mentioned in the code coverage report
    describe("Test finalCleanup() function", () => {
      test("Test that the finalCleanup() when page is rendered", () => {
        // attempt 1:
        // const fn = jest.fn(() => {
        //   const [reviewsHistory, setReviewsHistory] = useState([]);
        //   useEffect(() => {
        //     setReviewsHistory([{
        //       "game": "Counter-Strike",
        //       "likes": 0,
        //       "rating": 3,
        //       "review": "test review",
        //       "timestamp": 1682320097887,
        //       "userEmail": "unittestuser@email.com",
        //       "userId": "EHEpbYv3HvfwzUAC8AaCsZgaSHq1",
        //       "userName": "unittestuser",
        //       "firebaseKey": "-NTm4sCQb-JZfILJI0he"
        //     }]);
        //   });
        //   return reviewsHistory;
        // });

        // attempt 2
        let cleanupFunc;

        const spy = jest.spyOn(React, "useEffect").mockImplementationOnce(func => {
          cleanupFunc = func;
        });

        const reviewsSection = render(<ReviewsSection currentUser={TEST_USER} gameData={gameData} db={db} />);
        expect(spy).toHaveBeenCalled(); // but how do I test the finalCleanup() function?!

        // attempt 3
        // const reviewText = "test review";

        // const { unmount } = render(<ReviewsSection currentUser={TEST_USER} gameData={gameData} db={db} />);

        // const formInput = screen.getByRole("textbox");
        // userEvent.type(formInput, reviewText);

        // userEvent.click(screen.getByRole("button", { name: /submit/i }));

        // console.log(screen.getByText(reviewText));
        // expect(screen.getByText(reviewText)).toBeInTheDocument();
        // unmount();
      })
    })
})