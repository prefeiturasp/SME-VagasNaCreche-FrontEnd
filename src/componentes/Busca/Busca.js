import React from 'react';
import Axios from 'axios'
import calculatePreschoolGroup from './calculatePreschoolGroup'
import SelectData from './SelectData'

const URL_API_ENDERECO = process.env.REACT_APP_API_ENDERECO;

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
            btn_disabled: 'disabled',
            btn_css: 'btn btn-secondary btn-lg rounded-pill shadow btn-enviar-home'
        };

        this.setAtributosCampos = this.setAtributosCampos.bind(this);
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
        const monthOfBirth = parseInt(this.state.mes_aniversario, 10);
        const yearOfBirth = parseInt(this.state.ano_aniversario, 10);
        const preschoolGroup = calculatePreschoolGroup(monthOfBirth, yearOfBirth);
        //const ageMsg = composeDateOfBirthMsg(monthOfBirth, yearOfBirth);
        const state = {
            preschoolGroup: preschoolGroup,
            preschoolGroupName: preschoolGroup.dc_serie_ensino,
            preschoolGroupCode: preschoolGroup.serie,
            //ageMsg: ageMsg,
        };
        if (preschoolGroup.error) {
            state.preeschoolCalcError = true;
        } else {
            state.preeschoolCalcError = false;
        }
        this.setState(state);


        console.log("Ollyver 01: ", this.state.mes_aniversario);
        console.log("Ollyver 02: ", this.state.ano_aniversario);
        console.log("Ollyver 03: ", preschoolGroup);
        console.log("Ollyver 04: ", preschoolGroup.dc_serie_ensino);
        console.log("Ollyver 05: ", preschoolGroup.serie);
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
                console.log(this.state.enderecos_retornados)
            });
    }

    setInputEndereco(logradouro, longitude, latitude) {
        this.setState({endereco: logradouro});
        this.setState({longitude: longitude});
        this.setState({latitude: latitude});
        console.log("Longitude: ", longitude);
        console.log("Latitude: ", latitude);
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
                                <input id="endereco" className="form-control form-control-lg rounded-pill shadow pt-3 pb-3" type="text" value={this.state.endereco} onChange={this.handleChange.bind(this)}/>
                            </div>

                            <div className="form-group col-md-2">
                                <button onClick={this.mostraLatitudeLongitude.bind(this)} type="button" className={this.state.btn_css} disabled={this.state.btn_disabled}>Consultar</button>
                            </div>


                        </div>
                    </form>
                </div>

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