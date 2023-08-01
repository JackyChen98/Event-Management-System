import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import Dashboard from './components/Dashboard';
import Visitor from './components/Visitor';
import Payment from './components/Payment';
import Game from './components/Game';
import EventDetail from './components/Eventdetail';
import Allevents from './components/Allevents';
import Myprofile from './components/MyProfile';
import PastEvents from './components/PastEvents';
import CreateEvents from './components/CreateEvents';
import Buyticket from './components/Buyticket';
import Refundtickets from './components/Refundtickets';
import Resetpassword from './components/Resetpassword';
import Editinfo from './components/Editinfo';
import UserCreatedEvents from "./components/UserCreatedEvents";
import UserJoinedEvents from "./components/UserJoinedEvents";
import GetVoucher from './components/GetVoucher';
import Voucher from './components/Voucher';
import Search from './components/Search';
import Announcement from './components/Announcement'
import Moreinterested from './components/Moreinterested';
import MoreFollowing from './components/MoreFollowing';
import MoreJoin from './components/MoreJoin';
import MoreNearby from './components/MoreNearby';
import Message from './components/Message';

function App() {
    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path='/'
                        element={
                            <Visitor />
                        } />
                    <Route path='/signin'
                        element={
                            <SignIn />
                        } />
                    <Route path='/signup'
                        element={
                            <SignUp />
                        } />
                    <Route path='/payment'
                        element={
                            <Payment />
                        } />
                    <Route path='/dashboard'
                        element={
                            <Dashboard />
                        } />
                    <Route path='/game'
                        element={
                            <Game />
                        } />
                    <Route path='/eventdetail/:eventid'
                        element={
                            <EventDetail />
                        } />
                    <Route path='/allevents'
                        element={
                            <Allevents />
                        } />
                    <Route path='/profile'
                        element={
                            <Myprofile />
                        } />
                    <Route path='/pastevents'
                        element={
                            <PastEvents />
                        } />
                    <Route path='/createevents'
                        element={
                            <CreateEvents />
                        } />
                    <Route
                        path='/buyticket/:eventid'
                        element={
                            <Buyticket />
                        } />
                    <Route path='/refundticket/:eventid'
                        element={
                            <Refundtickets />
                        } />
                    <Route path='/resetpassword'
                        element={
                            <Resetpassword />
                        } />
                    <Route path='/editinfo'
                        element={
                            <Editinfo />
                        } />
                    <Route path='/usercreatedevents'
                        element={
                            <UserCreatedEvents />
                        } />
                    <Route path='/userjoinedevents'
                        element={
                            <UserJoinedEvents />
                        } />
                    <Route path='/getvoucher'
                        element={
                            <GetVoucher />
                        } />
                    <Route path='/voucher'
                        element={
                            <Voucher />
                        } />
                    <Route path='/search/:searchcontent'
                        element={
                            <Search />
                        } />
                    <Route path='/announcement/:eventid'
                        element={
                            <Announcement />
                        } />
                    <Route path='/moreinterested'
                        element={
                            <Moreinterested />
                        } />
                    <Route path='/morerecommand'
                        element={
                            <MoreFollowing />
                        } />
                    <Route path='/morejoin'
                        element={
                            <MoreJoin />
                        } />
                    <Route path='/morenearby'
                        element={
                            <MoreNearby />
                        } />
                    <Route path='/message'
                        element={
                            <Message />
                        } />

                </Routes>
            </BrowserRouter>
        </>
    );
}
export default App;
