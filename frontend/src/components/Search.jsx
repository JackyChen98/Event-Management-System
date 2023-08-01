import React, { useState, useEffect } from 'react';
import { Pagination, Button, Select } from 'antd';
import VisitorEvents from './VisitorEvents';
import Nav from './Nav';
import { Grid } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';

import config from '../config.json';

function Search(props) {
    const { Option } = Select;
    const navigate = useNavigate();
    const [filter, setFilter] = useState('all');
    const [events, setEvents] = useState([]);
    const [content, setContent] = useState(null);
    const [currentPage, setCurrentPage] = React.useState(1);
    const { searchcontent } = useParams();
    const [filteredEvents, setFilteredEvents] = useState([]);

    async function fetchAllEvents() {
        const response = await fetch(`${config.BACKEND_HOST}${config.BACKEND_PORT}/event/name/${content}`, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json',
            },
        });
        const data = await response.json();
        const eventList = [];
        for (const event of data) {
            const parsedTicketLeft = JSON.parse(event.eventTicketLeft);
            const sumTickets = Object.values(parsedTicketLeft).reduce((acc, value) => acc + value, 0);
            const eventDetail = [event.eventName, event.eventId, event.eventHolderId, event.eventType, event.eventDetailLocation, event.eventThumbnail, event.eventStartDate.slice(0, 10), event.eventTicketPrice, event.eventLocation, sumTickets];
            eventList.push(eventDetail);
        }
        setEvents(eventList);
    }

    useEffect(() => {
        const content = window.location.pathname.split('/')[2];
        setContent(content)
    }, [searchcontent]);

    useEffect(() => {
        if (content)
            fetchAllEvents();
    }, [content]);

    useEffect(() => {
        switch (filter) {
            case 'Music':
                setFilteredEvents(events.filter(event => event[3] === 'Music'));
                break;
            case 'Theatre':
                setFilteredEvents(events.filter(event => event[3] === 'Theatre'));
                break;
            case 'Sport':
                setFilteredEvents(events.filter(event => event[3] === 'Sport'));
                break;
            case 'Art':
                setFilteredEvents(events.filter(event => event[3] === 'Art'));
                break;
            case 'Movie':
                setFilteredEvents(events.filter(event => event[3] === 'Movie'));
                break;
            case 'Exhibition':
                setFilteredEvents(events.filter(event => event[3] === 'Exhibition'));
                break;
            case 'Lecture':
                setFilteredEvents(events.filter(event => event[3] === 'Lecture'));
                break;
            case 'Comedy':
                setFilteredEvents(events.filter(event => event[3] === 'Comedy'));
                break;
            case 'Workshop':
                setFilteredEvents(events.filter(event => event[3] === 'Workshop'));
                break;
            case 'Other':
                setFilteredEvents(events.filter(event => event[3] === 'Other'));
                break;
            default:
                setFilteredEvents(events);
                break;
        }
    }, [events, filter]);

    const ShowResults = () => {
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
                <Select defaultValue="All" style={{ width: 120 }} onChange={(value) => setFilter(value)}>
                    <Option value="Music">Music</Option>
                    <Option value="Theatre">Theatre</Option>
                    <Option value="Sport">Sport</Option>
                    <Option value="Art">Art</Option>
                    <Option value="Movie">Movie</Option>
                    <Option value="Exhibition">Exhibition</Option>
                    <Option value="Lecture">Lecture</Option>
                    <Option value="Comedy">Comedy</Option>
                    <Option value="Workshop">Workshop</Option>
                    <Option value="Other">Other</Option>
                </Select>
                <br />
                {filteredEvents.length > 0 ? `${filteredEvents.length} Results` : <p>No results found.</p> }
                <br />
                <br />
                <ShowResults />
            </div>
            <br />
        </>
    )
}
export default Search;
