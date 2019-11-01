import React from 'react'
import Axios from 'axios'

const API_VAGA_NA_CRECHE = process.env.REACT_APP_API_VAGANACRECHE;

class HelloWorldApi extends React.Component{
    constructor(){
        super();
        this.state={hello_world:''}
    }
    componentWillMount() {
        Axios.get(API_VAGA_NA_CRECHE)
            .then(resposta => {
                this.setState({hello_world:resposta.data.result})
            })
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