import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import VisitorEvents from './VisitorEvents';
import { Grid } from '@mui/material';
import Nav from './Nav';
import { FloatButton } from 'antd';
import { getTwoToneColor, setTwoToneColor, TagsOutlined } from '@ant-design/icons';
import config from '../config.json';
import defaultEvent from './defaultEvent.jpg';

const Visitor = (props) => {
  const navigate = useNavigate();
  const [upcoming, setUpcoming] = useState([]);
  const [type, setType] = useState([]);
  setTwoToneColor('#eb2f96');
  getTwoToneColor(); // #eb2f96

  async function fetchUpcoming() {
    const response = await fetch(`${config.BACKEND_HOST}${config.BACKEND_PORT}/event/upcoming`, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
      },
    });
    const data = await response.json();
    setUpcoming(data)
  }

  async function fetchType() {
    let data = []
    while (data.length == 0) {
      const Tag = ['Music', 'Theatre', 'Sport', 'Art', 'Movie', 'Workshop', 'Exhibition', 'Comedy', 'Lecture', 'Other']
      const randomIndex = Math.floor(Math.random() * Tag.length);
      const randomTag = Tag[randomIndex];
      const response = await fetch(`${config.BACKEND_HOST}${config.BACKEND_PORT}/event/homeType/${randomTag}`, {
        method: 'GET',
        headers: {
          'Content-type': 'application/json',
        },
      });
      data = await response.json();
    }
    setType(data)
  }

  useEffect(() => {
    fetchUpcoming();
    fetchType();
  }, []);

  const ShowEvents = () => {
    while (type.length < 4) {
      type.push(null);
    }
    const cards = type.slice(0, 4).map((event, i) => {
      if (!event) {
        return <div key={i} style={{ width: '290px', height: '400px' }}></div>;
      }

      return (
        <VisitorEvents
          key={i}
          title={event.eventName}
          id={event.eventId}
          holder={event.eventHolderId}
          type={event.eventType}
          location={event.eventDetailLocation}
          img={event.eventThumbnail}
          start={event.eventStartDate.slice(0, 10)}
          price={event.eventTicketPrice}
        />
      );
    });
    return (
      <Grid container spacing={4}>
        {cards}
      </Grid>
    );
  };

  const ShowRecommendEvents = () => {
    const recommendCards = upcoming.slice(0, 3).map((event, i) => {
      if (!event) {
        return (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <img
              src={defaultEvent}
              style={{ height: '300px', width: 'auto' }}
            />
          </div>
        )
      }
      else {
        const imageSource = event.eventThumbnail ? event.eventThumbnail.replace(/"/g, '') : defaultEvent;
        return (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <img
              src={imageSource}
              style={{ height: '300px', width: 'auto', cursor: 'pointer' }}
              onClick={() => detailButton(event.eventId)}
            />
          </div>
        );
      }

    });

    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
      const slideInterval = setInterval(() => {
        setCurrentSlide((prevSlide) => (prevSlide + 1) % recommendCards.length);
      }, 3000);

      return () => {
        clearInterval(slideInterval);
      };
    }, [recommendCards.length]);

    return (
      <div style={{ position: 'relative', width: '100%', overflow: 'hidden' }}>
        {recommendCards.map((card, index) => (
          <div
            key={index}
            style={{
              display: index === currentSlide ? 'block' : 'none',
              transition: 'opacity 0.5s ease',
            }}
          >
            {card}
          </div>
        ))}
      </div>
    );
  };

  const pastEvents = () => {
    navigate('/pastevents')
  }

  const detailButton = (id) => {
    navigate(`/eventdetail/${id}`);
  };

  const ShowTime = () => {
    while (upcoming.length < 4) {
      upcoming.push(null);
    }
    const cards = upcoming.slice(0, 4).map((event, i) => {
      if (!event) {
        return <div key={i} style={{ width: '290px', height: '400px' }}></div>;
      }

      return (
        <VisitorEvents
          key={i}
          title={event.eventName}
          id={event.eventId}
          holder={event.eventHolderId}
          type={event.eventType}
          location={event.eventDetailLocation}
          img={event.eventThumbnail}
          start={event.eventStartDate.slice(0, 10)}
          price={event.eventTicketPrice}
        />
      );
    });
    return (
      <Grid container spacing={4}>
        {cards}
      </Grid>
    );
  };

  return (
    <>
      <Nav />
      <ShowRecommendEvents />
      <div style={{ marginRight: '150px', marginLeft: '150px' }}>
        <h1 style={{ textDecoration: 'underline' }}><TagsOutlined style={{ marginRight: '6px', color: '#b0cae5' }} />Recommend</h1>
        <ShowEvents />
        <br />
        <h1 style={{ textDecoration: 'underline' }}><TagsOutlined style={{ marginRight: '6px', color: '#b0cae5' }} />Join an event ASAP!</h1>
        <ShowTime />
      </div>
      <FloatButton type="primary" description="All events" style={{ left: 20, width: 70, bottom: 0 }} shape="square" onClick={() => navigate('/allevents')}>All events</FloatButton>
      <FloatButton style={{ left: 20, width: 70, bottom: 50 }} onClick={pastEvents} description="Past events" shape="square" />
      <FloatButton.BackTop />
    </>
  );
}

export default Visitor;
