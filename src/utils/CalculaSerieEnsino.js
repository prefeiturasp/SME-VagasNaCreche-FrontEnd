export default function calculaSerieEnsino(monthOfBirth, yearOfBirth) {
  const checkAge = Date.parse(monthOfBirth + "/15/" + yearOfBirth); // set it to middle of month
  const currentYear = new Date().getFullYear();
  const ageRanges = [
      {cd_ciclo_ensino:"1", cd_faixa:"1", dc_serie_ensino:"Berçário I", serie:"1", mes_min:"0", mes_max:"13", birth_start: Date.parse("4/1/" + (currentYear - 1)), birth_end: Date.parse("12/31/" + currentYear)},
      {cd_ciclo_ensino:"1", cd_faixa:"2", dc_serie_ensino:"Berçário II", serie:"4", mes_min:"13", mes_max:"22", birth_start: Date.parse("4/1/" + (currentYear - 2)), birth_end: Date.parse("3/31/" + (currentYear - 1))},
      {cd_ciclo_ensino:"1", cd_faixa:"3", dc_serie_ensino:"Mini Grupo I", serie:"27", mes_min:"22", mes_max:"34", birth_start: Date.parse("4/1/"  + (currentYear - 3)), birth_end: Date.parse("3/31/" + (currentYear - 2))},
      {cd_ciclo_ensino:"1", cd_faixa:"4", dc_serie_ensino:"Mini Grupo II", serie:"28", mes_min:"34", mes_max:"46", birth_start: Date.parse("4/1/" + (currentYear - 4)), birth_end: Date.parse("3/31/" + (currentYear - 3))}//,
      // NOTE: not yet calulating for these ranges
      // {cd_ciclo_ensino:"2", cd_faixa:"5", dc_serie_ensino:"Infantil I", serie:"23", mes_min:"", mes_max:"", birth_start: Date.parse("4/1/" + (currentYear - 5)), birth_end: Date.parse("3/31/" + (currentYear - 4))},
      // {cd_ciclo_ensino:"2", cd_faixa:"6", dc_serie_ensino:"Infantil II", serie:"25", mes_min:"", mes_max:"", birth_start: Date.parse("4/1/" + (currentYear - 6)), birth_end: Date.parse("3/31/" + (currentYear - 5))}
    ];
  for (var i = 0; i < ageRanges.length; i++) {
    if (checkAge >= ageRanges[i].birth_start && checkAge <= ageRanges[i].birth_end) {
      return ageRanges[i];
    }
  }
  return {error: true};
}
