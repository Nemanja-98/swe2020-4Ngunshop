import React, { Component } from "react";
import fire from "./Konfig.js";

import IzdvojenaPuska from "./IzdvojenaPuska";

export class Pocetna extends Component {
  constructor(props) {
    super(props);

    this.state = {
      slika: " ",
      proizvodjac: " ",
      model: " ",
      kalibar: " ",
      dostupna: "",
    };
  }

  componentDidMount() {
    const Datum = new Date().toLocaleDateString().split("/");

    fire
      .firestore()
      .collection("Oruzje")
      .doc("Count")
      .get()
      .then((val) => {
        let broj = val.data().brojpusaka;
        let brojpuske = Datum[1] % broj;
        fire
          .firestore()
          .collection("Oruzje")
          .get()
          .then((datoteke) => {
            let puska = datoteke.docs[brojpuske].data();
            this.setState({
              dataId: datoteke.docs[brojpuske].id,
              slika: puska.slika1,
              proizvodjac: puska.proizvodjac,
              model: puska.model,
              kalibar: puska.kalibar,
              dostupna: puska.BrojNaRaspolaganju,
            });
          });
      });
  }

  render() {
    return (
      <div>
        <div className="glavnikontejner">
          <div className="textkontejner">
            <div className="tekst">
              <h1 className="welcome">Dobrodošli!</h1>
              <p className="poruka">
                Bilo da ste iskusni sportista,
                <br />
                pocetnik ili bezbedonosno lice
                <br />
                Mi imamo sve za vas arsenal.
                <br />
                Bilo moderno ili istorijsko <br />
                oruzje
              </p>
              <div className="readmore">
                <a className="procitaj" href="/kontakt">
                  <button className="dugmeprocitaj">Procitaj vise... </button>
                </a>
              </div>
            </div>

            <br className="noviRedIzdvojena" />
            <div className="puska">
              <p className="topponuda">Specijano izdvajamo iz ponude</p>
              <IzdvojenaPuska
                slika={this.state.slika}
                proizvodjac={this.state.proizvodjac}
                model={this.state.model}
                kalibar={this.state.kalibar}
                id={this.state.dataId}
                dostupna={this.state.dostupna}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default Pocetna;
