import './ListingDetailsPage.css';
import { useParams } from 'react-router';
import axios from 'axios';
import { useEffect, useState } from 'react';

import Header from '../../components/Header';
import ImgSection from './components/ImgSection/ImgSection';
import ListingInfoSection from './components/ListingInfoSection/ListingInfoSection';
import BookingForm from './components/BookingForm/BookingForm';

function ListingDetailsPage() {
  const { id } = useParams();
  const [listing, setListing] = useState(null);

  async function fetchListing() {
    const l = await axios.get(`/api/listings/${id}`);
    setListing(l.data);
    // console.log(l.data);
  }
  useEffect(() => { fetchListing() }, [])

  if (!listing) return;
  return (
    <>
      <Header />
      
      <main id='listing-details-page'>
        <h1>{listing.title}</h1>
        
        {listing.imgs &&
        <ImgSection listing={listing} />
        }
        
        <hr />

        <section className="info-section">
          <ListingInfoSection listing={listing} />
          <BookingForm listing={listing} />
        </section>

        <hr />
      </main>
    </>
  );
}

export default ListingDetailsPage;