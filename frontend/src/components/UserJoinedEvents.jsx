import React, { useState, useEffect } from "react";
import config from "../config.json";
import { Button, Card, Image, Tag, Select, Pagination, message } from 'antd';
import './UserCreatedEvents.css'; // import the CSS file
import Nav from "./Nav";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import defaultEvent from './defaultEvent.jpg';

const { Option } = Select;
const EVENTS_PER_PAGE = 5;

const styles = {
    gridContainer: {
        display: 'grid',
        gridTemplateRows: 'auto 1fr',
        gridTemplateColumns: 'auto 2fr 1fr',
        height: '100vh'
    },
    navbar: {
        gridRow: '1 / 2',
        gridColumn: '1 / 4',
    },
    sidebar: {
        gridRow: '2 / 3',
        gridColumn: '1 / 2',
    },
    mainContent: {
        gridRow: '2 / 3',
        gridColumn: '2 / 4',
    },
};

function UserJoinedEvents() {
    const token = localStorage.getItem('userId');
    const [events, setEvents] = useState([]);
    const [filteredEvents, setFilteredEvents] = useState([]);
    const [filter, setFilter] = useState('all');
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        if (!token) {
            message.error('To access the requested content, please log in with your credentials.')
            navigate('/')
        }
        else {
            const fetchData = async () => {
                const response = await fetch(`${config.BACKEND_HOST}${config.BACKEND_PORT}/user/query/${token}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    const userJoinedActivity = JSON.parse(data.userParticipateActivityList);
                    const userJoinedActivityList = [...new Set(userJoinedActivity)];

                    const eventDetails = await Promise.all(userJoinedActivityList.map(async (id) => {
                        const response = await fetch(`${config.BACKEND_HOST}${config.BACKEND_PORT}/event/query/${id}`, {
                            method: 'GET',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                        });

                        if (response.ok) {
                            const eventData = await response.json();
                            return eventData;
                        } else {
                            console.error('Error:', response.status);
                        }
                    }));
                    // Sort events based on endDate, upcoming events first
                    eventDetails.sort((a, b) => new Date(a.eventStartDate) - new Date(b.eventStartDate));
                    setEvents(eventDetails);
                } else {
                    console.error('Error:', response.status);
                }
            };
            fetchData();
        }
    }, []);
    const detailButton = (id) => {
        navigate(`/eventdetail/${id}`);
    };

    const startIndex = (currentPage - 1) * EVENTS_PER_PAGE;
    const endIndex = startIndex + EVENTS_PER_PAGE;
    const eventsToDisplay = filteredEvents.slice(startIndex, endIndex);

    useEffect(() => {
        switch (filter) {
            case 'past':
                setFilteredEvents(events.filter(event => new Date(event.eventStartDate) < new Date()));
                break;
            case 'upcoming':
                setFilteredEvents(events.filter(event => new Date(event.eventStartDate) >= new Date()));
                break;
            default:
                setFilteredEvents(events);
                break;
        }
    }, [events, filter]);

    const handleButtonClick = (eventid) => {
        navigate(`/refundticket/${eventid}`);
    };

    return (
        <>
            <div style={styles.gridContainer}>
                <div style={styles.navbar}>
                    <Nav />
                </div>
                <div style={styles.sidebar}>
                    <Sidebar />
                </div>
                <div style={styles.mainContent}>
                    <Select defaultValue="all" style={{ width: 120 }} onChange={setFilter}>
                        <Option value="all">All Events</Option>
                        <Option value="past">Past Events</Option>
                        <Option value="upcoming">Upcoming Events</Option>
                    </Select>
                    <h1>The activities you joined: </h1>
                    <div className="events-wrapper">
                        {eventsToDisplay.map((event, index) => {
                            const imageSource = event.eventThumbnail ? event.eventThumbnail.replace(/"/g, '') : defaultEvent;
                            return (
                                <Card
                                    key={index}
                                    className="event-card"
                                    style={{ height: 'auto' }}
                                    cover={<Image className={new Date(event.eventStartDate) < new Date() ? 'past-event' : ''} src={imageSource} />}
                                >
                                    <div className="event-title">
                                        <h3>{event.eventName}</h3>
                                        {new Date(event.eventStartDate) < new Date() ?
                                            <Tag color="red">Past Event</Tag> :
                                            <>
                                                <Tag color="green">Upcoming Event</Tag>
                                                <Button onClick={() => handleButtonClick(event.eventId)} >Tickets</Button>
                                            </>
                                        }
                                    </div>
                                    <div>
                                        <p><strong>Description:</strong> <span style={{ color: 'blue' }}>{event.eventDescription}</span></p>
                                        <p><strong>Location:</strong> <span style={{ color: 'green' }}>{event.eventLocation}</span></p>
                                        <p><strong>Start Date:</strong> <span style={{ color: 'purple' }}>{new Date(event.eventStartDate).toLocaleDateString('en-GB')}</span></p>
                                        <p><strong>End Date:</strong> <span style={{ color: 'red' }}>{new Date(event.eventEndDate).toLocaleDateString('en-GB')}</span></p>
                                        <Button type="primary" onClick={() => detailButton(event.eventId)}>Detail</Button>
                                    </div>
                                </Card>
                            );
                        })}
                    </div>
                    <Pagination
                        current={currentPage}
                        total={filteredEvents.length}
                        pageSize={5}
                        onChange={(page) => setCurrentPage(page)}
                        showSizeChanger={false}
                        showQuickJumper={true}
                    />
                </div>
            </div>
        </>
    );

}

export default UserJoinedEvents;
