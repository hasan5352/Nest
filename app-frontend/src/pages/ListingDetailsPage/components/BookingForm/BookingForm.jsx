import './BookingForm.css';

function BookingForm({ listing }) {
  async function bookListing(e){
    e.preventDefault();
  }

  return (
    <section className="booking-section">
      <form action="">
        <p id="price"> &#8364; {listing.price} /night</p>

        <div className="reservation-container">
          <div>
              <input type="date" name="check-in" id="check-in" />
              <input type="date" name="check-out" id="check-out" />
          </div>
          <select name="guests" id="guests" defaultValue="">
              <option value="">Select Guests...</option>
          </select>
        </div>

        <button type="submit" onClick={bookListing}>Book</button>

        <div className="cost-container">
          <div>
            <p>3 nights x &#8364; {listing.price} </p>
            <p>&#8364; 123</p>
          </div>
          
          <div>
            <p>Nest Service Fee</p>
            <p>&#8364; 25.6</p>
          </div>
          <hr />

          <div>
            <p>Total</p>
            <p>&#8364; 207</p>
          </div>
        </div>
      </form>
    </section>
  );
}

export default BookingForm;