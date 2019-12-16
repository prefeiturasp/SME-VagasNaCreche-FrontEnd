import React from 'react'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlus, faMinus} from "@fortawesome/free-solid-svg-icons";

import './TabelaCreches.scss'
import TabelaCrecheDetalhe from './TabelaCrecheDetalhe'

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

                <table className="table tabela-escolas fonte-14 border-top-0 borda-branca-topo">
                    <thead>
                    <tr>
                        <th></th>
                        {/*Montando o Cabecalho dinâmico*/}
                        {this.props.cabecalho.map((parametro, index) => {
                            if(index === this.props.cabecalho_posicao_concat){
                                return <th key={index}>{`${parametro} ${this.props.cabecalho_concat}`}</th>
                            }else{
                                return <th key={index}>{parametro}</th>
                            }
                        })}
                    </tr>
                    </thead>
                    <tbody>

                    {this.props.lista_escolas_raio_serie.map((escola, indice) => {

                        return (
                            <React.Fragment key={indice}>
                                <tr className="tr-tabela-creches" data-toggle="collapse"
                                    href={`#escola-${escola.cd_unidade_educacao}`}
                                    aria-controls={`escola-${escola.cd_unidade_educacao}`}
                                    id={escola.cd_unidade_educacao}
                                    onClick={() =>
                                        this.toggleIcon(escola.cd_unidade_educacao, escola)
                                    }
                                >
                                    <td>
                                        <span className="container-icon-tabela-creches">
                                        <FontAwesomeIcon
                                            role="button"
                                            className="text-secondary icon-tabela-creches"
                                            icon={this.state[escola.cd_unidade_educacao] ? faMinus : faPlus}

                                        />
                                        </span>
                                    </td>
                                    <td><strong>{escola.escola}</strong></td>
                                    <td>{escola.tipo}</td>
                                    <td>{escola[this.props.parametro_total_creches]}</td>
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