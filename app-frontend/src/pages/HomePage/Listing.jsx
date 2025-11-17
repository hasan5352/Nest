import './Listing.css'
import { Link } from 'react-router';

export default function Listing({ listing }) {
  return (
    <Link to={`/listings/${listing._id}`}>
      <div className="listing">
        <img src={listing.img} />
        <div className="info-box">
            <p id="title"> {listing.title} </p>
            <div className="info">
                <p id="price">&#8364; {listing.price} /night</p>
                <p id="location"> {listing.address.city}, {listing.country} </p>
            </div>
        </div>
      </div>
    </Link>
  );
}