import { Link, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { GameCard } from './GameList';
import ToggleButton from 'react-bootstrap/ToggleButton';
import { getDatabase, ref, onValue } from 'firebase/database';

// Search results from searching
// Results are either users or games
export function Results(props) {
    const { games } = props;
    const query = useLocation().search.substring(1, 2);
    const [users, setUser] = useState([]);
    if (query === 'u') {
        RenderUsers(users, setUser, games);
        return <UserCards users={users} />
    } else if (query === 'g') {
        return <GameCards games={games} />
    } else {
        return (
            <div>
                <hr className="search-line" />
                <section className="users-section">
                    <p className="zero-items">Invalid query</p>
                </section>
            </div>
        )
    }
}

// Helper function that takes in a list of users,
// a callback function and list of games.
// Creates an asynchronous effect hook that retrieves
// a list of users and their games played
function RenderUsers(users, callback, games) {
    const db = getDatabase();
    useEffect(() => {
        const gameListRef = ref(db, "gameLists");
        const offFunction = onValue(gameListRef, (snapshot) => {
            let newArray = users;
            snapshot.forEach((child) => {
                const username = child.key;
                const alt = child.key + '\'s picture';
                const gameIds = [];
                for (const key in child.val()) {
                    gameIds.push(parseInt(key));
                }
                const userGames = games.filter(game => {
                    return gameIds.includes(game.appid);
                });

                //const userGames = [];
                const newUser = {
                    'username': username,
                    'img': 'profile.png',
                    'alt': alt,
                    'games': userGames
                };
                newArray = [...newArray, newUser]
                callback(newArray);
            });
        });
        function cleanup() {
            offFunction();
        }
        return cleanup;
    }, []);
}

// Takes in an array of games or users and filters the array
// by the current location
function FilterQuery(list) {
    const queryLetter = useLocation().search.substring(1, 2);
    let query = useLocation().search.substring(3);

    // Various edge cases with non alphanumeric string
    const NON_ALPHANUMERIC = {
        '+': ' ', // Space
        '%3A': ':', // Colon
        '%3B': ';', // Semicolon
        '%2B': '+', // Plus
        '%2C': ',', // Comma
        '%2F': '/', // Right slash
        '%7E': '~', // Tilde
        '%40': '@', // At
        '%23': '#', // Hashtag
        '%24': '$', // Dollar
        '%25': '%', // Percent
        '%26': '&', // Ampersand
        '%3D': '=', // Equals
        '%3F': '?' // Question mark
    }
    console.log('Query before processing: ' + query); // before
    query = decodeURI(query); // Automates some non alphanumeric processing
    for (const unesc in NON_ALPHANUMERIC) {
        query = query.replaceAll(unesc, NON_ALPHANUMERIC[unesc]);
    }
    console.log('Query after processing: ' + query); // after
    const currItemsArray = list.filter(function (item) {
        let itemLower = '';
        if (queryLetter === 'u') {
            itemLower = item.username.toLowerCase();
        } else {
            itemLower = item.name.toLowerCase();
        }
        const queryLower = query.toLowerCase();
        return itemLower.includes(queryLower);
    });
    return currItemsArray;
}

// Contains list of all users specified by search criteria
// Maximum of 8 users per page
// Takes in a prop that contains information about other users
function UserCards(props) {
    const { users } = props;
    const [pageNum, setPageNum] = useState(1);

    // Search filter code
    let queryArray = FilterQuery(users);
    const usersArray = queryArray.map(userInfo => {
        return (
            <UserCard username={userInfo.username} img={userInfo.img} alt={userInfo.alt} games={userInfo.games} key={userInfo.username} />
        );
    });
    const currArray = usersArray.slice((pageNum - 1) * 8, pageNum * 8);
    console.log(currArray); // Current users shown
    if (currArray.length === 0) {
        return (
            <div>
                <hr className="search-line" />
                <section className="users-section">
                    <p className="zero-items">No users found</p>
                </section>
                <Pages pageNum={pageNum} pageCallback={setPageNum} />
            </div>
        )
    } else {
        return (
            <div>
                <hr className="search-line" />
                <section className="users-section">
                    {currArray}
                </section>
                <hr className="end-line" />
                <Pages pageNum={pageNum} pageCallback={setPageNum} />
            </div>
        );
    }
}

// Helper function that defines a user card
// Takes in user's information (name, img, alt for img, games) as a prop
function UserCard(props) {
    const { username, alt, games, img } = props;
    const src = "img/" + img;

    const userGamesArray = games.map(game => {
        return (
            <GameCard key={game.appid} gameData={game} />
        );
    });
    let sharedGames = "";
    if (userGamesArray.length === 0) {
        sharedGames = "No games";
    } else {
        sharedGames = "Games:";
    }

    return (
        <div>
            <section className="user-card" key={username}>
                <section className="user-pic">
                    <img className="profile" src={src} alt={alt} />
                </section>
                <section className="user-info">
                    <h2>{username}</h2>
                    <hr className="user-line" />
                    <p>{sharedGames}</p>
                    <div className="container" id="usergames">
                        {userGamesArray}
                    </div>
                </section>
            </section>
            <hr className="search-line" />
        </div>
    );
}

// Contains games specified by search criteria
// Takes in a prop that has all games
function GameCards(props) {
    const { games } = props;
    const [pageNum, setPageNum] = useState(1);

    // Filter games and genres by query
    const queryArray = FilterQuery(games);
    const genres = new Set();

    // Render queried games
    // Get genres from those queried games
    const gamesArray = queryArray.map((game) => {
        const gameGenres = game.genres.split(';');
        gameGenres.forEach(genre => genres.add(genre));
        return <GameCard key={game.appid} gameData={game} />
    });

    // Render genre buttons
    const [currGenres, setCurrGenres] = useState([...genres].sort());
    const genresArray = [...genres].sort().map((genre) => {
        const index = [...genres].indexOf(genre)
        return <Genre key={index} genre={genre} currGenres={currGenres} currGenreCallback={setCurrGenres} />
    });
    // console.log(currGenres); // Current genres shown

    // Filter games by selected genres
    const filteredGamesArray = gamesArray.filter((game) => {
        const data = game.props.gameData
        const gameGenres = data.genres.split(';');
        const hasGenres = gameGenres.filter(genre => {
            if (currGenres.includes(genre)) {
                return true
            } else {
                return false;
            }
        });
        return hasGenres.length !== 0;
    });

    // Filter each page with only 20 games
    const currArray = filteredGamesArray.slice((pageNum - 1) * 20, pageNum * 20);

    if (currArray.length === 0) {
        return (
            <div className="games-container">
                {genres.size !== 0 ? <h2>Filter by genre:</h2> : <h2></h2>}
                <section className="genres-section">
                    {genresArray}
                </section>
                <hr className="search-line" />
                <section className="games-section">
                    <p className="zero-items">No games found</p>
                </section>
                <Pages pageNum={pageNum} pageCallback={setPageNum} />
            </div>
        )
    } else {
        return (
            <div className="games-container">
                <h2>Filter by genre:</h2>
                <section className="genres-section">
                    {genresArray}
                </section>
                <section className="games-section">
                    {currArray}
                </section>
                <Pages pageNum={pageNum} pageCallback={setPageNum} />
            </div>
        );
    }
}

// Helper function that takes in a genre as a prop
// Returns ToggleButtons that can be clicked to filter
// genres of viewable games in the query
function Genre(props) {
    const { genre, currGenres, currGenreCallback } = props;
    const [checked, setChecked] = useState(true);
    //console.log('State of ' + genre + ': ' + checked);
    const handleChange = (e) => {
        setChecked(e.currentTarget.checked);
    };

    useEffect(() => {
        if (checked & !currGenres.includes(genre)) {
            const newArray = [...currGenres, genre].sort();
            currGenreCallback(newArray);
        }
        if (!checked & currGenres.includes(genre)) {
            const newArray = currGenres.filter(item => {
                return !(item === genre);
            })
            currGenreCallback(newArray);
        }
    }, [currGenres, currGenreCallback, checked, genre]);

    return (
        <ToggleButton id={'toggle-check-' + genre} type="checkbox" checked={checked} onChange={handleChange} active={checked}>
            {genre}
        </ToggleButton>
    );
}


// Pages component that cycles through games and users
// 20 games per page, 8 users per page
function Pages(props) {
    const { pageNum, pageCallback } = props;
    const queryLoc = '/results' + useLocation().search;
    const handleLeftClick = () => {
        if (pageNum !== 1) {
            pageCallback(pageNum - 1);
        }
    };
    const handleRightClick = () => {
        pageCallback(pageNum + 1);
    };

    return (
        <div>
            <section className="page-section">
                <section className="arrow">
                    <Link to={queryLoc}><i className="fa fa-arrow-left" aria-label="Left Arrow" onClick={handleLeftClick}></i></Link>
                </section>
                <section>
                    <p>{pageNum}</p>
                </section>
                <section className="arrow">
                    <Link to={queryLoc}><i className="fa fa-arrow-right" aria-label="Right Arrow" onClick={handleRightClick}></i></Link>
                </section>
            </section>
        </div>
    )
}

/*
<section className="user-card">
                    <section className="user-pic">
                        <img className="profile" src="img/profile.png" alt="User Profile Pic" />
                    </section>
                    <section className="user-info">
                        <h2>Johnny Joestar</h2>
                        <hr />
                        <p>Also plays: </p>
                        <div className="container" id="usergames">
                            <div className="card">
                                <img src="img/gameart/deathsdoor.jpg" alt="Death's Door game art" />
                            </div>
                            <div className="card">
                                <img src="img/gameart/uncharted.jpg" alt="uncharted game art" />
                            </div>
                            <div className="card">
                                <img src="img/gameart/botw.jpg" alt="Breath of the Wild game art" />
                            </div>
                            <div className="card">
                                <img src="img/gameart/acodyssey.jpg" alt="Assassin's Creed Odyssey game art" />
                            </div>
                            <div className="card">
                                <img src="img/gameart/kena.jpg" alt="kena Bridge of Spirits game art" />
                            </div>
                        </div>
                    </section>
                </section>
                <hr className="search-line" />
                <section className="user-card">
                    <section className="user-pic">
                        <img className="profile" src="img/profile.png" alt="User Profile Pic" />
                    </section>
                    <section className="user-info">
                        <h2>Alfonso</h2>
                        <hr />
                        <p>No shared games</p>
                    </section>
                </section>
*/