import React, { Component } from "react";
import PredmetAukcije from "./PredmetAukcije";
import fire from "./Konfig";

export class Aukcija extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listaAukcijskihPusaka: [],
    };
  }

  componentDidMount() {
    let Top = document.querySelector(".btnTop");
    window.addEventListener("scroll", () => {
      if (window.pageYOffset > 400 && Top) Top.style.visibility = "visible";
      else if (Top) {
        Top.style.visibility = "hidden";
      }
    });

    const sviAntikviteti = fire.firestore().collection("Antikvitet");

    sviAntikviteti.onSnapshot(() => {
      let lista = [];

      this.setState({ listaAukcijskihPusaka: lista });

      fire
        .firestore()
        .collection("Antikvitet")
        .get()
        .then((promena) => {
          promena.docs.forEach((data) => {
            let antikvitet = data.data();

            lista.push(
              <div key={data.id} className="col-6">
                <PredmetAukcije
                  blokiraj={this.props.blokiraj}
                  tipKorisnika={this.props.tipKorisnika}
                  trenutniBider={antikvitet.trenutniBider}
                  id={data.id}
                  proizvodjac={antikvitet.proizvodjac}
                  model={antikvitet.model}
                  kalibar={antikvitet.kalibar}
                  trenutnibid={antikvitet.TrenutniBid}
                  magacin={antikvitet.Magacin}
                  tezina={antikvitet.tezina}
                  datum={antikvitet.DatumProizvodnje.toDate()}
                  datumZavrsetka={antikvitet.DatumZavrsetka.toDate()}
                  opis={antikvitet.opis}
                  stanje={antikvitet.stanje}
                  slika1={antikvitet.slika1}
                  slika2={antikvitet.slika2}
                  slika3={antikvitet.slika3}
                />
              </div>
            );
          });
          this.setState({
            listaAukcijskihPusaka: lista,
          });
        });
    });
  }

  render() {
    return (
      <div className="container col-10">
        <div className="naslovniKontejner">
          <label className="h1NaslovAukc">
            DOBRO DOSLI NA AUKCIJU RETKOG I <br />
            ISTORIJSKOG ORUZJA
          </label>
        </div>
        <div className="ulogujteDivAukc">
          <div
            hidden={this.props.tipKorisnika >= 1 ? true : false}
            className="badge badge-pill badge-danger dangerAukc"
          >
            Trenutno ste u rezimu za pregled. Molimo Vas prijavite se.
          </div>
        </div>

        <div className="row">{this.state.listaAukcijskihPusaka}</div>
        <button className="btnTop" onClick={() => window.scrollTo(0, 0)}>
          <span className="fa fa-angle-up strelicaTop"></span>
        </button>
      </div>
    );
  }
}
export default Aukcija;
