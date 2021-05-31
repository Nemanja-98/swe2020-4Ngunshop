import React, { Component } from "react";
import fire from "./Konfig";

export class Rezervacije extends Component {
  constructor(props) {
    super(props);

    this.state = {
      listaRezervacija: [],
    };
  }

  obrisiRezervaciju = (ev) => {
    const UidRezervacije = ev.target.parentNode.parentNode.id;

    fire
      .firestore()
      .collection("Rezervacije")
      .doc(UidRezervacije)
      .delete()
      .catch((error) => {
        console.log(error);
      });
  };

  componentDidMount() {
    const sveRezervacije = fire.firestore().collection("Rezervacije");
    sveRezervacije.onSnapshot(() => {
      let lista = [];

      fire
        .firestore()
        .collection("Rezervacije")
        .orderBy("vremeRezervacije")
        .get()
        .then((niz) => {
          niz.docs.forEach((data) => {
            const rezervacija = data.data();
            const dataRezervacije = data;
            fire
              .firestore()
              .collection("Korisnik")
              .doc(rezervacija.idKorisnika)
              .get()
              .then((data) => {
                const korisnik = data.data();

                lista.push(
                  <div
                    id={dataRezervacije.id}
                    key={dataRezervacije.id}
                    className="card container narudzbenicaInstanca"
                  >
                    <div className="infoKoloneNar">Rezervacija:</div>

                    <div className="gornjiDeoRez">
                      
                      <label className="imeRez">{korisnik.ime}</label> &nbsp;
                      <label className="prezimeRez">{korisnik.prezime}</label>
                    </div>

                    <div className="sredinaRez">
                      <div className="sredinaBorder">
                      <label className="proizvRezervcija">
                        {rezervacija.oruzjeProizvodjac}
                      </label>
                      <label className="modelRezervcija">
                        {rezervacija.oruzjeModel}
                      </label>
                      <label className="vremeRezervcija">
                        {rezervacija.vremeRezervacije}
                      </label>
                      </div>
                    </div>

                    <div className="col-6 colKontrolniTasteri">
                      <button
                        onClick={(event) => this.obrisiRezervaciju(event)}
                        id="ZabraniNarudzbenicu"
                        className="btnZabrani"
                      >
                        Obrisi Rezervaciju
                      </button>
                    </div>
                  </div>
                );
                this.setState({
                  listaRezervacija: lista,
                });
              });
          });
        });
    });
  }

  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col-12 naslovNar">Rezervacije</div>
        </div>
        <ul className="listaNar">{this.state.listaRezervacija}</ul>
      </div>
    );
  }
}
export default Rezervacije;