import Axios from "axios";

const ConectarApi = {

    logarSemAutenticacao(endereco, verbo, dados=null) {

        const options = {
            method: verbo,
            url: endereco,
            data: dados
        };

        // send the request
       return Axios(options);


    }
};

export default ConectarApi