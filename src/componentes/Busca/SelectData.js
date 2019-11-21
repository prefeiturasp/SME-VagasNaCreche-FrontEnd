import React from 'react'
import GetMesNascimento from './GetMesNascimento';
import GetAnoNascimento from './GetAnoNascimento'

class SelectData extends React.Component {

    render() {
        return (
            <div className="col-12 col-md-6">
                <div className="row">
                    <div className="form-group col-md-6 pr-md-1">
                        <label htmlFor="mes_nascimento" className="cor-azul pl-2">Selecione o mês de nascimento *</label>
                        <select
                            id="mes_nascimento"
                            className="mes_nascimento_home form-control form-control-lg rounded-pill shadow"
                            /*onChange={this.mesAniversarioChange.bind(this)}*/

                            defaultValue={this.props.mes_aniversario}
                            onChange={(event) => this.props.onChange('mes_aniversario', event.target.value)}
                        >
                            <option value={undefined}>Selecione um mês</option>
                            <GetMesNascimento/>
                        </select>
                    </div>

                    <div className="form-group col-md-6 pl-md-1">
                        <label htmlFor="mes_nascimento" className="cor-azul pl-2">Selecione o mês de nascimento *</label>
                        <select
                            id="ano_nascimento"
                            className="mes_nascimento_home form-control form-control-lg rounded-pill shadow"
                            /*onChange={this.anoAniversarioChange.bind(this)}*/
                            onChange={(event) => this.props.onChange('ano_aniversario', event.target.value)}
                            defaultValue={this.props.ano_aniversario}
                        >
                            <option value={undefined}>Selecione um ano</option>
                            <GetAnoNascimento/>
                        </select>
                    </div>
                </div>
            </div>

        );
    }

}

export default SelectData;