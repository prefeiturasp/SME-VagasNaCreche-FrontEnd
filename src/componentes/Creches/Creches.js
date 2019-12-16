import React from 'react'
import Axios from "axios";
import PubSub from 'pubsub-js'
import {Link} from "react-router-dom";
import ConsultarNovamente from "../../utils/ConsultarNovamente";

import BarraSuperior from '../../utils/BarraSuperior'
import TabelaCreches from '../../utils/TabelaCreches'
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
            erro_carregamento_lista_de_escolas: false,
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
console.log("Ollyver dc serie ensino ", this.props.location.params.dc_serie_ensino)
console.log("Ollyver serie ", this.props.location.params.serie)
console.log("Ollyver endereco ", this.props.location.params.endereco)
console.log("Ollyver latitude ", this.props.location.params.latitude)
console.log("Ollyver longitude ",this.props.location.params.longitude)

            // Enviando parametros de pesquisa para gravar na API
            Axios.post(`${URL_API_VAGANACRECHE_HOM}/pesquisa/historico_busca_end/`, {cd_serie_ensino: this.props.location.params.serie, latitude:this.props.location.params.latitude, longitude:this.props.location.params.longitude})
            .then(resposta => {
                    console.log("Sucesso em gravar pesquisa na APi")
                }).catch(error => {
                console.log("Erro ao gravar pesquisa na APi - ", error)
            })

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
                            <Loading/>
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
                                    cabecalho={["Nome da escola", "Tipo", "Crianças aguardando vaga no"]}
                                    cabecalho_concat={this.state.dc_serie_ensino}
                                    cabecalho_posicao_concat={2}
                                    parametro_total_creches="total"
                                    atualizarMapa={this.atualizarMapa}
                                />

                            </div>
                            <div className="col-lg-6 col-lg-6 mapa-completo">
                                <Mapa
                                    lista_escolas_raio_serie={this.state.lista_escolas_raio_serie}
                                    dc_serie_ensino={this.state.dc_serie_ensino}
                                    zoom_inicial={14}
                                    classe_css="mapa-creche h-80"
                                />

                            </div>
                        </div>

                    ) : null}

                    {this.state.erro_carregamento_lista_de_escolas ? (



                        <div className="col-12 col-md-6 mt-5 mb-5">

                            <ConsultarNovamente
                                texto="Não foi encontrado nenhum resultado. Por favor tente uma nova pesquisa"
                                link_to="/"
                                classe_css_btn='btn btn-outline-primary rounded-pill'
                                texto_btn = "Consultar novamente"
                            />
                        </div>
                    ) : null}

                </div>
            </div>
        );
    }

}

export default Creches;
