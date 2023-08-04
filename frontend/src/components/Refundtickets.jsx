import React, { useEffect, useState } from 'react';
import config from '../config.json';
import { Button, Modal, message, Table } from 'antd';
import Nav from "./Nav";
import { useNavigate } from 'react-router-dom';

const { confirm } = Modal;

function Refundtickets() {
    const navigate = useNavigate();
    const userId = localStorage.getItem('userId');
    const eventId = window.location.pathname.split('/')[2];
    const [ticketData, setTicketData] = useState([])
    const [eventName, setEventName] = useState(null)
    const [eventDetailLocation, setEventDetailLocatio] = useState(null)
    const [userParticipateActivityList, setUserParticipateActivityList] = useState([])
    const [eventMemberList, setEventMemberList] = useState([])
    const [eventTicketLeft, setEventTicketLeft] = useState({})
    const [isInSevenDays, setIsInSevenDays] = useState(false)


    const getRowLetter = (rowNumber) => {
        return String.fromCharCode(65 + rowNumber - 1);
    };

    const columns = [
        {
            title: 'ID',
            dataIndex: 'ticketId',
            key: 'ticketId',
            render: (text) => <span>{text}</span>,
        },
        {
            title: 'Price',
            dataIndex: 'ticketPrice',
            key: 'ticketPrice',
            render: (text) => <span>💲{text}</span>,
        },
        {
            title: 'Seat',
            dataIndex: 'ticketSeat',
            key: 'ticketSeat',
            render: (text) => (
                <span>{`${getRowLetter(text.ticketRow)}${text.ticketColumn}`}</span>
            ),
        },
        {
            title: 'Action',
            key: 'action',
            render: (record) => (
                <Button danger onClick={() => handleRefund(record.ticketId, record.ticketPrice)}>
                    Refund
                </Button>
            ),
        },
    ];

    const dataSource = ticketData.map((ticket, index) => ({
        key: index,
        ticketId: ticket.ticketId,
        ticketPrice: ticket.ticketPrice,
        ticketSeat: ticket,
    }));

    async function ticketDetail() {
        const response = await fetch(`${config.BACKEND_HOST}${config.BACKEND_PORT}/ticket/getId`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId: userId,
                eventId: eventId
            }),
        });
        const data = await response.json();
        setTicketData(data)
    }

    async function eventDetail() {
        const response = await fetch(`${config.BACKEND_HOST}${config.BACKEND_PORT}/event/query/${eventId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const data = await response.json();
        console.log(data)
        setEventDetailLocatio(data.eventDetailLocation)
        setIsInSevenDays(new Date(data.eventStartDate) - new Date() <= 7 * 24 * 60 * 60 * 1000)
        setEventName(data.eventName)
        setEventMemberList(data.eventMemberList)
        setEventTicketLeft(data.eventTicketLeft)
    }

    async function userDetail() {
        const response = await fetch(`${config.BACKEND_HOST}${config.BACKEND_PORT}/user/query/${userId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const data = await response.json();
        setUserParticipateActivityList(data.userParticipateActivityList)
    }

    useEffect(() => {
        if (!userId) {
            message.error('To access the requested content, please log in with your credentials.')
            navigate('/')
        }
        else {
            ticketDetail()
            eventDetail()
            userDetail()
        }
    }, []);



    const handleRefund = (ticketId, ticketPrice) => {
        if (isInSevenDays) {
            Modal.warning({
                title: 'Unfortunately, this event will start in 7 days, so you can\'t redeem tickets',
                content: (
                    <span></span>
                ),
                onOk() { },
            });
        }
        else {
            confirm({
                title: 'Are you sure to refund this ticket?  This event is amazing!',
                okText: 'Refund',
                cancelText: 'Back',
                onOk: () => {
                    fetch(`${config.BACKEND_HOST}${config.BACKEND_PORT}/ticket/delete/${ticketId}`, {
                        method: 'DELETE',
                        headers: {
                            'Content-type': 'application/json',
                        },
                    })
                        .then((response) => response.json())
                        .then((data) => {
                            if (data) {
                                const parsedParticipateActivityList = JSON.parse(userParticipateActivityList);
                                const indexToRemovePart = parsedParticipateActivityList.indexOf(Number(eventId));
                                if (indexToRemovePart !== -1) {
                                    parsedParticipateActivityList.splice(indexToRemovePart, 1);
                                }

                                const parsedEventMemberList = JSON.parse(eventMemberList);
                                const indexToRemoveMember = parsedEventMemberList.indexOf(Number(userId));
                                if (indexToRemoveMember !== -1) {
                                    parsedEventMemberList.splice(indexToRemoveMember, 1);
                                }
                                const parsedEventTicketLeft = JSON.parse(eventTicketLeft)
                                console.log(parsedEventTicketLeft)
                                if (parsedEventTicketLeft.hasOwnProperty(ticketPrice)) {
                                    parsedEventTicketLeft[ticketPrice] += 1;
                                }

                                fetch(`${config.BACKEND_HOST}${config.BACKEND_PORT}/user/update`, {
                                    method: 'PUT',
                                    headers: {
                                        'Content-type': 'application/json',
                                    },
                                    body: JSON.stringify({
                                        userId: userId,
                                        userParticipateActivityList: JSON.stringify(parsedParticipateActivityList),
                                    }),
                                })
                                fetch(`${config.BACKEND_HOST}${config.BACKEND_PORT}/event/update`, {
                                    method: 'PUT',
                                    headers: {
                                        'Content-type': 'application/json',
                                    },
                                    body: JSON.stringify({
                                        eventId: eventId,
                                        eventTicketLeft: JSON.stringify(parsedEventTicketLeft),
                                        eventMemberList: JSON.stringify(parsedEventMemberList),
                                    }),
                                })
                            }
                        })
                    message.success('Your booking fee and voucher you used will be back in 10 work days.', () => {
                        window.location.reload();
                    });
                },
                onCancel() { },
            });
        }
    };

    return (
        <>
            <Nav />
            <Button onClick={() => window.history.back()}>Back</Button>
            <div style={{ marginRight: '150px', marginLeft: '150px' }}>
                <h1>{eventName}</h1>
                <p>{eventDetailLocation}</p>
                <h3>Select the ticket you want to refund</h3>
                <h5 style={{ color: 'red' }} > If you use a coupon to purchase a ticket, it will not be returned.</h5>
                <Table columns={columns} dataSource={dataSource} pagination={false} />
            </div>
        </>
    )
}
export default Refundtickets;
