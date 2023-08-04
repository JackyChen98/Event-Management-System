import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { makeStyles } from '@mui/styles';
import Button from '@mui/material/Button';
import shrek1 from './data/shrek/1.png';
import shrek2 from './data/shrek/2.png';
import shrek3 from './data/shrek/3.png';
import shrek4 from './data/shrek/4.png';
import shrek5 from './data/shrek/5.png';
import shrek6 from './data/shrek/6.png';
import shrek7 from './data/shrek/7.png';
import shrek8 from './data/shrek/8.png';
import PuzzlePic from './Puzzlepic.jpg';
import { Image, Menu, message } from 'antd';
import { BankOutlined, LikeOutlined } from '@ant-design/icons';
import Nav from './Nav';
import config from '../config.json';

function getItem(label, key, icon, onClick) {
    return {
        key,
        icon,
        label,
        onClick,
    };
}

const shrekImages = [
    shrek1, shrek2, shrek3,
    shrek4, shrek5, shrek6,
    shrek7, shrek8, ""
]

const useStyles = makeStyles(() => ({
    root: {
        flexGrow: 1,
        display: 'flex',
        position: 'relative',
        minHeight: '100vh',
    },
    main: {
        flexGrow: 1,
        paddingBottom: '50px',
        paddingTop: '80px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
    },
    gameContainer: {
        display: 'flex',
        flexDirection: 'column',
    },
    row: {
        display: 'flex',
        flexDirection: 'row',
    },
    cell: {
        height: '150px',
        width: '150px',
        border: '1px solid #333',
        margin: '0px',
    },
    buttonContainer: {
        margin: 15,
        width: '450px',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
}));

function Game() {
    const navigate = useNavigate();
    const classes = useStyles();
    const [grid, setGrid] = useState(new Array(9));
    const [solved, setSolved] = useState(false);
    const [moveMade, setmoveMade] = useState(false);
    const token = localStorage.getItem('userId');
    const [user, setUser] = useState(null);
    const [messageApi, contextHolder] = message.useMessage();

    const homePage = () => {
        navigate('/dashboard');
    };

    const shuffleArray = (array) => {
        for (let i = 0; i < array.length; i++) {
            const r = Math.floor(Math.random() * array.length);
            const temp = array[i];
            array[i] = array[r];
            array[r] = temp;
        }
    };

    const time = async () => {
        const fetchData = async () => {
            const response = await fetch(`${config.BACKEND_HOST}${config.BACKEND_PORT}/user/query/${token}`, {
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
    }

    const isGameDate = async () => {
        await time();
        const today = new Date();
        const gameDate = new Date(user.gameDate);
        return today.getFullYear() === gameDate.getFullYear() &&
            today.getMonth() === gameDate.getMonth() &&
            today.getDate() === gameDate.getDate();
    };

    const getVoucher = async () => {
        await time();
        if (user) {
            const result = await isGameDate();
            if (!result) {
                const today = new Date();
                const year = today.getFullYear();
                const month = String(today.getMonth() + 1).padStart(2, '0');
                const date = String(today.getDate()).padStart(2, '0');
                const todayString = `${year}-${month}-${date}`;

                let updatedUserVoucher = JSON.parse(user.userVoucher || '{}');
                updatedUserVoucher["0.1"] = (updatedUserVoucher["0.1"] || 0) + 1;
                const updatedUser = {
                    ...user,
                    userVoucher: JSON.stringify(updatedUserVoucher),
                };
                const response = await fetch(`${config.BACKEND_HOST}${config.BACKEND_PORT}/user/update`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        userId: token,
                        userVoucher: updatedUser.userVoucher,
                        gameDate: todayString
                    }),
                });
                if (response.ok) {
                    setUser(updatedUser);
                    messageApi.open({
                        type: 'success',
                        content: 'You have got a sliver voucher',
                    });
                } else {
                    console.error('Error:', response.status);
                }
            } else {
                messageApi.open({
                    type: 'warning',
                    content: 'You have got the voucher today, please come back tomorrow',
                });
            }
        }
    }

    const handleCellMove = (index) => {
        const gridCopy = grid.slice();
        // Check move up
        if (index - 3 >= 0 && grid[index - 3] === 8) {
            const temp = gridCopy[index];
            gridCopy[index] = gridCopy[index - 3];
            gridCopy[index - 3] = temp;
            setmoveMade(true);
            // Check move left
        } else if (![0, 3, 6].includes(index) && grid[index - 1] === 8) {
            const temp = gridCopy[index];
            gridCopy[index] = gridCopy[index - 1];
            gridCopy[index - 1] = temp;
            setmoveMade(true);
            // Check move right
        } else if (![2, 5, 8].includes(index) && grid[index + 1] === 8) {
            const temp = gridCopy[index];
            gridCopy[index] = gridCopy[index + 1];
            gridCopy[index + 1] = temp;
            setmoveMade(true);
            // Check move down
        } else if (index + 3 < 9 && grid[index + 3] === 8) {
            const temp = gridCopy[index];
            gridCopy[index] = gridCopy[index + 3];
            gridCopy[index + 3] = temp;
            setmoveMade(true);
        }
        setGrid(gridCopy);
        if (gridCopy.every((item, index) => item === index)) {
            setSolved(true);
            // setTimeout(() => {
            getVoucher();
            localStorage.setItem('won', parseInt(localStorage.getItem('won')) + 1);
            resetGame();
            // }, 500);
        }
    };

    useEffect(() => {
        resetGame();
    }, []);
    const handleReturnButtonClick = () => {
        navigate('/dashboard');
    };

    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch(`${config.BACKEND_HOST}${config.BACKEND_PORT}/user/query/${token}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (response.ok) {
                const data = await response.json();
                setUser(data);
                if (solved) {
                    getVoucher();
                }
            } else {
                console.error('Error:', response.status);
            }
        };
        fetchData();
    }, [solved]);


    const resetGame = () => {
        const array = [0, 1, 2, 3, 4, 5, 6, 7, 8];
        while (array.every((item, index) => item === index)) {
            shuffleArray(array);
        }
        setGrid(array);
        setSolved(false);
        setmoveMade(false);
    }

    const Solve = () => {
        setGrid([0, 1, 2, 3, 4, 5, 6, 7, 8]);
        setSolved(true);
        setmoveMade(true);
    };

    const items = [
        getItem('Redeem', '1', <BankOutlined />, () => navigate('/getvoucher')),
        getItem('Puzzle', '2', <LikeOutlined />, () => navigate('/game')),
    ];

    const onClick = (e) => {
        const item = items.find((i) => i.key === e.key);
        item && item.onClick && item.onClick();
    };

    const styles = {
        menuContainer: {
            margin: '0 0 0 150px'
        },
        menu: {
            fontSize: '20px'
        },
        paraContatiner: {
            margin: '0 0 0 180px'
        }
    }

    return <>
        <Nav />
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Image src={PuzzlePic} height={450} width={1350} />
        </div>
        <br />
        <div style={styles.menuContainer}>
            <Menu onClick={onClick} mode="horizontal" items={items} style={styles.menu} />
        </div>
        <div style={styles.paraContatiner}>
            <h1>Play to get a voucher</h1>
            <p>You can get a Sliver voucher by solving this puzzle!!!</p>
        </div>
        {contextHolder}
        <main className={classes.main}>
            <div className={classes.gameContainer}>
                <div className={classes.row}>
                    <Cell index={0} grid={grid} handleCellMove={handleCellMove} />
                    <Cell index={1} grid={grid} handleCellMove={handleCellMove} />
                    <Cell index={2} grid={grid} handleCellMove={handleCellMove} />
                </div>
                <div className={classes.row}>
                    <Cell index={3} grid={grid} handleCellMove={handleCellMove} />
                    <Cell index={4} grid={grid} handleCellMove={handleCellMove} />
                    <Cell index={5} grid={grid} handleCellMove={handleCellMove} />
                </div>
                <div className={classes.row}>
                    <Cell index={6} grid={grid} handleCellMove={handleCellMove} />
                    <Cell index={7} grid={grid} handleCellMove={handleCellMove} />
                    <Cell index={8} grid={grid} handleCellMove={handleCellMove} />
                </div>
            </div>
            <div className={classes.buttonContainer}>
                <Button color='primary' variant='contained' disabled={solved} onClick={Solve}>Solve</Button>
                <Button color='secondary' variant='contained' disabled={!moveMade} onClick={resetGame}>Reset</Button>
            </div>
        </main>
    </>;
}

function Cell(props) {
    const classes = useStyles();
    if (props.grid[props.index] === 8) {
        return (
            <div className={classes.cell}></div>
        );
    }

    return (
        <img
            className={classes.cell}
            src={shrekImages[props.grid[props.index]]}
            alt={`cell ${props.index}`}
            onClick={() => props.handleCellMove(props.index)}
        />
    );
}

export default Game;
