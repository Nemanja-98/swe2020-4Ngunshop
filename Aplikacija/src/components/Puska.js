/* eslint-disable eqeqeq */
/* eslint-disable no-script-url */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from "react";
import Srce_prazno from "../public/srceprazno.png";
import Srce_puno from "../public/srcepuno.png";

import TehnickeSpecifikacije from "./TehnickeSpecifikacije";
import ArrowRight from "../public/angle-right.png";
import ArrowLeft from "../public/angle-left.png";

import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import {
  ScheduleComponent,
  Inject,
  WorkWeek,
  ViewsDirective,
  ViewDirective,
} from "@syncfusion/ej2-react-schedule";

import $ from "jquery";
import "jquery-ui/ui/effect";
import "jquery-ui/ui/effects/effect-shake";
import fire from "./Konfig";

export class Puska extends Component {
  jedanTermin = {
    dataSource: [
      {
        EndTime: new Date(2020, 5, 6, 6, 0),
        StartTime: new Date(2020, 5, 6, 5, 0),
      },
    ],
  };
  constructor(props) {
    super(props);

    this.state = {
      dataId: this.props.dataId,
      slika: this.props.slika,
      slika2: this.props.slika2,
      slika3: this.props.slika3,
      proizvodjac: this.props.proizvodjac,
      model: this.props.model,
      kalibar: this.props.kalibar,
      cena: this.props.cena,
      magacin: this.props.magacin,
      tezina: this.props.tezina,
      datum: this.props.datum,
      opis: this.props.opis,
      tipdozvole: this.props.tipdozvole,
      tiporuzja: this.props.tiporuzja,
      srce: Srce_prazno,
      fav: false,
      showCalendar: false,
      showConfirmation: false,
    };

    this.srceKliknuto = this.srceKliknuto.bind(this);
    this.detaljnijeKliknuto = this.detaljnijeKliknuto.bind(this);
  }

  Rezervisi = (ev) => {
    //div iznad schedulercomponent ev.target.parentNode.parentNode.childNodes[1].childNodes[0]      + .childNodes[0] za scheduler prvi div
    const tableRows =
      ev.target.parentNode.parentNode.childNodes[1].childNodes[0].childNodes[0]
        .childNodes[2].childNodes[0].childNodes[0].childNodes[0].childNodes[1]
        .childNodes[1].childNodes[0].childNodes[0].childNodes[0].childNodes[0]
        .childNodes; //niz td-ova ;

    //.childNodes[2] za tabelucontainer + .childNodes[0] za e-table-wrap e-vertical-view e-work-week-view e-current-panel
    //   + childNodes[0] za e-schedule-table e-outer-table + childNodes[0] za tbody + childNodes[1] za drugi tr (unutrasnji vremena i workweek)
    //  + childNodes[1]  za  td sa samo sati u koji se stavljaju korisnikovi termini
    // + childNodes[0] za div e-content-wrap + childNodes[0] za table + childNodes[0] za thead + childNodes[0] za  TR u koji je e-day-wrapper

    const workWeek_TRs =
      ev.target.parentNode.parentNode.childNodes[1].childNodes[0].childNodes[0]
        .childNodes[2].childNodes[0].childNodes[0].childNodes[0].childNodes[0]
        .childNodes[1].childNodes[0].childNodes[0].childNodes[0].childNodes[2]
        .childNodes[0].childNodes; //niz td-ova

    // drugi red childNodes[1] je td Mon-Fri + childNodes[0] e-date-header-container + childNodes[0] e-date-header-wrap + childNodes[0] je e-schedule-table
    // + childNodes[2] je tbody + childNodes[0] tr element "e-header-row"  *ciji svaki td sadrzi dete div ("e-header-day" koji predstavlja ime dana)*

    // loop kroz tds
    tableRows.forEach((element, el_index) => {
      const e_appointments = element.childNodes[0].childNodes;

      if (e_appointments) {
        e_appointments.forEach((subEl) => {
          //e-appointment-wrapper-0  .  e-appointment . e-appointment-details . e-time ( 0 - e-subject, 1 - e-time, 2 - e-location of appointment)
          const termini = subEl.childNodes;

          if (termini) {
            termini.forEach((slot) => {
              if (slot) {
                //naso slot i za slot se stampa: datum, dan, vreme
                //workWeek_TRs[el_index] je kolona u kojoj se nalazi slot  + childNodes[0] e-header-day div u kome se nalazi informacija o danu koju trazimo;
                //                                                 ili     + childNodes[1] e-header-date e-navigate div u kome se nalazi informacija o datumu koji trazimo.

                const datum = workWeek_TRs[el_index].childNodes[1].innerHTML;
                const dan = workWeek_TRs[el_index].childNodes[0].innerHTML;
                const vreme = slot.childNodes[1].innerHTML; //format "11:00 AM - 11:30 AM"

                this.pozivBazi(datum, dan, vreme);
              }
            });
          } else {
            console.log("termini is null");
          }
        });
      }
    });
  };

  pozivBazi = (datum, dan, vreme) => {
    const danasnjiDatum = new Date(Date.now());
    const nizDanas = danasnjiDatum.toString().split(" ");
    const DanasnjiDan = nizDanas[2];
    const DanasnjiMesec = nizDanas[1];

    let VremeRez = "";

    if (Number(DanasnjiDan) > Number(datum)) {
      const greska = document.querySelector(".greskaRezervisanja");
      greska.innerHTML =
        "*Morate rezervisati u tekucem mesecu i ne u proslosti";
      greska.classList.remove("greskaRezervisanja");
      void greska.offsetWidth;
      greska.classList.add("greskaRezervisanja");

      return;
    }

    VremeRez += datum + " " + DanasnjiMesec + " " + vreme;

    fire
      .firestore()
      .collection("Rezervacije")
      .add({
        idKorisnika: fire.auth().currentUser.uid,
        oruzjeModel: this.state.model,
        oruzjeProizvodjac: this.state.proizvodjac,
        vremeRezervacije: VremeRez,
      })
      .catch((error) => {
        console.log(error.code);
      });

    const divBlocker = document.querySelector(".divBlocker");
    divBlocker.children[0].innerHTML = "Uspesna rezervacija";

    this.props.blokiraj();

    this.setState({ showCalendar: !this.state.showCalendar });
  };

  srceKliknuto(event) {
    if (this.props.TipKorisnika != 1) return;

    this.state.fav
      ? this.setState({
          srce: Srce_prazno,
          fav: !this.state.fav,
        })
      : this.setState({
          srce: Srce_puno,
          fav: !this.state.fav,
        });
    if (!this.state.fav) {
      const niz = this.props.niz;
      niz.push(this.state.dataId);
      this.props.nizOmiljeno(niz);
    } else {
      const niz = this.props.niz;
      niz.splice(niz.indexOf(this.state.dataId), 1);
      this.props.nizOmiljeno(niz);
    }
  }
  detaljnijeKliknuto(event) {
    const divPuske = event.target.parentNode.parentNode;
    const dete = divPuske.querySelector(".hiddenTehSpec");

    dete.hidden ? (dete.hidden = false) : (dete.hidden = true);
  }

  highlightGun = (e, side) => {
    const highlightedGun = e.target.parentNode.querySelector(".highlightedGun");
    highlightedGun.classList.remove("highlightedGun");
    const imgMain = e.target.parentNode.parentNode.querySelector(".imgPuska");
    let num = 0;
    let totalNumOfPictures;
    this.state.slika3 === ""
      ? (totalNumOfPictures = 2)
      : (totalNumOfPictures = 3);
    let next = null;
    if (side === 1) {
      //na desno lista slike
      num =
        (Number(highlightedGun.className.slice(-1)) + side) %
        totalNumOfPictures;
      next = highlightedGun.parentNode.querySelector(".imgPuska" + num);
    } else {
      //na levo lista slike
      Number(highlightedGun.className.slice(-1)) === 0
        ? (num = totalNumOfPictures - 1)
        : (num =
            (Number(highlightedGun.className.slice(-1)) + side) %
            totalNumOfPictures);

      next = highlightedGun.parentNode.querySelector(".imgPuska" + num);
    }
    next.classList.add("highlightedGun");
    imgMain.src = next.src;
  };

  obrisiPusku = () => {
    fire.firestore().collection("Oruzje").doc(this.state.dataId).update({
      BrojNaRaspolaganju: 0,
    });
  };

  proveriValidnostDozvole = () => {
    return !this.props.listaValidnihDozvola[this.state.tipdozvole - 1];
  };

  componentDidMount() {
    if (this.props.niz && this.props.niz.includes(this.state.dataId)) {
      this.setState({
        srce: Srce_puno,
        fav: !this.state.fav,
      });
    }
    $(".kupi").on("click", function () {
      var cart = $(".imgKorpa");
      var imgtodrag = $(this)
        .parent(".divDugmiciPuska")
        .parent(".divImgPuska")
        .find("img")
        .eq(0);

      if (imgtodrag) {
        var imgclone = imgtodrag
          .clone()
          .offset({
            top: imgtodrag.offset().top,
            left: imgtodrag.offset().left,
          })
          .css({
            opacity: "0.8",
            position: "absolute",
            height: "150px",
            width: "150px",
            "z-index": "100000",
          })
          .appendTo($("body"))
          .animate(
            {
              top: cart.offset().top + 10,
              left: cart.offset().left + 10,
              width: 75,
              height: 75,
            },
            1000,
            "easeInOutExpo"
          );

        imgclone.animate(
          {
            width: 0,
            height: 0,
          },
          function () {
            $(this).detach();
          }
        );
      }
    });
  }
  render() {
    return (
      <div className="divPuska">
        <div className="divImgPuska">
          <img
            src={this.state.slika}
            alt="slika puske"
            className="imgPuska"
          ></img>
          <div className="divAditionalPhotos">
            <img
              src={ArrowLeft}
              alt="slika puske"
              className="arrowLeft"
              onClick={(event) => {
                this.highlightGun(event, -1);
              }}
            ></img>
            <img
              src={this.state.slika}
              alt="slika puske"
              className="imgPuska0 highlightedGun"
            ></img>
            <img
              src={this.state.slika2}
              alt="slika puske"
              className="imgPuska1"
            ></img>
            <img src={this.state.slika3} alt="" className="imgPuska2"></img>
            <img
              src={ArrowRight}
              alt="slika puske"
              className="arrowRight"
              onClick={(event) => {
                this.highlightGun(event, 1);
              }}
            ></img>
          </div>
          <div className="divDugmiciPuska">
            <button
              disabled={
                this.props.TipKorisnika == 1
                  ? this.proveriValidnostDozvole()
                  : true
              }
              className="kupi"
              onClick={() => {
                this.props.kupiKliknuto({
                  id: this.state.dataId,
                  proizvodjac: this.state.proizvodjac,
                  model: this.state.model,
                  cena: this.state.cena,
                  kolicina: 1,
                });
              }}
            >
              Dodaj u korpu
              <div
                className="overlay"
                hidden={
                  this.props.TipKorisnika == 1
                    ? this.proveriValidnostDozvole()
                    : true
                }
              >
                <i className="ikonica fa fa-shopping-cart"></i>
              </div>
            </button>
            <button
              className="rezervacija"
              disabled={this.props.TipKorisnika == 1 ? false : true}
              onClick={() =>
                this.setState({ showCalendar: !this.state.showCalendar })
              }
            >
              Rezerviši
              <div
                className="overlay"
                hidden={this.props.TipKorisnika == 1 ? false : true}
              >
                <i className="ikonica fa fa-calendar"></i>
              </div>
            </button>
          </div>
        </div>
        <div className="divLabelePuska">
          <label className="proizvodjac">Proizvođač: </label>
          <label className="param_proizvodjac">{this.state.proizvodjac}</label>
          <br />
          <label className="model">Model: </label>
          <br />
          <label className="param_model">{this.state.model}</label> <br />
          <label className="cena">Cena: </label>
          <label className="param_cena">{this.state.cena}</label>
          <button className="btnDetaljnije" onClick={this.detaljnijeKliknuto}>
            <span className="fa fa-info infoIkonica"></span>
            Detaljnije{" "}
          </button>
        </div>

        <div className="divImgHeart">
          <button
            type="button"
            className="close"
            aria-label="Close"
            hidden={this.props.TipKorisnika == 3 ? false : true}
            onClick={() => {
              this.setState({ showConfirmation: !this.state.showConfirmation });
            }}
          >
            <span aria-hidden="true">&times;</span>
          </button>
          <div hidden={this.props.TipKorisnika == 3 ? true : false}>
            <span className="tooltiptext">Dodaj u omiljeno</span>
            <img
              src={this.state.srce}
              alt="slika za omiljeno"
              className="imgHeart"
              onClick={(event) => this.srceKliknuto(event)}
            ></img>
          </div>
        </div>
        <div className="hiddenTehSpec" hidden={true}>
          <TehnickeSpecifikacije
            proizvodjac={this.state.proizvodjac}
            model={this.state.model}
            kalibar={this.state.kalibar}
            cena={this.state.cena}
            magacin={this.state.magacin}
            tezina={this.state.tezina}
            datum={this.state.datum}
            opis={this.state.opis}
            tiporuzja={this.state.tiporuzja}
          />
        </div>

        <Modal
          show={this.state.showCalendar}
          onHide={() =>
            this.setState({ showCalendar: !this.state.showCalendar })
          }
          className="ModalCalendarShow"
          size="lg"
        >
          <Modal.Header closeButton>
            <Modal.Title className="titleCalendar">
              Izaberite termin za isprobavanje oruzja
              <div className="greskaRezervisanja"></div>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="bodyCalendar">
            <div className="row col-12">
              <ScheduleComponent
                currentView="Day"
                eventSettings={this.jedanTermin}
                startHour="09:00"
                endHour="17:00"
              >
                <ViewsDirective>
                  <ViewDirective option="WorkWeek" workDays={[1, 2, 3, 4, 5]} />
                </ViewsDirective>
                <Inject services={[WorkWeek]} />
              </ScheduleComponent>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              className="btnOtkaziCalendar"
              onClick={() =>
                this.setState({ showCalendar: !this.state.showCalendar })
              }
            >
              Otkazi
            </Button>
            <Button
              variant="primary"
              className="btnPotvrdiCalendar"
              onClick={(ev) => this.Rezervisi(ev)}
            >
              Potvrdi
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal
          show={this.state.showConfirmation}
          onHide={() =>
            this.setState({ showConfirmation: !this.state.showConfirmation })
          }
          className="ModalCalendarShow"
        >
          <Modal.Header closeButton>
            <Modal.Title className="titleCalendar">
              Da li ste sigurni da zelite da obrisete{" "}
              {this.state.proizvodjac + " " + this.state.model}?
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="bodyCalendar"></Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              className="btnOtkaziCalendar"
              onClick={() =>
                this.setState({
                  showConfirmation: !this.state.showConfirmation,
                })
              }
            >
              Otkazi
            </Button>
            <Button
              variant="primary"
              className="btnPotvrdiCalendar"
              onClick={() => this.obrisiPusku()}
            >
              Potvrdi
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}
export default Puska;
