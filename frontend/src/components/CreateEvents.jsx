import React, { useEffect, useState } from 'react';
import { Button, Card, Form, Input, message, DatePicker, Select, InputNumber, Table, FloatButton } from 'antd';
import { EnvironmentOutlined, ClockCircleOutlined, PictureOutlined, FormOutlined } from '@ant-design/icons';
import moment from 'moment';
import Nav from './Nav';
import config from '../config.json';
import { useNavigate } from 'react-router-dom';

const CreateEvents = () => {
    const navigate = useNavigate();
    const { RangePicker } = DatePicker;
    const userId = JSON.parse(localStorage.getItem('userId'));
    const { Option } = Select;
    const { TextArea } = Input;
    const [holderId, setHolderId] = useState(null);   // id
    const [eventTitle, setEventTitle] = useState('');
    const [selectedRange, setSelectedRange] = useState(null);
    const [eventType, setEventType] = useState('');
    const [eventLocation, setEventLocation] = useState('');
    const [eventDetailLocation, setEventDetailLocation] = useState('');
    const [eventDescription, setEventDescription] = useState('');
    const [ticketTypes, setTicketTypes] = useState([]);
    const [ticketLeft, setTicketLeft] = useState({});
    const [seatCapacity, setSeatCapacity] = useState(1);
    const [seatLayout, setSeatLayout] = useState([]);
    const [totalTickets, setTotalTickets] = useState(0);
    const [seatRows, setSeatRows] = useState(0);
    const [formattedStartTime, setFormattedStartTime] = useState(null);
    const [formattedEndTime, setFormattedEndTime] = useState(null);
    const [isAddingTicketType, setIsAddingTicketType] = useState(false);
    const [isEditingTicketType, setIsEditingTicketType] = useState(false);
    const [editingTicketTypeIndex, setEditingTicketTypeIndex] = useState(null);
    const [editedTicketType, setEditedTicketType] = useState({});
    const [ticketPrice, setTicketPrice] = useState({});
    const [userHoldActivityList, setUserHoldActivityList] = useState([]);
    const [eventImg, setEventImg] = useState('');
    const [previewImg, setPreviewImg] = useState('');
    const [minSeats, setMinSeats] = useState(0);


    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            previewImage(file);

            reader.onload = (event) => {
                const img = new Image();
                img.src = event.target.result;

                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');

                    const maxWidth = 800;
                    const maxHeight = 800;
                    let width = img.width;
                    let height = img.height;

                    if (width > maxWidth) {
                        height *= maxWidth / width;
                        width = maxWidth;
                    }

                    if (height > maxHeight) {
                        width *= maxHeight / height;
                        height = maxHeight;
                    }

                    canvas.width = width;
                    canvas.height = height;

                    ctx.drawImage(img, 0, 0, width, height);

                    const compressedBase64 = canvas.toDataURL('image/jpeg', 0.6);
                    setEventImg(compressedBase64);
                };
            };
            reader.readAsDataURL(file);
        }
    };

    const columns = [
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
            render: (text) => <span style={{ wordBreak: 'break-word' }}>{text}</span>,
        },
        {
            title: 'Quantity',
            dataIndex: 'quantity',
            key: 'quantity',
            render: (text) => <span>{text}</span>,
        },
        {
            title: 'Price',
            dataIndex: 'price',
            key: 'price',
            render: (text) => <span>{text}</span>,
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record, index) => (
                <div style={{ display: 'flex' }}>
                    <Button onClick={() => handleEditTicketType(index)} style={{ marginRight: '5px' }}>Edit</Button>
                    <Button danger onClick={() => handleRemoveTicketType(index)}>Remove</Button>
                </div>
            ),
        },
    ];

    const data = ticketTypes.map((type, index) => ({
        key: index,
        description: type.description,
        quantity: type.quantity,
        price: type.price,
    }));

    const removeImage = () => {
        setPreviewImg(null);
        setEventImg(null);
    };

    const previewImage = (file) => {
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setPreviewImg(imageUrl);
        }
    };

    const handleEventTypeChange = (value) => {
        if (value === "") {
            setEventType("Music");
        } else {
            setEventType(value);
        }
    };

    const handleRangeChange = (dates) => {
        if (!dates || dates.length === 0) {
            setSelectedRange(null);
            setFormattedStartTime(null);
            setFormattedEndTime(null);
        } else {
            const [startTime, endTime] = dates;
            if (startTime.isBefore(moment(), 'day')) {
                message.error('Start time cannot be earlier than today.');
                return;
            }
            const StartTime = startTime.format('YYYY-MM-DD HH:mm:ss');
            const EndTime = endTime.format('YYYY-MM-DD HH:mm:ss');
            setSelectedRange(dates);
            setFormattedStartTime(StartTime)
            setFormattedEndTime(EndTime)
        }
    };


    useEffect(() => {
        if (!userId) {
            message.error('To access the requested content, please log in with your credentials.')
            navigate('/')
        }
        else {
            setHolderId(localStorage.getItem('userId'));
        }
    }, []);

    const handleAddTicketType = () => {
        setIsAddingTicketType(true);
    };

    const handleCancelAddTicketType = () => {
        setIsAddingTicketType(false);
        setEditedTicketType({
            description: '',
            quantity: 1,
            price: 0,
        });
    };

    const handleCancelCancelTicketType = () => {
        setIsEditingTicketType(false);
    };


    const handleConfirmTicketType = () => {
        if (!editedTicketType.description || !editedTicketType.quantity || !editedTicketType.price) {
            message.error('Please fill in all required fields.');
            return;
        }

        if (editedTicketType.price in ticketPrice) {
            message.error('Ticket price already exists.');
            return;
        }

        setTicketPrice((prevTicketPrice) => ({
            ...prevTicketPrice,
            [`${editedTicketType.price}`]: [editedTicketType.quantity, `${editedTicketType.description}`],
        }));

        setTicketLeft((prevTicketLeft) => ({
            ...prevTicketLeft,
            [editedTicketType.price]: editedTicketType.quantity
        }));

        setTicketTypes((prevTicketTypes) => {
            const updatedTicketTypes = [...prevTicketTypes, editedTicketType];
            return updatedTicketTypes;
        });

        setIsAddingTicketType(false);
        setEditedTicketType({});
    };

    const handleCommitTicketType = () => {
        if (!editedTicketType.description || !editedTicketType.quantity || !editedTicketType.price) {
            message.error('Please fill in all required fields.');
            return;
        }

        setTicketTypes((prevTicketTypes) => {
            const updatedTicketTypes = [...prevTicketTypes];
            updatedTicketTypes[editingTicketTypeIndex] = { ...editedTicketType };
            return updatedTicketTypes;
        });

        setIsEditingTicketType(false);
        setEditingTicketTypeIndex(null);
        setEditedTicketType({});
    };

    const handleEditTicketType = (index) => {
        const ticketTypeToEdit = ticketTypes[index];
        setEditedTicketType({ ...ticketTypeToEdit });
        setIsEditingTicketType(true);
        setEditingTicketTypeIndex(index);
    };

    const handleRemoveTicketType = (index) => {
        const removedTicketType = ticketTypes[index];

        const updatedTicketTypes = [...ticketTypes];
        updatedTicketTypes.splice(index, 1);
        setTicketTypes(updatedTicketTypes);

        setTicketPrice((prevTicketPrice) => {
            const updatedPrice = { ...prevTicketPrice };
            delete updatedPrice[removedTicketType.price];
            return updatedPrice;
        });

        setTicketLeft((prevTicketLeft) => {
            const updatedLeft = { ...prevTicketLeft };
            delete updatedLeft[removedTicketType.price];
            return updatedLeft;
        });
    };

    const fetchUser = () => {
        fetch(`${config.BACKEND_HOST}${config.BACKEND_PORT}/user/query/${holderId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((response) => response.json())
            .then((userData) => {
                setUserHoldActivityList(userData.userHoldActivityList)
            })
            .catch((error) => {
                console.log(error.message);
            });
    };

    useEffect(() => {
        if (holderId) {
            fetchUser();
        }
    }, [holderId]);

    const handleCreateEvent = () => {
        if (
            !eventTitle ||
            eventType === '' ||
            !eventLocation ||
            !eventDescription ||
            !formattedStartTime ||
            !formattedEndTime ||
            !eventLocation ||
            !eventDetailLocation ||
            !ticketPrice
        ) {
            message.error('Please fill in all required fields.');
            return;
        }

        // Calculate total tickets
        const totalTickets = ticketTypes.reduce((total, type) => total + type.quantity, 0);

        let eventImage = null; // Declare the eventImage variable outside of the if-else block

        if (eventImg) {
            eventImage = JSON.stringify(eventImg); // Assign the value if eventImg is not empty
        }

        if (totalTickets > 100) {
            message.error('Total tickets cannot exceed 100.');
            return;
        }

        fetch(`${config.BACKEND_HOST}${config.BACKEND_PORT}/event/insert`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                eventHolderId: holderId,
                eventName: eventTitle,
                eventType: eventType,
                eventDescription: eventDescription,
                eventStartDate: formattedStartTime,
                eventEndDate: formattedEndTime,
                eventLocation: eventLocation,
                eventDetailLocation: eventDetailLocation,
                eventThumbnail: eventImage,
                eventMaxRow: seatRows,
                eventMaxColumn: seatCapacity,
                eventTicketPrice: JSON.stringify(ticketPrice),
                eventTicketNum: totalTickets,
                eventTicketLeft: JSON.stringify(ticketLeft),
            }),
        })
            .then((response) => response.json())
            .then((data) => {
                let updatedList = [];
                if (userHoldActivityList) {
                    try {
                        updatedList = JSON.parse(userHoldActivityList);
                        if (!Array.isArray(updatedList)) {
                            updatedList = [];
                        }
                    } catch (error) {
                        console.log('Error parsing userHoldActivityList:', error.message);
                    }
                }
                updatedList.push(data);
                setUserHoldActivityList(JSON.stringify(updatedList));

                // Second fetch request
                fetch(`${config.BACKEND_HOST}${config.BACKEND_PORT}/user/update`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        userId: holderId,
                        userHoldActivityList: JSON.stringify(updatedList),
                    }),
                })
                    .then((response) => response.json())
                    .catch((error) => {
                        console.log(error.message);
                    });
            })
            .catch((error) => {
                message.error('Error creating event. Please try again.');
                console.log(error.message);
            });
        message.success('Event created successfully!', () => {
            navigate('/usercreatedevents')
        });
    };


    useEffect(() => {
        const generateSeatLayout = () => {
            const totalTickets = ticketTypes.reduce((total, type) => total + type.quantity, 0);
            if (totalTickets === 0 || seatCapacity === 0) {
                setSeatLayout([]);
                return;
            }

            const rows = Math.ceil(totalTickets / seatCapacity);
            const lastRowSeats = totalTickets % seatCapacity;
            setSeatRows(rows)

            const layout = [];

            const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

            for (let i = 0; i < rows; i++) {
                let rowSeats = seatCapacity;
                if (i === rows - 1 && lastRowSeats !== 0) {
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

        generateSeatLayout();
    }, [ticketTypes, seatCapacity]);

    useEffect(() => {
        const calculateTotalTickets = () => {
            const total = ticketTypes.reduce((total, type) => total + type.quantity, 0);
            setTotalTickets(total);

            const minValue = Math.floor(total / 10);
            setSeatCapacity((prevSeatCapacity) => {
                if (prevSeatCapacity < minValue) {
                    setMinSeats(minValue)
                    return minValue;
                }
                setMinSeats(prevSeatCapacity)
                return prevSeatCapacity;
            });
        };

        calculateTotalTickets();
    }, [ticketTypes]);

    useEffect(() => {
        return () => {
            if (previewImg) {
                URL.revokeObjectURL(previewImg);
            }
        };
    }, [previewImg]);


    const CardTitle = ({ icon, title, description }) => (
        <div style={{ display: 'flex', alignItems: 'center', padding: '8px' }}>
            {icon}
            <div>
                <h2 style={{ marginBottom: '-15px' }}>{title}</h2>
                <p>{description}</p>
            </div>
        </div>
    );

    return (
        <>
            <Nav />
            <div style={{ margin: '0px 250px 10px 250px' }}>
                <Card bordered={true} style={{ padding: '0px 100px' }}>
                    <CardTitle
                        icon={<FormOutlined style={{ fontSize: '30px', marginRight: '15px' }} />}
                        title="Basic Info"
                        description="Name your event and tell event-goers why they should come."
                    />
                    <span style={{ color: 'red' }}>* </span>
                    Event Title: <br />
                    <Input
                        allowClear
                        showCount maxLength={20}
                        placeholder="Event title"
                        value={eventTitle}
                        style={{ marginBottom: 10, width: '500px' }}
                        onChange={(e) => setEventTitle(e.target.value)}
                    />
                    <br />
                    <span style={{ color: 'red' }}>* </span>
                    Event Type: <br />
                    <Select value={eventType} onChange={handleEventTypeChange} style={{ width: '150px' }}>
                        <Option value="">Select Type</Option>
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
                </Card>

                <Card bordered={true} style={{ padding: '0px 100px' }}>
                    <CardTitle
                        icon={<EnvironmentOutlined style={{ fontSize: '30px', marginRight: '15px' }} />}
                        title="Location"
                        description="Help people in the area discover your event and let attendees know where to show up."
                    />
                    <h3>Venue location</h3>
                    <span style={{ color: 'red' }}>* </span>
                    Postcode: <br />
                    <Input
                        allowClear
                        type='number'
                        placeholder="Input the postcode"
                        value={eventLocation}
                        style={{ marginBottom: 10, width: '605px' }}
                        onChange={(e) => setEventLocation(e.target.value)}
                    />

                    <br />
                    <span style={{ color: 'red' }}>* </span>
                    Location: <br />
                    <TextArea
                        autoSize={{
                            minRows: 1,
                            maxRows: 3,
                        }}
                        allowClear
                        showCount maxLength={50}
                        placeholder="Input the address"
                        value={eventDetailLocation}
                        style={{ marginBottom: 10, width: '605px', wordBreak: 'break-word' }}
                        onChange={(e) => setEventDetailLocation(e.target.value)}
                    />
                </Card>

                <Card bordered={true} style={{ padding: '0px 100px' }}>
                    <CardTitle
                        icon={<ClockCircleOutlined style={{ fontSize: '30px', marginRight: '15px' }} />}
                        title="Date and Time"
                        description="Tell event-goers when your event starts and ends so they can make plans to attend."
                    />
                    <span style={{ color: 'red' }}>* </span>
                    <RangePicker showTime defaultValue={selectedRange} onChange={handleRangeChange} allowClear />
                </Card>

                <Card bordered={true} style={{ padding: '0px 100px' }}>
                    <CardTitle
                        icon={<PictureOutlined style={{ fontSize: '30px', marginRight: '15px' }} />}
                        title="Event Media"
                    />
                    <h3 style={{ marginBottom: '-15px' }}>Images</h3>
                    <p>Add photo to show what your event will be about.</p>
                    <Input
                        accept="image/*"
                        type="file"
                        onChange={handleImageChange}
                    />
                    <br />
                    {previewImg && (
                        <div>
                            <br />
                            <img src={previewImg} alt="Selected Image" style={{ width: '30%', height: '30%' }} />
                            <br />
                            <Button onClick={removeImage}>Remove</Button>
                        </div>
                    )}
                </Card>
                <Card bordered={true} style={{ padding: '0px 100px' }}>
                    <CardTitle
                        icon={<FormOutlined style={{ fontSize: '30px', marginRight: '15px' }} />}
                        title="Description"
                        description="Add more details to your event like your schedule, sponsors, or featured guests."
                    />
                    <span style={{ color: 'red' }}>* </span>
                    Description: <br />
                    <TextArea
                        autoSize={{
                            minRows: 3,
                            maxRows: 5,
                        }}

                        showCount maxLength={200}
                        allowClear
                        placeholder="Input description"
                        value={eventDescription}
                        style={{ marginBottom: 10, width: '605px', wordBreak: 'break-word' }}
                        onChange={(e) => setEventDescription(e.target.value)}
                    />
                </Card>
                <Card bordered={true} style={{ padding: '0px 100px' }}>
                    <CardTitle
                        icon={<FormOutlined style={{ fontSize: '30px', marginRight: '15px' }} />}
                        title="Tickets"
                        description="Define how many tickets you want to sell and the price."
                    />
                    <Button type="primary" onClick={handleAddTicketType} disabled={isAddingTicketType || isEditingTicketType} style={{ marginBottom: '5px' }}>
                        Add Ticket Type
                    </Button>
                    {isAddingTicketType && !isEditingTicketType && (
                        <div style={{ marginTop: '10px' }}>
                            <span style={{ color: 'red' }}>* </span>
                            Ticket Type Description:<br />
                            <TextArea
                                autoSize={{
                                    minRows: 3,
                                    maxRows: 5,
                                }}
                                allowClear
                                placeholder="Ticket Type Description"
                                style={{ marginBottom: '10px', width: '500px' }}
                                value={editedTicketType.description}
                                showCount maxLength={50}
                                onChange={(e) => setEditedTicketType((prev) => ({ ...prev, description: e.target.value }))}
                            /><br />
                            <span style={{ color: 'red' }}>* </span>
                            Ticket Quantity: <br />
                            <InputNumber
                                allowClear
                                placeholder="Quantity"
                                style={{ marginBottom: '10px', width: '150px' }}
                                value={editedTicketType.quantity}
                                onChange={(value) => setEditedTicketType((prev) => ({ ...prev, quantity: value }))}
                                min={1}
                                max={100}
                            /><br />
                            <span style={{ color: 'red' }}>* </span>
                            Ticket Price: <br />
                            <InputNumber
                                prefix="$"
                                allowClear
                                placeholder="Price"
                                style={{ marginBottom: '10px', width: '150px' }}
                                value={editedTicketType.price}
                                onChange={(value) => setEditedTicketType((prev) => ({ ...prev, price: value }))}
                                min={0}
                                max={10000}
                            /><br />
                            <Button type='primary' onClick={handleConfirmTicketType} style={{ marginRight: '15px' }}>Confirm</Button>
                            <Button danger onClick={handleCancelAddTicketType}>Cancel</Button>
                        </div>
                    )}
                    {!isAddingTicketType && !isEditingTicketType && (
                        <>
                            <Table columns={columns} dataSource={data} pagination={false} />
                        </>
                    )}
                    {isEditingTicketType && (
                        <div style={{ marginTop: '10px' }}>
                            <span style={{ color: 'red' }}>* </span>
                            Ticket Type Description:<br />
                            <TextArea
                                autoSize={{
                                    minRows: 3,
                                    maxRows: 5,
                                }}
                                allowClear
                                showCount maxLength={50}
                                placeholder="Ticket Type Description"
                                style={{ marginBottom: '10px', width: '500px', wordBreak: 'break-word' }}
                                value={editedTicketType.description}
                                onChange={(e) => setEditedTicketType((prev) => ({ ...prev, description: e.target.value }))}
                            /><br />
                            <span style={{ color: 'red' }}>* </span>
                            Ticket Quantity: <br />
                            <InputNumber
                                allowClear
                                placeholder="Quantity"
                                style={{ marginBottom: '10px', width: '150px' }}
                                value={editedTicketType.quantity}
                                onChange={(value) => setEditedTicketType((prev) => ({ ...prev, quantity: value }))}
                                min={1}
                                max={100}
                            /><br />
                            <span style={{ color: 'red' }}>* </span>
                            Ticket Price: <br />
                            <InputNumber
                                prefix="$"
                                allowClear
                                placeholder="Price"
                                style={{ marginBottom: '10px', width: '150px' }}
                                value={editedTicketType.price}
                                onChange={(value) => setEditedTicketType((prev) => ({ ...prev, price: value }))}
                                min={0}
                                max={10000}
                            /><br />
                            <Button type='primary' onClick={handleCommitTicketType} style={{ marginRight: '15px' }}>Commit</Button>
                            <Button danger onClick={handleCancelCancelTicketType}>Cancel</Button>
                        </div>
                    )}
                </Card>
                <Card bordered={true} style={{ padding: '0px 100px' }}>
                    <CardTitle
                        icon={<FormOutlined style={{ fontSize: '30px', marginRight: '15px' }} />}
                        title="Seat Layout"
                    />
                    <Form labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
                        <Form.Item label="Seats per Row">
                            <span style={{ color: 'red' }}>* </span>
                            <InputNumber
                                value={seatCapacity}
                                style={{ marginBottom: 10, width: '100px' }}
                                onChange={(value) => setSeatCapacity(
                                    value === null ?
                                        value = seatCapacity :
                                        value)}
                                min={minSeats}
                                max={10}
                            />
                            <p>Total Tickets: {totalTickets}</p>
                        </Form.Item>
                    </Form>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <div style={{ alignItems: 'center', display: 'flex', justifyContent: 'center', marginBottom: '10px', border: '1px solid #d9d9d9', fontSize: '30px', width: '200px', height: '100px' }}>Stage</div>
                        {seatLayout.map((row, index) => (
                            <div key={index} style={{ display: 'flex' }}>
                                {row.map((seat, seatIndex) => (
                                    <div
                                        key={seatIndex}
                                        style={{
                                            border: '1px solid #d9d9d9',
                                            borderRadius: '4px',
                                            width: '30px',
                                            height: '30px',
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            marginRight: '5px',
                                        }}
                                    >
                                        {`${String.fromCharCode(65 + index)}${seatIndex + 1}`}
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>

                </Card>

                <Button type="primary" onClick={handleCreateEvent} style={{ marginTop: '16px' }}>
                    Create Event
                </Button>
            </div>
            <FloatButton.BackTop />
        </>
    );
};

export default CreateEvents;
