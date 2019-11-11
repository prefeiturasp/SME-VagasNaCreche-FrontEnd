import React from 'react'
import Axios from 'axios'

class Home extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            endereco: '',
            enderecos_retornados: [],
            latitude: '',
            longitude: '',
            mostraLatitudeLongitude: false
        };
    }
    mostraLatitudeLongitude() {
        this.setState({mostraLatitudeLongitude: true})
    }

    handleChange(event) {

        const endereco_pesquisado = event.target.value;
        this.setState({endereco: endereco_pesquisado});
        Axios.get(`http://10.49.23.37:4000/v1/search?text=${endereco_pesquisado}&size=10&boundary.gid=whosonfirst:locality:101965533`)
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

                <div className="col-xs-12 col-md-6 mb-5">
                    <h1>Estou na Home</h1>
                    <form onSubmit={this.handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="endereco">Digite o Endereço:</label>
                            <input id="endereco" className="form-control" type="text" value={this.state.endereco} onChange={this.handleChange.bind(this)}/>
                        </div>
                        <button onClick={this.mostraLatitudeLongitude.bind(this)} type="button" className="btn btn-primary">Enviar</button>

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

export default Home