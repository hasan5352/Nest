import './ListingInfoSection.css';

function ListingInfoSection({ listing }) {
  return (
    <article className="listing-info">
      <div className="meta">
        <h2 id="location"> Stay in {listing.address.city}, {listing.country} </h2>
        <p>
            {listing.rooms > 0 && <span>{listing.rooms} Rooms &middot;</span>}
            {listing.bathrooms > 0 && <span>{listing.bathrooms} Rooms</span>}
        </p>
      </div>
    
      <div className="description">
          <h3>About this place</h3>
          <p> {listing.description} </p>
      </div>
    
      <div>
          <h3>What this place offers</h3>
          <ul>
              {listing.amenities.map( amenity => <li> {amenity} </li>)}
          </ul>
      </div>
    </article>
  );
}

export default ListingInfoSection;