import React, {Component} from "react";
import PubSub from "pubsub-js";
import {Map, TileLayer, Marker, Popup} from "react-leaflet";

export default class Mapa extends Component {
    constructor(props) {
        super(props);
        this.state = {
            escola: "",
            lat: -23.5505,
            lng: -46.6333,
            zoom: 14,
            marcadores: [],
            lista_escolas_raio_serie: this.props.lista_escolas_raio_serie,
            dc_serie_ensino: this.props.dc_serie_ensino
        };

        this.criarMarcadores = this.criarMarcadores.bind(this);
    }

    componentDidMount() {
        this.criarMarcadores(this.state.lista_escolas_raio_serie)
        PubSub.subscribe(
            "escola",
            function (topico, escola) {
                this.setState({escola: escola, zoom: 18});
            }.bind(this)
        );

        PubSub.subscribe(
            "latitude",
            function (topico, latitude) {
                this.setState({lat: latitude});
            }.bind(this)
        );

        PubSub.subscribe(
            "longitude",
            function (topico, longitude) {
                this.setState({lng: longitude});
            }.bind(this)
        );

    }

    criarMarcadores(escolas) {
        if (escolas.length) {
            this.setState({marcadores: []}, () => {
                escolas.forEach(escola => {
                    let marcador = [];
                    marcador.escola = escola;
                    marcador.latitude = escola.latitude;
                    marcador.longitude = escola.longitude;
                    this.state.marcadores.push(marcador);
                });
                this.setState({
                    lat: this.state.marcadores[0].latitude,
                    lng: this.state.marcadores[0].longitude
                });
            });
        } else {
            this.setState({marcadores: []});
        }
    }

    render() {
        return (
            <div className="mapa h-80">
                <Map
                    ref="map"
                    center={[this.state.lat, this.state.lng]}
                    zoom={this.state.zoom}
                >
                    <TileLayer
                        attribution=""
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {this.state.marcadores.map((marcador, indice) => {
                        return (
                            <Marker
                                key={indice}
                                position={[marcador.latitude, marcador.longitude]}
                            >
                                <Popup>
                                    <p className="fonte-14 mb-0"><strong>{marcador.escola.escola}</strong></p>
                                    <p className="fonte-12 mb-1 mt-0"> Há {marcador.escola.total} crianças aguardando no {this.state.dc_serie_ensino}</p>
                                    <p className="fonte-14 mt-3">
                                        <strong>Endereço: </strong>{marcador.escola.endereco_completo}</p>

                                    {marcador.escola.telefones ? (
                                        marcador.escola.telefones.map((telefone, indice) => {
                                            return (
                                                <a key={indice} className="mr-2" href={`tel:${telefone}`}>
                                                    Tel: {telefone}
                                                </a>
                                            )
                                        })
                                    ) : null}

                                </Popup>
                            </Marker>
                        );
                    })}
                </Map>
            </div>
        );
    }
}
