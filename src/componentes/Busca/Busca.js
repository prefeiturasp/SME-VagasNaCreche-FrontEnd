import React from 'react';
import Axios from 'axios'
import {Link} from "react-router-dom";

import calculaSerieEnsino from './CalculaSerieEnsino';
import SelectData from './SelectData';
import GetEnderecoAutocomplete from './GetEnderecoAutocomplete'

const URL_API_ENDERECO = process.env.REACT_APP_API_ENDERECO;

class Busca extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            endereco: '',
            bairro: '',
            enderecos_retornados: [],
            latitude: '',
            longitude: '',
            mes_aniversario: undefined,
            ano_aniversario: undefined,
            dc_serie_ensino: '',
            serie: '',
            btn_disabled: 'disabled',
            btn_css: 'btn btn-secondary btn-lg rounded-pill shadow btn-enviar-home fonte-16 font-weight-bold pl-4 pr-4',
            input_endereco_disabled: 'disabled',
            input_endereco_round_css: '',
            msg_erro: null,
            popupVisible: '',
        };

        this.setAtributosCampos = this.setAtributosCampos.bind(this);
        this.setInputEndereco = this.setInputEndereco.bind(this);
        this.handleChange = this.handleChange.bind(this);

    }

    trataErro(msg_erro) {
        this.setState({msg_erro: msg_erro});
        this.setState({btn_disabled: 'disabled'});
        this.setState({btn_css: 'btn btn-secondary btn-lg rounded-pill shadow btn-enviar-home fonte-16 font-weight-bold pl-4 pr-4'})
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

                        this.setState({input_endereco_round_css: ' input_endereco_round_css'})
                        this.setState({popupVisible: 'd-md-block'})

                        this.setState({btn_disabled: ''});
                        this.setState({btn_css: 'btn btn-success btn-lg rounded-pill shadow btn-enviar-home fonte-16 font-weight-bold pl-4 pr-4'});
                        this.setState({msg_erro: null});

                        this.setState({longitude: resposta.data.features[0].geometry.coordinates[0]})
                        this.setState({latitude: resposta.data.features[0].geometry.coordinates[1]})

                        localStorage.setItem('longitude', resposta.data.features[0].geometry.coordinates[0]);
                        localStorage.setItem('latitude', resposta.data.features[0].geometry.coordinates[1]);
                    }
                });
        }
    }

    setInputEndereco = (logradouro, bairro, longitude, latitude) => {

        if (bairro){
            this.setState({endereco: `${logradouro} - ${bairro}`})
            this.setState({bairro: bairro});
            localStorage.setItem('endereco', `${logradouro} - ${bairro}`);
        }else {
             this.setState({endereco: `${logradouro}`})
            localStorage.setItem('endereco', `${logradouro}`);
        }


        this.setState({longitude: longitude});
        this.setState({latitude: latitude});


        localStorage.setItem('longitude', longitude);
        localStorage.setItem('latitude', latitude);

        this.setState({input_endereco_round_css: ''})
        this.setState({popupVisible: 'd-none'})
    };

    render() {

        return (
            <div id="busca" className="col-lg-12 col-sm-12 mt-5 pr-0 pl-0">

                <form>
                    <div className="form-row ml-lg-5">

                        <SelectData
                            mes_aniversario={this.state.mes_aniversario}
                            ano_aniversario={this.state.ano_aniversario}
                            onChange={this.setAtributosCampos}
                        />

                        <GetEnderecoAutocomplete
                            endereco={this.state.endereco}
                            bairro={this.state.bairro}
                            onChange={this.handleChange}
                            inputEnderecoDisabled={this.state.input_endereco_disabled}
                            inputEnderecoRoundCss={this.state.input_endereco_round_css}
                            enderecos_retornados={this.state.enderecos_retornados}
                            setInputEndereco={this.setInputEndereco}
                            popupVisible={this.state.popupVisible}
                        />

                        <div className="form-group col-lg-2 text-center text-lg-left">
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
                                    disabled={this.state.btn_disabled}
                                >
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

            </div>

        );
    }

}

export default Busca;