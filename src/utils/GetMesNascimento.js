import React from 'react';
const months_list = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

const GetMesNascimento = () =>{
    let monthsOptions = months_list.map((month, i) =>
    <option key={'mo_' + i} value={i + 1}>{month}</option>
  );
  return monthsOptions;


};
export default GetMesNascimento;