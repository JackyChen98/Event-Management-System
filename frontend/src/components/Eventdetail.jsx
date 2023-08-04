import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Card, Image, Avatar, Input, message, FloatButton } from 'antd';
import Nav from './Nav';
import './image.css';
import config from '../config.json';
import defaultEvent from './defaultEvent.jpg';
import { UserOutlined, CalendarOutlined, HeartFilled, EnvironmentOutlined } from '@ant-design/icons';

function EventDetail() {
    const navigate = useNavigate();
    const { eventid } = useParams();
    const currentDateTime = new Date();
    const [eventDetails, setEventDetails] = useState([]);
    const [imgSrc, setImgSrc] = useState(null);
    const [holderId, setHolderId] = useState(null);
    const [userParticipateActivityList, setUserParticipateActivityList] = useState([]);
    const [userDetails, setUserDetails] = useState(null);
    const [userProfile, setUserProfile] = useState(null);   // id
    const [userPhoto, setUserPhoto] = useState(null);
    const [eventStartDate, setEventStartDate] = useState(null);
    const [likeColor, setLikeColor] = useState('#888888');
    const [commandList, setCommandList] = useState(null);
    const [isEventStarted, setIsEventStarted] = useState(false);
    const [eventLikeList, setEventLikeList] = useState([]);
    const [commandDetails, setCommandDetails] = useState([]);
    const [userFollowed, setUserFollowed] = useState([]);
    const [userFollowing, setUserFollowing] = useState([]);
    const [userThumbnails, setUserThumbnails] = useState({});
    const [showFloatingContent, setShowFloatingContent] = useState(false);
    const [replyInputs, setReplyInputs] = useState([]);
    const [command, setCommand] = useState('');
    const [reply, setReply] = useState('');
    const [eventId, setEventId] = useState('');
    const [eventMemberList, setEventMemberList] = useState([]);
    const [userLikes, setUserLikes] = useState('')
    const [ticketLeft, setTicketLeft] = useState('')
    const [totalTicketLeft, setTotalTicketLeft] = useState('')
    const [lowestPrice, setLowestPrice] = useState('')
    const [eventTicketPrice, seteventTicketPrice] = useState('')
    const [isUserFollowed, setIsUserFollowed] = useState(false)
    const [userPoint, setUserPoint] = useState(0)

    useEffect(() => {
        setUserProfile(localStorage.getItem('userId'));
    }, []);

    const fetchUserId = async () => {
        const response = await fetch(`${config.BACKEND_HOST}${config.BACKEND_PORT}/user/query/${userProfile}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (response.ok) {
            const data = await response.json();
            // setUserLikes(data.userReceivedLikes)    // number
            setUserPhoto(data.userThumbnail);
            setUserFollowing(data.userFollowing);
            if (data.userParticipateActivityList) {
                setUserParticipateActivityList(JSON.parse(data.userParticipateActivityList));
            } else {
                setUserParticipateActivityList([]);
            }
        } else {
            console.error('Error:', response.status);
        }
    };

    const fetchCommandUserId = async (userId) => {
        try {
            const response = await fetch(`${config.BACKEND_HOST}${config.BACKEND_PORT}/user/query/${userId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (response.ok) {
                const data = await response.json();
                return data.userName;
            } else {
                console.error('Error:', response.status);
                return "Unknown User";
            }
        } catch (error) {
            console.error('Error fetching user:', error);
            return null;
        }
    };

    const fetchEventDetail = async () => {
        try {
            const response = await fetch(`${config.BACKEND_HOST}${config.BACKEND_PORT}/event/query/${eventid}`, {
                method: 'GET',
                headers: {
                    'Content-type': 'application/json',
                },
            });
            const data = await response.json(); // event detail
            if (data.error) {
                console.log(data.error);
            } else {
                seteventTicketPrice(data.eventTicketPrice)
                setTicketLeft(data.eventTicketLeft)
                setEventDetails([data]);
                const imageSource = data.eventThumbnail ? data.eventThumbnail.replace(/"/g, '') : defaultEvent;
                setImgSrc(imageSource)
                // setEventStartDate(new Date(data.eventStartDate));
                setEventStartDate(data.eventStartDate);
                setEventMemberList(data.eventMemberList)
                const userId = data.eventHolderId;
                setHolderId(data.eventHolderId);
                setEventId(data.eventId);
                const userResponse = await fetch(`${config.BACKEND_HOST}${config.BACKEND_PORT}/user/query/${userId}`);  // holder detail
                const userData = await userResponse.json(); // holder detail
                setUserPoint(userData.userPoint)
                setUserLikes(userData.userReceivedLikes)    // holder received likes
                setUserFollowed(userData.userFollowed);
                setUserDetails(userData);
                setEventLikeList(JSON.parse(data.eventLikeList));
                setCommandList(JSON.parse(data.eventCommandList));
                const commands = JSON.parse(data.eventCommandList);
                const commandPromises = commands.map(commandId => fetchCommand(commandId));
                await Promise.all(commandPromises);
            }
        } catch (error) {
            console.log('Error:', error);
        }
    };

    const eventLikedFunction = async () => {
        try {
            const response = await fetch(`${config.BACKEND_HOST}${config.BACKEND_PORT}/event/update`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    eventId: eventid,
                    eventLikeList: JSON.stringify(eventLikeList)
                })
            });
        } catch (error) {
            console.error('Error updating event like:', error);
        }

        try {
            const response_2 = await fetch(`${config.BACKEND_HOST}${config.BACKEND_PORT}/user/update`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: holderId,
                    userReceivedLikes: userLikes,
                    userPoint: userPoint
                })
            });
        }
        catch (error) {
            console.error('Error updating event like:', error);
        }
    };

    const fetchCommandDetails = async () => {
        if (commandList) {
            const details = await Promise.all(commandList.map((commandId) => fetchCommand(commandId)));
            const updatedDetails = await Promise.all(details.map(async (detail) => {
                if (detail && detail.userId) {
                    const userName = await fetchCommandUserId(detail.userId);
                    const userThumbnail = await fetchCommandUserThumbnail(detail.userId);
                    const commandReply = await fetchCommandReply(detail.commandReply);
                    setUserThumbnails(prevThumbnails => ({
                        ...prevThumbnails,
                        [detail.userId]: userThumbnail,
                    }));
                    return { ...detail, userName, commandReply };
                }
                return detail;
            }));
            setCommandDetails(updatedDetails);
        }
    };

    const fetchCommandUserThumbnail = async (userId) => {
        try {
            const response = await fetch(`${config.BACKEND_HOST}${config.BACKEND_PORT}/user/query/${userId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (response.ok) {
                const data = await response.json();
                return data.userThumbnail || null;
            } else {
                console.error('Error:', response.status);
                return null;
            }
        } catch (error) {
            console.error('Error fetching user thumbnail:', error);
            return null;
        }
    };

    const fetchCommandReply = async (replyList) => {
        if (!JSON.parse(replyList) || JSON.parse(replyList).length === 0) {
            return [];
        }

        const replyPromises = JSON.parse(replyList).map((replyId) => fetchCommandReplyById(replyId));
        const replyDetails = await Promise.all(replyPromises);

        const updatedReplyDetails = await Promise.all(
            replyDetails.map(async (reply) => {
                if (reply && reply.userId) {
                    const userName = await fetchCommandUserId(reply.userId);
                    const userThumbnail = await fetchCommandUserThumbnail(reply.userId);
                    return { ...reply, userName, userThumbnail };
                }
                return reply;
            })
        );

        return updatedReplyDetails.filter((reply) => reply !== null);
    };

    const fetchCommandReplyById = async (replyId) => {
        try {
            const response = await fetch(`${config.BACKEND_HOST}${config.BACKEND_PORT}/command/query/${replyId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (response.ok) {
                const data = await response.json();
                return {
                    replyDetail: data.commandDetail,
                    userId: data.userId,
                };
            } else {
                console.error('Error:', response.status);
                return null;
            }
        } catch (error) {
            console.error('Error fetching reply:', error);
            return null;
        }
    };

    useEffect(() => {
        fetchCommandDetails();
    }, [commandList]);

    const fetchCommand = async (commandId) => {
        try {
            const response = await fetch(`${config.BACKEND_HOST}${config.BACKEND_PORT}/command/query/${commandId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (response.ok) {
                const data = await response.json();
                return {
                    commandDetail: data.commandDetail,
                    userId: data.userId,
                    commandReply: data.commandReply, // command reply
                };
            } else {
                console.error('Error:', response.status);
                return null;
            }
        } catch (error) {
            console.error('Error fetching command:', error);
            return null;
        }
    };

    useEffect(() => {
        if (eventLikeList.includes(JSON.parse(userProfile))) {
            setLikeColor('red');
        } else {
            setLikeColor('#888888');
        }
        if (holderId && userProfile) {
            eventLikedFunction();
        }
    }, [eventLikeList, userProfile]);

    useEffect(() => {
        fetchEventDetail().then(() => { });
    }, [eventid]);

    useEffect(() => {
        if (userProfile) {
            fetchUserId();
        }
    }, [userProfile]);

    const getDayOfWeek = (dateString) => {
        const dateParts = dateString.split('/');
        const year = parseInt(dateParts[0], 10);
        const month = parseInt(dateParts[1], 10) - 1;
        const day = parseInt(dateParts[2], 10);
        const date = new Date(year, month, day);
        const dayOfWeek = date.getDay();
        const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

        return daysOfWeek[dayOfWeek];
    };

    const handleLikeClick = () => {
        if (eventLikeList.includes(JSON.parse(userProfile))) {
            setEventLikeList(prevList => prevList.filter(activityId => activityId !== JSON.parse(userProfile)));
            setUserLikes(userLikes - 1)
            setUserPoint(userPoint - 10)
            // remove
        } else {
            setEventLikeList(prevList => [...prevList, JSON.parse(userProfile)]);
            setUserLikes(userLikes + 1)
            setUserPoint(userPoint + 10)
            // add
        }
    };

    const holderAvatar = userDetails && userDetails.userThumbnail ? (
        <Avatar src={userDetails.userThumbnail} size={64} style={{ marginRight: 16 }} />
    ) : (
        <Avatar icon={<UserOutlined />} size={64} style={{ marginRight: 16 }} />
    );

    const userAvatar = userPhoto ? (
        <Avatar src={userPhoto} size={35} style={{ marginRight: 16 }} />
    ) : (
        <Avatar icon={<UserOutlined />} size={35} style={{ marginRight: 16 }} />
    );

    const holderReply = async (commandId) => {
        const response = await fetch(`${config.BACKEND_HOST}${config.BACKEND_PORT}/command/insert`, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
            },
            body: JSON.stringify({
                userId: JSON.parse(userProfile),
                eventId: eventId,
                commandDetail: reply,
                holderId: holderId
            })
        });
        const data = await response.json();
        const response_2 = await fetch(`${config.BACKEND_HOST}${config.BACKEND_PORT}/command/query/${commandId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const data_2 = await response_2.json();

        const replyListId = [...JSON.parse(data_2.commandReply), data]

        const response_3 = await fetch(`${config.BACKEND_HOST}${config.BACKEND_PORT}/command/update`, {
            method: 'PUT',
            headers: {
                'Content-type': 'application/json',
            },
            body: JSON.stringify({
                commandId: commandId,
                commandReply: JSON.stringify(replyListId), // Convert to JSON string
            })
        });
        message.success('Reply published!', 1, () => {
            window.location.reload();
        });
    }

    const commandPublishClick = async () => {
        const response = await fetch(`${config.BACKEND_HOST}${config.BACKEND_PORT}/command/insert`, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
            },
            body: JSON.stringify({
                userId: JSON.parse(userProfile),
                eventId: eventId,
                commandDetail: command,
                holderId: holderId
            })
        });

        const data = await response.json();
        setCommandList([...commandList, data]);
        const updatedCommandList = [...commandList, data]; // Updated commandList

        const response_2 = await fetch(`${config.BACKEND_HOST}${config.BACKEND_PORT}/event/update`, {
            method: 'PUT',
            headers: {
                'Content-type': 'application/json',
            },
            body: JSON.stringify({
                eventId: eventId,
                eventCommandList: JSON.stringify(updatedCommandList), // Convert to JSON string
            })
        });
        message.success('Comment published!', 1, () => {
            window.location.reload();
        });
    };

    const handleReplyButtonClick = (index) => {
        setReplyInputs(prevInputs => {
            const updatedInputs = [...prevInputs];
            updatedInputs[index] = !updatedInputs[index];
            return updatedInputs;
        });
    };

    const followFunction = () => {
        let followedList = []
        followedList = JSON.parse(userFollowed);
        followedList.push(parseInt(userProfile, 10));
        const response = fetch(`${config.BACKEND_HOST}${config.BACKEND_PORT}/user/update`, {
            method: 'PUT',
            headers: {
                'Content-type': 'application/json',
            },
            body: JSON.stringify({
                userId: holderId,
                userFollowed: JSON.stringify(followedList)
            })
        });

        let followingList = []
        followingList = JSON.parse(userFollowing);
        followingList.push(parseInt(holderId, 10));
        const response_2 = fetch(`${config.BACKEND_HOST}${config.BACKEND_PORT}/user/update`, {
            method: 'PUT',
            headers: {
                'Content-type': 'application/json',
            },
            body: JSON.stringify({
                userId: userProfile,
                userFollowing: JSON.stringify(followingList)
            })
        });
        window.location.reload();
    }

    const unfollowFunction = () => {
        const parsedFollowedList = JSON.parse(userFollowed);
        const indexToRemoveFollowed = parsedFollowedList.indexOf(Number(userProfile));
        if (indexToRemoveFollowed !== -1) {
            parsedFollowedList.splice(indexToRemoveFollowed, 1);
        }

        const response = fetch(`${config.BACKEND_HOST}${config.BACKEND_PORT}/user/update`, {
            method: 'PUT',
            headers: {
                'Content-type': 'application/json',
            },
            body: JSON.stringify({
                userId: holderId,
                userFollowed: JSON.stringify(parsedFollowedList)
            })
        });

        const parsedFollowingList = JSON.parse(userFollowing);
        const indexToRemoveFollowing = parsedFollowingList.indexOf(Number(holderId));
        if (indexToRemoveFollowing !== -1) {
            parsedFollowingList.splice(indexToRemoveFollowing, 1);
        }
        const response_2 = fetch(`${config.BACKEND_HOST}${config.BACKEND_PORT}/user/update`, {
            method: 'PUT',
            headers: {
                'Content-type': 'application/json',
            },
            body: JSON.stringify({
                userId: userProfile,
                userFollowing: JSON.stringify(parsedFollowingList)
            })
        });
        window.location.reload();
    }



    useEffect(() => {
        setIsUserFollowed(userFollowed.includes(userProfile))
    }, [userFollowed]);

    useEffect(() => {
        if (eventStartDate) {
            setIsEventStarted(currentDateTime >= new Date(eventStartDate));
        }
    }, [eventStartDate, currentDateTime]);

    useEffect(() => {
        if (eventTicketPrice) {
            const parsedPrice = JSON.parse(eventTicketPrice);
            const entries = Object.entries(parsedPrice);
            const minPrice = Math.min(...entries.map(([key, value]) => parseInt(key)));
            setLowestPrice(minPrice)
        }
    }, [eventTicketPrice]);

    useEffect(() => {
        if (ticketLeft) {
            const parsedTicketLeft = JSON.parse(ticketLeft);
            const sumTickets = Object.values(parsedTicketLeft).reduce((acc, value) => acc + value, 0);
            setTotalTicketLeft(sumTickets)
        }
    }, [ticketLeft]);

    const buyFunction = (eventid) => {
        navigate(`/buyticket/${eventid}`)
    }

    return (
        <>
            <Nav />
            <Button onClick={() => window.history.back()}>Back</Button>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
                <div>
                    {eventDetails && eventDetails.map(event => (
                        <Card key={event.eventId} style={{ marginBottom: 24, width: 800 }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '8px' }}>
                                <div style={{ textAlign: 'center', width: '100%' }} className="image-container">
                                    {imgSrc ?
                                        <Image
                                            height={'300px'}
                                            width={'auto'}
                                            src={imgSrc}
                                            style={{ margin: '0 auto', filter: 'drop-shadow(0 0 30px rgba(0, 0, 0, 0.8))' }}
                                        /> :
                                        <Image
                                            width={'100%'}
                                            height={'100%'}
                                            src={defaultEvent}
                                            style={{ margin: '0 auto' }}
                                        />}
                                </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'flex-end', padding: '8px' }}>
                                <div style={{ width: '100%' }}>
                                    <p>{getDayOfWeek(new Date(event.eventStartDate).toLocaleDateString())} {(new Date(event.eventStartDate)).toLocaleDateString('en-GB')}</p>
                                    <h1>{event.eventName}</h1>
                                    {userDetails && (
                                        <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #ccc', padding: '8px', marginRight: '30px' }}>
                                            {holderAvatar}
                                            <div style={{ flex: 1 }}>
                                                <span style={{ marginBottom: 4, color: '#888888' }}>By </span><span style={{ fontWeight: 'bold' }}>{userDetails.userName}</span>
                                                {userProfile ?
                                                    <>
                                                        {holderId == userProfile ? (
                                                            null
                                                        ) :
                                                            <>
                                                                {
                                                                    isUserFollowed ?
                                                                        <Button style={{ marginLeft: '10px' }} onClick={unfollowFunction}>Unfollow</Button>
                                                                        : <Button style={{ marginLeft: '10px' }} onClick={followFunction}>Follow</Button>
                                                                }
                                                            </>
                                                        }
                                                    </> :
                                                    <></>
                                                }
                                                <p>Created {(JSON.parse(userDetails.userHoldActivityList)).length} Event(s)</p>
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <span style={{ marginBottom: 4, color: '#888888' }}>{userDetails.userName} has gained </span>
                                                <p>
                                                    <HeartFilled
                                                        style={{ color: 'red', opacity: 0.5, marginRight: 16, fontSize: '35px', marginTop: '3px' }}
                                                    />
                                                    {userLikes} Like(s)
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div>
                                    {userProfile ?
                                        <>
                                            {isEventStarted ? (
                                                <div
                                                    style={{
                                                        display: showFloatingContent ? 'none' : 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        flexDirection: 'column',
                                                        border: '1px solid #ccc',
                                                        padding: '8px',
                                                        position: 'fixed',
                                                        top: '50%',
                                                        right: '20px',
                                                        transform: 'translateY(-50%)',
                                                        zIndex: 1000,
                                                        backgroundColor: '#ffffff',
                                                    }}
                                                >
                                                    <div style={{ textAlign: 'center', fontSize: '16px', marginBottom: '8px' }}>
                                                        How do you feel about this event?
                                                    </div>
                                                    <div style={{ textAlign: 'center', fontSize: '16px', marginBottom: '8px' }}>
                                                        Click to like/unlike it!
                                                    </div>
                                                    <HeartFilled
                                                        style={{ color: likeColor, opacity: 0.5, marginRight: 16, fontSize: '35px', cursor: 'pointer' }}
                                                        onClick={handleLikeClick}
                                                    />
                                                </div>

                                            ) : (
                                                totalTicketLeft !== 0 ? (
                                                    <div
                                                        style={{
                                                            display: showFloatingContent ? 'none' : 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            flexDirection: 'column',
                                                            border: '1px solid #ccc',
                                                            padding: '8px',
                                                            position: 'fixed',
                                                            top: '50%',
                                                            right: '20px',
                                                            transform: 'translateY(-50%)',
                                                            zIndex: 1000,
                                                            backgroundColor: '#ffffff',
                                                            borderRadius: '5px',
                                                        }}
                                                    >
                                                        <div style={{ textAlign: 'center', fontSize: '25px', marginBottom: '8px' }}>
                                                            💲{lowestPrice}
                                                        </div>
                                                        {totalTicketLeft} Ticket(s) left!
                                                        <button
                                                            style={{
                                                                alignSelf: 'center',
                                                                cursor: 'pointer',
                                                                height: '30px',
                                                                width: '250px',
                                                                marginTop: '15px',
                                                                color: 'white',
                                                                backgroundColor: '#bd3124',
                                                                border: '1px solid #ccc',
                                                                borderRadius: '5px',
                                                            }}
                                                            onClick={() => buyFunction(eventid)}
                                                        >
                                                            Get ticket!
                                                        </button>
                                                    </div>
                                                ) : <div
                                                    style={{
                                                        display: showFloatingContent ? 'none' : 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        flexDirection: 'column',
                                                        border: '1px solid #ccc',
                                                        padding: '8px',
                                                        position: 'fixed',
                                                        top: '50%',
                                                        right: '20px',
                                                        transform: 'translateY(-50%)',
                                                        zIndex: 1000,
                                                        backgroundColor: '#ffffff',
                                                        borderRadius: '5px',
                                                    }}
                                                >
                                                    <div style={{ textAlign: 'center', fontSize: '25px', marginBottom: '8px' }}>
                                                        💲{lowestPrice}
                                                    </div>
                                                    {totalTicketLeft} Ticket(s) left!
                                                    <button
                                                        disabled
                                                        style={{
                                                            alignSelf: 'center',
                                                            height: '30px',
                                                            width: '250px',
                                                            marginTop: '15px',
                                                            color: 'white',
                                                            backgroundColor: '#CCCCCC',
                                                            border: '1px solid #ccc',
                                                            borderRadius: '5px',
                                                        }}
                                                    >
                                                        No ticket left😭
                                                    </button>
                                                </div>
                                            )}
                                        </> : <></>
                                    }
                                </div>

                            </div>
                            <h2>When and where</h2>
                            <div style={{ display: 'flex', alignItems: 'center', padding: '8px' }}>
                                <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
                                    <div style={{ marginRight: '16' }}>
                                        <CalendarOutlined style={{ opacity: 0.5, marginRight: 16, fontSize: '24px', color: 'blue' }} />
                                    </div>
                                    <div style={{ flex: 1, alignItems: 'center' }}>
                                        <p style={{ fontWeight: 'bold' }}>Date and time</p>
                                        <p style={{ color: '#888888' }}>{getDayOfWeek(new Date(event.eventStartDate).toLocaleDateString()).slice(0, 3)} {(new Date(event.eventStartDate)).toLocaleDateString('en-GB')} {new Date(event.eventStartDate).toLocaleTimeString('en-GB')}{" "} -
                                            {" "}{getDayOfWeek(new Date(event.eventEndDate).toLocaleDateString()).slice(0, 3)} {(new Date(event.eventEndDate)).toLocaleDateString('en-GB')} {new Date(event.eventEndDate).toLocaleTimeString('en-GB')}
                                        </p>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', margin: '0 16px', borderLeft: '1px solid #ccc', height: '60px' }}></div>
                                <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
                                    <div style={{ marginRight: '16' }}>
                                        <EnvironmentOutlined style={{ opacity: 0.5, marginRight: 16, fontSize: '24px', color: 'blue' }} />
                                    </div>
                                    <div style={{ flex: 1, alignItems: 'center' }}>
                                        <span style={{ fontWeight: 'bold' }}>Location</span>
                                        <p style={{ color: '#888888', wordBreak: 'break-word' }}>{event.eventDetailLocation}</p>
                                    </div>
                                </div>
                            </div>
                            <h2>About this event</h2>
                            <div style={{ display: 'flex', alignItems: 'center', padding: '8px', color: '#888888' }}>
                                <p style={{ wordBreak: 'break-word' }}>{event.eventDescription}</p>
                            </div>

                            {isEventStarted ?
                                <>
                                    <h2>Comments</h2>
                                    {JSON.parse(eventMemberList).includes(parseInt(userProfile)) || userProfile == holderId ?
                                        <>
                                            {userAvatar}
                                            <Input
                                                showCount maxLength={200}
                                                placeholder="Share your experience now!"
                                                value={command}
                                                style={{ marginBottom: 10, width: '605px' }}
                                                onChange={(e) => setCommand(e.target.value)}
                                            />
                                            <Button type="primary" onClick={commandPublishClick} style={{ marginBottom: 10, marginLeft: '10px' }}
                                                disabled={!command}
                                            >
                                                Publish
                                            </Button>
                                        </> : null
                                    }

                                    <div style={{ border: '1px solid #ccc', paddingLeft: '20px' }}>
                                        {commandList &&
                                            commandList.map((commandId, index) => {
                                                const userName = commandDetails[index]?.userName;
                                                const userId = commandDetails[index]?.userId;
                                                const comment = commandDetails[index]?.commandDetail;
                                                const replyList = commandDetails[index]?.commandReply;
                                                const userThumbnail = userThumbnails[userId];

                                                return (
                                                    <div key={commandId} style={{ marginBottom: '16px' }}>
                                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                                {userThumbnail ? (
                                                                    <Avatar src={userThumbnail} size={50} style={{ marginRight: '8px' }} />
                                                                ) : (
                                                                    <Avatar icon={<UserOutlined />} size={50} style={{ marginRight: '8px' }} />
                                                                )}
                                                                <div>
                                                                    <p style={{ fontWeight: 'bold', marginBottom: '-16px' }}>{userName}
                                                                        {holderId == userId ? (<span style={{ color: '#888888' }}> (Holder)</span>) : (<span></span>)}</p>
                                                                    <p style={{ color: '#888888', wordBreak: 'break-word', width: '550px' }} >{comment}</p>
                                                                </div>
                                                            </div>
                                                            {holderId == userProfile ? (
                                                                <Button style={{ marginRight: '10px' }} onClick={() => handleReplyButtonClick(index)}>Reply</Button>
                                                            ) :
                                                                null
                                                            }
                                                        </div>

                                                        {replyInputs[index] && (
                                                            <div style={{ marginLeft: '55px', marginTop: '5px', marginRight: '15px' }}>
                                                                <Input
                                                                    placeholder="Reply:"
                                                                    showCount maxLength={200}
                                                                    value={reply}
                                                                    onChange={(e) => setReply(e.target.value)}
                                                                    style={{ width: '500px', marginRight: '15px' }}
                                                                />
                                                                <Button type="primary" onClick={() => holderReply(commandId)}
                                                                    disabled={!reply}
                                                                >Publish</Button>
                                                            </div>
                                                        )}

                                                        {replyList &&
                                                            replyList.map((reply, replyIndex) => {
                                                                const replyUserName = reply.userName;
                                                                const replyDetail = reply.replyDetail;
                                                                const replyUserThumbnail = reply.userThumbnail;

                                                                return (
                                                                    <div
                                                                        key={replyIndex}
                                                                        style={{
                                                                            display: 'flex',
                                                                            alignItems: 'center',
                                                                            marginLeft: '55px',
                                                                            marginTop: '5px',
                                                                            marginRight: '15px',
                                                                        }}
                                                                    >
                                                                        {replyUserThumbnail ? (
                                                                            <Avatar src={replyUserThumbnail} size={35} style={{ marginRight: '8px' }} />
                                                                        ) : (
                                                                            <Avatar icon={<UserOutlined />} size={35} style={{ marginRight: '8px' }} />
                                                                        )}
                                                                        <div>
                                                                            <p style={{ fontWeight: 'bold', marginBottom: '-16px' }}>{replyUserName}<span style={{ color: '#888888' }}> (Holder)</span></p>
                                                                            <p style={{ color: '#888888', wordBreak: 'break-word', width: '500px' }}>{replyDetail}</p>
                                                                        </div>
                                                                    </div>
                                                                );
                                                            })}
                                                    </div>
                                                );
                                            })}
                                    </div>
                                </> :
                                null}
                        </Card>
                    ))}
                </div>
            </div>
            <FloatButton.BackTop />
        </>
    );
}

export default EventDetail;
