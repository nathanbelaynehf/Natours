
import React, { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import ReviewCard from './ReviewCard';
import Footer from './Footer';
import Header from './Header';
import { useAuth } from './AuthContext';

// OverviewBox component
const OverviewBox = ({ label, text, icon }) => {
  return (
    <div className="overview-box__detail">
      <svg className="overview-box__icon">
        <use xlinkHref={`/img/icons.svg#icon-${icon}`}></use>
      </svg>
      <span className="overview-box__label">{label}</span>
      <span className="overview-box__text">{text}</span>
    </div>
  );
};

const TourDetail = () => {
  const { user} = useAuth();
  const [tour, setTour] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const mapRef = useRef(null);
  const { id } = useParams(); // Get tour ID from URL

  // Fetch tour data
  useEffect(() => {
    const fetchTour = async () => {
      try {
        setLoading(true);
        const response = await fetch(`https://natours-1-zy39.onrender.com/api/v1/tours/${id}`);
       
        if (!response.ok) {
          throw new Error('Tour not found');
        }
        
        const data = await response.json();
        console.log(data);
        setTour(data.data.data); // Adjust based on your API response structure
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchTour();
    }
  }, [id]);

  // Mapbox initialization
  useEffect(() => {
    if (!tour) return;

    const loadMapbox = () => {
      if (!document.querySelector('#mapbox-script')) {
        const script = document.createElement('script');
        script.id = 'mapbox-script';
        script.src = 'https://api.mapbox.com/mapbox-gl-js/v0.54.0/mapbox-gl.js';
        script.onload = initializeMap;
        document.head.appendChild(script);

        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://api.mapbox.com/mapbox-gl-js/v0.54.0/mapbox-gl.css';
        document.head.appendChild(link);
      } else {
        initializeMap();
      }
    };

    const initializeMap = () => {
      if (mapRef.current && tour?.locations) {
        // Mapbox initialization would go here
        console.log('Initializing map with locations:', tour.locations);
      }
    };

    loadMapbox();

    return () => {
      // Cleanup if needed
    };
  }, [tour]);

  const handleBookTour = async () => {
    try {
      // Handle book tour logic
      console.log('Booking tour:', tour._id);
      // You would typically make an API call here
      // await fetch(`/api/v1/bookings`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ tour: tour._id })
      // });
    } catch (err) {
      console.error('Booking failed:', err);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
        <p>Loading tour...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="error">
        <h2>Tour Not Found</h2>
        <p>{error}</p>
        <Link to="/tours" className="btn btn--green">
          Back to All Tours
        </Link>
      </div>
    );
  }

  // Tour not found
  if (!tour) {
    return (
      <div className="error">
        <h2>Tour Not Found</h2>
        <p>The tour you're looking for doesn't exist.</p>
        <Link to="/tours" className="btn btn--green">
          Back to All Tours
        </Link>
      </div>
    );
  }

  const date = new Date(tour.startDates[0]).toLocaleString('en-us', {
    month: 'long',
    year: 'numeric'
  });

  const paragraphs = tour.description.split('\n');

  return (
    <>
    <Header/>
    <section className="section-header position-relative overflow-hidden">
  <div className="header__hero position-relative">
    <div className="header__hero-overlay position-absolute w-100 h-100"></div>
    <img 
      src={`/img/tours/${tour.imageCover}`} 
      alt={tour.name}
      className="header__hero-img w-100" 
      style={{height: 'auto', minHeight: '60vh', objectFit: 'cover'}}
    />
  </div>

  <div className="heading-box position-absolute text-white p-3 p-md-4"
       style={{
         top: '50%',
         left: '50%', 
         transform: 'translate(-50%, -50%)',
         width: '95%',
         maxWidth: '1200px',
         textAlign: 'center',
         zIndex: 10
       }}>
    <div className="heading-content" style={{marginBottom: '2rem'}}>
      <h1 className="heading-primary mb-0" 
          style={{
            fontSize: 'clamp(1.8rem, 5vw, 4rem)',
            width: '100%',
            margin: '0 auto',
            lineHeight: '1.3'
          }}>
        <span style={{
          display: 'inline-block',
          wordWrap: 'break-word',
          overflowWrap: 'break-word',
          hyphens: 'auto',
          padding: '1rem 1.5rem',
          background: 'linear-gradient(to right bottom, rgba(125, 213, 111, 0.9), rgba(40, 180, 135, 0.9))'
        }}>
          {`${tour.name} tour`}
        </span>
      </h1>
    </div>
    
    <div className="heading-box__group d-flex flex-column flex-sm-row gap-2 gap-md-3 justify-content-center align-items-center">
      <div className="heading-box__detail d-flex align-items-center">
        <svg className="heading-box__icon me-2" width="16" height="16">
          <use xlinkHref="/img/icons.svg#icon-clock"></use>
        </svg>
        <span className="heading-box__text" style={{fontSize: 'clamp(1rem, 2.5vw, 1.4rem)'}}>
          {`${tour.duration} days`}
        </span>
      </div>
      <div className="heading-box__detail d-flex align-items-center">
        <svg className="heading-box__icon me-2" width="16" height="16">
          <use xlinkHref="/img/icons.svg#icon-map-pin"></use>
        </svg>
        <span className="heading-box__text text-wrap" style={{fontSize: 'clamp(1rem, 2.5vw, 1.4rem)'}}>
          {tour.startLocation.description}
        </span>
      </div>
    </div>
  </div>

  <style>{`
    /* Ensure proper spacing between multi-line text and details */
    @media (max-width: 768px) {
      .section-header {
        clip-path: none !important;
        -webkit-clip-path: none !important;
        height: auto !important;
        margin-top: 0 !important;
        min-height: 70vh !important;
      }
      
      .header__hero {
        height: auto !important;
        min-height: 70vh !important;
      }
      
      .heading-content {
        margin-bottom: 1.5rem !important;
      }

      .heading-primary span {
        line-height: 1.4 !important;
        padding: 0.8rem 1rem !important;
        max-width: 100%;
      }

      /* Add space between sections */
      .section-description {
        margin-top: 0 !important;
        padding-top: 4rem !important;
      }
    }

    /* Extra space for very long text */
    @media (max-width: 480px) {
      .section-header {
        min-height: 80vh !important;
      }
      
      .header__hero {
        min-height: 80vh !important;
      }
      
      .heading-content {
        margin-bottom: 2rem !important;
      }

      .heading-primary span {
        padding: 0.7rem 0.8rem !important;
        font-size: clamp(1.6rem, 4vw, 2.2rem) !important;
        line-height: 1.5 !important;
      }
    }

    /* Prevent any text overlap */
    .heading-box__group {
      margin-top: auto;
    }
  `}</style>
</section>

<section className="section-description mb-4">
  <div className="overview-box">
    <div>
      <div className="overview-box__group">
        <h2 className="heading-secondary ma-bt-lg pt-5">Quick facts</h2>
        <OverviewBox label="Next date" text={date} icon="calendar" />
        <OverviewBox label="Difficulty" text={tour.difficulty} icon="trending-up" />
        <OverviewBox label="Participants" text={`${tour.maxGroupSize} people`} icon="user" />
        <OverviewBox label="Rating" text={`${tour.ratingsAverage} / 5`} icon="star" />
      </div>

      <div className="overview-box__group">
        <h2 className="heading-secondary ma-bt-lg">Your tour guides</h2>
        {tour.guides.map((guide, index) => (
          <div className="overview-box__detail" key={index}>
            <img 
              src={`/img/users/${guide.photo}`} 
              alt={guide.name}
              className="overview-box__img" 
            />
            <span className="overview-box__label">
              {guide.role === 'lead-guide' ? 'Lead guide' : 
               guide.role === 'guide' ? 'Tour guide' : guide.role}
            </span>
            <span className="overview-box__text">{guide.name}</span>
          </div>
        ))}
      </div>
    </div>
  </div>

  <div className="description-box mb-4">
    <h2 className="heading-secondary ma-bt-lg pt-5">{`About ${tour.name} tour`}</h2>
    {paragraphs.map((paragraph, index) => (
      <p key={index} className="description__text">{paragraph}</p>
    ))}
  </div>

  <style>{`
    /* Add top margin to prevent covering by header/navigation */
    .section-description {
      margin-top: 2rem !important;
    }

    /* Big screen fixes - override the excessive padding */
    @media (min-width: 769px) {
      .section-description {
        display: flex !important;
        margin-top: calc(2rem - var(--section-rotate)) !important;
        padding-top:8rem;
      }
      
      .section-description > * {
        padding: 0 2rem !important; /* Reduced from 8vw */
        padding-top: 8vw !important;
        padding-bottom: 2rem !important;
        flex: 0 0 50% !important;
      }
      
      /* Add some space between the two columns */
      .overview-box {
        padding-right: 1rem !important;
      }
      
      .description-box {
        padding-left: 1rem !important;
      }
      
      /* Fix the overview-box centering */
      .overview-box {
        justify-content: flex-start !important;
      }
    }

    /* Mobile responsive */
    @media (max-width: 768px) {
      .section-description {
        display: block !important;
        margin-top: 2rem !important;
        padding: 2rem 1rem !important;
      }
      
      .section-description > * {
        padding: 0 !important;
        padding-top: 0 !important;
        padding-bottom: 0 !important;
        flex: none !important;
        width: 100% !important;
      }
      
      .overview-box {
        margin-bottom: 3rem;
        justify-content: center !important;
        padding-top: 1rem !important;
      }
      
      .description-box {
        padding-top: 1rem !important;
      }
    }

    /* Very large screens - even less padding */
    @media (min-width: 1200px) {
      .section-description > * {
        padding: 0 3rem !important; /* Even less padding on very large screens */
        margin-top: 22vw !important;
      }
    }

    /* Extra margin for very small screens */
    @media (max-width: 480px) {
      .section-description {
        margin-top: 22vw !important;
        padding: 1.5rem 1rem !important;
      }
    }
  `}</style>
</section>
<section className="section-pictures mt-3">
  <div className="container-fluid px-0">
    <div className="row g-0 align-items-end">
      {tour.images.map((img, index) => (
        <div className="col-4" key={index}>
          <div className="picture-box position-relative">
            <img 
              src={`/img/tours/${img}`} 
              alt={`${tour.name} ${index + 1}`}
              className="picture-box__img w-100 h-100 object-fit-cover"
              style={{
                minHeight: '400px',
                transform: `translateY(${-index * 20}px)`
              }}
            />
          </div>
        </div>
      ))}
    </div>
  </div>

  <style>{`
    /* Reset original problematic CSS */
    .section-pictures {
      clip-path: none !important;
      -webkit-clip-path: none !important;
      margin-top: 0 !important;
      padding: 3rem 0 !important;
    }
    
    .picture-box {
      height: auto;
      overflow: visible;
    }
    
    .picture-box__img {
      display: block;
      border-radius: 0 !important;
    }
    
    /* Create consistent overlapping effect */
    .picture-box:nth-child(1) .picture-box__img {
      transform: translateY(-40px) !important;
    }
    
    .picture-box:nth-child(2) .picture-box__img {
      transform: translateY(-20px) !important;
    }
    
    .picture-box:nth-child(3) .picture-box__img {
      transform: translateY(0px) !important;
    }

    /* Mobile responsive */
    @media (max-width: 768px) {
      .section-pictures {
        padding: 2rem 0 !important;
      }
      
      .row {
        flex-direction: column !important;
        gap: 1rem !important;
      }
      
      .col-4 {
        width: 100% !important;
      }
      
      .picture-box__img {
        min-height: 300px !important;
        transform: none !important;
        border-radius: 8px !important;
      }
      
      /* Reset transforms on mobile */
      .picture-box:nth-child(1) .picture-box__img,
      .picture-box:nth-child(2) .picture-box__img,
      .picture-box:nth-child(3) .picture-box__img {
        transform: none !important;
      }
    }
    
    /* Tablet */
    @media (max-width: 1024px) and (min-width: 769px) {
      .picture-box__img {
        min-height: 350px !important;
      }
    }
    
    /* Large screens */
    @media (min-width: 1200px) {
      .picture-box__img {
        min-height: 450px !important;
      }
    }
  `}</style>
</section>

      {/* <section className="section-map">
        <div 
          id="map" 
          ref={mapRef}
          data-locations={JSON.stringify(tour.locations)}
          style={{ height: '400px', background: '#eee' }}
        ></div>
      </section> */}

      {/* <section className="section-reviews">
        <div className="reviews">
          {tour.reviews.map((review, index) => (
            <ReviewCard key={index} review={review} />
          ))}
        </div>
      </section> */}

<section className="section-cta">
  <div className="cta">
    <div className="cta__img cta__img--logo">
      <img src="/img/logo-white.png" alt="Natours logo" />
    </div>
    <img 
      src={`/img/tours/${tour.images[1]}`} 
      alt="Tour picture"
      className="cta__img cta__img--1" 
    />
    <img 
      src={`/img/tours/${tour.images[2]}`} 
      alt="Tour picture"
      className="cta__img cta__img--2" 
    />
    <div className="cta__content">
      <h2 className="heading-secondary">What are you waiting for?</h2>
      <p className="cta__text">
        {`${tour.duration} days. 1 adventure. Infinite memories. Make it yours today!`}
      </p>
      
      {user ? (
        <button
          className="btn btn--green span-all-rows" 
          onClick={handleBookTour}
          data-tour-id={tour._id}
        >
          Book tour now!
        </button>
      ) : (
        <Link to="/login" className="btn btn--green span-all-rows">
          Log in to book tour
        </Link>
      )}
    </div>
  </div>

  <style>{`
    /* Button color for all screens */
    .btn--green {
      background-color: #2e864b !important;
      color: #fff !important;
      border: none !important;
      border-radius: 10rem !important;
      text-transform: uppercase !important;
      font-weight: 600 !important;
      transition: all 0.3s !important;
    }
    
    .btn--green:hover {
      background-color: #55c57a !important;
      transform: translateY(-2px) !important;
      box-shadow: 0 1rem 2rem rgba(0, 0, 0, 0.2) !important;
    }

    /* Mobile responsive fixes */
    @media (max-width: 768px) {
      .section-cta {
        margin-top: 0 !important;
        padding: 3rem 1rem !important;
        padding-bottom: 5rem !important;
        padding-top: 3rem !important;
        clip-path: none !important;
        -webkit-clip-path: none !important;
        /* Keep original background gradient */
        background: linear-gradient(to right bottom, #7dd56f, #28b487) !important;
      }
      
      .cta {
        position: relative !important;
        max-width: 100% !important;
        margin: 0 auto !important;
        overflow: visible !important;
        background-color: transparent !important;
        padding: 3rem 2rem !important;
        border-radius: 1rem !important;
        box-shadow: none !important;
        text-align: center;
      }
      
      .cta__img--logo,
      .cta__img--1,
      .cta__img--2 {
        display: none !important;
      }
      
      .cta__content {
        display: block !important;
        grid-template: none !important;
        text-align: center;
      }
      
      .heading-secondary {
        font-size: 2.2rem !important;
        margin-bottom: 1.5rem !important;
        text-align: center;
        color: #fff !important;
        background-image: none !important;
        -webkit-background-clip: initial !important;
        background-clip: initial !important;
        color: #fff !important;
      }
      
      .cta__text {
        font-size: 1.6rem !important;
        margin-bottom: 2rem !important;
        line-height: 1.6;
        color: #fff !important;
      }
      
      .btn--green {
        display: block !important;
        width: 100% !important;
        max-width: 280px;
        margin: 0 auto !important;
        padding: 1.2rem 2rem !important;
        font-size: 1.6rem !important;
      }
      
      .span-all-rows {
        grid-row: auto !important;
      }
    }

    /* Tablet */
    @media (max-width: 1024px) and (min-width: 769px) {
      .cta {
        padding: 6rem 3rem 6rem 15rem !important;
      }
      
      .cta__img--1 {
        transform: translate(-5%, -50%) scale(0.9) !important;
      }
      
      .cta__img--2 {
        transform: translate(10%, -50%) scale(0.85) !important;
      }
    }

    /* Restore original desktop design */
    @media (min-width: 1025px) {
      .section-cta {
        margin-top: calc(0px - var(--section-rotate)) !important;
        padding: 3rem !important;
        padding-bottom: 11rem !important;
        padding-top: calc(15rem + var(--section-rotate)) !important;
        background-color: #f7f7f7 !important;
      }
      
      .btn--green {
        padding: 1.4rem 3rem !important;
        font-size: 1.6rem !important;
      }
    }
  `}</style>
</section>
      <Footer/>
    </>
  );
};

export default TourDetail;