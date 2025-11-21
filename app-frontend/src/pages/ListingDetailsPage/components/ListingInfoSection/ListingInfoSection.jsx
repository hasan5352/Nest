import './ListingInfoSection.css';

function ListingInfoSection({ listing }) {
  return (
    <article className="listing-info">
      <div className="meta">
        <h2 id="location"> Stay in {listing.address.city}, {listing.address.country} </h2>
        <p> {listing.rooms} Rooms &middot; {listing.bathrooms} Bathrooms </p>
      </div>

      {listing.description &&
      <div className="description">
        <h3>About this place</h3>
        <p> {listing.description} </p>
      </div>
      }

      {listing.amenities &&
      <div>
        <h3>What this place offers</h3>
        <ul>
          {listing.amenities.map((amenity, i) => <li key={i}> {amenity} </li>)}
        </ul>
      </div>
      }
      
    </article>
  );
}

export default ListingInfoSection;