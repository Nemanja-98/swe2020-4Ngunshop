/* eslint-disable eqeqeq */
import React, { Component } from "react";
import SlideEffect from "./SlideEffect";
import moment from "moment";
// eslint-disable-next-line no-unused-vars
import { countdown } from "moment-countdown"; //ovo nije unused import ne dirati
import Timer from "easytimer.js";
//import { isEmptyObject } from "jquery";
import fire from "./Konfig";

import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

let meta_licitacija = 0;

export class Licitacija extends Component {
  constructor(props) {
    super(props);

    this.state = {
      vremeZavrsetka: "",
      timer: " ",
      trenutnaCena: this.props.bid,
      trenutniBider: " ",
      showConfirmation: false,
    };
  }

  povecajCenu = (ev) => {
    const cenaJe = ev.target.id;
    let unetaVrednost;
    switch (cenaJe) {
      case "cena+1000":
        unetaVrednost = Number(this.props.bid) + 1000;
        break;

      case "cena+5000":
        unetaVrednost = Number(this.props.bid) + 5000;
        break;

      default:
        //case "cena+10000":
        unetaVrednost = Number(this.props.bid) + 10000;
        break;
    }

    this.setState({ showConfirmation: !this.state.showConfirmation });
    meta_licitacija = unetaVrednost;
  };

  posaljiZahtevBazi = (cifra) => {
    const divBlocker = document.querySelector(".divBlocker");
    divBlocker.children[0].innerHTML = "Uspesno ste bidovali";
    fire
      .firestore()
      .collection("Antikvitet")
      .doc(this.props.id)
      .update({
        TrenutniBid: cifra,
        trenutniBider: fire.auth().currentUser.uid,
      })
      .then(() => {
        this.props.blokiraj();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  potvrdiLicitaciju = (ev) => {
    const GreskapriUnosu = document.querySelector("#GreskaUnos");

    const unetaVrednost =
      ev.target.parentNode.parentNode.children[1].children[1].value;

    if (unetaVrednost < Number(this.props.bid) + 1000) {
      GreskapriUnosu.innerHTML =
        "* Morate uneti veci bid od sledeceg minimalnog bida";

      GreskapriUnosu.classList.remove("greskaZaBid");
      void GreskapriUnosu.offsetWidth;
      GreskapriUnosu.classList.add("greskaZaBid");
      return;
    }
    /////////////////////////////////////////  testirati
    this.setState({ showConfirmation: !this.state.showConfirmation });
    meta_licitacija = unetaVrednost;
  };

  componentWillUnmount() {
    setTimeout(() => {
      if (this.state.timer != " ") {
        this.state.timer.stop();
      }
    }, 200);
  }
  componentDidMount() {
    // live server

    // fire
    //   .messaging()
    //   .requestPermission()
    //   .then(function () {
    //     return fire.messaging().getToken();
    //   })
    //   .then((token) => {
    //     console.log(token);
    //   })
    //   .catch(function (err) {
    //     console.log("Unable to get permission to notify.", err);
    //   });

    if (this.props.trenutniBider !== "") {
      setTimeout(() => {
        if (this.props.trenutniBider !== fire.auth().currentUser.uid) {
          this.setState({ trenutniBider: this.props.trenutniBider });
        } else {
          this.setState({ trenutniBider: "Vas Bid je najveci" });
        }
      }, 1000);
    }

    const mom = moment(this.props.datumZavrsetka).countdown().toString();

    //ako se ponovo otvori istekla aukcija
    const proslost = moment(this.props.datumZavrsetka).fromNow();
    if (String(proslost).includes("ago")) {
      this.setState({
        vremeZavrsetka: "00:00:00",
        timer: " ",
      });
      const div = document.querySelector(".karticaHidden");
      if (div) {
        div.innerHTML = "*OVA AUKCIJA JE ISTEKLA!";
        div.style.color = "#f44000";
        div.style.fontSize = "18px";
      }
      return;
    }

    //ako ima days i da li je vise  1 dan(a)
    if (mom.includes("days")) {
      const dana = Number(mom.split(" ")[0]);
      dana >= 2
        ? this.setState({ vremeZavrsetka: dana + " dana" })
        : this.setState({ vremeZavrsetka: dana + " dan" });
    } else {
      let obj = {};
      let niz = ["hour", "minute", "second"];
      niz.forEach((el, index) => {
        if (mom.includes(el.toString()) || mom.includes(el.toString() + "s")) {
          const noviMom = String(mom.split(" ")).split(",");

          let ind = noviMom.indexOf(el.toString() + "s");
          if (ind == -1) {
            ind = noviMom.indexOf(el.toString());
            // console.log("drugi ind trazim za  " + el.toString());
          }
          // console.log("ind", ind, "splitam noviMoment:", noviMom);
          obj[niz[index] + "s"] = Number(noviMom[ind - 1]);
        }
      });
      // console.log("obj", obj);
      const time = new Timer();
      time.start({ countdown: true, startValues: obj });
      time.addEventListener("secondsUpdated", (e) => {
        // console.log(time.getTimeValues().toString());

        this.setState({
          vremeZavrsetka: time.getTimeValues().toString(),
          timer: time,
        });
        // console.log("proveraaaaaaaa");
        if (this.state.vremeZavrsetka == "00:00:00") {
          const div = document.querySelector(".karticaHidden");
          if (div) {
            div.hidden = true;
            div.innerHTML = "OVA AUKCIJA JE ISTEKLA!";
          }
        }
      });
    }
  }

  render() {
    return (
      <div className="container">
        <div className="row">
          {/* levi kontejner*/}
          <div className="container col-6">
            <div className="row">
              <SlideEffect
                img={[this.props.img[0], this.props.img[1], this.props.img[2]]}
              ></SlideEffect>
            </div>

            <div className="divBiderVreme">
              <div className="row">
                <div className="col-12 ">
                  <label className="preostaloText">Preostalo Vreme:</label>
                  <label className="preostaloVreme">
                    {this.state.vremeZavrsetka}
                  </label>
                </div>
              </div>

              <div className="row redBider">
                <div className="col-12">
                  <label className="preostaloText">Trenutni Bider: </label>
                  <label className="trenutniBider">
                    {this.state.trenutniBider
                      .toString()
                      .substring(0, 18)
                      .split(/[+-]?\d+(?:\.\d+)?/g)}
                  </label>
                </div>
              </div>
            </div>

            <div className="redStanjePuske">
              <div className="row">
                <div className="col-8 ">
                  <h4>Stanje puske: </h4>
                </div>
                <div className="col-12 ">{this.props.status}</div>
              </div>
            </div>
          </div>

          {/* desni kontejner*/}
          <div className="container col-6 card">
            <div className="kartica2">
              {/*ovde je bilo card*/}
              <div className="row">
                <div className="col-6 text-secondary">
                  <h5 className="h5Trenutna">Trenutna Licitacija:</h5>
                </div>
                <div className="col-6 trenutnaLicitacija">
                  {this.props.bid} &nbsp;
                  <label>Din</label>
                </div>
              </div>
            </div>

            <div className="kartica2">
              {/*ovde je bilo card*/}
              <div className="row">
                <div className="col-8 ">
                  <label>Sledeca minimalna Licitacija:</label>
                </div>
                <div className="col-4 seldecaMinimalnaLicitacija">
                  {Number(this.props.bid) + 1000} &nbsp;
                  <label> Din</label>
                </div>

                <div className="col-8">
                  {" "}
                  <label className="lokacijaText">Lokacija prodavaca: </label>
                </div>

                <div className="col-4">
                  <label className="lokacijaLabel"> Nis</label>
                </div>

                <div className="col-12">
                  <span className="fa fa-info-circle ikonicaPDV"></span>
                  <label className="infoPDV">Cena PDV-a nije ukljucena.</label>
                  {/* <span className="badge-pill badge-info">
                    Cena PDV-a nije ukljucena.
                  </span> */}
                </div>

                <div className="col-4">
                  {" "}
                  <label>Cena PDV-a:</label>
                </div>

                <div className="col-8">
                  {" "}
                  <label className="labelCenaPDV">
                    {" "}
                    7% na cenu pobednicke licitacije{" "}
                  </label>
                </div>
              </div>
            </div>

            <div className="kartica2 karticaHidden">
              <div className="row">
                <div className="col-12 ">
                  <h4>Brze Licitacije:</h4>
                </div>
                <div className="col-12 redCenaBida">
                  <button
                    onClick={(event) => this.povecajCenu(event)}
                    id="cena+1000"
                    className="btnPodigniCenu"
                  >
                    cena+1000
                  </button>

                  <button
                    onClick={(event) => this.povecajCenu(event)}
                    id="cena+5000"
                    className="btnPodigniCenu"
                  >
                    cena+5000
                  </button>

                  <button
                    onClick={(event) => this.povecajCenu(event)}
                    id="cena+10000"
                    className="btnPodigniCenu"
                  >
                    cena+10000
                  </button>
                </div>
              </div>

              <div className="row">
                <div className="col-12 ">
                  <h4>Direktna Licitacija:</h4>
                </div>
                <div className="col-6">
                  <label className="labelDin">Din</label>
                  <input
                    className="col-6 inputDirektLicitacija"
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    defaultValue={this.state.trenutnaCena}
                  ></input>
                </div>

                <div className="col-6">
                  <button
                    onClick={(event) => this.potvrdiLicitaciju(event)}
                    className="btnPotvrdaDirekt"
                  >
                    potvrda direkt licitacije
                  </button>
                </div>
              </div>
              <div className="row">
                <div id="GreskaUnos" className="greskaZaBid"></div>
              </div>
              <br />
            </div>
          </div>
        </div>

        <Modal
          show={this.state.showConfirmation}
          onHide={() =>
            this.setState({ showConfirmation: !this.state.showConfirmation })
          }
          className="ModalCalendarShow"
        >
          <Modal.Header closeButton>
            <Modal.Title className="titleCalendar">
              Da li ste sigurni da zelite da ucestvujete na aukciji?
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
              onClick={() => this.posaljiZahtevBazi(meta_licitacija)}
            >
              Potvrdi
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}
export default Licitacija;
