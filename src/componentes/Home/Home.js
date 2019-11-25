import React from 'react'

import logoEscolaAberta from "../../img/escola_aberta.png";
import Busca from '../Busca/Busca'
import BlocoDeConteudos from './BlocosDeConteudo'
import PubSub from "pubsub-js";

const Home = () => {

    PubSub.publish("mostraLinkHome", false);

    return (
        <div>
            <div className="w-100 busca-escolas position-relative">
                <div className="container d-flex justify-content-center">
                    <div className="conteudo">
                        <div className="col-lg-12 col-sm-12 text-center m-auto">
                            <img
                                src={logoEscolaAberta}
                                alt="Escola Aberta"
                                className="mb-5"
                            />
                            <h2>
                                Consulte a demanda pelos Centros de Educação Infantil
                            </h2>
                            <div className="col-12 col-md-8 text-center m-auto">
                                <p className="fonte-16 texto-home">Para conhecer os Centros de Educação Infantil mais próximos com turmas que atendem sua necessidade, informe abaixo o mês e ano de nascimento da criança e, também, o endereço para o qual quer fazer a consulta</p>
                            </div>
                        </div>

                        <Busca/>

                    </div>
                </div>
            </div>
            <BlocoDeConteudos/>
        </div>
    )
}

export default Home