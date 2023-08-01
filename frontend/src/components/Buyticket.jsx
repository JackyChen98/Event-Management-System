import React, { useEffect, useState } from 'react';
import config from '../config.json';
import { Card, Button, Radio, Divider, Image, message } from 'antd';
import { CreditCardOutlined } from '@ant-design/icons';
import Nav from "./Nav";
import defaultEventThumbnail from './defaultEventThumbnail.jpg';
import { useNavigate } from 'react-router-dom';

function Buyticket() {
    const userId = JSON.parse(localStorage.getItem('userId'));
    const eventId = window.location.pathname.split('/')[2];
    const [eventDetail, setEventDetail] = useState({});
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [eventImg, setEventImg] = useState(null);
    const [userVoucherData, setUserVoucherData] = useState({});
    const [selectedVoucher, setSelectedVoucher] = useState(null);
    const [discountedPrice, setDiscountedPrice] = useState(0);
    const [occupiedSeats, setOccupiedSeats] = useState([]);
    const [userParticipateActivityList, setUserParticipateActivityList] = useState([])
    const [eventTicket, setEventTicket] = useState({})
    const [eventMemberList, setEventMemberList] = useState([])
    const [eventHolderId, setEventHolderId] = useState(null)
    const [userPoint, setUserPoint] = useState(0)
    const [userTag, setUserTag] = useState(null)
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [totalTickets, setTotalTickets] = useState(0);
    const [seatLayout, setSeatLayout] = useState(null);
    const [seatRow, setSeatRow] = useState(null);
    const [seatCol, setSeatCol] = useState(null);
    const [ticketCount, setTicketCount] = useState(0);
    const [payButton, setPayButton] = useState(true);
    const navigate = useNavigate();

    const handleSeatSelect = (seat) => {
        const isSelected = selectedSeats.includes(seat);
        if (isSelected) {
            setSelectedSeats((prevSelectedSeats) => prevSelectedSeats.filter((selectedSeat) => selectedSeat !== seat));
        } else {
            setSelectedSeats((prevSelectedSeats) => [...prevSelectedSeats, seat]);
        }
    };

    const handleVoucherSelect = (value) => {
        setSelectedVoucher(value);
    };

    const handleCancelSelection = () => {
        setSelectedVoucher(null);
    };

    const fetchUserDetail = async () => {
        try {
            const response = await fetch(`${config.BACKEND_HOST}${config.BACKEND_PORT}/user/query/${userId}`, {
                method: 'GET',
                headers: {
                    'Content-type': 'application/json',
                },
            });
            const data = await response.json();
            setUserParticipateActivityList(data.userParticipateActivityList)
            setUserVoucherData(JSON.parse(data.userVoucher));
        } catch (error) {
            console.log('Error:', error);
        }
    };

    const fetchEventDetail = async () => {
        try {
            const response = await fetch(`${config.BACKEND_HOST}${config.BACKEND_PORT}/event/query/${eventId}`, {
                method: 'GET',
                headers: {
                    'Content-type': 'application/json',
                },
            });
            const data = await response.json();
            setSeatRow(data.eventMaxRow)
            setSeatCol(data.eventMaxColumn)
            const eventTicketPrice = JSON.parse(data.eventTicketPrice);
            const ticketPriceValues = Object.values(eventTicketPrice);
            setTotalTickets(ticketPriceValues.reduce((total, ticketInfo) => total + ticketInfo[0], 0))
            setUserTag(data.eventType)
            const eventHolderId = data.eventHolderId;
            setEventHolderId(eventHolderId);

            try {
                const userResponse = await fetch(`${config.BACKEND_HOST}${config.BACKEND_PORT}/user/query/${eventHolderId}`);
                const userData = await userResponse.json();
                if (userData && userData.userPoint !== undefined) {
                    setUserPoint(userData.userPoint);
                } else {
                    setUserPoint(null);
                }
            } catch (error) {
                console.log('Error fetching user data:', error.message);
            }
            setEventTicket(JSON.parse(data.eventTicketLeft))
            setEventMemberList(data.eventMemberList)
            const imageSource = data.eventThumbnail ? data.eventThumbnail.replace(/"/g, '') : defaultEventThumbnail;
            setEventImg(imageSource)
            data.eventTicketPrice = JSON.parse(data.eventTicketPrice); // Convert the JSON string to an object
            setEventDetail(data);
        } catch (error) {
            console.log('Error:', error);
        }
    };

    const fetchTicketDetail = async () => {
        try {
            const response = await fetch(`${config.BACKEND_HOST}${config.BACKEND_PORT}/ticket/query`, {
                method: 'GET',
                headers: {
                    'Content-type': 'application/json',
                },
            });
            const data = await response.json();
            const filteredTickets = data.filter(ticket => ticket.eventId === Number(eventId));
            const occupiedSeatsList = filteredTickets.map(ticket => ([ticket.ticketRow, ticket.ticketColumn]));
            setOccupiedSeats(occupiedSeatsList);
        } catch (error) {
            console.log('Error:', error);
        }
    }


    const handleTicketSelect = (e) => {
        const ticket = parseFloat(e.target.value);
        setSelectedTicket(ticket);
        setTicketCount(eventTicket[ticket])
    };

    useEffect(() => {
        if (selectedSeats && selectedTicket) {
            if (selectedSeats.length > ticketCount) {
                message.error('You have selected more tickets than the number of tickets available. Please choose a smaller quantity.')
                setPayButton(false)
            }
            else {
                const voucherDiscount = parseFloat(selectedVoucher) || 0;
                const discounted = selectedTicket * (1 - voucherDiscount) * (selectedSeats.length);
                setDiscountedPrice(discounted);
                setPayButton(true)
            }
        }
    }, [selectedVoucher, selectedSeats, selectedTicket]);

    const handleBuyTicket = () => {
        if (selectedTicket) {
            const selectedTickets = selectedSeats.map((seat) => {
                const [ticketRow, ticketColumn] = seatToNumber(seat);
                return {
                    userId: userId,
                    eventId: Number(eventId),
                    ticketRow: ticketRow,
                    ticketColumn: ticketColumn,
                    ticketPrice: Number(selectedTicket),
                };
            });

            Promise.all(selectedTickets.map((ticketData) => {
                return fetch(`${config.BACKEND_HOST}${config.BACKEND_PORT}/ticket/insert`, {
                    method: 'POST',
                    headers: {
                        'Content-type': 'application/json',
                    },
                    body: JSON.stringify(ticketData),
                });
            }))
                .then((responses) => Promise.all(responses.map((response) => response.json())))
                .then((dataArray) => {
                    const allTicketsPurchased = dataArray.every((data) => data !== null);
                    if (allTicketsPurchased) {

                        let updatedList = [];
                        if (userParticipateActivityList) {
                            try {
                                updatedList = JSON.parse(userParticipateActivityList);
                                if (!Array.isArray(updatedList)) {
                                    updatedList = [];
                                }
                            } catch (error) {
                                console.log('Error parsing userParticipateActivityList:', error.message);
                            }
                        }

                        if (selectedVoucher) {
                            userVoucherData[selectedVoucher] -= 1;
                        }

                        const eventIdToAdd = parseInt(eventId, 10);
                        const seatsToAdd = selectedSeats.length;
                        const eventIdArray = Array(seatsToAdd).fill(eventIdToAdd);

                        setOccupiedSeats((prevSeats) => [...prevSeats, ...selectedSeats]);
                        updatedList.push(...eventIdArray);

                        fetch(`${config.BACKEND_HOST}${config.BACKEND_PORT}/user/update`, {
                            method: 'PUT',
                            headers: {
                                'Content-type': 'application/json',
                            },
                            body: JSON.stringify({
                                userId: userId,
                                userVoucher: JSON.stringify(userVoucherData),
                                userParticipateActivityList: JSON.stringify(updatedList),
                                userTag: userTag
                            }),
                        })
                            .then((response) => response.json())
                            .then(() => {
                                const newEventTicket = { ...eventTicket };
                                newEventTicket[selectedTicket] -= selectedSeats.length;

                                let newEventMemberList = [];
                                try {
                                    newEventMemberList = JSON.parse(eventMemberList);
                                } catch (error) {
                                    console.log('Error parsing eventMemberList:', error.message);
                                }
                                newEventMemberList.push(...selectedSeats.map((seat) => parseInt(userId, 10)));

                                fetch(`${config.BACKEND_HOST}${config.BACKEND_PORT}/event/update`, {
                                    method: 'PUT',
                                    headers: {
                                        'Content-type': 'application/json',
                                    },
                                    body: JSON.stringify({
                                        eventId: eventId,
                                        eventTicketLeft: JSON.stringify(newEventTicket),
                                        eventMemberList: JSON.stringify(newEventMemberList),
                                    }),
                                });

                                const point = userPoint + selectedSeats.length;
                                fetch(`${config.BACKEND_HOST}${config.BACKEND_PORT}/user/update`, {
                                    method: 'PUT',
                                    headers: {
                                        'Content-type': 'application/json',
                                    },
                                    body: JSON.stringify({
                                        userId: eventHolderId,
                                        userPoint: point,
                                    }),
                                });
                            })
                            .catch((error) => {
                                console.log('Error:', error.message);
                            });

                        message.success(`Tickets purchased successfully!`, () => {
                            window.location.reload();
                        });
                    } else {
                        throw new Error('Error while purchasing the tickets.');
                    }
                })
                .catch((error) => {
                    console.log('Error:', error.message);
                });
        }
        else {
            message.error('Please select a ticket type!')
        }
    };

    const seatToNumber = (seat) => {
        const rowLetter = seat[0];
        const columnNumber = seat.slice(1);
        const rowNumber = rowLetter.charCodeAt(0) - 'A'.charCodeAt(0) + 1;
        return [rowNumber, parseInt(columnNumber)];
    }

    const seatLayoutFun = () => {
        if (totalTickets === 0 || seatCol === 0) {
            setSeatLayout([]);
            return;
        }

        const lastRowSeats = totalTickets % seatCol;

        const layout = [];

        const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

        for (let i = 0; i < seatRow; i++) {
            let rowSeats = seatCol;
            if (i === seatRow - 1 && lastRowSeats !== 0) {
                rowSeats = lastRowSeats;
            }

            const row = [];
            for (let j = 0; j < rowSeats; j++) {
                const seat = `${alphabet.charAt(i)}${j + 1}`;
                row.push(seat);
            }

            layout.push(row);
        }
        setSeatLayout(layout);
    };

    useEffect(() => {
        fetchUserDetail();
        fetchEventDetail();
        fetchTicketDetail();
    }, [userId]);

    useEffect(() => {
        if (!userId) {
            message.error('To access the requested content, please log in with your credentials.')
            navigate('/')
        }
    }, []);

    useEffect(() => {
        if (totalTickets != 0) {
            seatLayoutFun();
        }
    }, [totalTickets]);


    return (
        <div>
            <Nav />
            <Button onClick={() => window.history.back()}>Back</Button>
            <Card
                bordered={true}
                style={{ margin: '20px auto', maxWidth: '800px' }}
                title={<h2><CreditCardOutlined /> Ticket Selection</h2>}
            >
                <h2>Event Name: {eventDetail.eventName}</h2>
                <h3>Event Start: {eventDetail.eventStartDate}</h3>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    {eventDetail.eventThumbnail &&
                        <Image src={eventImg} alt="Event thumbnail" height='300px' width='auto' />}
                </div>
                <Divider />

                <h3>Choose Your Ticket Type</h3>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <Radio.Group onChange={handleTicketSelect}>
                        {eventDetail.eventTicketPrice && Object.entries(eventDetail.eventTicketPrice).map(([ticketPrice, ticketDetail]) => {
                            const [count, name] = ticketDetail;
                            const description = `Price: 💲${ticketPrice}, Seat Left: ${JSON.parse(eventDetail.eventTicketLeft)[ticketPrice]}`;
                            return (
                                <Radio key={ticketPrice} value={ticketPrice} disabled={JSON.parse(eventDetail.eventTicketLeft)[ticketPrice] === 0}>
                                    <Card title={name} bordered={false} style={{ width: '300px' }}>
                                        {description}
                                    </Card>
                                </Radio>
                            );
                        })}
                    </Radio.Group>
                </div>

                <Divider />
                <h3>Your Voucher Last:</h3>
                <Button onClick={handleCancelSelection} disabled={selectedVoucher === null}>
                    Cancel Selection
                </Button>
                <br />
                <Radio.Group
                    onChange={(e) => handleVoucherSelect(e.target.value)}
                    value={selectedVoucher}
                >
                    {userVoucherData && Object.entries(userVoucherData).map(([voucherType, voucherCount]) => {
                        const formattedVoucherType = (parseFloat(voucherType) * 100).toFixed(0) + '%';
                        const isDisabled = voucherCount === 0;
                        return (
                            <div key={voucherType}>
                                <Radio value={voucherType} disabled={isDisabled}>
                                    {`${formattedVoucherType}: ${voucherCount}`}
                                </Radio>
                                <br />
                            </div>

                        );
                    })}
                </Radio.Group>

                <Divider />
                <h3>Seats</h3>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{
                        alignItems: 'center',
                        display: 'flex',
                        justifyContent: 'center',
                        marginBottom: '10px',
                        border: '1px solid #d9d9d9',
                        fontSize: '30px',
                        width: '200px',
                        height: '100px'
                    }}>Stage
                    </div>
                    {seatLayout && seatLayout.map((row, rowIndex) => (
                        <div key={rowIndex} style={{ display: 'flex' }}>
                            {row.map((seat, colIndex) => {
                                const seatCode = `${String.fromCharCode(65 + rowIndex)}${colIndex + 1}`;
                                const isSelected = selectedSeats.includes(seatCode);
                                const isOccupied = occupiedSeats.some((occSeat) => occSeat[0] === rowIndex + 1 && occSeat[1] === colIndex + 1);
                                return (
                                    <div
                                        key={colIndex}
                                        onClick={isOccupied ? null : () => handleSeatSelect(seatCode)}
                                        style={{
                                            border: '1px solid #d9d9d9',
                                            borderRadius: '4px',
                                            width: '30px',
                                            height: '30px',
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            marginRight: '5px',
                                            backgroundColor: isOccupied ? '#d9d9d9' : (isSelected ? '#1890ff' : '#fff'),
                                            color: isSelected ? '#fff' : '#000',
                                            cursor: 'pointer',
                                        }}
                                    >
                                        {seatCode}
                                    </div>
                                );
                            })}
                        </div>
                    ))}
                </div>

                <Divider />
                <h3>Total Price: ${discountedPrice.toFixed(2)}</h3>
                <Button type="primary" onClick={handleBuyTicket} disabled={!payButton}>Pay Now</Button>
            </Card>
        </div>
    );

}

export default Buyticket;
