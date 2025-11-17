import Header from "../../components/Header";
import NotRequiredDataProvider from "./context/NotRequiredDataProvider";
import RequiredDataProvider from "./context/RequiredDataProvider";
import NewListingForm from "./NewListingForm";
import './NewListingPage.css'

export default function NewListingPage() {
	return (
		<>
			<Header />
			
			<main id="new-listing-page">
				<h2>Add New Listing</h2>
				
				<RequiredDataProvider>
					<NotRequiredDataProvider>
						<NewListingForm />
					</NotRequiredDataProvider>
				</RequiredDataProvider>
			</main>
		</>
	);
}