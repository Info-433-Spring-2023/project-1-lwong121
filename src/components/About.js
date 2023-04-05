import { Link } from 'react-router-dom';

const INFO_CARD_TEXT = [
  { title: "Keep track of all your games", body: "Create customized lists of games you have played, are currently playing, and want to play next on your My Games page." },
  { title: "Share your lists with friends", body: "Share and talk about the lists of the games you are currently enjoying or want to play with your friends. Or connect with new friends who share similar interests." },
  { title: "Rate and review games", body: "Let other people know what you think about the games you have played by giving them a rating and a review as you add them to your game lists." },
  { title: "Discover new games", body: "Look at game reviews and ratings from your friends and others to create your own wishlist of games so you never have to worry about what to play next." }
];

export function IntroSection() {
  return (
    <div className="intro">
      <h2>Need a way to track all of your games?</h2>
      <p>
        MyGameList or MGL for short is your solution. MGL is a simple and effective way to keep track of all your games,
        connect with friends, share your thoughts on games you liked or didn't like, and discover new games to play
        next.
      </p>
      <Link className="btn" to="/signup">Sign Up Here</Link>
    </div>
  );
}

export function InfoCards() {
  const infoCards = INFO_CARD_TEXT.map((cardInfo) => {
    return <InfoCard cardInfo={cardInfo} key={cardInfo.title} />;
  });
  return (
    <div className="card-container">
      {infoCards}
    </div>
  );
}

function InfoCard({cardInfo}) {
  return (
    <div className="info-card">
      <h2>{ cardInfo.title }</h2>
      <hr />
      <p>{ cardInfo.body }</p>
    </div>
  );
}