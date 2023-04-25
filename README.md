**Lauren Wong and Sachi Figliolini**

# Checkpoint 1

**Name of Project:** My Game List (MGL)

**Who Created it:** Jerome Ortiz Orille, Gavin Patrick Pereira & Lauren Wong

**What kind of software:** React App

**Description:** MGL is a simple and effective way to keep track of all your games, connect with friends, share your thoughts on games you liked or didn't like, and discover new games to play next.

**Link to website:** [https://mygamelist-a7724.web.app/]

**Link to repo:** [https://github.com/Info-433-Spring-2023/project-1-lwong121]



# Checkpoint 2

## Class Diagram

![Class Diagram](/images/INFO%20443%20Checkpoint%202%20-%20Class%20Diagram.jpg)

## Activity Diagram

![Activity Diagram](/images/INFO%20443%20Checkpoint%202%20-%20Activity%20Diagram.jpg)

**Selected Candidate Element:**
Selected.js Components


# Checkpoint 3

**Note on missing code coverage:**

We are aware of the missing code coverage for lines 17-25, which corresponds to the `finalCleanup()` function in the `useEffect()` under the `<ReviewsSection>` component in ReviewsSection.js. But after several attempts (as seen in the "Test finalCleanup() function" test), we have not yet managed to solve this issue.

Here are some links we tried to look at:
- https://stackoverflow.com/questions/58194024/how-to-unit-test-useeffect-cleanup-return-function-using-jest-and-enzyme
- https://jestjs.io/docs/jest-object#jestspyonobject-methodname
- https://testing-library.com/docs/react-testing-library/api/#unmount

This is a screenshot of the code we have missing code coverage on. Other than these lines, we have 100% code coverage.

![Missing Code Coverage](/images/missing-cleanup-function.jpg)

*Replace this later when we have all the tests
![Code Coverage](/images/test-coverage-missing-cleanup-function.jpg)