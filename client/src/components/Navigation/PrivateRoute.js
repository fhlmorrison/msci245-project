import React from "react";
import { Router, Switch, Route } from "react-router-dom";
import Home from '../Home';
import Landing from "../Landing";
import history from './history';
import Search from "../Search";
import Reviews from "../Reviews";

export default function PrivateRoute({
  //authenticated,
  //...rest
}) {
  return (

    <Router history={history}>
      <Switch>
      <Route path="/" exact component={Landing} />
      <Route path="/search" exact component={Search} />
      <Route path="/reviews" exact component={Reviews} />
      <Route path="/home" exact component={Home} /> {/*Temporary*/}
      {/*<Route path="/myPage" exact component={myPage} />*/ /*Custom page*/}
      </Switch>
    </Router>
  );
}