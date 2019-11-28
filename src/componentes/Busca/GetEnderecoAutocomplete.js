import React from 'react'
import './busca.css'

class GetEnderecoAutocomplete extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            escondeAoClicarFora: false,
            input_endereco_round_css_recoloca_bordas: '',
        };

        this.setWrapperRef = this.setWrapperRef.bind(this);
        this.handleClickOutside = this.handleClickOutside.bind(this);
        this.onclick = this.onclick.bind(this);
    }

    componentDidMount() {
        document.addEventListener('mousedown', this.handleClickOutside);
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClickOutside);
    }

    setWrapperRef(node) {
        this.wrapperRef = node;
    }

    handleClickOutside(event) {
        if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {

            this.setState({escondeAoClicarFora: true})
        }
    }

    onclick(event) {
        this.setState({escondeAoClicarFora: false})
        this.setState({input_endereco_round_css_recoloca_bordas: 'input_endereco_round_css_recoloca_bordas'})
    }

    render() {
        return (


            <div className="col-12 col-lg-4">

                <div className="form-group text-center">
                    <label htmlFor="endereco" className="cor-azul mt-3 mt-lg-0">Digite o endereço que deseja consultar *</label>
                    <input id="endereco"
                           className={"text-center form-control form-control-lg rounded-pill shadow pt-3 pb-3 fonte-14 " + this.props.inputEnderecoRoundCss + " " + this.state.input_endereco_round_css_recoloca_bordas}
                           type="text"
                           value={this.props.endereco}
                           onChange={(event) => this.props.onChange(event)}
                           disabled={this.props.inputEnderecoDisabled}
                           onClick={this.onclick}

                    />


                    {this.props.enderecos_retornados.length > 0 && !this.state.escondeAoClicarFora ? (

                        <ul className={"endereco-autocomplete pl-0 fonte-14 " + this.props.popupVisible}
                            ref={this.setWrapperRef}>
                            <li className="list-group-item list-group-item-secondary border-0 rounded-0 mb-0">
                                Logradouros
                            </li>
                            {this.props.enderecos_retornados.map((logradouro, indice) => {
                                return (
                                    <li key={indice}
                                        onClick={() => this.props.setInputEndereco(logradouro.properties.name, logradouro.properties.neighbourhood, logradouro.geometry.coordinates[0], logradouro.geometry.coordinates[1])}>
                                        <a href="#!" className="list-group-item list-group-item-action border-0">
                                            {logradouro.properties.name}
                                            { logradouro.properties.neighbourhood ? (
                                                ` - ${logradouro.properties.neighbourhood}`
                                            ) : null }

                                        </a>
                                    </li>
                                );
                            })}
                        </ul>

                    ) : null}


                </div>
            </div>

        );
    }


}

export default GetEnderecoAutocomplete