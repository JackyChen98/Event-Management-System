import React, { useState, useEffect } from 'react';
import { FloatButton, Button, message } from 'antd';
import VisitorEvents from './VisitorEvents';
import Nav from './Nav';
import { Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { TagsOutlined } from '@ant-design/icons';
import defaultEventThumbnail from './defaultEventThumbnail.jpg';
import defaultEvent from './defaultEvent.jpg';
import config from '../config.json';

function Dashboard() {
    const [userTag, setUserTag] = useState(null);
    const [userPostcode, setUserPostcode] = useState(0);
    const [userFollowing, setUserFollowing] = useState([]);
    const [postcode, setPostcode] = useState([]);
    const [upcoming, setUpcoming] = useState([]);
    const [type, setType] = useState([]);
    const [following, setFollowing] = useState([]);
    const navigate = useNavigate();
    const userId = JSON.parse(localStorage.getItem('userId'));

    async function fetchUserDetail() {
        const response = await fetch(`${config.BACKEND_HOST}${config.BACKEND_PORT}/user/query/${userId}`, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json',
            },
        });
        const data = await response.json();
        setUserTag(data.userTag)
        setUserFollowing(data.userFollowing)
        setUserPostcode(data.userPostcode)
    }

    async function fetchPostcode() {
        const response = await fetch(`${config.BACKEND_HOST}${config.BACKEND_PORT}/event/postcode/${userPostcode}`, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json',
            },
        });
        const data = await response.json();
        setPostcode(data)
    }

    async function fetchType() {
        const response = await fetch(`${config.BACKEND_HOST}${config.BACKEND_PORT}/event/homeType/${userTag}`, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json',
            },
        });
        const data = await response.json();
        setType(data)
    }

    async function fetchFollowing() {

        const response = await fetch(`${config.BACKEND_HOST}${config.BACKEND_PORT}/event/following/${userId}`, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json',
            },
        });
        const data = await response.json();
        setFollowing(data)
    }

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

    useEffect(() => {
        if (!userId) {
            message.error('To access the requested content, please log in with your credentials.')
            navigate('/')
        }
        else {
            fetchUserDetail()
        }
    }, []);

    useEffect(() => {
        if (userPostcode) {
            fetchPostcode();
            fetchUpcoming();
        }
        if (userTag) {
            fetchType();
        }
        if (userFollowing) {
            fetchFollowing();
        }
    }, [userPostcode, userTag, userId]);


    const ShowEventsType = () => {
        while (type.length < 4) {
            type.push(null);
        }

        const allNull = type.every(item => item === null);
        const countNull = type.filter(item => item === null).length;

        if (allNull) {
            return (
                <p>
                    We currently don't have any events tagged as {userTag}.
                </p>
            )
        }
        const recommendCards = type.slice(0, 4).map((event, i) => {
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
            <div>
                <Grid container spacing={4}>
                    {recommendCards}
                </Grid>
                {!(countNull > 0) &&
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Button onClick={recommandButton}>View More</Button>
                    </div>}
            </div>
        );
    };

    const ShowNearby = () => {
        while (postcode.length < 4) {
            postcode.push(null);
        }

        const allNull = postcode.every(item => item === null);
        const countNull = postcode.filter(item => item === null).length;

        if (allNull) {
            return (
                <p>
                    There are currently no events scheduled in the {userPostcode} area.
                </p>
            )
        }
        const nearbyCards = postcode.slice(0, 4).map((event, i) => {
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
            <div>
                <Grid container spacing={4}>
                    {nearbyCards}
                </Grid>
                {!(countNull > 0) && (
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Button onClick={nearbyButton}>View More</Button>
                    </div>
                )}
            </div>
        );
    };


    const ShowFollowing = () => {

        while (following.length < 4) {
            following.push(null);
        }

        const allNull = following.every(item => item === null);
        const countNull = following.filter(item => item === null).length;

        if (allNull) {
            return (
                <p>
                    The user you are following has not posted any activities yet.
                </p>
            )
        }
        const followingCards = following.map((event, i) => {
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
            <div>
                <Grid container spacing={4}>
                    {followingCards}
                </Grid>
                {!(countNull > 0) && (
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Button onClick={interestedButton}>View More</Button>
                    </div>
                )}
            </div>
        );
    };

    const ShowTime = () => {
        while (upcoming.length < 4) {
            upcoming.push(null);
        }

        const allNull = upcoming.every(item => item === null);
        const countNull = upcoming.filter(item => item === null).length;

        if (allNull) {
            return (
                <p>
                    No new events available at the moment.
                </p>
            )
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
            <div>
                <Grid container spacing={4}>
                    {cards}
                </Grid>
                {!(countNull > 0) && (
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Button onClick={joinButton}>View More</Button>
                    </div>
                )}
            </div>
        );
    };

    const detailButton = (id) => {
        navigate(`/eventdetail/${id}`);
    };

    const ShowRecommendEvents = () => {
        const recommendCards = upcoming.slice(0, 3).map((event, i) => {
            if (!event) {
                return (
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <img
                            src={defaultEventThumbnail}
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

    const allEvents = () => {
        navigate('/allevents');
    };

    const pastEvents = () => {
        navigate('/pastevents');
    };

    const recommandButton = () => {
        navigate('/morerecommand')
    }

    const interestedButton = () => {
        navigate('/moreinterested')
    }

    const joinButton = () => {
        navigate('/morejoin')
    }

    const nearbyButton = () => {
        navigate('/morenearby')
    }


    return (
        <>
            <Nav />
            <ShowRecommendEvents />
            <div style={{ marginRight: '150px', marginLeft: '150px' }}>
                <h1 style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', textDecoration: 'underline' }}>
                    <span>
                        <TagsOutlined style={{ marginRight: '6px', color: '#b0cae5' }} />Recommand
                    </span>
                </h1>
                <ShowFollowing />
                <hr />
                <br />
                <h1 style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', textDecoration: 'underline' }}>
                    <span>
                        <TagsOutlined style={{ marginRight: '6px', color: '#b0cae5' }} />You may be interested
                    </span>
                </h1>
                <ShowEventsType />
                <hr />
                <br />
                <h1 style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', textDecoration: 'underline' }}>
                    <span>
                        <TagsOutlined style={{ marginRight: '6px', color: '#b0cae5' }} />Join an event ASAP!
                    </span>
                </h1>
                <ShowTime />
                <hr />
                <br />
                <h1 style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', textDecoration: 'underline' }}>
                    <span>
                        <TagsOutlined style={{ marginRight: '6px', color: '#b0cae5' }} />Nearby
                    </span>
                </h1>
                <ShowNearby />
            </div>
            <FloatButton type="primary" onClick={allEvents} style={{ left: 20, width: 70, bottom: 10 }} description="All events" shape="square" />
            <FloatButton style={{ left: 20, width: 70, bottom: 60 }} onClick={pastEvents} description="Past events" shape="square" />
            <FloatButton.BackTop />
        </>
    );
}

export default Dashboard;
