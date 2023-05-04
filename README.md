# INFO 443 Project 1 Report
By Lauren Wong and Sachi Figliolini

INFO 443 Spring 2023

## Code Structure Analysis

### 1. Code-level Artchitectural Elements

#### List of Architectural Elements:
The following list contains all the architectural elements included in the React app for My Game List broken down into their JavaScript module, which corresponds to the section of the website they are a part of (e.g. navigation bar, selected game page, etc.). It also includes brief descriptions of the element’s  purpose and relationship to the other elements in the system.

***Note:** The elements highlighted in bold are React components and the names not in bold are the JavaScript module they are in. We organized it this way to better organize the components according to the part of the website they represent.

- NavBar
  - **NavBar** – creates the navigation bar used throughout the website
  - **SearchNav** – creates the search bar section of the navigation bar that is responsible for handling searches for users or games using keywords
  - **DefaultNav** – creates the regular navigation bar intended for larger screens like laptops
  - **CollapsedNav** – creates the collapsed navigation bar for smaller screens like phones (changes into a hamburger menu containing all the same buttons as the DefaultNav)
- Login
  - **LoginPage** – creates the login page for the website
  - **Login** – creates the login section of the login page where users can input their username and password to access their account
  - **Intro** – creates a short introduction to the website on the login page
- About
  - **IntroSection** – creates a short introduction to the website for new users
  - **InfoCards** – creates a section for all the InfoCard components containing information about the website’s features for users to learn about
  - **InfoCard** – creates a single card containing information on one of the website’s features
- SignUp
  - **SignUpPage** – creates the signup page for the website
  - **SignUp** – creates the sign up section of the page where users can create a new account
- Results
  - **Results** – creates a page displaying the search results from searching for either users or games
  - **UserCards** – creates a page for the user search results containing a UserCard for each user found
  - **UserCard** – creates a single card to be used in the user search results, where each card contains information on a user of the website (includes name, image, and the games they have saved)
  - **GameCards** – creates a page for the game search results containing a GameCard for each game found
  - **Genre** – creates the filters for game genre on the search page
  - **Pages** – creates the basic page layout for search results page that is used for the UserCards and GameCards components
- GameList (it is essentially the homepage of the website)
  - **GameCards** – creates a section containing the game cards for all the games listed in the data provided to it (used to create the game cards in the GameList and Results modules)
  - **GameCard** – creates a single game card that contains an image of the game and can be clicked to open up the SelectedGamePage where users can get more information on the specific game
  - **MyGames** – creates the section of the home page containing all the games that the user has saved, where each game will be represented in the form of GameCard components
  - **Suggestions** – creates the section of the home page containing various game suggestions for the user to play next, where each game will be represented in the form of GameCard components
  - **StatBox** – creates the section of the home page displaying basic statistics on which games the user is planning on playing, is currently playing, and has stopped playing
- Selected
  - **SelectedGamePage** – creates the page for a single game containing additional information on the game and reviews from other users
  - **GameInfo** – creates the section of the selected game page containing additional information on the game (e.g. description, genres, etc.)
- ReviewsSection
  - **ReviewsSection** – creates the section of the selected game page containing the reviews of the game from other users and a section where the user can write their own review
  - **ReviewForm** – creates the section where users can submit a review and/or rate the game
  - **FormReviewStars** – creates the buttons that users use to rate the game in the form
  - **GameReviewsSection** – creates a section for information on game reviews including all of the previous reviews and ratings of the game and the average rating for the game
  - **GameReviews** – creates a section for all the individual game Review cards to be displayed
  - **Review** – creates a single card containing information on a review (e.g. user who wrote the review, review, rating, etc.)
  - **ReactionsSection** – creates the like buttons section of a review card
  - **ReviewHeader** – creates the header of a review card that includes information on the username, user profile image, rating, and time posted
  - **ReviewCardStars** – creates the review stars for a specific review card
- Tags
  - **Tags** – creates the tag buttons in the selected game page for users tag a game as playing, completed, planned, or stopped so they can keep track of their games in the future
- Footer
  - **Footer** – creates a basic footer for the website

#### UML Component Diagram:

Figure 1 is a UML component diagram showing the relationships between the different architectural elements in the React app for My Game List. The elements have been grouped together according to their JavaScript module and purpose to help with understanding the overall structure of the app. The arrows represent the relationships between nested components (child → parent) and may include additional information on the cardinality if it is different from the standard 1 to 1 relationship.

![Architectural Element Component Diagram](images/final-component-diagram.jpg)
Figure 1: Architectural Element Component Diagram for MGL.

This diagram shows the relationships between all architectural elements and their nested components in the My Game List React app. It also is grouped according to the JavaScript module they belong to.


## Architecture Assessment & Refactoring Solutions

**Module Analyzed:** ReviewsSection.js

### Code Smells

- Long Function
  - Location: `ReviewsSection()`
    - Description: Function is too long and contains too many helper functions or additional code that that is not necessary in the function, which makes it hard to understand and make modifications.
    - Fix: Refactored code to calculate the average rating for game reviews into a separate helper function.
  - Location: `Review()`
    - Description: Same issue as ReviewsSection(). The function is too long and tries to accomplish too many things, which makes it hard to understand and maintain.
- Bloated Components
  - Idea from: [https://hackernoon.com](https://hackernoon.com/lessons-learned-common-react-code-smells-and-how-to-avoid-them-f253eb9696a4)
  - Location: `ReviewsSection()`
    - Description: The variable gameReviewsToDisplay used to create the ReviewsSection component makes the component overly long and complicated even though it can be divided up into smaller components to make it simpler.
    - Fix: Created a new child component called GameReviewsSection for the section to display all the reviews on the game and the average rating.
  - Location: `Review()`
    - Description: The component for a review card is overly complex and can be broken down into different sections to make it easier to understand.
    - Fix: Moved the code to create the (non-interactive) review stars on a single review card into its own component called ReviewCardStars and created another component for the ReviewHeader to simplify the Review component.
- Mysterious Name
  - Location: `ReviewsSection()`
    - Description: The function finalCleanup in the useEffect does not clearly communicate what it does and how it is used.
    - Fix: Renamed the function to setReviewsHistoryOnChange() to more clearly communicate its purpose.
  - Location: `ReviewBox()`
    - Description: The name for the ReviewBox function does not clearly communicate that it is a form that handles submitting a review and/or rating.
    - Fix: Renamed the ReviewBox component to ReviewForm.
  - Location: `ReviewStars()`
    - Description: The name for the ReviewStars function does not communicate that it creates the buttons for adding a rating in the form and can be confused with other review stars on the page.
    - Fix: Renamed the ReviewStars component to FormReviewStars to prevent confusion with the review stars on each review card.
  - Location: `Review()`
    - Description: The variable reviewStars has the same as the ReviewStars component even though the variable represents a fixed rating for a review on a card, not the ReviewStar buttons used in the form.
    - Fix: Created a new component called ReviewCardStars to differentiate it from the FormReviewStars.
- Magic Numbers
  - Location: `ReviewCardStars()`, `FormReviewStars()`, and `GameReviewsSection()`
    - Description: In the first two functions, we create arrays by hard-coding the values in for the number of stars (e.g. [0, 1, 2, 3, 4]) and in the last function we use a magic number 5 in the \<p\> tag to represent the number of stars the ratings are out of. This makes the code a bit confusing and hard to maintain in the future if we ever need to change this number.
    - Fix: Created a global const variable called NUM_STARS for the magic number 5 and used it instead of the hardcoded values.


### Standards Violations

- Web Accessibility standards
  - Followed the guidelines from:
    - [https://accessibility.18f.gov](https://accessibility.18f.gov/checklist/)
    - [https://www.w3.org](https://www.w3.org/WAI/WCAG21/quickref/)
  - Violations:
    - Incorrect use of the button element for the star rating on review cards even though they are a non-interactive element. So when you try to navigate the ReactionsSection using the tab on the keyboard it focuses on that element even though it is non-interactive, which causes confusion on whether users can actually interact with the element or not.
      - Fix: Changed the button element to a span element to ensure that it is not counted as an interactive element on the page so that it is keyboard accessible.
    - Lack of proper accessible names and/or descriptions for interactive elements (e.g. the review star buttons in the form and the like buttons on review cards) to help users using screen readers determine the purpose or function/action of the element.
      - Fix: Added an aria-label for the review star buttons in the form and the like buttons on the review cards.


## Automated Tests

### How to run the test suite?

**Run the tests:**
- `npm test` will run the tests only
- `npm test -- --coverage` will run the tests and provide a coverage report


### What aspects of the code were tested and why?

1. Render Review - Check if review rendered
    - We wanted to test whether adding a review without a star rating would be successfully added to the database and rendered under the game reviews section in the correct format to ensure that users have the option of just adding a review.
2. Render Stars - Check if star rating rendered
    - We wanted to test whether adding a star rating without a review would be successfully added to the database and rendered under the game reviews section to ensure that users have the option of just adding a rating.
3. Don't Render Empty Review - Check that empty review did not render
    - We wanted to make sure that users could only submit a review when there is a star rating and/or review entered in the form (not when the form is empty) so that we don’t have any empty reviews stored in our database.
4. Clear Content After Submit - Check that the textbox is cleared after submit
    - We wanted to ensure that the content in the form was properly cleared after a user clicks submit because it will act as a visual cue to the user that their review has successfully been submitted and prepare the form for any future submissions.
5. Correct Average Rating Calculation - Check that the average rating is calculated properly
    - We wanted to make sure that the average rating for a game was correctly calculated using the reviews which did actually provide a star rating and excluding those which did not to ensure that we are accurately reporting the user ratings.
6. No Reviews Displayed - Check that no reviews are displayed when there are no reviews
    - For games with no reviews yet, we wanted to ensure that the game reviews section would not show any reviews and that it would contain a message to clearly communicate to users that the game does not have a review yet.
7. Like a Review - Check that liking a review adds one like
    - We wanted to ensure that clicking the like button on a review increases the count of likes for that review by 1 and that you could like a review multiple times so that the like button will work as expected when users interact with it.
8. test
9. test
10. test
11. test
12. test
13. Render Database Change - Check that a change in the reviews database will render a new review
    - We wanted to ensure that an update to the allReviews firebase database like adding a new review would correctly result in that new review being rendered on the page as well.


---

# Checkpoints

## Checkpoint 1

**Name of Project:** My Game List (MGL)

**Who Created it:** Jerome Ortiz Orille, Gavin Patrick Pereira & Lauren Wong

**What kind of software:** React App

**Description:** MGL is a simple and effective way to keep track of all your games, connect with friends, share your thoughts on games you liked or didn't like, and discover new games to play next.

**Link to website:** [https://mygamelist-a7724.web.app/]

**Link to repo:** [https://github.com/Info-433-Spring-2023/project-1-lwong121]



## Checkpoint 2

**Class Diagram**

![Class Diagram](/images/INFO%20443%20Checkpoint%202%20-%20Class%20Diagram.jpg)

**Activity Diagram**

![Activity Diagram](/images/INFO%20443%20Checkpoint%202%20-%20Activity%20Diagram.jpg)

**Selected Candidate Element:** Selected.js Components



## Checkpoint 3

**Instructions for how to run tests:**

npm install the following:
* -g firebase-tools
* react-scripts
* jest-dom
* --save-dev @testing-library/jest-dom
* --save-dev @testing-library/react
* --save-dev @testing-library/user-event
* firebase
* @fortawesome/react-fontawesome
* @fortawesome/free-solid-svg-icons

then run npm test and type a to run all tests

**Updated Test Coverage Report:**

![Updated Test Coverage Report](images\checkpoint-3-updated-coverage.jpg)

---
**ISSUE RESOLVED: Can Ignore the following**

Note on missing code coverage:

We are aware of the missing code coverage for lines 17-25, which corresponds to the `finalCleanup()` function in the `useEffect()` under the `<ReviewsSection>` component in ReviewsSection.js. But after several attempts (as seen in the "Test finalCleanup() function" test), we have not yet managed to solve this issue.

Here are some links we tried to look at:
- https://stackoverflow.com/questions/58194024/how-to-unit-test-useeffect-cleanup-return-function-using-jest-and-enzyme
- https://jestjs.io/docs/jest-object#jestspyonobject-methodname
- https://testing-library.com/docs/react-testing-library/api/#unmount

This is a screenshot of the code we have missing code coverage on. Other than these lines, we have 100% code coverage.

![Missing Code Coverage](/images/missing-cleanup-function.jpg)

*Replace this later when we have all the tests
![Code Coverage](/images/test-coverage-missing-cleanup-function.jpg)