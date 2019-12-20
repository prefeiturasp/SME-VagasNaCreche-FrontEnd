//import React from 'react'

const ConvertDateTime = {

    exibirDateTimeFormatada(data) {
        const date = new Date(data);
        return date.toLocaleDateString('pt-BR') + " às " + date.toLocaleTimeString('pt-BR');
    }
}

export default ConvertDateTime