import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Avatar, Space } from 'antd';
import Nav from './Nav';

function Myprofile(props) {
  const token = localStorage.getItem('userId')
  const [user, setUser] = React.useState(null);
  const navigate = useNavigate();

  console.log(token)
  React.useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`http://172.20.10.12:8090/user/query/${token}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data);
      } else {
        console.error('Error:', response.status);
      }
    };
    fetchData();
  }, []);

  const pageStyle = {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr',
    gridTemplateRows: 'auto 1fr',
    height: '100vh',
  };

  const headerStyle = {
    gridColumn: '1 / span 2',
    padding: '5px',
    backgroundColor: '#ffffff',
  };

  const buttonStyle = {
    padding: '10px 20px',
    margin: '0 auto',

  };

  const buttonContainerStyle = {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '20px',
  };


  const contentStyle = {
    padding: '20px',
    backgroundColor: '#ffffff',
  };

  const sidebarStyle = {
    padding: '20px',
    backgroundColor: '#ffffff',
  };

  const iconContainerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '300px',
  };

  const iconStyle = {
    maxWidth: '100%',
    maxHeight: '100%',
  };

  const paraStyle = {
    textAlign: 'center'
  }

  if (!user) {
    return <div>Loading...</div>;
  } else {
    return (
      <>
        <div style={pageStyle} className="page">
          <header style={headerStyle} className="header">
            {/* <img src={Logo}  component="img" width='160px' height='60px' onClick={() => {navigate('/dashboard')}} alt="Logo" /> */}
            <Nav />
          </header>
          <div style={contentStyle} className="content">
            <h1 style={paraStyle}>My Profile</h1>
            <p style={paraStyle}>Name: {user.userName}</p>
            <p style={paraStyle}>Email: {user.userEmail}</p>
            <p style={paraStyle}>Birthday: {user.userBirthday}</p>
            <p style={paraStyle}>Postcode: {user.userPostcode}</p>
            <p style={paraStyle}>Royal Points: {user.userPoint}</p>
            <p style={paraStyle}>Coupon Amount: {user.userVoucherNum}</p>
            <div style={buttonContainerStyle}>
              <Button onClick={() => { navigate('/reset') }}>reset password</Button>
            </div>
            <div style={buttonContainerStyle}>
              <Button onClick={() => { navigate('/host') }}>manage created event</Button>
            </div>
            <div style={buttonContainerStyle}>
              <Button onClick={() => { navigate('/userevent') }}>manage participated event</Button>
            </div>
          </div>
          <aside style={sidebarStyle} className="sidebar">
            <div style={iconContainerStyle}>
              <Avatar shape="square" size={300} style={iconStyle} src={user.userThumbnail} alt="User icon" />
            </div>
            <div style={buttonContainerStyle}>
              <Button onClick={() => { navigate('/editprofile') }}>edit</Button>
            </div>
          </aside>
          <div />
        </div>
      </>
    );
  }
}


export default Myprofile;
