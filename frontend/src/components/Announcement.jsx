import React, { useState, useEffect } from 'react';
import Nav from "./Nav";
import { Button, Card, Input, notification, Spin } from 'antd';
import config from "../config.json";
import { useNavigate, useParams } from "react-router-dom";
import defaultEvent from './defaultEvent.jpg';

function Announcement() {
    const navigate = useNavigate();
    const [event, setEvent] = useState({});
    const [announcement, setAnnouncement] = useState('');
    const [loading, setLoading] = useState(false);
    const { eventid } = useParams();
    const [eventthumbnail, setEventthumbnail] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch(`${config.BACKEND_HOST}${config.BACKEND_PORT}/event/query/${eventid}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const eventData = await response.json();
                setEvent(eventData);
                setEventthumbnail(eventData.eventThumbnail);
                // console.log(eventData.eventThumbnail)
            } else {
                console.error('Error:', response.status);
            }
        };

        fetchData();
    }, [eventid]);

    const handleAnnouncementChange = (e) => {
        setAnnouncement(e.target.value);
    };

    const handleAnnouncementSubmit = async () => {
        setLoading(true);
        const memberList = JSON.parse(event.eventMemberList);

        const updatePromises = memberList.map(async userId => {
            // Get the current user news list
            const userResponse = await fetch(`${config.BACKEND_HOST}${config.BACKEND_PORT}/user/query/${userId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!userResponse.ok) {
                throw new Error('Failed to fetch user ' + userId);
            }

            const userData = await userResponse.json();
            const userNewsList = JSON.parse(userData.userNewsList || '[]');

            // Add the new news to the list
            userNewsList.push({
                "message": announcement,
                "holderId": event.eventHolderId,
                "time": new Date().toISOString(),
                "status": "false"
            });

            // Update the user news list
            const updateResponse = await fetch(`${config.BACKEND_HOST}${config.BACKEND_PORT}/user/update`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: userId,
                    userNewsList: JSON.stringify(userNewsList),
                }),
            });

            if (!updateResponse.ok) {
                throw new Error('Failed to update user ' + userId);
            }
        });

        try {
            await Promise.all(updatePromises);
            notification.success({ message: 'Announcement sent successfully!' });
        } catch (error) {
            notification.error({ message: 'Failed to send some announcements' });
            console.error(error);
        } finally {
            setLoading(false);
        }
    };
    const handleButtonClick = () => {
        navigate('/usercreatedevents');
    };
    return (
        <>
            <Nav />
            <Button type="primary" onClick={handleButtonClick} style={{ marginTop: 16 }}>Go back</Button>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <Card title={event.eventName} style={{ marginBottom: 24, width: 800, margin: '0 auto' }}>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <img src={eventthumbnail ? eventthumbnail.replace(/"/g, '') : defaultEvent} alt="Event image"  height={'300px'}
                                            width={'auto'} style={{ marginBottom: 16 }} />
                    </div>
                    <p><strong>Date:</strong> {new Date(event.eventStartDate).toLocaleDateString('en-GB')} {new Date(event.eventStartDate).toLocaleTimeString('en-GB')}</p>
                    <p><strong>Location:</strong> {event.eventLocation}</p>
                    <p><strong>Description:</strong> {event.eventDescription}</p>
                    <hr />
                    <h2>Send Announcement to customers:</h2>
                    <Input.TextArea placeholder="Enter your announcement here" onChange={handleAnnouncementChange} autoSize={{
                        minRows: 3,
                        maxRows: 5,
                    }} style={{ marginBottom: 16 }} />
                    
                    <Button type="primary" onClick={handleAnnouncementSubmit} disabled={loading} style={{ marginTop: 16 }}>
                        {loading ? <Spin /> : 'Send'}
                    </Button>
                </Card>
            </div>
        </>
    );
}

export default Announcement;
