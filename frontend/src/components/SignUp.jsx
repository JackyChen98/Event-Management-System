import React, { useEffect, useState } from 'react';
import Nav from './Nav';
import { DatePicker, Space, Button, Input, Select, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import SignInPhoto from './SignInPhoto.jpg'
import config from '../config.json';

const SignUp = (props) => {
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [confirmpassword, setConfirmPassword] = React.useState('')
  const [birthday, setBirthday] = React.useState('')
  const [name, setName] = React.useState('')
  const navigate = useNavigate();
  const [location, setLocation] = React.useState('');
  const { Option } = Select;
  const [eventType, setEventType] = useState('Music');

  const dateChange = (dateString) => {
    if (!dateString) {
      setBirthday(null)
    }
    else {
      setBirthday(dateString.format('YYYY-MM-DD'));
    }
  };

  const handleEventTypeChange = (value) => {
    if (value === "") {
      setEventType("Music");
    } else {
      setEventType(value);
    }
  };

  async function register() {
    if (name == '') {
      message.error('Name cannot be empty!')
    }
    else if (!birthday) {
      message.error('Birthday cannot be empty!')
    }
    else if (location == '') {
      message.error('Postcode cannot be empty!')
    }
    else if (location.length !== 4) {
      message.error('Postcode must be exactly four digits!')
    }
    else if (confirmpassword != password) {
      message.error('Password does not match!')
    }

    else {
      const response = await fetch(`${config.BACKEND_HOST}${config.BACKEND_PORT}/user/insert`, {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify({
          userEmail: email,
          userPassword: password,
          userName: name,
          userBirthday: birthday,
          userPostcode: location,
          userTag: eventType
        })
      });

      const data = await response.json();
      if (data == -1) {
        message.error('Email cannot be empty!')
      }
      else if (data == -2) {
        message.error('Password cannot be empty!')
      }
      else if (data == 0) {
        message.error('Email has been exist!')
      }
      else {
        localStorage.setItem('userId', data);
        navigate('/payment')
      }
    }
  }
  if (!props.token) {
    return (
      <>
        <Nav />
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 32 }}>
          <div style={{ width: '50%', paddingLeft: '300px', fontSize: 'large' }}>
            <h2>Create an account</h2>
            <br />
            Email: <br /><Input label="Email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email address" style={{ width: 200, marginTop: 8 }} />
            <br /><br />
            Password:  <br /> <Space direction="vertical">
              <Input.Password label="Password" type='password' value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Input password" style={{ width: 200 }} />
            </Space>
            <br /><br />
            Confirm Password:  <br /> <Space direction="vertical">
              <Input.Password label="Password" type='password' value={confirmpassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm password" style={{ width: 200 }} />
            </Space>
            <br /><br />
            Name: <br /><Input label="Name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Set your name" style={{ width: 200, marginTop: 4 }} />
            <br /><br />
            Birthday:(YYYY-MM-DD)  <br /> <Space direction="vertical">
              <DatePicker style={{ width: 200, marginTop: 4 }} onChange={dateChange} />
            </Space>
            <br /><br />
            Postcode: <br /> <Space direction="vertical">
              <Input
                allowClear
                type='number'
                placeholder="Input your postcode"
                value={location}
                defaultValue={2020}
                style={{ marginBottom: 10, width: '605px', width: 200 }}
                onChange={(e) => setLocation(e.target.value)}
              />
            </Space>
            <br /><br />
            Your favourite event type: <br /><Select value={eventType} onChange={handleEventTypeChange} style={{ width: 200 }}>
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
            <br /><br />
            <Button type="primary" onClick={register}>Sign Up</Button>
          </div>
          <div style={{ width: '50%', display: 'flex', justifyContent: 'center', paddingRight: '300px' }}>
            <img
              src={SignInPhoto}
              height="83%"
              width="100%"
              component="img"
              alt="Logo"
            />
          </div>
        </div>
        <br />
      </>
    )
  } else {
    return <></>
  }
}

export default SignUp;
