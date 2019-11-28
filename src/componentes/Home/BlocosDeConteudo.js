import React from 'react'
import imgCeus from '../../img/cei_10.jpg'
import imgPhone from '../../img/phone.png'
const URL_VIDEO = process.env.REACT_APP_URL_VIDEO;

const BlocosDeConteudo = () => (

    <div>
        <div id="conteudo" className="w-100 desenvolvimento-escolar">
            <div className="container pt-5 pb-5">
                <div className="row">
                    <div className="col-12 col-md-6 col-lg-6 mb-3">
                        <h2 className="cor-azul mb-4">
                            Quer entender melhor como solicitar uma vaga na creche?
                        </h2>
                        <p className="mb-0">
                            O Portal da Secretaria Municipal de Educação explica de maneira didática o passo a passo para se solicitar uma vaga e fazer matrícula nas creches municipais, que são os Centros de Educação Infantil (CEIs) <a href="https://educacao.sme.prefeitura.sp.gov.br/coordenadoria-de-gestao-e-organizacao-educacional-coged/solicitacao-de-vaga-e-matricula/">(ir para Solicitação de Vaga e Matrícula).</a>
                        </p>
                    </div>
                    <div className="col-12 offset-lg-1 col-md-6 col-lg-5">
                        <div className="embed-responsive embed-responsive-16by9">
                            <iframe title="Vídeo sobre o Vaga Na Creche" src={URL_VIDEO} frameBorder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                        </div>

                    </div>
                </div>
            </div>
        </div>
        <div className="w-100 sociedade-governo text-white">
            <div className="container pt-5 pb-5">
                <div className="row">
                    <div className="col-12 col-md-6 col-lg-5 mb-3">

                        <h2 className="mb-4">A criança já está cadastrada à espera de uma vaga?</h2>
                        <p className="mb-0">
                            No endereço bit.ly/consultavaganacreche é possível consultar a posição da criança na espera por uma vaga em cada Centros de Educação Infantil constante no seu cadastro <a className="text-white" href="http://eolgerenciamento.prefeitura.sp.gov.br/se1426g/frmgerencial/ConsultaPosicaoIndividual.aspx?Cod=000000"> <u><strong>(ir para Consulta de Posição Individual)</strong></u></a>.
                        </p>
                    </div>
                    <div className="col-12 offset-lg-1 col-md-6 col-lg-5">
                        <img
                            src={imgCeus}
                            alt="Sociedade e Governo"
                            className="img-fluid"
                        />
                    </div>
                </div>
            </div>
        </div>

        <div id="conteudo" className="w-100 desenvolvimento-escolar">
            <div className="container pt-5 pb-5">
                <div className="row">
                    <div className="col-12 col-md-6 col-lg-5 mb-3">
                        <h2 className="cor-azul mb-4">
                            Quer saber mais sobre cada Centro de Educação Infantil?
                        </h2>
                        <p className="mb-0">
                            Na plataforma Escola Aberta você pode consultar dados não apenas dos Centros de Educação Infantil, mas de todas as escolas municipais de São Paulo. Ela informa, por exemplo, as séries, períodos, quantidade de turmas e de estudantes, vagas oferecidas e atendidas e que ambientes a escola possui <a href="https://educacao.sme.prefeitura.sp.gov.br/escolaaberta/conheca-a-rede">(ir para Escola Aberta).</a>

                        </p>
                    </div>
                    <div className="col-12 offset-lg-1 col-md-6 col-lg-5">
                        <img
                            src={imgPhone}
                            alt="Sociedade e Governo"
                            className="img-fluid"
                        />
                    </div>
                </div>
            </div>
        </div>

    </div>
);

export default BlocosDeConteudo