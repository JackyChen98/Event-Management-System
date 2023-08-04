import React, { useState, useEffect } from 'react';
import { Pagination, Button } from 'antd';
import VisitorEvents from './VisitorEvents';
import { Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import config from '../config.json';
import Nav from './Nav';

const MoreJoin = () => {
    const [events, setEvents] = useState([]);
    const [userTag, setUserTag] = useState(null);
    const [userPostcode, setUserPostcode] = useState(null);
    const [userFollowing, setUserFollowing] = useState([]);
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
            const currentDate = new Date();
            const oneMonthLater = new Date();
            oneMonthLater.setMonth(currentDate.getMonth() + 1);
            if (sumTickets != 0 && eventStartDate >= currentDate && eventStartDate <= oneMonthLater) {
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

    // Pagination
    const indexOfLastEvent = currentPage * eventsPerPage;
    const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
    const currentEvents = events.slice(indexOfFirstEvent, indexOfLastEvent);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const cards = [];
    for (let i = 0; i < eventsPerPage; i++) {
        if (currentEvents[i]) {
            const event = currentEvents[i];
            cards.push(
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
        } else {
            cards.push(<div key={i} style={{ width: '300px', height: '400px' }}></div>);
        }
    }

    return (
        <div>
            <Nav />
            <Button onClick={() => window.history.back()}>Back</Button>
            <br />
            <div style={{ marginRight: '150px', marginLeft: '150px' }}>
                <Grid container spacing={4}>
                    {cards}
                </Grid>
            </div>
            <Pagination
                current={currentPage}
                onChange={handlePageChange}
                total={events.length}
                pageSize={eventsPerPage}
            />
        </div>
    );
};

export default MoreJoin;
