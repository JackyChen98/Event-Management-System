import React, { useState, useEffect } from 'react';
import { Pagination, Button } from 'antd';
import VisitorEvents from './VisitorEvents';
import Nav from './Nav';
import { Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import config from '../config.json';

const MoreNearby = () => {
    const [events, setEvents] = useState([]);
    const [userTag, setUserTag] = useState(null);
    const [userPostcode, setUserPostcode] = useState(null);
    const [userFollowing, setUserFollowing] = useState([]);
    const currentDate = new Date();
    const navigate = useNavigate();
    const userId = JSON.parse(localStorage.getItem('userId'));
    const [currentPage, setCurrentPage] = useState(1);
    const [eventsPerPage] = useState(4);

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

    async function fetchAllEvents() {
        const response = await fetch(`${config.BACKEND_HOST}${config.BACKEND_PORT}/event/query`, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json',
            },
        });
        const data = await response.json();
        const eventList = [];

        for (const e of data) {
            const response = await fetch(`${config.BACKEND_HOST}${config.BACKEND_PORT}/event/query/${e.eventId}`, {
                method: 'GET',
                headers: {
                    'Content-type': 'application/json',
                },
            });
            const event = await response.json();
            const parsedTicketLeft = JSON.parse(event.eventTicketLeft);
            const sumTickets = Object.values(parsedTicketLeft).reduce((acc, value) => acc + value, 0);
            const eventStartDate = new Date(event.eventStartDate);
            const timeDiff = Math.floor((eventStartDate - currentDate) / (24 * 60 * 60 * 1000));
            if (sumTickets != 0 && timeDiff <= 30) {
                const eventDetail = [event.eventName, event.eventId, event.eventHolderId, event.eventType, event.eventDetailLocation, event.eventThumbnail, event.eventStartDate.slice(0, 10), event.eventTicketPrice, event.eventLocation, sumTickets];
                eventList.push(eventDetail);
            }
        }
        setEvents(eventList);
    }

    useEffect(() => {
        fetchAllEvents();
        fetchUserDetail();
    }, []);

    const filteredNearbyEvents = events.filter((event) => {
        const eventDates = new Date(event[6]);
        return eventDates >= currentDate && userPostcode == event[8];
    });
    filteredNearbyEvents.sort((a, b) => new Date(a[6]) - new Date(b[6]))

    while (filteredNearbyEvents.length < 4) {
        filteredNearbyEvents.push(null);
    }

    const totalPages = Math.ceil(filteredNearbyEvents.length / eventsPerPage);

    const currentCards = filteredNearbyEvents.slice((currentPage - 1) * eventsPerPage, currentPage * eventsPerPage);

    const nearbyCards = currentCards.map((event, i) => {
        if (!event) {
            return <div key={i} style={{ width: '300px', height: '400px' }}></div>;
        }
        return (
            <VisitorEvents
                key={i}
                title={event[0]}
                id={event[1]}
                holder={event[2]}
                type={event[3]}
                location={event[4]}
                img={event[5]}
                start={event[6]}
                price={event[7]}
            />
        );
    });

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    return (
        <div>
            <Nav />
            <Button onClick={() => window.history.back()}>Back</Button>
            <br />
            <div style={{ marginRight: '150px', marginLeft: '150px' }}>
                <Grid container spacing={4}>
                    {nearbyCards}
                </Grid>
            </div>
            <Pagination current={currentPage} total={totalPages * eventsPerPage} onChange={handlePageChange} />
        </div>
    );
};

export default MoreNearby;
