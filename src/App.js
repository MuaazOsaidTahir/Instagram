import './App.css';
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import BodyLeft from './BodyLeft';
import BodyRight from './BodyRight';
import Header from './Header';
import Login from './Login';
import { useContext, useEffect, useState } from 'react';
import { auth, database } from './firebase';
import { Context } from "./context/Provider"
import ProfilePage from './ProfilePage';
import RequestsPage from './RequestsPage';
import Chat from './Chat';
import ChatSideBar from './ChatSideBar';
import NoChatSide from './NoChatSide';

function App() {
  const { state, dispatch, username } = useContext(Context)
  const [screenwidth, setscreenwidth] = useState()
  // const [user] = useAuthState(auth)

  useEffect(() => {
    auth.onAuthStateChanged(user => {
      if (user) {
        if (username !== null && user.displayName === null) {
          user.updateProfile({
            displayName: username,
          })
          database.collection("users").doc(`${username}`).set({
            bio: "",
            pictureURL: ""
          })
          database.collection("users").doc(`${username}`).collection("privateaccount").doc("privatetoggle").set({
            decision: "no"
          })
        }
        dispatch({ user: user, payload: "ADD_USER" })
      }
      else {
        dispatch({ user: null, payload: "REMOVE_USER" })
      }
    })
  }, [username, dispatch])

  useEffect(() => {
    setscreenwidth(window.screen.width);
  }, [])

  if(screenwidth < 1050){
    return <h1>Application for small and medium screen if under development</h1>
  }

  return (
    <div className="App">
      <BrowserRouter>
        <Switch>
          {
            !state ?
              <Login /> :
              <>
                <Route exact path="/" >
                  <Header />
                  <div className="body" >
                    <BodyLeft />
                    <BodyRight />
                  </div>
                </Route>
                <Route path="/profile/:profilename" >
                  <Header />
                  <ProfilePage />
                </Route>
                <Route path="/requests/:profilename" >
                  <RequestsPage />
                </Route>
                <Route path="/messages" >
                  <Header />
                  <div className="MessagesPage" >
                    <div className="messages_subcontainer" >
                      <ChatSideBar />
                      <NoChatSide />
                    </div>
                  </div>
                </Route>
                <Route exact path="/chat/:roomId" >
                  <Header />
                  <div className="MessagesPage" >
                    <div className="messages_subcontainer" >
                      <ChatSideBar />
                      <Chat />
                    </div>
                  </div>
                </Route>
              </>
          }
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
