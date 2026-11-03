import Axios from "axios";

const ConectarApi = {

    logarSemAutenticacao(endereco, verbo, dados=null, configuracao={}) {

        const options = {
            ...configuracao,
            method: verbo,
            url: endereco,
            data: dados,
        };

        // send the request
       return Axios(options);


    }
};

export default ConectarApi
