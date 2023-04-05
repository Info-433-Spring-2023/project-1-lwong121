/* DEPRECATED delete when we are completely finished
*/

import { Link } from 'react-router-dom';
import { useState } from 'react';

// Helper function that takes in an array of games and returns
// five random games from that array as an array
function RandGames(games) {
    //console.log('RandGames function!');
    let arrayLen = games.length;
    const fiveRandGames = [];
    const gamesCopy = [...games];
    for (let x = 0; x < 5; x++) {
        const rand = Math.floor(Math.random() * arrayLen);
        const game = gamesCopy[rand];
        fiveRandGames.push(game);
        arrayLen -= 1;
        gamesCopy.splice(rand, 1);
    }
    return fiveRandGames;
}

// Games featured in user's lists
// Used in both search and results page
// Search: used to show 5 most popular games
// Results: used to show similar games that other users played with the user
export function SearchGames(props) {
    //console.log('SearchGames component!');
    const { img, alt } = props;
    return (
        <div className="card">
            <img src={img} alt={alt} />
        </div>
    );
}

// Search header
// Includes Recommended Games (random!) from SearchGames component
export function SearchHeader(props) {
    //console.log('SearchHeader component!');
    const { recGames } = props;
    const fiveRandGames = RandGames(recGames)
    const recGamesArray = fiveRandGames.map(game => {
        return (
            <div key={game.appid}>
                <SearchGames img={game.img} alt={'Cover of ' + game.name} />
            </div>
        );
    })
    return (
        <div>
            <section>
                <h2 className="user-search-header">Looking for a friend? Say no more...</h2>
            </section>

            <hr className="search-line" />
            <section className="list-section">
                <h3>Recommended Games</h3>
                <div className="container">
                    {recGamesArray}
                </div>
            </section>
            <hr className="search-line" />
        </div>
    );
}

// Search bar that searches for other users
// Also used for the results page
export function SearchBar(props) {
    const { searchCallback } = props;
    const [queryText, setQueryText] = useState('');

    const handleChange = (event) => { // works every time you type something in
        setQueryText(event.target.value);
    }

    const handleSubmit = (event) => { // works after you press enter
        event.preventDefault();
        searchCallback(queryText);
    }

    return (
        <div>
            <section>
                <form className="search-form" onSubmit={handleSubmit} action="/results">
                    <label className="search-label" htmlFor="search-bar">Search: </label>
                    <input className="search-input" name="search-bar" placeholder="Search here.." aria-label="Search bar"
                    onChange={handleChange} value={queryText}/>
                    <Link className="search-button" to="/results">
                        <i className="fa fa-arrow-circle-right fa-lg"></i>
                    </Link>
                </form>
            </section>
        </div>
    )
}