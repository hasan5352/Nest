import { useRef } from 'react';
import './Header.css';
import { NavLink, useNavigate } from 'react-router';

export default function Header(){
	const searchBar = useRef(null);
	const navigate = useNavigate();

	function displaySearchedListings(e){
		if (e.key && e.key != 'Enter') return;
		const q = searchBar.current.value.trim();
		let search = '';

		if (q != '') search = `?q=${q}`
		navigate('/' + search);
	}

  return (
		<header>
			<div className="left">
				<NavLink to="/"> <img src='/logo.jpeg' alt="Nest" /> </NavLink>
				<NavLink to="/listings/new">Add a Listing</NavLink>
				<NavLink to=""> My Listings </NavLink>
				<NavLink to=""> My Bookings </NavLink>
			</div>
			
			<div className="middle">
				<input type="text" id='searchbar' ref={searchBar}
					placeholder='Search Listings...' onKeyDown={displaySearchedListings}/>

				<button id='searchbtn' onClick={displaySearchedListings}> 
					<img src="/search-icon.svg	" alt="Oops" /> 
				</button>
			</div>

			<div className="right">
				<button id="signup-btn">Sign Up</button>
				<button id="login-btn">Login</button>
			</div>
		</header>
	);
}