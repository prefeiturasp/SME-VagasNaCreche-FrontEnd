import React from 'react';
import Axios from 'axios'
import {Link} from "react-router-dom";

import calculaSerieEnsino from './CalculaSerieEnsino';
import SelectData from './SelectData';

const URL_API_ENDERECO = process.env.REACT_APP_API_ENDERECO;

//http://127.0.1.1/api/fila-da-creche/espera_escola_raio/-23.570077/-46.568318/1

class Busca extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            endereco: '',
            enderecos_retornados: [],
            latitude: '-23.570077',
            longitude: '-46.568318',
            mostraLatitudeLongitude: false,
            mes_aniversario: undefined,
            ano_aniversario: undefined,
            dc_serie_ensino: '',
            serie: '',
            btn_disabled: 'disabled',
            btn_css: 'btn btn-secondary btn-lg rounded-pill shadow btn-enviar-home',
            lista_escolas_raio_serie: [],
            msg_erro: null,
        };

        this.setAtributosCampos = this.setAtributosCampos.bind(this);
    }

    trataErro(msg_erro) {
        this.setState({msg_erro: msg_erro});
        this.setState({btn_disabled: 'disabled'});
        this.setState({btn_css: 'btn btn-secondary btn-lg rounded-pill shadow btn-enviar-home'})
    }

    setAtributosCampos = (attribute, value) => {
        this.setState({[attribute]: value}, () => {
            if (this.state.mes_aniversario !== undefined && this.state.ano_aniversario !== undefined) {
                this.setAge();
            }
        });
    };

    setAge() {
        this.setState({btn_disabled: ''});
        this.setState({btn_css: 'btn btn-success btn-lg rounded-pill shadow btn-enviar-home'});
        this.setState({msg_erro: null});
        const monthOfBirth = parseInt(this.state.mes_aniversario, 10);
        const yearOfBirth = parseInt(this.state.ano_aniversario, 10);
        const preschoolGroup = calculaSerieEnsino(monthOfBirth, yearOfBirth);

        if (preschoolGroup.error) {
            this.trataErro('A criança não está em idade de creche. Tente para outra idade.');
        }

        this.setState({dc_serie_ensino: preschoolGroup.dc_serie_ensino});
        this.setState({serie: preschoolGroup.serie})

        console.log("Ollyver 03: ", preschoolGroup);
        console.log("Ollyver 04: ", preschoolGroup.dc_serie_ensino);
        console.log("Ollyver 05: ", preschoolGroup.serie);
    }

    getEscolasRaioSerie() {
        console.log("Entrei getEscolasRaioSerie");
        Axios.get(`${URL_API_ENDERECO}/${this.state.latitude}/${this.state.longitude}/${this.state.serie}`)
            .then(resposta => {
                this.setState({lista_escolas_raio_serie: resposta});
                console.log("Entrei getEscolasRaioSerie 02 | ", resposta);
            });
    }

    mostraLatitudeLongitude() {
        this.setState({mostraLatitudeLongitude: true})
    }

    handleChange(event) {

        const endereco_pesquisado = event.target.value;
        this.setState({endereco: endereco_pesquisado});
        Axios.get(`${URL_API_ENDERECO}/search?text=${endereco_pesquisado}&size=10&boundary.gid=whosonfirst:locality:101965533`)
            .then(resposta => {
                this.setState({enderecos_retornados: resposta.data.features})
            });
    }

    handleSubmit() {

    }

    setInputEndereco(logradouro, longitude, latitude) {
        this.setState({endereco: logradouro});
        this.setState({longitude: longitude});
        this.setState({latitude: latitude});
    }

    render() {
        return (
            <div className="row">

                <div className="col-12">
                    <form onSubmit={this.handleSubmit}>
                        <div className="form-row">

                            <SelectData
                                mes_aniversario={this.state.mes_aniversario}
                                ano_aniversario={this.state.ano_aniversario}
                                onChange={this.setAtributosCampos}
                            />

                            <div className="form-group col-md-4">
                                <label htmlFor="endereco" className="cor-azul pl-2">Digite o Endereço:</label>
                                {/*<input id="endereco" className="form-control form-control-lg rounded-pill shadow pt-3 pb-3" type="text" value={this.state.endereco} onChange={this.handleChange.bind(this)}/>*/}
                                <input onChange={this.getEscolasRaioSerie.bind(this)} id="endereco" className="form-control form-control-lg rounded-pill shadow pt-3 pb-3" type="text"/>
                            </div>

                            <div className="form-group col-md-2">
                                {/*<button onClick={this.mostraLatitudeLongitude.bind(this)} type="button" className={this.state.btn_css} disabled={this.state.btn_disabled}>Consultar</button>*/}
                                <Link to={{
                                    pathname:"/creches",
                                    params: {
                                        lista_escolas_raio_serie: this.state.lista_escolas_raio_serie,
                                        dc_serie_ensino: this.state.dc_serie_ensino,
                                        serie: this.state.serie,
                                      }
                                }}>

                                    <button
                                        //onClick={this.getEscolasRaioSerie.bind(this)}
                                        type="button" className={this.state.btn_css}
                                        disabled={this.state.btn_disabled}>
                                        Consultar
                                    </button>
                                </Link>
                            </div>


                        </div>
                    </form>
                </div>

                {this.state.msg_erro ? (
                    <div className="col-12 text-center m-auto">
                        <h4>{this.state.msg_erro}</h4>
                    </div>
                ) : null}

                {this.state.mostraLatitudeLongitude ? (
                    <div id='mostra-latitude-longitude' className="col-xs-12 col-md-6">
                        <h4>Você pesquisou</h4>
                        <p><strong>Longitude: </strong>{this.state.longitude}</p>
                        <p><strong>Latitude: </strong>{this.state.latitude}</p>
                    </div>
                ) : null}


                <div className="w-100"></div>

                {this.state.enderecos_retornados.length > 0 ? (
                    <div className="col-xs-12 col-md-6 mt-3">

                        <ul className="retorno-endereco pl-0">
                            <li className="list-group-item list-group-item-secondary border-0 rounded-0 mb-0">
                                Logradouros
                            </li>
                            {this.state.enderecos_retornados.map((logradouro, indice) => {
                                return (
                                    <li key={indice} className="list-group-item list-group-item-action border-0" onClick={this.setInputEndereco.bind(this, logradouro.properties.name, logradouro.geometry.coordinates[0], logradouro.geometry.coordinates[1])}>
                                        {/*{logradouro.properties.label}*/}
                                        {logradouro.properties.name}
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                ) : null}

            </div>
        );
    }

}

export default Busca;