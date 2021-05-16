import React, { createContext, useReducer } from "react";
import { Route, Switch } from "react-router-dom";
import "./App.css";
import "../node_modules/bootstrap/dist/css/bootstrap.css";

import About from "./components/About";
import Contact from "./components/Contact";
import Errorpage from "./components/Errorpage";
import Home from "./components/Home";
import Login from "./components/Login";
import Navbar from "./components/Navbar";
import Signup from "./components/Signup";
import Logout from "./components/Logout";

import { initialState, reducer } from "./Reducer/UseReducer";

export const UserContext = createContext();

const Routing = () => {
  return (
    <Switch>
      <Route path="/" exact>
        <Home />
      </Route>
      <Route path="/about" exact>
        <About />
      </Route>
      <Route path="/contact" exact>
        <Contact />
      </Route>
      <Route path="/login" exact>
        <Login />
      </Route>
      <Route path="/signup" exact>
        <Signup />
      </Route>
      <Route path="/logout" exact>
        <Logout />
      </Route>
      <Route>
        <Errorpage />
      </Route>
    </Switch>
  );
};

const App = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <>
      <div>
        <UserContext.Provider value={{ state, dispatch }}>
          <Navbar />
          <Routing />
        </UserContext.Provider>
      </div>
    </>
  );
};

export default App;
