import React, {Fragment} from 'react'
import PubSub from "pubsub-js";
import ConvertDateTime from "../../utils/ConvertDateTime";
import TabelaCreches from "../../utils/TabelaCreches";
import BarraSuperior from "../../utils/BarraSuperior";
import Mapa from "../Mapa/Mapa";
import Loading from "../../utils/Loading";
import ConsultarNovamente from "../../utils/ConsultarNovamente";
import ConectarApi from "../../services/ConectarApi";

const URL_API_VAGANACRECHE_HOM = process.env.REACT_APP_API_VAGANACRECHE_HOM;

class VagasRemanescentesCreches extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            serie_vagas: '',
            filtro: '',
            busca: '',
            dc_serie_ensino_vagas: '',
            lista_escolas_raio_serie: false,
            dt_atualizacao: new Date(),
            quantidade_de_creches: '',
            localidade_escolhida_label: '',
            total_vagas_remanescentes: '',
            carregado: undefined,
            erro_carregamento_lista_de_escolas: false,
        };

        PubSub.publish("mostraLinkHome", true);
    }

    somaVagasRemanescentes = (resposta) => {
        // Desconstruindo o objeto
        return resposta.data.escolas.map(({vagas_remanescente}) => vagas_remanescente)
            .reduce((a, b) => a + b, 0)
    };

    UNSAFE_componentWillMount() {

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

        let url_consulta = ''

        if (this.state.busca === 'all') {
            url_consulta = `${URL_API_VAGANACRECHE_HOM}/vaga/${this.state.serie_vagas}/?filtro=ALL`
        } else {
            url_consulta = `${URL_API_VAGANACRECHE_HOM}/vaga/${this.state.serie_vagas}/?filtro=${this.state.filtro}&busca=${this.state.busca}`
        }

        ConectarApi.logarSemAutenticacao(url_consulta, 'get')

            .then(resposta => {
                const soma = this.somaVagasRemanescentes(resposta)
                this.setState({total_vagas_remanescentes: soma})
                this.setState({lista_escolas_raio_serie: resposta.data.escolas})
                this.setState({quantidade_de_creches: resposta.data.escolas.length})
                this.setState({carregado: true});
            }).catch(error => {
            this.setState({carregado: true});
            this.setState({erro_carregamento_lista_de_escolas: true});
        });

        let url_consulta_data_atualizacao = `${URL_API_VAGANACRECHE_HOM}/fila/espera_escola_raio/-23.595418/-46.648723/4`

        ConectarApi.logarSemAutenticacao(url_consulta_data_atualizacao, 'get')

            .then(resposta => {
                this.setState({dt_atualizacao: resposta.data.dt_atualizacao});
            }).catch(error => {

        });

    }


    atualizarMapa(escola, latitude, longitude) {
        PubSub.publish("escola", escola);
        PubSub.publish("latitude", latitude);
        PubSub.publish("longitude", longitude);
    }

    render() {
        const data_formatada = ConvertDateTime.exibirDateTimeFormatada(this.state.dt_atualizacao)
        return (
            <Fragment>
                <BarraSuperior texto="Quer saber onde há vagas disponíveis?" filtro={false}/>
                <div className="container">

                    {!this.state.carregado ? (
                            <Loading/>
                        ) :
                        null
                    }


                    {this.state.lista_escolas_raio_serie.length > 0 ? (

                            <div className="row">
                                <div className="col-12 col-lg-6 mt-5">

                                    <p className='fonte-16'>
                                        Há <strong>{this.state.quantidade_de_creches}</strong> Centro de Educação Infantil
                                        em <strong>{this.state.localidade_escolhida_label}</strong> com <strong>{this.state.total_vagas_remanescentes}</strong> vagas disponíveis
                                        no <strong>{this.state.dc_serie_ensino_vagas}</strong>.
                                    </p>
                                    <p className="fonte-16">Estes dados foram atualizados em {data_formatada}</p>

                                    <TabelaCreches
                                        lista_escolas_raio_serie={this.state.lista_escolas_raio_serie}
                                        cabecalho={["Nome da escola", "Tipo", "Vagas remanescentes no"]}
                                        cabecalho_concat={this.state.dc_serie_ensino_vagas}
                                        cabecalho_posicao_concat={2}
                                        parametro_total_creches="vagas_remanescente"
                                        atualizarMapa={this.atualizarMapa}
                                    />

                                    <div className="text-center mb-5 mt-5">
                                        <ConsultarNovamente
                                            texto=""
                                            link_to="/vagas-remanescentes"
                                            classe_css_btn='btn btn-outline-primary rounded-pill'
                                            texto_btn="Consultar novamente"
                                        />
                                    </div>

                                </div>

                                <div className="col-lg-6 col-lg-6 mapa-completo">

                                    <Mapa
                                        lista_escolas_raio_serie={this.state.lista_escolas_raio_serie}
                                        dc_serie_ensino={this.state.dc_serie_ensino_vagas}
                                        zoom_inicial={10}
                                        parametro_total_creches="vagas_remanescente"
                                        classe_css="mapa-vagas-remanescentes-creches"
                                        texto_detalhe_pin="vagas disponíveis em "
                                    />

                                </div>
                            </div>
                        ) :

                        this.state.erro_carregamento_lista_de_escolas || this.state.lista_escolas_raio_serie.length <= 0 ? (
                            <div className="col-12 col-md-6 mt-5 mb-5">

                                <ConsultarNovamente
                                    texto="No momento, não há vagas remanescentes no território selecionado."
                                    link_to="/vagas-remanescentes"
                                    classe_css_btn='btn btn-outline-primary rounded-pill'
                                    texto_btn="Consultar novamente"
                                />
                            </div>

                        ) : null

                    }


                </div>
            </Fragment>
        )
    }
}

export default VagasRemanescentesCreches