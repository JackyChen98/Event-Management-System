import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Input, Space, message } from 'antd';
import Nav from './Nav';
import SignInPhoto from './SignInPhoto.jpg'
import config from '../config.json';

const SignIn = (props) => {
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const navigate = useNavigate();

    async function login() {
        
        const response = await fetch(`${config.BACKEND_HOST}${config.BACKEND_PORT}/user/login`, {
            method: 'PUT',
            headers: {
                'Content-type': 'application/json',
            },
            body: JSON.stringify({
                userEmail: email,
                userPassword: password,
            })
        });
        const data = await response.json();
        if (data === 0) {
            message.error('User does not exist!');
        } else if (data === -1) {
            message.error('Password does not match!');
        } else {
            localStorage.setItem('userId', data);
            navigate('/dashboard');
        }
    }

    return (
        <>
            <Nav />
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: 32 }}>
                <div style={{ width: '50%', paddingLeft: '300px', fontSize: 'large' }}>
                    <h2>Sign In</h2>
                    <br />
                    Email:
                    <br />
                    <Input
                        label="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email address"
                        style={{ width: 200, marginTop: 8 }}
                    />
                    <br /><br />
                    Password:
                    <br />
                    <Space direction="vertical" >
                        <Input.Password
                            label="Password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Input password"
                            style={{ marginBottom: 8, width: 200 }}
                        />
                    </Space>
                    <br /><br />
                    <Button type="primary" onClick={login}>
                        Sign In
                    </Button>
                </div>
                <div style={{ width: '50%', display: 'flex', justifyContent: 'center', paddingRight: '300px' }}>
                    <img
                        src={SignInPhoto}
                        height="100%"
                        width="100%"
                        component="img"
                        alt="Logo"
                    />
                </div>
            </div>
        </>
    );
};

export default SignIn;
