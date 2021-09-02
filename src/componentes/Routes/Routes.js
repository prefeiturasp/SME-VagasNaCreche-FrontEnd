import React from  'react';
import {Route, Switch} from 'react-router-dom'
import Home from '../Home/Home'
import Creches from '../Creches/Creches'
import VagasRemanescentes from "../VagasRemanescentes";
import Page404 from "../Page404/Page404";
import VagasRemanescentesCreches from "../VagasRemanescentes/VagasRemanescentesCreches";
import EmManutencao from "../EmManutencao";


export default props => (
    <div id="main">
        <Switch>
            <Route path="/" exact component={Home} />
            <Route path="/creches" component={Creches} />
            {/*<Route path="/vagas-remanescentes" component={VagasRemanescentes} />*/}
            <Route path="/vagas-remanescentes" component={EmManutencao} />
            <Route path="/vagas-remanescentes-creches" component={VagasRemanescentesCreches} />
            <Route path="*" component={Page404}/>
        </Switch>
    </div>
);