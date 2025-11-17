
import './utility.css';
import { Route, Routes } from 'react-router';

import HomePage from './pages/HomePage/HomePage';
import NewListingPage from './pages/NewListingPage/NewListingPage';
import NotFoundPage from './pages/NotFoundPage/NotFoundPage'
import ListingDetailsPage from './pages/ListingDetailsPage/ListingDetailsPage';

function App() {

  return (
    <Routes>
      <Route index element={<HomePage />} />

      <Route path='/listings/new' element={ <NewListingPage /> } />

      <Route path='/listings/:id' element={ <ListingDetailsPage /> } />

      <Route path='*' element={ <NotFoundPage /> } />
    </Routes>
  )
}

export default App
