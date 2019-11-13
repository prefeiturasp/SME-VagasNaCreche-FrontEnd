import React from 'react'

class Creches extends React.Component{

    constructor(props){
        super(props);
        console.log("Ollyver Creches | ", this.props.location.params)
    }

    render() {

        return(
            <div className="container">
                <h1> Estou no Creches</h1>
            </div>
        );
    }

}
export default Creches;