import React from 'react';
import { Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Nav from './Nav';
import VisitorEvents from './VisitorEvents';
import { Button, Pagination } from 'antd';
import config from '../config.json';

const Allevents = (props) => {
    const [events, setEvents] = React.useState([]);
    const [time, setTime] = React.useState([]);
    const [currentPage, setCurrentPage] = React.useState(1);
    const navigate = useNavigate();
    const currentDate = new Date();

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
            const eventDetail = [
                event.eventName,
                event.eventId,
                event.eventHolderId,
                event.eventType,
                event.eventDetailLocation,
                event.eventThumbnail,
                event.eventStartDate.slice(0, 10),
                event.eventTicketPrice
            ];
            const eventDates = new Date(eventDetail[6]);
            if (eventDates >= currentDate) {
                eventList.push(eventDetail);
            }
        }
        setEvents(eventList);
        setTime(eventList);
    }

    React.useEffect(() => {
        fetchAllEvents();
    }, []);

    const filteredEvents = time.filter((event) => {
        const eventDate = new Date(event[6]);
        return eventDate >= currentDate;
    });

    const ShowTime = () => {
        filteredEvents.sort((a, b) => (a[6] > b[6] ? 1 : -1));
        const startIndex = (currentPage - 1) * 4;
        const endIndex = Math.min(startIndex + 4, filteredEvents.length);
        const currentPageEvents = filteredEvents.slice(startIndex, endIndex);

        while (currentPageEvents.length < 4) {
            currentPageEvents.push(null);
        }

        const cards = currentPageEvents.map((event, i) => {
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

        return (
            <div>
                <Grid container spacing={4}>
                    {cards}
                </Grid>
                <Pagination
                    current={currentPage}
                    total={filteredEvents.length}
                    pageSize={4}
                    onChange={(page) => setCurrentPage(page)}
                    showSizeChanger={false}
                    showQuickJumper={true}
                />
            </div>
        );
    };

    return (
        <>
            <Nav />
            <Button onClick={() => window.history.back()}>Back</Button>
            <div style={{ marginRight: '150px', marginLeft: '150px' }}>
                <br />
                <br />
                <ShowTime />
            </div>
        </>
    );
};

export default Allevents;
