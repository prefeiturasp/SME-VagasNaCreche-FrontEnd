import React, {Fragment} from 'react'
import Axios from "axios";
import PubSub from "pubsub-js";
import TabelaCreches from "../../utils/TabelaCreches";
import BarraSuperior from "../../utils/BarraSuperior";
import Mapa from "../Mapa/Mapa";

const URL_API_ENDERECO_VAGA_LOCAL = process.env.REACT_APP_API_VAGANACRECHE_LOCAL;

// http://127.0.1.1/api/vaga/4/?filtro=DRE&busca=JT
// http://127.0.1.1/api/vaga/4/?filtro=SUB&busca=JT
// http://127.0.1.1/api/vaga/4/?filtro=DIS&busca=JT
// http://127.0.1.1/api/vaga/4/?filtro=ALL
class VagasRemanescentesCreches extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            serie_vagas: '',
            filtro: '',
            busca: '',
            dc_serie_ensino_vagas: '',
            lista_escolas_raio_serie: [],
            quantidade_de_creches: ''
        }

        PubSub.publish("mostraLinkHome", true);
    }

    componentWillMount() {

        if (this.props.location.params) {
            this.setState({serie_vagas: this.props.location.params.serie_vagas})
            this.setState({dc_serie_ensino_vagas: this.props.location.params.dc_serie_ensino_vagas})
            this.setState({filtro: this.props.location.params.selecione_categoria})
            this.setState({busca: this.props.location.params.localidade_escolhida})
        } else {
            this.setState({serie_vagas: localStorage.getItem('serie_vagas')})
            this.setState({dc_serie_ensino_vagas: localStorage.getItem('dc_serie_ensino_vagas')})
            this.setState({filtro: localStorage.getItem('selecione_categoria')})
            this.setState({busca: localStorage.getItem('localidade_escolhida')})
        }

    }

    componentDidMount() {

        // http://127.0.1.1/api/vaga/4/?filtro=DIS&busca=JT
// http://127.0.1.1/api/vaga/4/?filtro=ALL

        let url_consulta = ''

        if (this.state.busca === 'all') {
            url_consulta = `${URL_API_ENDERECO_VAGA_LOCAL}/vaga/${this.state.serie_vagas}/?filtro=ALL`
        } else {
            url_consulta = `${URL_API_ENDERECO_VAGA_LOCAL}/vaga/${this.state.serie_vagas}/?filtro=${this.state.filtro}&busca=${this.state.busca}`
        }

        Axios.get(`${url_consulta}`)
            .then(resposta => {
                this.setState({lista_escolas_raio_serie: resposta.data.escolas})
                this.setState({quantidade_de_creches: resposta.data.escolas.length})
            }).catch(error => {

        });
    }

    atualizarMapa(escola, latitude, longitude) {


        console.log("Ollyver Creche escola | ", escola)

                PubSub.publish("escola", escola);
                PubSub.publish("latitude", latitude);
                PubSub.publish("longitude", longitude);
    }

    render() {
        return (
            <Fragment>
                <BarraSuperior texto="Quer saber onde há vagas disponíveis?" filtro={false}/>
                <div className="container">

                    {this.state.lista_escolas_raio_serie.length > 0 ? (

                        <div className="row">
                            <div className="col-12 col-lg-6 mt-5">

                                <p className='fonte-16'>
                                    Há <strong>{this.state.quantidade_de_creches}</strong> Centro de Educação Infantil
                                    em <strong>{this.state.busca}</strong> com vagas disponíveis
                                    no <strong>{this.state.dc_serie_ensino_vagas}</strong>.
                                </p>


                                <TabelaCreches
                                    lista_escolas_raio_serie={this.state.lista_escolas_raio_serie}
                                    parametro_nome_escola="nm_unidade_educacao"
                                    parametro_latitude="cd_latitude"
                                    parametro_longitude="cd_longitude"
                                    cabecalho={["Nome da escola", "Tipo", "Vagas remanescentes no"]}
                                    cabecalho_concat={this.state.dc_serie_ensino_vagas}
                                    cabecalho_posicao_concat={2}
                                    parametro_total_creches="vagas_remanescente"
                                    atualizarMapa={this.atualizarMapa}
                                />


                            </div>

                            <div className="col-lg-6 col-lg-6 mapa-completo">


                                <Mapa
                                    lista_escolas_raio_serie={this.state.lista_escolas_raio_serie}
                                    parametro_latitude="cd_latitude"
                                    parametro_longitude="cd_longitude"
                                    dc_serie_ensino={this.state.dc_serie_ensino_vagas}
                                    classe_css="mapa-creche h-80"
                                />


                            </div>
                        </div>
                    ) : null}

                </div>
            </Fragment>
        )
    }
}

export default VagasRemanescentesCreches