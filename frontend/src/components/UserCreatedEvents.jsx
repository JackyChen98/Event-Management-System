import React, { useEffect, useState } from "react";
import config from "../config.json";
import { Button, Card, Image, Modal, notification, Pagination, Select, Tag, Tooltip } from 'antd';
import './UserCreatedEvents.css';
import Nav from "./Nav";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import defaultEvent from './defaultEvent.jpg';

const { Option } = Select;
const EVENTS_PER_PAGE = 5;

function UserCreatedEvents() {
    const token = localStorage.getItem('userId');
    const [events, setEvents] = useState([]);
    const [filteredEvents, setFilteredEvents] = useState([]);
    const [filter, setFilter] = useState('all');
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);

    const styles = {
        gridContainer: {
            display: 'grid',
            gridTemplateRows: 'auto 1fr auto',
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

    const detailButton = (id) => {
        navigate(`/eventdetail/${id}`);
    };
    const announceButton = (eventid) => {
        navigate(`/announcement/${eventid}`);
    };

    const cancelButton = (eventid) => {
        Modal.confirm({
            title: 'Are you sure you want to cancel this event?',
            content: 'This action cannot be undone!',
            onOk: async () => {

                // Get all commands and tickets
                const commandResponse = await fetch(`${config.BACKEND_HOST}${config.BACKEND_PORT}/command/query`, {
                    method: 'GET',
                });
                const commands = await commandResponse.json();

                const ticketResponse = await fetch(`${config.BACKEND_HOST}${config.BACKEND_PORT}/ticket/query`, {
                    method: 'GET',
                });
                const tickets = await ticketResponse.json();

                // Find the commands and tickets associated with this event
                const relatedCommandIds = commands.filter(command => command.eventId === eventid).map(command => command.commandId);
                console.log("relatedCommandIds: ", relatedCommandIds);
                const relatedTicketIds = tickets.filter(ticket => ticket.eventId === eventid).map(ticket => ticket.ticketId);

                console.log("relatedTicketIds: ", relatedTicketIds);
                // Delete related commands and tickets
                for (const commandId of relatedCommandIds) {
                    console.log("commandId: ", commandId);
                    await fetch(`${config.BACKEND_HOST}${config.BACKEND_PORT}/command/delete/${commandId}`, {
                        method: 'DELETE',
                    });
                }
                for (const ticketId of relatedTicketIds) {
                    console.log("ticketId: ", ticketId);
                    await fetch(`${config.BACKEND_HOST}${config.BACKEND_PORT}/ticket/delete/${ticketId}`, {
                        method: 'DELETE',
                    });
                }

                // Deletes the activity in the participant's participation list
                const eventResponse = await fetch(`${config.BACKEND_HOST}${config.BACKEND_PORT}/event/query/${eventid}`);
                if (eventResponse.ok) {
                    const eventData = await eventResponse.json();
                    const memberList = JSON.parse(eventData.eventMemberList);
                    console.log("Member List before deletion ：", memberList);
                    for (let i = 0; i < memberList.length; i++) {
                        const userId = memberList[i];
                        const userResponse = await fetch(`${config.BACKEND_HOST}${config.BACKEND_PORT}/user/query/${userId}`);
                        if (userResponse.ok) {
                            const userData = await userResponse.json();
                            let userParticipateActivityList = JSON.parse(userData.userParticipateActivityList);
                            let userVouchers = JSON.parse(userData.userVoucher);
                            console.log("Voucher Number：", userVouchers);
                            console.log("List of personal activity ids before deletion：", userParticipateActivityList);
                            userParticipateActivityList = userParticipateActivityList.filter(id => id !== eventid);
                            console.log("List of personal activity ids after deletion：", userParticipateActivityList);

                            // Add one 0.3 voucher to the user
                            const userNewsList = JSON.parse(userData.userNewsList || '[]');

                            // Add the new news to the list
                            userNewsList.push({
                                "message": "We are sorry to inform you that we have canceled the event, please confirm in time",
                                "holderId": token,
                                "time": new Date().toISOString(),
                                "status": "false"
                            });

                            userVouchers['0.3'] += 1;
                            const response_of_remove_participate_list = await fetch(`${config.BACKEND_HOST}${config.BACKEND_PORT}/user/update`, {
                                method: 'PUT',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({
                                    userId: userId,
                                    userParticipateActivityList: JSON.stringify(userParticipateActivityList),
                                    userVoucher: JSON.stringify(userVouchers),
                                    userNewsList: JSON.stringify(userNewsList),
                                }),
                            });
                            if (response_of_remove_participate_list.ok) {
                                console.log(`Deleting the participation list of ${userId} was successful`);
                                console.log("Updated voucher:", userVouchers);
                            } else {
                                console.log(`Deleting the participation list of ${userId} failed`);
                            }
                        }
                    }
                }


                // Remove the activity in the holder creation list
                const response_of_holder = await fetch(`${config.BACKEND_HOST}${config.BACKEND_PORT}/user/query/${token}`, {
                    method: 'GET',
                });
                if (response_of_holder.ok) {
                    const data = await response_of_holder.json();
                    let userHoldActivityList = JSON.parse(data.userHoldActivityList);
                    console.log("Before deletion of userHoldActivityList：", userHoldActivityList);
                    userHoldActivityList = userHoldActivityList.filter(id => id !== eventid);
                    console.log("After deletion of userHoldActivityList：", userHoldActivityList);
                    const response_of_remove_create_list = await fetch(`${config.BACKEND_HOST}${config.BACKEND_PORT}/user/update`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            userId: token,
                            userHoldActivityList: JSON.stringify(userHoldActivityList),
                        }),
                    });
                    if (response_of_remove_create_list.ok) {
                        console.log("Succeeded in deleting the holder's creation list.");
                    } else {
                        console.log("Failed to delete the holder's creation list.");
                    }
                } else {
                    console.log("Failed to fetch the holder's information.");
                }

                // Finally, delete the activities from the event table
                const response = await fetch(`${config.BACKEND_HOST}${config.BACKEND_PORT}/event/delete/${eventid}`, {
                    method: 'DELETE',
                },);
                if (response.ok) {

                    const data = await response.json();
                    console.log("Successfully in deleting the record in event table", data);
                    notification.success({ message: 'Event cancelled successfully! We returned 0.3 voucher to customer!' });
                    setTimeout(function () {
                        window.location.reload();
                    }, 3000);
                } else {
                    console.error('Error:', response.status);
                    notification.error({ message: 'Event cancellation failed!' });
                }


            },
            onCancel: () => {

            },
        });
    };

    const startIndex = (currentPage - 1) * EVENTS_PER_PAGE;
    const endIndex = startIndex + EVENTS_PER_PAGE;
    const eventsToDisplay = filteredEvents.slice(startIndex, endIndex);

    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch(`${config.BACKEND_HOST}${config.BACKEND_PORT}/user/query/${token}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const data = await response.json();
                const userHoldActivityList = JSON.parse(data.userHoldActivityList);
                const eventDetails = await Promise.all(userHoldActivityList.map(async (id) => {
                    const response = await fetch(`${config.BACKEND_HOST}${config.BACKEND_PORT}/event/query/${id}`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    });

                    if (response.ok) {
                        return await response.json();
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
    }, []);

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
                    <h1>The activities you created: </h1>
                    <div className="events-wrapper">
                        {eventsToDisplay.map((event, index) => {
                            const imageSource = event.eventThumbnail ? event.eventThumbnail.replace(/"/g, '') : defaultEvent;
                            return (
                                <Card
                                    key={index}
                                    style={{ height: 'auto' }}
                                    className="event-card"
                                    cover={<Image
                                        className={new Date(event.eventStartDate) < new Date() ? 'past-event' : ''}
                                        src={imageSource} />}
                                >
                                    <div className="event-title">
                                        <h3>{event.eventName}</h3>
                                        {new Date(event.eventStartDate) < new Date() ?
                                            <Tag color="red">Past Event</Tag> :
                                            <Tag color="green">Upcoming Event</Tag>
                                        }
                                    </div>
                                    <div>
                                        <p><strong>Description:</strong> <span
                                            style={{ color: 'blue' }}>{event.eventDescription}</span></p>
                                        <p><strong>Location:</strong> <span
                                            style={{ color: 'green' }}>{event.eventLocation}</span></p>
                                        <p><strong>Start Date:</strong> <span
                                            style={{ color: 'purple' }}>{new Date(event.eventStartDate).toLocaleDateString('en-GB')}</span>
                                        </p>
                                        <p><strong>End Date:</strong> <span
                                            style={{ color: 'red' }}>{new Date(event.eventEndDate).toLocaleDateString('en-GB')}</span>
                                        </p>
                                        <Button type="primary" style={{ marginRight: '10px' }}
                                            onClick={() => detailButton(event.eventId)}>Detail</Button>
                                        <Button type="default" style={{ marginRight: '10px' }}
                                            onClick={() => announceButton(event.eventId)}>Announce</Button>
                                        <Tooltip title="Cannot cancel less than 7 days before the event starts.">
                                            <Button danger onClick={() => cancelButton(event.eventId)} disabled={new Date(event.eventStartDate) < new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000)}>Cancel</Button>
                                        </Tooltip>
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
                <br />
            </div>
        </>
    );

}

export default UserCreatedEvents;
