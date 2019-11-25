import React from 'react'

class GetEnderecoAutocomplete extends React.Component{

    render() {
        return(

            <div className='row'>
                    {this.props.enderecos_retornados.length > 0 ? (
                        <div className='col-12 col-md-6 offset-md-6'>

                            <ul className="retorno-endereco pl-0">
                                <li className="list-group-item list-group-item-secondary border-0 rounded-0 mb-0">
                                    Logradouros
                                </li>
                                {this.props.enderecos_retornados.map((logradouro, indice) => {
                                    return (
                                        <li key={indice} className="list-group-item list-group-item-action border-0" onClick={() => this.props.setInputEndereco(logradouro.properties.name, logradouro.geometry.coordinates[0], logradouro.geometry.coordinates[1])}>
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

export default GetEnderecoAutocomplete