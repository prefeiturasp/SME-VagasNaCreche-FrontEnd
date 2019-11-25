import React from 'react'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlus, faMinus} from "@fortawesome/free-solid-svg-icons";

import TabelaCrecheDetalhe from './TabelaCrecheDetalhe'
import './tabela-creches.css'


class TabelaCreches extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            lista_escolas_raio_serie: this.props.lista_escolas_raio_serie,
        }
    }

    toggleIcon = (id, escola) => {
        this.setState(state => ({[id]: !state[id]}));
        this.props.atualizarMapa(
            escola.escola,
            escola.latitude,
            escola.longitude
        )
    }

    render() {
        return (
            <div className="tabela-escolas-div overflow-auto pt-4 pb-4">

                <table className="table tabela-escolas fonte-14">
                    <thead>
                    <tr>
                        <th></th>
                        <th>Nome da escola</th>
                        <th>Tipo</th>
                        <th>Crianças aguardando vaga no Berçário I</th>

                    </tr>
                    </thead>
                    <tbody>

                    {this.state.lista_escolas_raio_serie.map((escola, indice) => {
                        return (
                            <React.Fragment key={indice}>
                                <tr>
                                    <td>
                                        <FontAwesomeIcon
                                            role="button"
                                            className="text-secondary icon-tabela-creches"
                                            data-toggle="collapse"
                                            href={`#escola-${escola.cd_unidade_educacao}`}
                                            aria-controls={`escola-${escola.cd_unidade_educacao}`}

                                            id={escola.cd_unidade_educacao}
                                            icon={this.state[escola.cd_unidade_educacao] ? faMinus : faPlus}
                                            onClick={() =>
                                                this.toggleIcon(escola.cd_unidade_educacao, escola)
                                            }
                                        />
                                    </td>
                                    <td><strong>{escola.escola}</strong></td>
                                    <td>{escola.tipo}</td>
                                    <td>{escola.total}</td>
                                </tr>
                                <TabelaCrecheDetalhe escola={escola}/>
                            </React.Fragment>
                        );

                    })}
                    </tbody>
                </table>
            </div>
        );
    }

}

export default TabelaCreches