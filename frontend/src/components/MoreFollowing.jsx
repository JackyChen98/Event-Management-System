import React, { useState, useEffect } from 'react';
import { Pagination, Button } from 'antd';
import VisitorEvents from './VisitorEvents';
import Nav from './Nav';
import { Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import config from '../config.json';

const MoreFollowing = (props) => {
    const [events, setEvents] = useState([]);
    const [time, setTime] = useState([]);
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
                    Authorization: `Bearer ${props.token}`,
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
        setTime(eventList);
    }

    useEffect(() => {
        fetchAllEvents();
        fetchUserDetail()
    }, []);

    const filteredFollowingEvents = events.filter((event) => {
        const eventDates = new Date(event[6]);
        return eventDates >= currentDate && userFollowing.includes(event[2]);
    });
    filteredFollowingEvents.sort((a, b) => new Date(a[6]) - new Date(b[6]))

    const indexOfLastEvent = currentPage * eventsPerPage;
    const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
    const currentEvents = filteredFollowingEvents.slice(indexOfFirstEvent, indexOfLastEvent);

    const followingCards = [];
    for (let i = 0; i < eventsPerPage; i++) {
        if (currentEvents[i]) {
            const event = currentEvents[i];
            followingCards.push(
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
            followingCards.push(<div key={i} style={{ width: '300px', height: '400px' }}></div>);
        }
    }

    const paginate = pageNumber => setCurrentPage(pageNumber);

    return (
        <div>
            <Nav />
            <Button onClick={() => window.history.back()}>Back</Button>
            <br />
            <div style={{ marginRight: '150px', marginLeft: '150px' }}>
                <Grid container spacing={4}>
                    {followingCards}
                </Grid>
            </div>
            <Pagination
                current={currentPage}
                total={filteredFollowingEvents.length}
                pageSize={eventsPerPage}
                onChange={paginate}
            />
        </div>
    );
};


export default MoreFollowing;
