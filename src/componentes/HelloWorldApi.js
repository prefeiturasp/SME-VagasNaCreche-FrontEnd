import React from 'react'
//import Axios from 'axios'

const API_VAGA_NA_CRECHE = process.env.REACT_APP_API_VAGANACRECHE;

class HelloWorldApi extends React.Component{
    constructor(){
        super();
        this.state={hello_world:''}
    }
    componentWillMount() {

            fetch('https://hom-vaganacreche.sme.prefeitura.sp.gov.br/api/hello/')
            .then(resposta => {
                if (resposta.ok){
                    return resposta.json();
                }else {
                    throw new Error("Não foi possível encontrar o tipo de escola");
                }
            })
            .then(tipo_de_escola => {
               this.setState({hello_world:resposta.data.result})
            });

       /* Axios.get(API_VAGA_NA_CRECHE)
            .then(resposta => {
                this.setState({hello_world:resposta.data.result})
            })*/
    }

    render() {
        return(
            <div>
                <h1>{this.state.hello_world}</h1>
            </div>

        );
    }
}

export default HelloWorldApi