import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';

function TourCards() {
    const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTours = async () => {
      try {
        const res = await fetch('https://natours-1-zy39.onrender.com/api/v1/tours');
        const data = await res.json();
        console.log(data.data.data);
        setTours(data.data.data);
      } catch (err) {
        console.error('Failed to fetch tours:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTours();
  }, []);

  if (loading) return (
    <div className="d-flex justify-content-center align-items-center" style={{height: '50vh'}}>
      <div className="spinner-border text-success" role="status" style={{width: '3rem', height: '3rem'}}>
        <span className="visually-hidden">Loading tours...</span>
      </div>
    </div>
  );

  return (
    <main className="main">
      <div className="container-fluid">
        <div className="row g-4">
          {tours.map(tour => (
            <div className="col-12 col-sm-6 col-lg-4 me-5" key={tour._id}>
              <div className="card h-100 shadow-sm border-0 tour-card">
                <div className="card-header position-relative p-0 border-0" style={{height: '220px'}}>
                  <div className="card-picture position-relative h-100 w-100 overflow-hidden">
                    <div className="card-picture-overlay position-absolute top-0 start-0 w-100 h-100" 
                         style={{background: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.4) 100%)'}}></div>
                    <img 
                      src={`/img/tours/${tour.imageCover}`} 
                      alt={tour.name}
                      className="card-picture-img w-100 h-100 object-fit-cover" 
                      loading="lazy"
                    />
                  </div>
                  <h3 className="position-absolute bottom-0 start-0 text-white m-3 mb-2 fs-2 fw-bold" style={{textShadow: '2px 2px 4px rgba(0,0,0,0.7)'}}>
                    <span>{tour.name}</span>
                  </h3>
                </div>

                <div className="card-body d-flex flex-column p-4">
                  <h4 className="card-subheading text-success text-uppercase fw-bold fs-4 mb-3">
                    {`${tour.difficulty} ${tour.duration}-day tour`}
                  </h4>
                  <p className="card-text text-muted flex-grow-1 fs-5 lh-base">
                    {tour.summary}
                  </p>
                  
                  <div className="row g-3 mt-auto">
                    <div className="col-6">
                      <div className="d-flex align-items-center">
                        <svg className="card-icon me-3" width="24" height="24" style={{flexShrink: 0}}>
                          <use xlinkHref='/img/icons.svg#icon-map-pin'></use>
                        </svg>
                        <span className="card-data-text fs-5 fw-medium">
                          {tour.startLocation.description}
                        </span>
                      </div>
                    </div>
                    
                    <div className="col-6">
                      <div className="d-flex align-items-center">
                        <svg className="card-icon me-3" width="24" height="24" style={{flexShrink: 0}}>
                          <use xlinkHref='/img/icons.svg#icon-calendar'></use>
                        </svg>
                        <span className="card-data-text fs-5 fw-medium">
                          {new Date(tour.startDates[0]).toLocaleString('en-us', {
                            month: 'long', 
                            year: 'numeric'
                          })}
                        </span>
                      </div>
                    </div>
                    
                    <div className="col-6">
                      <div className="d-flex align-items-center">
                        <svg className="card-icon me-3" width="24" height="24" style={{flexShrink: 0}}>
                          <use xlinkHref='/img/icons.svg#icon-flag'></use>
                        </svg>
                        <span className="card-data-text fs-5 fw-medium">
                          {`${tour.locations.length} stops`}
                        </span>
                      </div>
                    </div>
                    
                    <div className="col-6">
                      <div className="d-flex align-items-center">
                        <svg className="card-icon me-3" width="24" height="24" style={{flexShrink: 0}}>
                          <use xlinkHref='/img/icons.svg#icon-user'></use>
                        </svg>
                        <span className="card-data-text fs-5 fw-medium">
                          {`${tour.maxGroupSize} people`}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="card-footer bg-transparent border-0 pt-0 p-4">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <p className="mb-2 fs-4 fw-bold text-dark">
                        {`$${tour.price}`}
                        <span className="text-muted ms-2 fs-5">per person</span>
                      </p>
                      <p className="mb-0 fs-5">
                        <span className="fw-bold text-dark">{tour.ratingsAverage}</span>
                        <span className="text-muted ms-2">{`rating (${tour.ratingsQuantity})`}</span>
                      </p>
                    </div>
                    <Link 
                      to={`/tour/${tour._id}`} 
                      className="btn btn-success fs-5 fw-bold px-4 py-3 mt-3"
                      style={{minWidth: '100px'}}
                    >
                      Details
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}

export default TourCards