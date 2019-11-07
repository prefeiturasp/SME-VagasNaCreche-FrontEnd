import React from  'react';
import { Route, Switch } from 'react-router-dom'
import Home from '../Home/Home'

export default props => (
    <div id="main">
        <Switch>
            <Route path="/" exact component={Home} />
        </Switch>
    </div>
);