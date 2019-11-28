import React from 'react'
import Axios from "axios";
import PubSub from 'pubsub-js'
import {Link} from "react-router-dom";

import BarraSuperior from '../../utils/BarraSuperior'
import TabelaCreches from './TabelaCreches'
import Loading from '../../utils/Loading'
import Mapa from '../Mapa/Mapa'
import './creche.css'

const URL_API_VAGANACRECHE_HOM = process.env.REACT_APP_API_VAGANACRECHE_HOM;

class Creches extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            dc_serie_ensino: undefined,
            serie: undefined,
            endereco: undefined,
            latitude: undefined,
            longitude: undefined,
            dt_atualizacao: new Date(),
            fila_de_espera: 0,
            qtde_escolas: 0,
            esconderLinkBuscaEscola: true,
            carregado: undefined,
            erro_carregamento_lista_de_escolas:false,
        };

        PubSub.publish("mostraLinkHome", true);
    }

    componentWillMount() {

        if (this.props.location.params) {
            this.setState({dc_serie_ensino: this.props.location.params.dc_serie_ensino})
            this.setState({serie: this.props.location.params.serie})
            this.setState({endereco: this.props.location.params.endereco})
            this.setState({latitude: this.props.location.params.latitude})
            this.setState({longitude: this.props.location.params.longitude})
        } else {
            this.setState({dc_serie_ensino: localStorage.getItem('dc_serie_ensino')})
            this.setState({serie: localStorage.getItem('serie')})
            this.setState({endereco: localStorage.getItem('endereco')})
            this.setState({latitude: localStorage.getItem('latitude')})
            this.setState({longitude: localStorage.getItem('longitude')})
        }

        this.convertDateTime.bind(this)

    }

    componentDidMount() {

        Axios.get(`${URL_API_VAGANACRECHE_HOM}/fila/espera_escola_raio/${this.state.latitude}/${this.state.longitude}/${this.state.serie}`)
            .then(resposta => {
                this.setState({lista_escolas_raio_serie: resposta.data.escolas});
                this.setState({qtde_escolas: resposta.data.escolas.length});
                this.setState({dt_atualizacao: resposta.data.dt_atualizacao});
                this.setState({fila_de_espera: resposta.data.espera});

                this.setState({carregado: true});
            }).catch(error => {
                this.setState({carregado: true});
                this.setState({erro_carregamento_lista_de_escolas: true});
            });
    }

    atualizarMapa(escola, latitude, longitude) {
        PubSub.publish("escola", escola);
        PubSub.publish("latitude", latitude);
        PubSub.publish("longitude", longitude);
    }

    convertDateTime(data) {
        const date = new Date(data);
        return date.toLocaleDateString('pt-BR') + " às " + date.toLocaleTimeString('pt-BR');
    }

    render() {
        const data_formatada = this.convertDateTime(this.state.dt_atualizacao)

        return (
            <div>

                <BarraSuperior texto="Centros de Educação Infantil mais próximos" filtro={false}/>

                <div className="container">

                    {!this.state.carregado ? (
                        <Loading />
                    ) :
                        null
                    }

                    {this.state.lista_escolas_raio_serie ? (

                            <div className="row">
                                <div className="col-12 col-lg-6 mt-5">
                                    <p className="fonte-16">Há <strong>{this.state.fila_de_espera}</strong> crianças
                                        aguardando vaga no <strong>{this.state.dc_serie_ensino}</strong>, a serem
                                        distribuídas nos <strong>{this.state.qtde_escolas}</strong> Centros de Educação
                                        Infantil (CEIs) perto de <strong>{this.state.endereco}</strong>
                                    </p>
                                    <p className="fonte-16">Estes dados foram atualizados em {data_formatada}</p>

                                    <TabelaCreches
                                        lista_escolas_raio_serie={this.state.lista_escolas_raio_serie}
                                        atualizarMapa={this.atualizarMapa}
                                    />

                                </div>
                                <div className="col-lg-6 col-lg-6 mapa-completo">
                                    <Mapa
                                        lista_escolas_raio_serie={this.state.lista_escolas_raio_serie}
                                        dc_serie_ensino={this.state.dc_serie_ensino}
                                    />

                                </div>
                            </div>

                        ) : null }

                    {this.state.erro_carregamento_lista_de_escolas ? (
                        <div className="col-12 col-md-6 mt-5 mb-5">
                            <p className="fonte-14">Não foi encontrado nenhum resultado. Por favor tente uma nova
                                pesquisa</p>
                            <Link
                                to={{
                                    pathname: "/",
                                    params: {
                                        dc_serie_ensino: this.state.dc_serie_ensino,
                                        serie: this.state.serie,
                                        endereco: this.state.endereco,
                                        longitude: this.state.longitude,
                                        latitude: this.state.latitude,
                                    }
                                }}>
                                <button type="button" className="btn btn-outline-primary rounded-pill">Consultar
                                    novamente
                                </button>
                            </Link>
                        </div>
                    ): null}

                </div>
            </div>
        );
    }

}

export default Creches;