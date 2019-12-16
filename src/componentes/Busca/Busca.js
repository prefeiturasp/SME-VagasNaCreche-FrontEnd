import React from 'react';
import {Link} from "react-router-dom";

import ConectarApi from "../../services/ConectarApi";

import calculaSerieEnsino from '../../utils/CalculaSerieEnsino';
import SelectData from '../../utils/SelectData';
import GetEnderecoAutocomplete from '../../utils/GetEnderecoAutocomplete'
import TrataErros from '../../utils/TrataErros'

const URL_API_ENDERECO = process.env.REACT_APP_API_ENDERECO;

// Simulando um Helper
const isButtonDisabled = (texto) => {
    return texto.length < 5
}

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
            input_endereco_disabled: 'disabled',
            input_endereco_round_css: '',
            erro_idade_crianca: false,
            popupVisible: '',
        };

        this.setAtributosCampos = this.setAtributosCampos.bind(this);
        this.setInputEndereco = this.setInputEndereco.bind(this);
        this.handleChange = this.handleChange.bind(this);

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
            this.setState({erro_idade_crianca: true});
            this.setState({input_endereco_disabled: 'disabled'})
        } else {
            this.setState({erro_idade_crianca: false});
        }

        this.setState({dc_serie_ensino: preschoolGroup.dc_serie_ensino});
        this.setState({serie: preschoolGroup.serie});
        localStorage.setItem('dc_serie_ensino', preschoolGroup.dc_serie_ensino);
        localStorage.setItem('serie', preschoolGroup.serie);
    }

    handleChange(event) {
        // Para montar o autocomplete
        const endereco_pesquisado = event.target.value;
        const endereco_api_consulta = `${URL_API_ENDERECO}/v1/search?text=${endereco_pesquisado}&size=10&boundary.gid=whosonfirst:locality:101965533`
        this.setState({endereco: endereco_pesquisado});
        localStorage.setItem('endereco', endereco_pesquisado);

        ConectarApi.logarSemAutenticacao(endereco_api_consulta, 'get')

            .then(resposta => {
                //console.log("entrei aqui then ", retorno_conectar)

                this.setState({enderecos_retornados: resposta.data.features});

                if (resposta.data.features.length > 0) {

                    this.setState({input_endereco_round_css: ' input_endereco_round_css'})
                    this.setState({popupVisible: 'd-md-block'})

                    this.setState({longitude: resposta.data.features[0].geometry.coordinates[0]})
                    this.setState({latitude: resposta.data.features[0].geometry.coordinates[1]})

                    localStorage.setItem('longitude', resposta.data.features[0].geometry.coordinates[0]);
                    localStorage.setItem('latitude', resposta.data.features[0].geometry.coordinates[1]);
                }

            }).catch(erro => {
                //console.log("entrei aqui then ", retorno_conectar)
        });




    }

    setInputEndereco = (logradouro, bairro, longitude, latitude) => {

        if (bairro) {
            this.setState({endereco: `${logradouro} - ${bairro}`})
            this.setState({bairro: bairro});
            localStorage.setItem('endereco', `${logradouro} - ${bairro}`);
        } else {
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

                        <div className="col-12 col-lg-6">
                            <SelectData
                                atributo_mes="mes_aniversario"
                                atributo_ano="ano_aniversario"
                                mes_aniversario={this.state.mes_aniversario}
                                ano_aniversario={this.state.ano_aniversario}
                                onChange={this.setAtributosCampos}
                                classe_css_container_mes="form-group col-lg-6 pr-md-1 pl-md-2 text-center"
                                classe_css_container_ano="form-group col-lg-6 pl-md-1 text-center"
                                classe_css_select="centraliza-select"
                            />
                        </div>

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
                                    type="button"
                                    className={
                                        `btn btn-${this.state.endereco.length < 5 ? 'secondary' : 'success'} btn-lg rounded-pill shadow btn-enviar-home fonte-16 font-weight-bold pl-4 pr-4`
                                    }
                                    disabled={isButtonDisabled(this.state.endereco)}
                                >
                                    Consultar
                                </button>
                            </Link>
                        </div>
                    </div>
                </form>

                {this.state.erro_idade_crianca ? (
                    <TrataErros
                        msg_erro="A criança já não está em idade de creche. Saiba como matriculá-la na Educação Básica "
                        msg_erro_link="(ir para Solicitação de Vaga e Matrícula)."
                        msg_erro_link_url="https://educacao.sme.prefeitura.sp.gov.br/coordenadoria-de-gestao-e-organizacao-educacional-coged/solicitacao-de-vaga-e-matricula/)"
                        classe_css="ml-lg-5 mr-lg-5"
                        classe_css_texto="texto-alert-danger"
                        color="danger"
                    />
                ) : null}

            </div>
        );
    }
}

export default Busca;