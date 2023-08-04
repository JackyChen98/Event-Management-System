import React, { useEffect } from 'react';
import { DatePicker, Button, Input, message, Card } from 'antd';
import { useNavigate } from 'react-router-dom';

const Payment = () => {
    const [cardNum, setCardNum] = React.useState('')
    const [date, setDate] = React.useState('')
    const [cvv, setCVV] = React.useState('')
    const userId = JSON.parse(localStorage.getItem('userId'));

    const navigate = useNavigate();

    useEffect(() => {
        if (!userId) {
            message.error('To access the requested content, please log in with your credentials.')
            navigate('/')
        }
    }, []);

    const pay = () => {
        navigate('/dashboard')
    }
    const dateChange = (dateString) => {
        setDate(dateString);
    };

    return (
        <>
            <Card
                style={{ justifyContent: 'center', textAlign: 'center' }}
            >
                <h1>Payment Detail</h1>
                <br /><br />
                Card Number: <Input value={cardNum} onChange={(e) => setCardNum(e.target.value)} placeholder="Card Number" style={{ width: 200, marginTop: 8 }} />
                <br /><br />
                Expiry Date: (MM/YY) 
                <DatePicker format={'MM/YY'} picker="month" onChange={dateChange} />
                <br /><br />
                CVV: <Input placeholder="CVV" style={{ width: 200, marginTop: 8 }} value={cvv} type='number' onChange={(e) => {
                    if (e.target.value < 0) {
                        e.target.value = 0
                    }
                    if (e.target.value.length < 4) {
                        setCVV(e.target.value)
                    } else {
                        e.target.value = e.target.value.slice(0, 3)
                    }
                }}
                />
                <br /><br />
                <Button onClick={pay} type="primary" style={{ marginRight: '20px' }}>Submit</Button>
            </Card>
        </>
    )
}
export default Payment;
