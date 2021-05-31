/* eslint-disable array-callback-return */
/* eslint-disable no-useless-concat */
import React, { Component } from "react";
import fire from "./Konfig";
import * as emailjs from "emailjs-com";

export class Narudzbenice extends Component {
  constructor(props) {
    super(props);

    this.state = {
      listanarudzbenica: [],
    };
  }

  obrisiPusku = (ev) => {
    const UidNarudzbenice =
      ev.target.parentNode.parentNode.parentNode.parentNode.id;
    const puskaZaBrisanje = ev.target.parentNode.parentNode.id;

    fire
      .firestore()
      .collection("Narudzbenica")
      .doc(UidNarudzbenice)
      .get()
      .then((data) => {
        const narudzbenica = data.data();
        let pomLista = [];

        narudzbenica.proizvod.map((val) => {
          if (val.model !== puskaZaBrisanje) pomLista.push(val);
        });

        fire
          .firestore()
          .collection("Narudzbenica")
          .doc(UidNarudzbenice)
          .update({
            proizvod: pomLista,
          })
          .catch((error) => {
            console.log(error);
          });
      });
  };

  Odobri_Zabrani_Kupovinu = (ev) => {
    const UidNarudzbenice = ev.target.parentNode.parentNode.parentNode.id;
    const kliknutoDugme = ev.target.id;
    const ukupnoZaduzenje =
      ev.target.parentNode.parentNode.children[0].children[0].innerHTML;

    fire
      .firestore()
      .collection("Narudzbenica")
      .doc(UidNarudzbenice)
      .get()
      .then((data) => {
        const narudzbenica = data.data();
        let statusnarudzbenice;

        kliknutoDugme === "OdobriNarudzbenicu"
          ? (statusnarudzbenice = "Odobrena")
          : (statusnarudzbenice = "Odbijena");

        fire
          .firestore()
          .collection("IstorijaNarudzbenica")
          .add({
            korisnik: narudzbenica.korisnik,
            proizvod: narudzbenica.proizvod,
            status: statusnarudzbenice,
            tipnarudzbine: narudzbenica.tipnarudzbine,
          })
          .then(() => {
            fire
              .firestore()
              .collection("Korisnik")
              .doc(narudzbenica.korisnik)
              .get()
              .then((data) => {
                let korisnik = data.data().email;

                let Isporuka = "";
                narudzbenica.tipnarudzbine === "Doci ce porucilac po narudzbinu"
                  ? (Isporuka =
                      "Mozete doci svakog radnog dana od 09:00h do 17:00h.")
                  : (Isporuka =
                      "Narudzbenica ce vam stici u roku od najmanje nedelju dana.");

                if (kliknutoDugme === "OdobriNarudzbenicu") {
                  let dataPoruke = "";
                  narudzbenica.proizvod.map((el) => {
                    dataPoruke +=
                      el.kolicina +
                      "x " +
                      el.proizvodjac +
                      "   " +
                      el.model +
                      " " +
                      "\n";
                  });

                  let template = {
                    data: dataPoruke,
                    email: korisnik,
                    isporuka: Isporuka,
                    zaduzenje: ukupnoZaduzenje,
                  };

                  emailjs
                    .send(
                      "gmail",
                      "odobravanje",
                      template,
                      "user_D1dcW3jQETHoGslQI4UTg"
                    )
                    .then(() => {
                      console.log("POSLATO");
                    });
                } else {
                  let template = {
                    email: korisnik,
                  };

                  emailjs
                    .send(
                      "gmail",
                      "odbijanje",
                      template,
                      "user_D1dcW3jQETHoGslQI4UTg"
                    )
                    .then(() => {
                      console.log("POSLATO");
                    });
                }

                fire
                  .firestore()
                  .collection("Narudzbenica")
                  .doc(UidNarudzbenice)
                  .delete();
              });
          });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  componentDidMount() {
    const narudzbeniceSve = fire.firestore().collection("Narudzbenica");
    narudzbeniceSve.onSnapshot(() => {
      let lista = [];

      fire
        .firestore()
        .collection("Narudzbenica")
        .orderBy("vremenarudzbine")
        .get()
        .then((niz) => {
          niz.docs.forEach((data) => {
            const narudzbenica = data.data();
            const dataNarudzbenice = data;
            fire
              .firestore()
              .collection("Korisnik")
              .doc(narudzbenica.korisnik)
              .get()
              .then((data) => {
                const korisnik = data.data();
                let ukupnozaduzenje = 0;

                lista.push(
                  <div
                    id={dataNarudzbenice.id}
                    key={dataNarudzbenice.id}
                    className="card container narudzbenicaInstanca"
                  >
                    <div className="infoKoloneNar">Narucilac:</div>
                    <div className="gornjiDeoNar">
                      <div className="row">
                        <div className="col-6">
                          <label>Ime narucioca: </label>
                          <label className="highlightText">
                            {korisnik.ime}
                          </label>
                          <br />
                          <label>Prezime narucioca: </label>
                          <label className="highlightText">
                            {korisnik.prezime}
                          </label>
                          <br />
                          <label>Jmbg narucioca:</label>
                          <label className="highlightText">
                            {korisnik.jmbg}
                          </label>
                          <br />
                        </div>
                        <div className="col-6">
                          <label>Dozvola za Pistolj:</label>
                          <label className="highlightText">
                            {" "}
                            {korisnik.dozvola1}
                          </label>{" "}
                          <br />
                          <label>Dozvola za Revolver: </label>{" "}
                          <label className="highlightText">
                            {korisnik.dozvola2}
                          </label>
                          <br />
                          <label>Dozvola za Sacmaricu: </label>
                          <label className="highlightText">
                            {korisnik.dozvola3}
                          </label>
                          <br />
                          <label>Dozvola za Karabin: </label>{" "}
                          <label className="highlightText">
                            {korisnik.dozvola4}
                          </label>
                        </div>
                      </div>
                      <label className="detaljiNar">
                        Detalji Narudzbenice:
                      </label>{" "}
                      <br />
                      <label color="green">Status Narudzbenice: </label>{" "}
                      <label className="highlightText">
                        {narudzbenica.status}
                      </label>
                      <br />
                      <label className="highlightText">
                        {narudzbenica.tipnarudzbine}
                      </label>{" "}
                      <br />
                    </div>
                    <div className="infoKoloneNar">Naruceno Oruzje:</div>
                    <div className="sredinaNar">
                      {narudzbenica.proizvod.map((el, index) => {
                        ukupnozaduzenje += el.kolicina * el.cena;
                        return (
                          <div
                            className="row narudzbenicaInstance"
                            key={el.model}
                            id={el.model}
                          >
                            <div className=" col-12 colPuska">
                              <span
                                onClick={(event) => this.obrisiPusku(event)}
                                className="fa fa-close OtkaziNar"
                              ></span>
                              <label id="NarProizvodjac">
                                {el.proizvodjac}{" "}
                              </label>
                              <br />
                              <label id="NarModel">{el.model}</label>
                              <br />
                              <label>Po komadu: {el.cena}</label>
                              <br />
                              <label>Komada: {el.kolicina}</label> <br />
                              <label className="labelZaJednu">
                                Ukupno: &nbsp;
                                <label className="labelUkupnoZaJednu">
                                  {el.kolicina * el.cena} din
                                </label>
                              </label>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="donjiDeoNar">
                      <label className="labelaUkupno">
                        Ukupno zaduzenje je: &nbsp;
                        <label className="labelUkupnoBaza">
                          {ukupnozaduzenje} din
                        </label>
                      </label>
                      <div className="col-12 colKontrolniTasteri">
                        <button
                          id="OdobriNarudzbenicu"
                          className="btnOdobri"
                          onClick={(event) =>
                            this.Odobri_Zabrani_Kupovinu(event)
                          }
                        >
                          Odobri Kupovinu
                        </button>
                        <button
                          id="ZabraniNarudzbenicu"
                          className="btnZabrani"
                          onClick={(event) =>
                            this.Odobri_Zabrani_Kupovinu(event)
                          }
                        >
                          Zabrani Kupovinu
                        </button>
                      </div>
                    </div>
                  </div>
                );
                this.setState({
                  listanarudzbenica: lista,
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
          <div className="col-12 naslovNar">NARUDZBENICE</div>
        </div>
        <ul className="listaNar">{this.state.listanarudzbenica}</ul>
      </div>
    );
  }
}
export default Narudzbenice;
