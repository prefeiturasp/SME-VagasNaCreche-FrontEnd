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
            quantidade_de_creches: '',
            localidade_escolhida_label:'',
        }

        PubSub.publish("mostraLinkHome", true);
    }

    componentWillMount() {

        if (this.props.location.params) {
            this.setState({serie_vagas: this.props.location.params.serie_vagas})
            this.setState({dc_serie_ensino_vagas: this.props.location.params.dc_serie_ensino_vagas})
            this.setState({filtro: this.props.location.params.selecione_categoria})
            this.setState({busca: this.props.location.params.localidade_escolhida})
            this.setState({localidade_escolhida_label: this.props.location.params.localidade_escolhida_label})
        } else {
            this.setState({serie_vagas: localStorage.getItem('serie_vagas')})
            this.setState({dc_serie_ensino_vagas: localStorage.getItem('dc_serie_ensino_vagas')})
            this.setState({filtro: localStorage.getItem('selecione_categoria')})
            this.setState({busca: localStorage.getItem('localidade_escolhida')})
            this.setState({localidade_escolhida_label: localStorage.getItem('localidade_escolhida_label')})
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
                                    em <strong>{this.state.localidade_escolhida_label}</strong> com vagas disponíveis
                                    no <strong>{this.state.dc_serie_ensino_vagas}</strong>.
                                </p>


                                <TabelaCreches
                                    lista_escolas_raio_serie={this.state.lista_escolas_raio_serie}
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
                                    dc_serie_ensino={this.state.dc_serie_ensino_vagas}
                                    zoom_inicial={10}
                                    classe_css="mapa-vagas-remanescentes-creches h-80"
                                />

                            </div>
                        </div>
                    ) :
                    <div className="col-12 col-lg-6 mt-5">
                        <h1>Não existem dados cadastrados</h1>
                    </div>
                    }

                </div>
            </Fragment>
        )
    }
}

export default VagasRemanescentesCreches