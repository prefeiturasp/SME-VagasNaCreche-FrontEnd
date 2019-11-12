import React from 'react';

const GetAnoNascimento = () => {
    const current_year = new Date().getFullYear();
    const IDADE_MAXIMA = 4;
    const startYear = current_year - IDADE_MAXIMA;
    let yearsList = [];
    let yearsOptions = [];
    for (var i = startYear; i <= current_year; i++) {
        yearsList.push(i);
        let yearOption = <option key={'yo_' + i} value={i}>{i}</option>
        yearsOptions.push(yearOption);
    }
    return yearsOptions;
}

export default GetAnoNascimento
