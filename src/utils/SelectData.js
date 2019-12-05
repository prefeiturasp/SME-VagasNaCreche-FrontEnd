import React from 'react'
import './SelectData.css'
import GetMesNascimento from './GetMesNascimento';
import GetAnoNascimento from './GetAnoNascimento'

class SelectData extends React.Component {

    render() {

        return (

            <div className="row">
                <div className={`${this.props.classe_css_container_mes}`}>

                    <label htmlFor="mes_nascimento" className="cor-azul">Selecione o mês de nascimento*</label>
                    <select
                        id="mes_nascimento"
                        className={`${this.props.classe_css_select} mes_nascimento_home form-control form-control-lg rounded-pill shadow fonte-16`}
                        defaultValue={this.props.mes_aniversario}
                        onChange={(event) => this.props.onChange(this.props.atributo_mes, event.target.value)}
                    >
                        <option className="text-center" value={undefined}>Selecione um mês</option>
                        <GetMesNascimento/>
                    </select>
                </div>

                <div className={`form-group col-lg-6 ${this.props.classe_css_container_ano}`}>
                    <label htmlFor="mes_nascimento" className="cor-azul mt-3 mt-lg-0">Selecione o ano de nascimento*</label>
                    <select
                        id="ano_nascimento"
                        className={`${this.props.classe_css_select} mes_nascimento_home form-control form-control-lg rounded-pill shadow fonte-16`}
                        onChange={(event) => this.props.onChange(this.props.atributo_ano, event.target.value)}
                        defaultValue={this.props.ano_aniversario}
                    >
                        <option value={undefined}>Selecione um ano</option>
                        <GetAnoNascimento/>
                    </select>
                </div>
            </div>

        );
    }

}

export default SelectData;