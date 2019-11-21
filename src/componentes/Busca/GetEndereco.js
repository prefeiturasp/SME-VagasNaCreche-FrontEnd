import React from 'react'

class GetEndereco extends React.Component {

    render() {

        return (

            <div className="col-12 col-md-4">

                    <div className="form-group ">
                        <label htmlFor="endereco" className="cor-azul pl-2">Digite o Endereço:</label>
                        <input id="endereco" className="form-control form-control-lg rounded-pill shadow pt-3 pb-3" type="text"
                               value={this.props.endereco}
                            //onChange={this.props.handleChange}
                            //onChange={(event) => this.props.onChange(this)}
                               onChange={(event) => this.props.onChange(event.target.value)}
                               disabled={this.props.inputEnderecoDisabled}
                        />
                    </div>

            </div>

        );

    }

}

export default GetEndereco