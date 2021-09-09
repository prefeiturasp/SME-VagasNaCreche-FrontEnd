import React, {Fragment} from "react";
import BarraSuperior from "../../utils/BarraSuperior";
import PubSub from "pubsub-js";

class EmManutencao extends React.Component{
    constructor() {
        super();
        PubSub.publish("mostraLinkHome", true);
    }

    render() {
        return(
            <Fragment>
                <BarraSuperior texto="Em manutenção" filtro={false}/>
                <div className="container">
                    <div className="row">
                        <div className="col-12 col-lg-6 mt-5">
                            <p className="fonte-16">Esta página encontra-se em manutenção</p>
                        </div>
                    </div>
                </div>
            </Fragment>
        )
    }
}

export default EmManutencao