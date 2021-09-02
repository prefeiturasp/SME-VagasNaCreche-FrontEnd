import React from "react";
import BarraSuperior from "../../utils/BarraSuperior";
import PubSub from "pubsub-js";

export const EmManutencao = () =>{
    PubSub.publish("mostraLinkHome", true);
    return (
        <>
            <BarraSuperior texto="Em manutenção" filtro={false}/>
            <div className="container">
                <div className="row">
                    <div className="col-12 col-lg-6 mt-5">
                        <p className="fonte-16">
                            Esta página encontra-se em manutenção
                        </p>
                    </div>
                </div>
            </div>
        </>
    )
}