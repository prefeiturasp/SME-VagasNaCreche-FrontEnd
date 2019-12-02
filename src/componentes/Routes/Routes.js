import React from  'react';
import { Route, Switch } from 'react-router-dom'
import Home from '../Home/Home'
import Creches from '../Creches/Creches'
import Page404 from "../Page404/Page404";


export default props => (
    <div id="main">
        <Switch>
            <Route path="/" exact component={Home} />
            <Route path="/creches" component={Creches} />
            <Route path="*" component={Page404}/>
        </Switch>
    </div>
);