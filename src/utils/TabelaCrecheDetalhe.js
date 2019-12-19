import React from 'react'

class TabelaCrecheDetalhe extends React.Component {
    render() {
        return (

            <tr id={`escola-${this.props.escola.cd_unidade_educacao}`} className="collapse bg-linha-detalhe">
                <td className='td-tabela-creches-sem-borda'></td>
                <td colSpan="3" className='td-tabela-creches-sem-borda'>
                    <p><strong>Endereço: </strong> {this.props.escola.endereco_completo}</p>
                    {this.props.escola.telefones ? (
                        this.props.escola.telefones.map((telefone, indice) => {
                            return (
                                <a key={indice} className="mr-2" href={`tel:${telefone}`}>
                                    Tel: {telefone}
                                </a>
                            )
                        })
                    ) : null}
                </td>


            </tr>


        );
    }
}

export default TabelaCrecheDetalhe