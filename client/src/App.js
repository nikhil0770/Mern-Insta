import "./App.css";
import NavBar from "./components/NavBar";
import { BrowserRouter, Route, Switch, useHistory } from "react-router-dom";
import React, { useEffect, createContext, useReducer, useContext } from "react";
import Home from "./screens/Home";
import Signin from "./screens/Signin";
import Signup from "./screens/Signup";
import Profile from "./screens/Profile";
import CreatePost from "./screens/CreatePost";
import UserProfile from "./screens/UserProfile";
import { user_reducer, initalState } from "./reducers/userReducer";
import Followingpost from "./screens/Followingpost";
export const Usercontext = createContext();

const Routing = () => {
  const history = useHistory();
  const { state, dispatch } = useContext(Usercontext);
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user_details"));
    if (user) {
      //to avoid state destroy
      dispatch({ type: "USER", payload: user });
      history.push("/");
    } else {
      history.push("/signin");
    }
  }, []);

  return (
    <Switch>
      <Route exact path="/">
        <Home />
      </Route>
      <Route path="/signin">
        <Signin />
      </Route>
      <Route path="/signup">
        <Signup />
      </Route>
      <Route exact path="/myposts">
        <Profile />
      </Route>
      <Route path="/createpost">
        <CreatePost />
      </Route>
      <Route path="/myposts/:id">
        <UserProfile />
      </Route>
      <Route path="/followingpost">
        <Followingpost />
      </Route>
    </Switch>
  );
};

function App() {
  const [state, dispatch] = useReducer(user_reducer, initalState);
  return (
    <Usercontext.Provider value={{ state, dispatch }}>
      <BrowserRouter>
        <NavBar />
        <Routing />
      </BrowserRouter>
    </Usercontext.Provider>
  );
}

export default App;
