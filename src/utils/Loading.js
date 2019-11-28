import React from "react";
import FadeIn from "react-fade-in";
import Lottie from "react-lottie";
import ReactLoading from "react-loading";

export default class Loading extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="d-flex justify-content-center mt-5 mb-5">
                <div className="d-flex flex-column mt-5 mb-5">
                    <ReactLoading type={"bars"} color={"black"}/>
                    <p className="ml-n3">Carregando...</p>
                </div>
            </div>
        )

    }
}