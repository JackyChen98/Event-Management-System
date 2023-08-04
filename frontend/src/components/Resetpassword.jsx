import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Avatar, Space, Input, message } from 'antd';
import Nav from './Nav';
import Sidebar from './Sidebar';

function Resetpassword() {
  const token = localStorage.getItem('userId')
  const [user, setUser] = React.useState(null);
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();

  const [oldPassword, setOldPassword] = React.useState('');
  const [newPassword, setNewPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');

  const handleSubmit = async event => {
    event.preventDefault();

    const response = await fetch(`http://localhost:8090/user/query/${token}`);
    const data = await response.json();
    console.log(data)
    if (data.userPassword !== oldPassword) {
      messageApi.open({
        type: 'warning',
        content: 'The old password is wrong',
      });
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      return;
    }

    if (newPassword !== confirmPassword) {
      messageApi.open({
        type: 'warning',
        content: 'New password and confirmation password do not match, please re-enter!',
      });
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      return;
    }

    if (newPassword === oldPassword) {
      messageApi.open({
        type: 'warning',
        content: 'The new password cannot be the same as the old password, please re-enter!',
      });
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      return;
    }

    let formData = {
      "userId": token,
      "userPassword": newPassword
    };

    const updateResponse = await fetch(`http://localhost:8090/user/update`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body:JSON.stringify(formData)
    });

    if (updateResponse.ok) {
      if (updateResponse.headers.get('content-type').includes('application/json')) {
        const updateData = await updateResponse.json();
        console.log(updateData);
      } else {
        messageApi.open({
          type: 'success',
          content: 'Password updated successfully!',
        });
      }
    } else {
      console.error('Update failed:', updateResponse.status);
      messageApi.open({
        type: 'warning',
        content: 'Update failed',
      });
    }
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const styles = {
    gridContainer: {
      display: 'grid',
      gridTemplateRows: 'auto 1fr',
      gridTemplateColumns: 'auto 1fr', // Updated column template
      height: '100vh'
    },
    navbar: {
      gridRow: '1 / 2',
      gridColumn: '1 / 3', // Updated grid column
      // Styles for the navbar
    },
    sidebar: {
      gridRow: '2 / 3',
      gridColumn: '1 / 2',
      // Styles for the sidebar
    },
    mainContent: {
      gridRow: '2 / 3',
      gridColumn: '2 / 3',
      // Styles for the main content area
    },
    hrStyle: {
      marginLeft: "20px", 
      marginRight: "20px", 
      color: "#808080" 
    },
    h1Style: {
      marginLeft: "30px"
    },
    inputStyle: {
      width: '250px',
    },
    laberStyle: {
      paddingLeft: '80px',
    },
    buttonStyle: {
      marginLeft: '425px'
    }
  };
  
  return (
    <>
      {contextHolder}
      <div style={styles.gridContainer}>
        <div style={styles.navbar}>
          <Nav />
        </div>
        <div style={styles.sidebar}>
          <Sidebar />
        </div>
        <div style={styles.mainContent}>
          <form onSubmit={handleSubmit}>
            <h2 style={styles.h1Style}>Reset password</h2>
            <hr style={styles.hrStyle}/>

            <label style={styles.laberStyle}>
              old password:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <Input.Password style={styles.inputStyle}
                value={oldPassword} 
                onChange={e => setOldPassword(e.target.value)} 
                required 
              />
            </label>

            <br/>
            <br/>
            <br/>

            <label style={styles.laberStyle}>
              new password:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <Input.Password style={styles.inputStyle}
                value={newPassword} 
                onChange={e => setNewPassword(e.target.value)} 
                required 
              />
            </label>

            <br/>
            <br/>
            <br/>

            <label style={styles.laberStyle}>
              confirm password:&nbsp;&nbsp;&nbsp;&nbsp;
              <Input.Password style={styles.inputStyle}
                value={confirmPassword} 
                onChange={e => setConfirmPassword(e.target.value)} 
                required 
              />
            </label>

            <br/>
            <br/>
            <br/>

            <Button style={styles.buttonStyle} htmlType="submit" type="primary">submit</Button>
          </form>
        </div>
      </div>
    </>
  );
}


export default Resetpassword;
