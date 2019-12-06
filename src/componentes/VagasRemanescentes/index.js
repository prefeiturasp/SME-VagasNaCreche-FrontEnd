import React, {Fragment} from 'react'
import PubSub from "pubsub-js";

import './VagasRemanescentes.css'
import BarraSuperior from "../../utils/BarraSuperior";
import calculaSerieEnsino from '../../utils/CalculaSerieEnsino';
import SelectData from '../../utils/SelectData';
import Mapa from "../Mapa/Mapa";
import TrataErros from "../../utils/TrataErros";
import Axios from "axios";
import {Link} from "react-router-dom";

const URL_API_VAGANACRECHE_HOM_LOCAL = process.env.REACT_APP_API_VAGANACRECHE_LOCAL;

class VagasRemanescentes extends React.Component {

    constructor() {
        super()

        this.state = {
            mes_aniversario_vagas: undefined,
            ano_aniversario_vagas: undefined,
            dc_serie_ensino_vagas: '',
            serie_vagas: '',
            erro_idade_crianca_vagas: false,
            selecione_categoria: null,
            selecione_categoria_css_round: '',
            selecione_localidade_css_round: '',
            localidades: [],
            localidade_escolhida: null,
            localidade_escolhida_label: null,
            label_localidades: '',
            lista_escolas_raio_vagas: [],
        }

        PubSub.publish("mostraLinkHome", true);
    }

    componentWillMount() {
        Axios.get(`${URL_API_VAGANACRECHE_HOM_LOCAL}/vaga/filtros/`)
            .then(resposta => {
                this.setState({localidades: resposta.data})
            }).catch(error => {

        });
    }

    isButtonDisabled = () => {
        return this.state.erro_idade_crianca_vagas || this.state.mes_aniversario_vagas === undefined || this.state.ano_aniversario_vagas === undefined || !this.state.selecione_categoria || this.state.selecione_categoria === '' || this.state.localidade_escolhida === null || this.state.localidade_escolhida === ''
    }

    onChangeLocalidade = (event) => {
        this.setState({localidade_escolhida: event.target.value})
        this.setState({localidade_escolhida_label: event.target.options[event.target.selectedIndex].text})
        localStorage.setItem("localidade_escolhida", event.target.value)
        localStorage.setItem("localidade_escolhida_label", event.target.options[event.target.selectedIndex].text)
    }


    onChangeCategoria = (event) => {

        this.setState({selecione_categoria: event})
        localStorage.setItem("selecione_categoria", event)
        if (event === 'DRE') {
            this.setState({label_localidades: "Todas as Diretorias Regionais de Educação (DREs)"})
        } else if (event === 'DIS') {
            this.setState({label_localidades: "Todos os Distritos"})
        } else if (event === 'SUB') {
            this.setState({label_localidades: "Todas as Subprefeituras"})
        }

    }

    populateSelectLocalidade = () => {

        const categoria = this.state.selecione_categoria;

        if (this.state.localidades && categoria) {

            if (categoria === 'DRE') {
                return this.state.localidades.dres.map((item, index) =>
                    <option key={item.dre} value={item.dre}>{item.nm_dre}</option>)

            } else if (categoria === 'DIS') {
                return this.state.localidades.distritos.map((item, index) =>
                    <option key={item.nm_distrito} value={item.nm_distrito}>{item.nm_distrito}</option>)

            } else if (categoria === 'SUB') {
                return this.state.localidades['sub-prefeituras'].map((item, index) =>
                    <option key={item.dc_sub_prefeitura}
                            value={item.dc_sub_prefeitura}>{item.dc_sub_prefeitura}</option>)
            }
        }

    }

    setAtributosCampos = (attribute, value) => {
        this.setState({[attribute]: value}, () => {
            if (this.state.mes_aniversario_vagas !== undefined && this.state.ano_aniversario_vagas !== undefined) {
                this.setAge();
            }
        });
    };

    setAge() {

        const monthOfBirth = parseInt(this.state.mes_aniversario_vagas, 10);
        const yearOfBirth = parseInt(this.state.ano_aniversario_vagas, 10);
        const preschoolGroup = calculaSerieEnsino(monthOfBirth, yearOfBirth);

        if (preschoolGroup.error) {
            this.setState({erro_idade_crianca_vagas: true});

        } else {
            this.setState({erro_idade_crianca_vagas: false});
        }

        this.setState({dc_serie_ensino_vagas: preschoolGroup.dc_serie_ensino});
        this.setState({serie_vagas: preschoolGroup.serie});
        localStorage.setItem('dc_serie_ensino_vagas', preschoolGroup.dc_serie_ensino);
        localStorage.setItem('serie_vagas', preschoolGroup.serie);
    }

    render() {

        return (<Fragment>
            <BarraSuperior texto="Quer saber onde há vagas disponíveis?" filtro={false}/>
            <div className="container">
                <div className="row">
                    <div className="col-12 col-lg-6 mt-5">
                        <p className="fonte-16">
                            Abaixo, você pode pesquisar os Centros de Educação Infantil (CEIs) que têm vagas ainda
                            não preenchidas e avaliar se a localização de algum deles seria viável para sua família.
                            ​Selecione um Distrito, Subprefeitura ou Diretoria Regional de Educação (DRE) e veja
                            todos os CEIs com vagas remanescentes no território escolhido.
                        </p>
                        <p className="fonte-16"><strong>Sobre a Criança</strong></p>
                        <SelectData
                            atributo_mes="mes_aniversario_vagas"
                            atributo_ano="ano_aniversario_vagas"
                            mes_aniversario={this.state.mes_aniversario_vagas}
                            ano_aniversario={this.state.ano_aniversario_vagas}
                            onChange={this.setAtributosCampos}
                            classe_css_container_mes="form-group col-lg-6"
                            classe_css_container_ano="form-group col-lg-6"
                            classe_css_select=""
                        />
                        {
                            this.state.erro_idade_crianca_vagas ? (
                                <TrataErros
                                    msg_erro="A criança já não está em idade de creche. Saiba como matriculá-la na Educação Básica "
                                    msg_erro_link="(ir para Solicitação de Vaga e Matrícula)."
                                    msg_erro_link_url="https://educacao.sme.prefeitura.sp.gov.br/coordenadoria-de-gestao-e-organizacao-educacional-coged/solicitacao-de-vaga-e-matricula/)"
                                    color="danger"
                                    classe_css_texto="texto-alert-danger"
                                />
                            ) : null}

                        <p className="fonte-16 mt-4"><strong>Sobre a localidade</strong></p>
                        <label htmlFor="selecione_categoria_busca" className="cor-azul">Selecione a categoria de
                            busca*</label>

                        <select
                            defaultValue={this.state.selecione_categoria}
                            className={`${this.state.selecione_categoria_css_round} mb-5 form-control form-control-lg rounded-pill shadow fonte-16`}
                            id="selecione_categoria_busca"
                            onChange={(event) => this.onChangeCategoria(event.target.value)}
                            onBlur={() => this.setState({selecione_categoria_css_round: ''})}
                            onClick={() => !this.state.selecione_categoria_css_round ? this.setState({selecione_categoria_css_round: 'input_selecione_categoria_round_css'}) : this.setState({selecione_categoria_css_round: ''})}
                            disabled={this.state.erro_idade_crianca_vagas || this.state.mes_aniversario_vagas === undefined || this.state.ano_aniversario_vagas === undefined}
                        >
                            <option value=''>Selecione uma categoria</option>
                            <option value="DRE">Diretoria Regional de Educação</option>
                            <option value="DIS">Distrito</option>
                            <option value="SUB">Subprefeitura</option>

                        </select>

                        <label htmlFor="selecione_localidade" className="cor-azul">Selecione a localidade*</label>

                        <select
                            className={`${this.state.selecione_localidade_css_round} mb-4 form-control form-control-lg rounded-pill shadow fonte-16`}
                            id="selecione_localidade"
                            disabled={this.state.erro_idade_crianca_vagas || !this.state.selecione_categoria || this.state.selecione_categoria === ''}
                            onChange={(event) => this.onChangeLocalidade(event)}
                            onBlur={() => this.setState({selecione_localidade_css_round: ''})}
                            onClick={() => !this.state.selecione_localidade_css_round ? this.setState({selecione_localidade_css_round: 'input_selecione_categoria_round_css'}) : this.setState({selecione_localidade_css_round: ''})}
                        >
                            <option value=''>Selecione</option>
                            <option value='all'>{this.state.label_localidades}</option>

                            {this.populateSelectLocalidade()}

                        </select>

                        <div className="form-group text-center">

                            <Link
                                to={{
                                    pathname: "/vagas-remanescentes-creches",
                                    params: {
                                        dc_serie_ensino_vagas: this.state.dc_serie_ensino_vagas,
                                        serie_vagas: this.state.serie_vagas,
                                        selecione_categoria: this.state.selecione_categoria,
                                        localidade_escolhida: this.state.localidade_escolhida,
                                        localidade_escolhida_label: this.state.localidade_escolhida_label,
                                    }
                                }}>

                                <button
                                    type="button"
                                    className={`btn btn-${this.state.erro_idade_crianca_vagas || this.state.localidade_escolhida === null || this.state.localidade_escolhida === '' ? 'secondary' : 'success'} btn-lg rounded-pill shadow btn-enviar-home fonte-16 font-weight-bold pl-4 pr-4`}
                                    disabled={this.isButtonDisabled()}
                                >
                                    Consultar
                                </button>
                            </Link>
                        </div>


                    </div>
                    <div className="col-lg-6 col-lg-6 mapa-completo">
                        <Mapa
                            lista_escolas_raio_serie={this.state.lista_escolas_raio_vagas}
                            dc_serie_ensino={this.state.dc_serie_ensino_vagas}
                            zoom_inicial={14}
                            parametro_total_creches="vagas_remanescente"
                            classe_css="mapa-vagas-remanescentes h-80"
                        />
                    </div>
                </div>

            </div>
        </Fragment>)
    }

}

export default VagasRemanescentes