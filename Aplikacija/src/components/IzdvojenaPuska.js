import React, { Component } from "react";

export default class IzdvojenaPuska extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    return (
      <div className="divIzdovijena">
        <div hidden={this.props.dostupna > 0 ? true : false}>
          <span className="badge badge-pill badge-danger">SOLD OUT</span>
        </div>

        <img
          className="slikapuske"
          alt="specijalna ponuda"
          src={this.props.slika}
        />

        <div className="opispuske">
          <div>
            <label className="proizvodjac">Proizvođač: </label>
            <label className="param_proizvodjac">
              &nbsp; {this.props.proizvodjac}
            </label>
            <br />
            <label className="model">Model: </label>
            <label className="param_model">&nbsp; {this.props.model}</label>
            <br />
            <label className="kalibar">Kalibar: </label>
            <label className="param_kalibar">&nbsp; {this.props.kalibar}</label>
          </div>

          <a
            href="/prodaja"
            className="detaljnije"
            hidden={this.props.dostupna > 0 ? false : true}
          >
            <span>Vidi u Prodavnici</span>
          </a>
          
        </div>
      </div>
    );
  }
}
