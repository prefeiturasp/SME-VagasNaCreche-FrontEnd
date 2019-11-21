import React from 'react';
import Axios from 'axios'
import {Link} from "react-router-dom";

import calculaSerieEnsino from './CalculaSerieEnsino';
import SelectData from './SelectData';

const URL_API_ENDERECO = process.env.REACT_APP_API_ENDERECO;

class Busca extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            endereco: '',
            enderecos_retornados: [],
            latitude: '',
            longitude: '',
            mes_aniversario: undefined,
            ano_aniversario: undefined,
            dc_serie_ensino: '',
            serie: '',
            btn_disabled: 'disabled',
            btn_css: 'btn btn-secondary btn-lg rounded-pill shadow btn-enviar-home',
            input_endereco_disabled: 'disabled',
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
                this.setState({input_endereco_disabled: ''});
                this.setAge();
            }
        });
    };

    setAge() {
        const monthOfBirth = parseInt(this.state.mes_aniversario, 10);
        const yearOfBirth = parseInt(this.state.ano_aniversario, 10);
        const preschoolGroup = calculaSerieEnsino(monthOfBirth, yearOfBirth);

        if (preschoolGroup.error) {
            this.trataErro('A criança não está em idade de creche. Tente para outra idade.');
            this.setState({input_endereco_disabled: 'disabled'})
        } else {
            this.setState({msg_erro: null})
        }

        this.setState({dc_serie_ensino: preschoolGroup.dc_serie_ensino});
        this.setState({serie: preschoolGroup.serie});
        localStorage.setItem('dc_serie_ensino', preschoolGroup.dc_serie_ensino);
        localStorage.setItem('serie', preschoolGroup.serie);
    }

    handleChange(event) {

        // Para montar o autocomplete
        const qtde_caracteres = event.target.value.length;

        const endereco_pesquisado = event.target.value;
        const endereco_api_consulta = `${URL_API_ENDERECO}/v1/search?text=${endereco_pesquisado}&size=10&boundary.gid=whosonfirst:locality:101965533`
        this.setState({endereco: endereco_pesquisado});
        localStorage.setItem('endereco', endereco_pesquisado);

        if (qtde_caracteres > 4) {

            Axios.get(endereco_api_consulta)
                .then(resposta => {
                    this.setState({enderecos_retornados: resposta.data.features});

                    if (resposta.data.features.length > 0) {

                        this.setState({btn_disabled: ''});
                        this.setState({btn_css: 'btn btn-success btn-lg rounded-pill shadow btn-enviar-home'});
                        this.setState({msg_erro: null});

                        this.setState({longitude: resposta.data.features[0].geometry.coordinates[0]})
                        this.setState({latitude: resposta.data.features[0].geometry.coordinates[1]})

                        localStorage.setItem('longitude', resposta.data.features[0].geometry.coordinates[0]);
                        localStorage.setItem('latitude', resposta.data.features[0].geometry.coordinates[1]);
                    }
                });
        }
    }

    setInputEndereco(logradouro, longitude, latitude) {
        this.setState({endereco: logradouro});
        this.setState({longitude: longitude});
        this.setState({latitude: latitude});
    }

    render() {

        return (
            <div id="busca" className="col-lg-12 col-sm-12 mt-5">

                <form>
                    <div className="form-row">

                        <SelectData
                            mes_aniversario={this.state.mes_aniversario}
                            ano_aniversario={this.state.ano_aniversario}
                            onChange={this.setAtributosCampos}
                        />

                        <div className="form-group col-md-4">
                            <label htmlFor="endereco" className="cor-azul pl-2">Digite o Endereço:</label>
                            <input id="endereco" className="form-control form-control-lg rounded-pill shadow pt-3 pb-3" type="text" value={this.state.endereco} onChange={this.handleChange.bind(this)} disabled={this.state.input_endereco_disabled}/>
                            {/*<input onChange={this.getEscolasRaioSerie.bind(this)} id="endereco" className="form-control form-control-lg rounded-pill shadow pt-3 pb-3" type="text"/>*/}
                        </div>

                        <div className="form-group col-md-2 text-center text-md-left">
                            {/*<button onClick={this.mostraLatitudeLongitude.bind(this)} type="button" className={this.state.btn_css} disabled={this.state.btn_disabled}>Consultar</button>*/}
                            <Link
                                to={{
                                    pathname: "/creches",
                                    params: {
                                        dc_serie_ensino: this.state.dc_serie_ensino,
                                        serie: this.state.serie,
                                        endereco: this.state.endereco,
                                        longitude: this.state.longitude,
                                        latitude: this.state.latitude,
                                    }
                                }}>

                                <button
                                    type="button" className={this.state.btn_css}
                                    disabled={this.state.btn_disabled}>
                                    Consultar
                                </button>
                            </Link>
                        </div>


                    </div>
                </form>

                {this.state.msg_erro ? (
                    <div className="col-12 text-center m-auto">
                        <h4>{this.state.msg_erro}</h4>
                    </div>
                ) : null}


                <div className="w-100"></div>

                <div className='row'>
                    {this.state.enderecos_retornados.length > 0 ? (
                        <div className='col-12 col-md-6 offset-md-6'>

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

            </div>

        );
    }

}

export default Busca;