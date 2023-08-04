import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Typography } from '@mui/material';
import defaultEventThumbnail from './defaultEventThumbnail.jpg';
import { UserOutlined, EnvironmentOutlined, FieldTimeOutlined, WalletOutlined, StarFilled } from '@ant-design/icons';
import config from '../config.json';

const VisitorEvents = (props) => {
    const navigate = useNavigate();
    const [holder, setHolder] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [lowestPrice, setLowestPrice] = useState('');

    async function holderName(id) {
        const response = await fetch(`${config.BACKEND_HOST}${config.BACKEND_PORT}/user/query/${id}`, {
            method: 'GET',
            headers: {
                'Content-type': 'application/json',
                Authorization: `Bearer ${props.token}`,
            },
        });
        const data = await response.json();
        setHolder(data.userName);
    }

    useEffect(() => {
        holderName(props.holder);
        const parsedPrice = JSON.parse(props.price);
        const entries = Object.entries(parsedPrice);
        const minPrice = Math.min(...entries.map(([key, value]) => parseInt(key)));
        setLowestPrice(minPrice);
    }, [props.holder, props.price]);

    const detailButton = () => {
        navigate(`/eventdetail/${props.id}`);
    };

    const imageSource = props.img ? props.img.replace(/"/g, '') : defaultEventThumbnail;

    const locationText = props.location.length > 13
        ? props.location.substring(0, 13) + '...'
        : props.location;

    const cardStyle = {
        position: 'relative',
        cursor: 'pointer',
        width: 200,
        height: 420,
        margin: '20px',
        flex: '1',
        overflow: 'hidden',
        borderRadius: '8px',
        boxShadow: isHovered ? '0px 8px 8px rgba(0, 0, 0, 1)' : 'none',
        background: '#f1f1f1',
    };

    const imageContainerStyle = {
        position: 'relative',
        backgroundColor: '#000',
        height: '250px',
    };

    const textStyle = {
        position: 'relative',
        height: '150px',
        bottom: 0,
        left: 0,
        right: 0,
        padding: '0px 16px 16px 16px',
        textAlign: 'left',
        zIndex: 1,
        background: 'rgba(241, 241, 241, 0.8)',
    };

    const handleMouseEnter = () => {
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
    };

    return (
        <>
            <Card
                style={cardStyle}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                <div style={imageContainerStyle}>
                    <img
                        src={imageSource}
                        style={{
                            display: 'block',
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                        }}
                        alt="Event Image"
                        onClick={detailButton}
                    />
                </div>
                <div style={textStyle} onClick={detailButton}>
                    <Typography variant="h6" style={{ fontFamily: 'Arial', fontWeight: 'bold', marginBottom: '-10px' }}>
                        {props.title}
                    </Typography>
                    <Typography variant="body2" style={{ marginBottom: '-10px', fontWeight: 'bold' }}  >
                        <p ><StarFilled style={{ marginRight: '6px' }} />{props.type}</p>
                    </Typography>
                    <Typography variant="body2" style={{ marginBottom: '-10px' }}  >
                        <p style={{ color: '#c24d27' }}><FieldTimeOutlined style={{ marginRight: '6px' }} />{new Date(props.start).toLocaleDateString('en-GB')}</p>
                    </Typography>
                    <Typography variant="body2" style={{ marginBottom: '-10px' }}  >
                        <p style={{ color: '#828292', wordBreak: 'break-word' }}><EnvironmentOutlined style={{ marginRight: '6px' }} />
                            {locationText}
                        </p>
                    </Typography>
                    <Typography variant="body2" style={{ marginBottom: '-5px' }}  >
                        <p style={{ color: '#828292' }}><WalletOutlined style={{ marginRight: '6px' }} />Starts at <span style={{ fontWeight: 'bold', textDecoration: 'underline' }}>${lowestPrice}</span>!</p>
                    </Typography>
                    <Typography variant="body2">
                        <p><UserOutlined style={{ marginRight: '6px' }} />{holder}</p>
                    </Typography>
                </div>
            </Card>
        </>
    );
};

export default VisitorEvents;
