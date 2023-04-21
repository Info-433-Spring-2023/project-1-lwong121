import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ReviewsSection, ReviewBox } from "./Selected";
import HUGE_GAME_DATA from '../data/games.json';
import TEST_USER from './testuser.json';

import { getDatabase, connectDatabaseEmulator, ref } from "firebase/database";
import { initializeApp } from "firebase/app";

// copied from firebase-config.js
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

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// copied from https://firebase.google.com/docs/emulator-suite/connect_rtdb and slides
const db = getDatabase();
if (location.hostname === "localhost") {
  // Point to the RTDB emulator running on localhost.
  connectDatabaseEmulator(db, "localhost", 9000);
}

const gameName = "Counter-Strike";
const gameData = HUGE_GAME_DATA.find((game) => {
  return game.name === gameName;
});

describe("Unit: Review Forms", () => {
  describe("Render Review", () => {
    test("Did the review render?", () => {
      const reviewText = "test review";

      render(<ReviewsSection currentUser={TEST_USER} gameData={gameData} db={db} />);

      // enter some text
      const formInput = screen.getByRole("textbox");
      userEvent.type(formInput, reviewText);

      userEvent.click(screen.getByRole("button", { name: /submit/i }));

      expect(screen.getByText(reviewText)).toBeInTheDocument();
    })
  })//,
  // describe("Render Stars", () => {
  //   test("Did the stars render?", () => {
  //     const reviewText = "test stars";

  //     render(<ReviewsSection currentUser={TEST_USER} gameData={gameData} db={db} />);

  //     // enter some text
  //     const formInput = screen.getByRole("textbox");
  //     userEvent.type(formInput, reviewText);

  //     userEvent.click(screen.getByRole("button", { name: /submit/i }));

  //     expect(screen.getByRole("button", {name: /reviewStar/i})).toBeInTheDocument();
  //   })
  // }),
  // describe("Don't Render Empty Review", () => {
  //   test("Did the empty review render?", () => {
  //     const reviewText = "test review";

  //     render(<ReviewsSection currentUser={TEST_USER} gameData={gameData} db={db} />);

  //     // enter some text
  //     const formInput = screen.getByRole("textbox");
  //     userEvent.type(formInput, reviewText);

  //     userEvent.click(screen.getByRole("button", { name: /submit/i }));

  //     console.log(screen.getByText(reviewText));
  //     expect(screen.getByText(reviewText)).toBeInTheDocument();
  //   })
  // })
})