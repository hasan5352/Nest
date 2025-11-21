import './ImgSection.css';

function ImgSection({ listing }) {
  console.log(listing);
  return (
  <section className="img-section">
      <div className='img-holder'> 
        <img src={listing.imgs[0]} alt="" /> 
      </div>
      
      <div className='img-holder'>
        <img src={listing.imgs[1]} alt="" />
        <img src={listing.imgs[2]} alt="" />
      </div>

      <div className='img-holder'>
        <img src={listing.imgs[3]} alt="" />
        <img src={listing.imgs[4]} alt="" />
      </div>

  </section>
  );
}

export default ImgSection;