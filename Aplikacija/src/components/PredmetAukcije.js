import React, { Component } from "react";

import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import TehnickeSpec from "./TehnickeSpecifikacije";
import Licitacija from "./Licitacija";
export class PredmetAukcije extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showModal: false,
      showTehnickeSpecifikacije: true,
      proizvodjac: this.props.proizvodjac,
      model: this.props.model,
      kalibar: this.props.kalibar,
      trenutnibid: this.props.trenutnibid,
      magacin: this.props.magacin,
      tezina: this.props.tezina,
      datum: this.props.datum,
      datumZavrsetka: " ",
      opis: this.props.opis,
      stanje: this.props.stanje,
      slika1: this.props.slika1,
      slika2: this.props.slika2,
      slika3: this.props.slika3,
    };
  }

  componentDidMount() {
    const pom = this.props.datumZavrsetka.toString().split(" ");
    let pom2 = "";
    pom2 += pom[1] + " " + pom[2] + " " + pom[3] + " " + pom[4];
    this.setState({ datumZavrsetka: pom2 });
  }

  showModalPredmetAukcije = (event) => {
    if (Number(this.props.tipKorisnika) !== 1) {
      return;
    }
    //poseban slucaj kad je modal aktivan a korisnik klikne bilo gde na stranici (nema potrebe za blokerom)
    if (this.state.showModal) {
      this.setState({ showModal: !this.state.showModal });
      return;
    }

    // eslint-disable-next-line eqeqeq
    if (event && event.target.className == "btnDetaljnijeAukc") return;
    //modal je neaktivan i kliknuto je na card div predmeta
    this.setState({ showModal: !this.state.showModal });
  };
  showTehnickeSpecifikacije = () => {
    this.setState({
      showTehnickeSpecifikacije: !this.state.showTehnickeSpecifikacije,
    });
  };
  render() {
    return (
      <>
        <div
          className="card"
          onClick={(event) => this.showModalPredmetAukcije(event)}
        >
          <img
            className="card-img-top"
            src={this.state.slika1}
            alt="slika aukcijskog predmeta"
          ></img>
          <div className="card-body">
            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
            <a className="card-link" href="#">
              <h2 className="h2imeAukcjskog">
                {this.state.proizvodjac} {this.props.model}
              </h2>
            </a>

            <p className="card-text">
              <label className="labelaOpisAukc">Opis: </label> {this.state.opis}
            </p>

            <div className="container">
              <div className="row">
                <div className="col-12 vremeAukc">
                  <label className="labelaVremeAukc">Aukcija se zatvara:</label>
                  {this.state.datumZavrsetka}
                </div>
              </div>
              <div className="row">
                <div className="col-12 cenaAukc">
                  <label className="labelaCenaAukc">TRENUTNA CENA: </label>{" "}
                  {this.state.trenutnibid}
                </div>
              </div>
            </div>

            <button
              className="btnDetaljnijeAukc"
              onClick={this.showTehnickeSpecifikacije}
            >
              <span className="fa fa-info infoIkonica"></span>
              Detaljnije
            </button>
            <div
              className="hiddenTehSpec"
              hidden={this.state.showTehnickeSpecifikacije}
            >
              <TehnickeSpec
                proizvodjac={this.state.proizvodjac}
                model={this.state.model}
                kalibar={this.state.kalibar}
                cena={this.state.trenutnibid}
                magacin={this.state.magacin}
                tezina={this.state.tezina}
                datum={this.state.datum}
                opis={this.state.opis}
                tiporuzja={this.state.tiporuzja}
              />
            </div>
          </div>
        </div>
        <Modal
          show={this.state.showModal}
          onHide={this.showModalPredmetAukcije}
          className="ModalLicitacija"
          size="xl"
        >
          <Modal.Header closeButton>
            <Modal.Title className="">
              {this.state.proizvodjac + " " + this.state.model}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Licitacija
              blokiraj={this.props.blokiraj}
              trenutniBider={this.props.trenutniBider}
              datumZavrsetka={this.state.datumZavrsetka}
              bid={this.state.trenutnibid}
              id={this.props.id}
              status={this.state.stanje}
              img={[this.state.slika1, this.state.slika2, this.state.slika3]}
            ></Licitacija>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              className="btnOtkaziEdit"
              onClick={this.showModalPredmetAukcije}
            >
              Otkazi
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
}

export default PredmetAukcije;
