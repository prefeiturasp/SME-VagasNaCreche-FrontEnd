import React from 'react';
import Routes from './componentes/Routes/Routes'
import MenuAcessibilidade from './componentes/Menu/MenuAcessibilidade'
import MenuPrincipal from './componentes/Menu/MenuPrincipal'
import Rodape from './componentes/Rodape/Rodape'
import "./styles/styles.scss";

import ReactGA from 'react-ga';
ReactGA.initialize('UA-149756375-1');
ReactGA.pageview(window.location.pathname + window.location.search);

class App extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            alterarFonte:
                (localStorage.getItem("alterarFonte") &&
                    localStorage.getItem("alterarFonte") === "true") ||
                false,
            alterarContraste:
                (localStorage.getItem("alterarContraste") &&
                    localStorage.getItem("alterarContraste") === "true") ||
                false,

            esconderLinkBuscaEscola:true

        };
        this.alterarFonte = this.alterarFonte.bind(this);
        this.alterarContraste = this.alterarContraste.bind(this);
    }

    alterarFonte() {
    const alterarFonte =
      localStorage.getItem("alterarFonte") !== null
        ? localStorage.getItem("alterarFonte") !== "true"
        : true;
    localStorage.setItem("alterarFonte", alterarFonte);
    this.setState({ alterarFonte });
  }

  alterarContraste() {
    const alterarContraste =
      localStorage.getItem("alterarContraste") !== null
        ? localStorage.getItem("alterarContraste") !== "true"
        : true;
    localStorage.setItem("alterarContraste", alterarContraste);
    this.setState({ alterarContraste });
  }

    render() {
        const { alterarFonte, alterarContraste } = this.state;
        return (
            <section role="main" className={`${alterarFonte && "fonte-maior"} ${alterarContraste && "alto-contraste"}`}>
                <MenuAcessibilidade alterarFonte={this.alterarFonte} alterarContraste={this.alterarContraste}/>
                <MenuPrincipal esconderLinkBuscaEscola = {this.state.esconderLinkBuscaEscola}/>
                <Routes/>
                <Rodape/>
            </section>

        );
    }
}

export default App;
