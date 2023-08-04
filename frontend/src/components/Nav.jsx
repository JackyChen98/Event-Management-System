import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from './Logo.jpg';
import { Button, Input, Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import config from '../config.json';

const Nav = () => {
  const [userProfile, setUserProfile] = useState(null);
  const [userPhoto, setUserPhoto] = useState(null);
  const { Search } = Input;
  // const [selectedOption, setSelectedOption] = useState('eventtype');
  const route = window.location.pathname.split('/')[1];

  // const handleOptionChange = (value) => {
  //   setSelectedOption(value);
  // };

  const navigate = useNavigate();

  const logoutButton = () => {
    localStorage.removeItem('userId')
    navigate('/')
  }

  const profileLink = () => {
    navigate('/profile')
  }

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
      setUserPhoto(data.userThumbnail);
    } else {
      console.error('Error:', response.status);
    }
  };
  useEffect(() => {
    if (userProfile) {
      fetchUserId();
    }
  }, [userProfile]);

  const userAvatar = userPhoto ? (
    <Avatar src={userPhoto} size={30} style={{ marginRight: 16, cursor: 'pointer' }} onClick={profileLink} />
  ) : (
    <Avatar icon={<UserOutlined />} size={30} style={{ marginRight: 16, cursor: 'pointer' }} onClick={profileLink} />
  );

  const handleGameButtonClick = () => {
    navigate('/getvoucher');
  };
  const homePage = () => {
    if (userProfile) {
      navigate('/dashboard');
    }
    else {
      navigate('/')
    }
  };
  const createEvent = () => {
    navigate('/createevents');
  };

  const handleSearch = (value) => {
    if (!value.trim()) {
      return;
    }
    navigate(`/search/${value}`)

  };

  if (localStorage.getItem('userId') === null) {
    return (
      <>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
        }}>
          <img
            src={Logo}
            height='5%'
            width='5%'
            component='img'
            alt='Logo'
            onClick={homePage}
            style={{ cursor: 'pointer' }}
          />
          <Search
            placeholder='Search event'
            style={{ width: 300, marginRight: 15, marginTop: '18px' }}
            enterButton
            onSearch={handleSearch}
          />
          <div style={{ marginTop: 20 }}>
            <Button style={{ marginRight: 10 }}>
              <Link to='/signin'>SignIn</Link>
            </Button>
            <Button>
              <Link to='/signup'>SignUp</Link>
            </Button>
          </div>
        </div>
        <hr />
      </>
    );
  } else {
    return (
      <>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 10,
          }}
        >
          <img
            src={Logo}
            height='5%'
            width='5%'
            component='img'
            onClick={homePage}
            alt='Logo'
            style={{ cursor: 'pointer' }}
          />
          <div>
            {/* {route !== 'search' ? */}
              <Search
                placeholder='Search event'
                style={{ width: 300, marginRight: 15 }}
                enterButton
                onSearch={handleSearch}
              />
              {/* : */}
              {/* <></> */}
            {/* } */}

            <Button type='link' size='large' style={{ marginRight: 10 }} onClick={createEvent}>
              Create Event
            </Button>
            <Button
              type='link'
              size='large'
              onClick={handleGameButtonClick}
              style={{ marginRight: 10 }}
            >
              Get a voucher
            </Button>
            {userAvatar}
            <Button danger type='link' size='large' onClick={logoutButton}>
              Logout
            </Button>
          </div>
        </div>
        <hr />
      </>
    );
  }
};

export default Nav;
