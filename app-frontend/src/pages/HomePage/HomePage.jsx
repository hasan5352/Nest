
import './HomePage.css';
import Listing from './Listing';
import Header from '../../components/Header';
import { useSearchParams } from 'react-router';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function HomePage() {
	const [listings, setListings] = useState([]);
	const [searchParams] = useSearchParams();
	const q = (searchParams.get('q'))? searchParams.get('q') : '';

	async function loadListings() {
		const newListings = await axios.get(`/api/listings/?q=${q}`);
		setListings(newListings.data);
		// console.log(newListings.data);
	}
	useEffect(()=>{ loadListings() }, [q]);

	if (!listings) return;
	return (
		<>
			<Header />
			<main id='homepage'>
				{!listings.length && <h2>No matching listings found !</h2>}
				{listings.map( l => <Listing key={l._id} listing={l} />)}
			</main>
		</>
	);
}