import { Link } from 'react-router-dom';
export default function Footer() {
  return (
    <footer>
      <p>Copyright© 2021 | Jerome Ortiz Orille, Gavin Patrick Pereira & Lauren Wong</p>
      <p>Data from <Link to="https://www.kaggle.com/nikdavis/steam-store-games"> https://www.kaggle.com/nikdavis/steam-store-games</Link>
      </p>
    </footer>
  )
}