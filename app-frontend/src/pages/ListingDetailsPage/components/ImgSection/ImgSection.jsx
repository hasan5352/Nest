import './ImgSection.css';

function ImgSection({ listing }) {
  return (
    <section className="img-section">
        <h1>{listing.title}</h1>
        <div className="img-container">
            <img src={listing.img} alt="unavailable" />
        </div>
        <hr />
    </section>
  );
}

export default ImgSection;