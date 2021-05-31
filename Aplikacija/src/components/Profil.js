/* eslint-disable eqeqeq */
import React, { Component } from "react";

import fire from "./Konfig";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import IzdvojenaPuska from "./IzdvojenaPuska";
//const [show, setShow] = useState(false);//react hooks

export class Profil extends Component {
  constructor(props) {
    super(props);

    this.state = {
      pokaziPass: false,
      pokaziPass1: false,
      pokaziPass2: false,
      korisnik: "",
      show: false,
      profilnaSlika: false,
      promenaLozinke: false,
      omiljenePuske: [],
      Rezervacije: "",
    };
    this.showModalUrediKorisnika = this.showModalUrediKorisnika.bind(this);
    this.promeniKorisnika = this.promeniKorisnika.bind(this);
  }

  componentDidMount() {
    const divBlocker = document.querySelector(".divBlocker");
    divBlocker.children[0].innerHTML = "";
    this.props.blokiraj();
    let niz;
    let nizOmiljenih = [];

    setTimeout(() => {
      fire
        .firestore()
        .collection("Korisnik")
        .doc(this.props.Korisnik.uid)
        .get()
        .then((data) => {
          let korisnik = data.data();

          niz = korisnik.omiljeno;

          fire
            .firestore()
            .collection("Oruzje")
            .get()
            .then((nizPusaka) => {
              nizPusaka.docs.forEach((puskaJedna) => {
                let puska = puskaJedna.data();

                if (niz.includes(puskaJedna.id)) {
                  nizOmiljenih.push(
                    <div className="omiljenaPuska" key={puskaJedna.id}>
                      <IzdvojenaPuska
                        proizvodjac={puska.proizvodjac}
                        model={puska.model}
                        kalibar={puska.kalibar}
                        slika={puska.slika1}
                        dostupna={puska.BrojNaRaspolaganju}
                      />
                    </div>
                  );
                }
              });
              this.setState({ omiljenePuske: nizOmiljenih });
            });

          this.setState({
            korisnik: korisnik,
          });
        });
      const SveRezervacije = fire.firestore().collection("Rezervacije");
      SveRezervacije.onSnapshot(() => {
        fire
          .firestore()
          .collection("Rezervacije")
          .get()
          .then((nizrezervacija) => {
            let rezervacijeNiz = [];

            nizrezervacija.docs.forEach((rezervacija) => {
              let rezervacijaJedna = rezervacija.data();

              let pom = rezervacijaJedna.vremeRezervacije.split(" ");

              let datum = new Date(Date.now());
              let pomniz = datum.toString().split(" ");

              if (
                rezervacijaJedna.idKorisnika === this.props.Korisnik.uid &&
                pomniz[2] <= pom[0]
              ) {
                rezervacijeNiz.push(
                  <div
                    className="RezervacijaJedna"
                    key={rezervacija.id}
                    id={rezervacija.id}
                  >
                    <label className="proizvRezervcija">
                      {rezervacijaJedna.oruzjeProizvodjac}
                    </label>
                    <label className="modelRezervcija">
                      {rezervacijaJedna.oruzjeModel}
                    </label>
                    <label className="vremeRezervcija">
                      {rezervacijaJedna.vremeRezervacije}
                    </label>
                    <br className="noviRedRez"></br>
                    <button
                      onClick={(event) => this.obrisiRezervaciju(event)}
                      className="btnObrisiRez"
                    >
                      Obrisi Rezervaciju
                    </button>
                  </div>
                );
              }
            });
            this.setState({ Rezervacije: rezervacijeNiz });
          });
      });
    }, 2500);
  }

  obrisiRezervaciju = (ev) => {
    const UidRezervacije = ev.target.parentNode.id;

    fire
      .firestore()
      .collection("Rezervacije")
      .doc(UidRezervacije)
      .delete()
      .catch((error) => {
        console.log(error);
      });
  };

  promeniProfilnu = (ev) => {
    if (ev.target.id === "potvrdiProfilnuSliku") {
      if (
        ev.target.parentNode.parentNode.querySelector(".highlightedPicture")
          .src === this.state.korisnik.profilnaSlika
      ) {
        this.showModalProfilnaSlika();
        return;
      }
      this.props.blokiraj();
      fire
        .firestore()
        .collection("Korisnik")
        .doc(this.props.Korisnik.uid)
        .update({
          profilnaSlika: ev.target.parentNode.parentNode.querySelector(
            ".highlightedPicture"
          ).src,
        })
        .catch((error) => {
          console.log(error);
        });

      fire
        .firestore()
        .collection("Korisnik")
        .doc(this.props.Korisnik.uid)
        .get()
        .then((data) => {
          let korisnik = data.data();
          this.setState({
            korisnik: korisnik,
          });
          this.props.updateNavSlika(korisnik.profilnaSlika);
        })
        .catch((error) => {
          console.log(error);
        });

      this.showModalProfilnaSlika();
      return;
    }
    const selected = ev.target.parentNode.querySelector(".highlightedPicture");
    if (selected) selected.classList.remove("highlightedPicture");
    ev.target.className = "highlightedPicture";
  };

  promeniLozinku = () => {
    const staraLozinka = document.querySelector("#staraLozinka");
    const novaLozinka = document.querySelector("#novaLozinka");
    const novaPotvrdjenaLozinka = document.querySelector(
      "#novaPotvrdjenaLozinka"
    );
    const staraSifraGreska = document.querySelector("#staraSifraGreska");
    const novaSifraGreska = document.querySelector("#novaSifraGreska");
    const ponovljenaNovaSifraGreska = document.querySelector(
      "#ponovljenaNovaSifraGreska"
    );

    if (novaLozinka.value !== novaPotvrdjenaLozinka.value) {
      staraSifraGreska.innerHTML = " ";
      novaSifraGreska.innerHTML = " ";
      ponovljenaNovaSifraGreska.innerHTML = "*Ne podudaraju se sifre";

      staraLozinka.style.borderBottom = "1px rgb(66, 66, 66) solid";

      novaLozinka.style.borderBottom = "1px rgb(66, 66, 66) solid";

      novaPotvrdjenaLozinka.style.borderBottom = "1px #ff4000 solid";

      ponovljenaNovaSifraGreska.classList.remove("greska");
      void ponovljenaNovaSifraGreska.offsetWidth;
      ponovljenaNovaSifraGreska.classList.add("greska");

      return;
    }

    fire
      .auth()
      .signInWithEmailAndPassword(
        fire.auth().currentUser.email,
        staraLozinka.value
      )
      .then((korisnik) => {
        fire
          .auth()
          .currentUser.updatePassword(novaLozinka.value)
          .then((potvrda) => {
            const divBlocker = document.querySelector(".divBlocker");
            divBlocker.children[0].innerHTML = "Uspesno ste promenili lozinku";

            this.props.blokiraj();

            this.showModalPromenaLozinke();
          })
          .catch((error2) => {
            console.log(error2);

            const greske = error2.code.toString().split("/");

            if (greske[1] === "weak-password") {
              staraSifraGreska.innerHTML = "";
              novaSifraGreska.innerHTML =
                "*Preslaba Sifra, morate imati minimum 6 karaktera";

              ponovljenaNovaSifraGreska.innerHTML = " ";

              staraLozinka.style.borderBottom = "1px rgb(66, 66, 66) solid";

              novaLozinka.style.borderBottom = "1px #ff4000 solid";

              novaPotvrdjenaLozinka.style.borderBottom =
                "1px rgb(66, 66, 66) solid";

              novaSifraGreska.classList.remove("greska");
              void novaSifraGreska.offsetWidth;
              novaSifraGreska.classList.add("greska");
            }
          });
      })
      .catch((error1) => {
        console.log(error1);
        const greske = error1.code.toString().split("/");

        if (greske[1] === "wrong-password") {
          staraSifraGreska.innerHTML = "*Promasili ste sifru";
          novaSifraGreska.innerHTML = " ";
          ponovljenaNovaSifraGreska.innerHTML = " ";

          staraLozinka.style.borderBottom = "1px #ff4000 solid";

          novaLozinka.style.borderBottom = "1px rgb(66, 66, 66) solid";

          novaPotvrdjenaLozinka.style.borderBottom =
            "1px rgb(66, 66, 66) solid";

          staraSifraGreska.classList.remove("greska");
          void staraSifraGreska.offsetWidth;
          staraSifraGreska.classList.add("greska");
        }
      });
  };

  showModalPromenaLozinke = () => {
    this.setState({ promenaLozinke: !this.state.promenaLozinke });
  };
  showModalProfilnaSlika = () => {
    this.setState({ profilnaSlika: !this.state.profilnaSlika });
  };

  showModalUrediKorisnika() {
    this.setState({ show: !this.state.show });
  }

  proveraSvihGresaka = () => {};

  promeniKorisnika() {
    const ModelIme = document.querySelector("#ModelIme");
    const ModelPrezime = document.querySelector("#ModelPrezime");
    const ModelJmbg = document.querySelector("#ModelJmbg");
    const ModelKontaktTelefon = document.querySelector("#ModelKotnaktTelefon")
      .value;
    const ModelDozvola1 = document.querySelector("#ModelDozvola1");
    const ModelDozvola2 = document.querySelector("#ModelDozvola2");
    const ModelDozvola3 = document.querySelector("#ModelDozvola3");
    const ModelDozvola4 = document.querySelector("#ModelDozvola4");

    const JmbgGreska = document.querySelector("#jmbgGreska");
    const ImeGreska = document.querySelector("#imeGreska");
    const PrezimeGreska = document.querySelector("#prezimeGreska");
    const Dozvola1Greska = document.querySelector("#dozvola1Greska");
    const Dozvola2Greska = document.querySelector("#dozvola2Greska");
    const Dozvola3Greska = document.querySelector("#dozvola3Greska");
    const Dozvola4Greska = document.querySelector("#dozvola4Greska");

    if (ModelJmbg.value.length != 13) {
      JmbgGreska.innerHTML = "*Jmbg mora imati 13 cifara";
      ImeGreska.innerHTML = "";
      PrezimeGreska.innerHTML = "";
      Dozvola2Greska.innerHTML = "";
      Dozvola1Greska.innerHTML = "";
      Dozvola3Greska.innerHTML = "";
      Dozvola4Greska.innerHTML = "";

      ModelJmbg.style.borderBottom = "1px #ff4000 solid";
      ModelIme.style.borderBottom = "1px rgb(66, 66, 66) solid";
      ModelPrezime.style.borderBottom = "1px rgb(66, 66, 66) solid";
      ModelDozvola1.style.borderBottom = "1px rgb(66, 66, 66) solid";
      ModelDozvola2.style.borderBottom = "1px rgb(66, 66, 66) solid";
      ModelDozvola3.style.borderBottom = "1px rgb(66, 66, 66) solid";
      ModelDozvola4.style.borderBottom = "1px rgb(66, 66, 66) solid";

      JmbgGreska.classList.remove("greska");
      void JmbgGreska.offsetWidth;
      JmbgGreska.classList.add("greska");
      return;
    }

    if (ModelIme.value.length < 1) {
      ImeGreska.innerHTML = "*Obavezno polje";
      JmbgGreska.innerHTML = "";
      PrezimeGreska.innerHTML = "";
      Dozvola2Greska.innerHTML = "";
      Dozvola1Greska.innerHTML = "";
      Dozvola3Greska.innerHTML = "";
      Dozvola4Greska.innerHTML = "";

      ModelIme.style.borderBottom = "1px #ff4000 solid";

      ModelJmbg.style.borderBottom = "1px rgb(66, 66, 66) solid";
      ModelPrezime.style.borderBottom = "1px rgb(66, 66, 66) solid";
      ModelDozvola1.style.borderBottom = "1px rgb(66, 66, 66) solid";
      ModelDozvola2.style.borderBottom = "1px rgb(66, 66, 66) solid";
      ModelDozvola3.style.borderBottom = "1px rgb(66, 66, 66) solid";
      ModelDozvola4.style.borderBottom = "1px rgb(66, 66, 66) solid";

      ImeGreska.classList.remove("greska");
      void ImeGreska.offsetWidth;
      ImeGreska.classList.add("greska");
      return;
    }

    if (ModelPrezime.value.length < 1) {
      ImeGreska.innerHTML = "";
      JmbgGreska.innerHTML = "";
      PrezimeGreska.innerHTML = "*Obavezno polje";
      Dozvola2Greska.innerHTML = "";
      Dozvola1Greska.innerHTML = "";
      Dozvola3Greska.innerHTML = "";
      Dozvola4Greska.innerHTML = "";

      ModelDozvola1.style.borderBottom = "1px rgb(66, 66, 66) solid";
      ModelDozvola2.style.borderBottom = "1px rgb(66, 66, 66) solid";
      ModelDozvola3.style.borderBottom = "1px rgb(66, 66, 66) solid";
      ModelDozvola4.style.borderBottom = "1px rgb(66, 66, 66) solid";
      ModelIme.style.borderBottom = "1px rgb(66, 66, 66) solid";
      ModelJmbg.style.borderBottom = "1px rgb(66, 66, 66) solid";
      ModelPrezime.style.borderBottom = "1px #ff4000 solid";

      PrezimeGreska.classList.remove("greska");
      void PrezimeGreska.offsetWidth;
      PrezimeGreska.classList.add("greska");
      return;
    }

    if (
      ModelDozvola1.value.length != 9 &&
      ModelDozvola1.value != "Nemate unetu dozvolu"
    ) {
      ImeGreska.innerHTML = "";
      JmbgGreska.innerHTML = "";
      PrezimeGreska.innerHTML = "";
      Dozvola1Greska.innerHTML = "*Dozvola mora biti duzine 9";
      Dozvola2Greska.innerHTML = "";
      Dozvola3Greska.innerHTML = "";
      Dozvola4Greska.innerHTML = "";

      ModelIme.style.borderBottom = "1px rgb(66, 66, 66) solid";
      ModelJmbg.style.borderBottom = "1px rgb(66, 66, 66) solid";
      ModelPrezime.style.borderBottom = "1px rgb(66, 66, 66) solid";

      ModelDozvola1.style.borderBottom = "1px #ff4000 solid";
      ModelDozvola2.style.borderBottom = "1px rgb(66, 66, 66) solid";
      ModelDozvola3.style.borderBottom = "1px rgb(66, 66, 66) solid";
      ModelDozvola4.style.borderBottom = "1px rgb(66, 66, 66) solid";

      Dozvola1Greska.classList.remove("greska");
      void Dozvola1Greska.offsetWidth;
      Dozvola1Greska.classList.add("greska");
      return;
    }

    if (
      ModelDozvola2.value.length != 9 &&
      ModelDozvola2.value != "Nemate unetu dozvolu"
    ) {
      ImeGreska.innerHTML = "";
      JmbgGreska.innerHTML = "";
      PrezimeGreska.innerHTML = "";
      Dozvola2Greska.innerHTML = "*Dozvola mora biti duzine 9";
      Dozvola1Greska.innerHTML = "";
      Dozvola3Greska.innerHTML = "";
      Dozvola4Greska.innerHTML = "";

      ModelIme.style.borderBottom = "1px rgb(66, 66, 66) solid";
      ModelJmbg.style.borderBottom = "1px rgb(66, 66, 66) solid";
      ModelPrezime.style.borderBottom = "1px rgb(66, 66, 66) solid";

      ModelDozvola2.style.borderBottom = "1px #ff4000 solid";
      ModelDozvola1.style.borderBottom = "1px rgb(66, 66, 66) solid";
      ModelDozvola3.style.borderBottom = "1px rgb(66, 66, 66) solid";
      ModelDozvola4.style.borderBottom = "1px rgb(66, 66, 66) solid";

      Dozvola2Greska.classList.remove("greska");
      void Dozvola2Greska.offsetWidth;
      Dozvola2Greska.classList.add("greska");
      return;
    }

    if (
      ModelDozvola3.value.length != 9 &&
      ModelDozvola3.value != "Nemate unetu dozvolu"
    ) {
      ImeGreska.innerHTML = "";
      JmbgGreska.innerHTML = "";
      PrezimeGreska.innerHTML = "";
      Dozvola3Greska.innerHTML = "*Dozvola mora biti duzine 9";
      Dozvola1Greska.innerHTML = "";
      Dozvola2Greska.innerHTML = "";
      Dozvola4Greska.innerHTML = "";

      ModelIme.style.borderBottom = "1px rgb(66, 66, 66) solid";
      ModelJmbg.style.borderBottom = "1px rgb(66, 66, 66) solid";
      ModelPrezime.style.borderBottom = "1px rgb(66, 66, 66) solid";

      ModelDozvola3.style.borderBottom = "1px #ff4000 solid";
      ModelDozvola1.style.borderBottom = "1px rgb(66, 66, 66) solid";
      ModelDozvola2.style.borderBottom = "1px rgb(66, 66, 66) solid";
      ModelDozvola4.style.borderBottom = "1px rgb(66, 66, 66) solid";

      Dozvola3Greska.classList.remove("greska");
      void Dozvola3Greska.offsetWidth;
      Dozvola3Greska.classList.add("greska");
      return;
    }
    if (
      ModelDozvola4.value.length != 9 &&
      ModelDozvola4.value != "Nemate unetu dozvolu"
    ) {
      ImeGreska.innerHTML = "";
      JmbgGreska.innerHTML = "";
      PrezimeGreska.innerHTML = "";
      Dozvola4Greska.innerHTML = "*Dozvola mora biti duzine 9";
      Dozvola1Greska.innerHTML = "";
      Dozvola3Greska.innerHTML = "";
      Dozvola2Greska.innerHTML = "";

      ModelIme.style.borderBottom = "1px rgb(66, 66, 66) solid";
      ModelJmbg.style.borderBottom = "1px rgb(66, 66, 66) solid";
      ModelPrezime.style.borderBottom = "1px rgb(66, 66, 66) solid";

      ModelDozvola4.style.borderBottom = "1px #ff4000 solid";
      ModelDozvola1.style.borderBottom = "1px rgb(66, 66, 66) solid";
      ModelDozvola3.style.borderBottom = "1px rgb(66, 66, 66) solid";
      ModelDozvola2.style.borderBottom = "1px rgb(66, 66, 66) solid";

      Dozvola4Greska.classList.remove("greska");
      void Dozvola4Greska.offsetWidth;
      Dozvola4Greska.classList.add("greska");
      return;
    }

    this.props.blokiraj();
    fire
      .firestore()
      .collection("Korisnik")
      .doc(this.props.Korisnik.uid)
      .update({
        ime: ModelIme.value,
        prezime: ModelPrezime.value,
        jmbg: ModelJmbg.value,
        kontaktTelefon: ModelKontaktTelefon,
        dozvola1: ModelDozvola1.value,
        dozvola2: ModelDozvola2.value,
        dozvola3: ModelDozvola3.value,
        dozvola4: ModelDozvola4.value,
      })
      .then(() => {})
      .catch((error) => {
        console.log(error);
      });

    fire
      .firestore()
      .collection("Korisnik")
      .doc(this.props.Korisnik.uid)
      .get()
      .then((data) => {
        let korisnik = data.data();
        this.setState({
          korisnik: korisnik,
        });

        this.props.updateNavIme(korisnik.ime);
      })
      .catch((error) => {
        console.log(error);
      });

    this.showModalUrediKorisnika();
  }

  klikPass = () => {
    const { pokaziPass } = this.state;
    this.setState({ pokaziPass: !pokaziPass });
  };
  klikPass2 = () => {
    const { pokaziPass2 } = this.state;
    this.setState({ pokaziPass2: !pokaziPass2 });
  };
  klikPass3 = () => {
    const { pokaziPass3 } = this.state;
    this.setState({ pokaziPass3: !pokaziPass3 });
  };

  render = () => {
    const { pokaziPass } = this.state;
    const { pokaziPass2 } = this.state;
    const { pokaziPass3 } = this.state;
    return (
      <div className="divPoruka">
        <div className="badge badge-pill badge-danger dangerProfil">
          *Mozete kupovati samo oruzije za koje imate dozvolu
        </div>
        <div className="containerProfil">
          <div className="deoProfil">
            <div className="infoProfila">
              <div className="divslikaProfila">
                <div
                  className="overlayChangePic"
                  onClick={this.showModalProfilnaSlika}
                >
                  <div className="textChange">
                    <span className="fa fa-camera kamera "></span>
                    <p className="pPromeniteSliku">Promenite Sliku</p>
                  </div>
                </div>
                <img
                  className="slikaProfila"
                  src={this.state.korisnik.profilnaSlika}
                  alt="profile pic"
                ></img>
              </div>

              <div className="informacijeProfila">
                <label className="labelPodatak">E-mail: </label>
                <label className="labelStatePodatak">
                  {this.props.Korisnik.email}
                </label>
                <br />
                <label className="labelPodatak">Ime: </label>
                <label className="labelStatePodatak">
                  {" "}
                  {this.state.korisnik.ime}
                </label>
                <br />
                <label className="labelPodatak">Prezime: </label>
                <label className="labelStatePodatak">
                  {this.state.korisnik.prezime}
                </label>
                <br />
                <label className="labelPodatak">Jmbg: </label>
                <label className="labelStatePodatak">
                  {" "}
                  {this.state.korisnik.jmbg}
                </label>
                <br />
                <p className="pDozvole">
                  <label className="lDozvolaZa">Dozvola za:</label>
                  <br />
                  <label className="labelPodatak">Pistolj: </label>{" "}
                  <label className="labelStatePodatak">
                    {" "}
                    {this.state.korisnik.dozvola1}
                  </label>
                  <br />
                  <label className="labelPodatak">Revolver: </label>
                  <label className="labelStatePodatak">
                    {this.state.korisnik.dozvola2}
                  </label>
                  <br />
                  <label className="labelPodatak">Sacmaricu: </label>
                  <label className="labelStatePodatak">
                    {this.state.korisnik.dozvola3}
                  </label>
                  <br />
                  <label className="labelPodatak">
                    Karabin i Malokalibarku:{" "}
                  </label>
                  <label className="labelStatePodatak">
                    {this.state.korisnik.dozvola4}{" "}
                  </label>
                  <br />
                </p>
                <button
                  className="btnUrediProfil"
                  onClick={this.showModalUrediKorisnika}
                >
                  Uredi Profil{" "}
                </button>
              </div>
            </div>
          </div>
          <div className="deoPregled">
            <div className="deoIznajljmeno">
              <div className="pIznamljeno">Iznajmljeno</div>
              <div className="listaRezervacija"> {this.state.Rezervacije} </div>
            </div>
            <div className="deoOmiljeno">
              <div className="pomiljenePuske">Omiljeno Oruzje</div>
              <div className="listaOmiljenih"> {this.state.omiljenePuske}</div>
            </div>
          </div>
        </div>

        <Modal
          show={this.state.show}
          onHide={this.showModalUrediKorisnika}
          className="ModalEditProfile"
        >
          <Modal.Header closeButton>
            <Modal.Title className="urediText">Uredi profil</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="kontejnerIzmeni">
              <div className="izmenaPodaci">
                <div className="divPodatak">
                  <label className="lPodatak">Ime: </label>
                  <input
                    id="ModelIme"
                    className="inputIzmena"
                    type="text"
                    defaultValue={this.state.korisnik.ime}
                  ></input>
                </div>
                <div id="imeGreska" className="greska"></div>
                <div className="divPodatak">
                  <label className="lPodatak">Prezime: </label>
                  <input
                    id="ModelPrezime"
                    className="inputIzmena"
                    type="text"
                    defaultValue={this.state.korisnik.prezime}
                  ></input>
                </div>
                <div id="prezimeGreska" className="greska"></div>
                <div className="divPodatak">
                  <label className="lPodatak">JMBG: </label>
                  <input
                    id="ModelJmbg"
                    className="inputIzmena"
                    type="number"
                    defaultValue={this.state.korisnik.jmbg}
                  ></input>
                </div>
                <div id="jmbgGreska" className="greska"></div>
                <div className="divPodatak">
                  <label className="lPodatak">Kontakt Telefon: </label>
                  <input
                    id="ModelKotnaktTelefon"
                    className="inputIzmena"
                    type="text"
                    defaultValue={this.state.korisnik.kontaktTelefon}
                  ></input>
                </div>

                <div className="pdozvolaZa">
                  <label className="lPodatak">Dozvola za:</label>
                </div>
                <div className="divPodatak">
                  <label className="lPodatak">Pistolj: </label>{" "}
                  <input
                    id="ModelDozvola1"
                    className="inputIzmena"
                    type="text"
                    placeholder={this.state.korisnik.dozvola1}
                    defaultValue={this.state.korisnik.dozvola1}
                  ></input>
                </div>
                <div id="dozvola1Greska" className="greska"></div>
                <div className="divPodatak">
                  <label className="lPodatak">Revolver: </label>{" "}
                  <input
                    id="ModelDozvola2"
                    className="inputIzmena"
                    type="text"
                    defaultValue={this.state.korisnik.dozvola2}
                  ></input>
                </div>
                <div id="dozvola2Greska" className="greska"></div>
                <div className="divPodatak">
                  <label className="lPodatak">Sacmaricu: </label>{" "}
                  <input
                    id="ModelDozvola3"
                    className="inputIzmena"
                    type="text"
                    defaultValue={this.state.korisnik.dozvola3}
                  ></input>
                </div>
                <div id="dozvola3Greska" className="greska"></div>
                <div className="divPodatak">
                  <label className="lPodatak">
                    Karabin i <br />
                    Malokalibarku:
                  </label>
                  <input
                    id="ModelDozvola4"
                    className="inputIzmena"
                    type="text"
                    defaultValue={this.state.korisnik.dozvola4}
                  ></input>
                </div>
                <div id="dozvola4Greska" className="greska"></div>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button
              className="PromeniSifru"
              onClick={() => this.showModalPromenaLozinke()}
            >
              Promeni Lozinku
            </Button>
            <Button
              variant="secondary"
              className="btnOtkaziEdit"
              onClick={this.showModalUrediKorisnika}
            >
              Otkazi
            </Button>
            <Button
              variant="primary"
              className="btnPotvrdiEdit"
              onClick={this.promeniKorisnika}
            >
              Potvrdi
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal
          show={this.state.profilnaSlika}
          //show={this.state.showProfilePic}
          onHide={() => this.showModalProfilnaSlika()}
          className="ModalProfilnaSlika"
        >
          <Modal.Header closeButton>
            <Modal.Title className="titleProfilna">
              Promenite profilnu sliku
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="bodyProfilna">
            <img
              src="https://firebasestorage.googleapis.com/v0/b/gunshop-9c4ec.appspot.com/o/ikonice%2Fikonica1.png?alt=media&token=c45a8fd0-71c4-4507-9fe5-6e9d105a5dc7"
              alt="profilna slika0"
              className="highlightedPicture"
              id="profilnaSlika"
              onClick={(event) => this.promeniProfilnu(event)}
            ></img>
            <img
              src="https://firebasestorage.googleapis.com/v0/b/gunshop-9c4ec.appspot.com/o/ikonice%2Fikonica2.png?alt=media&token=0686c08d-42fd-4d0a-bc70-4adae4ca6d97"
              alt="profilna slika1"
              className=""
              id="profilnaSlika"
              onClick={(event) => this.promeniProfilnu(event)}
            ></img>
            <img
              src="https://firebasestorage.googleapis.com/v0/b/gunshop-9c4ec.appspot.com/o/ikonice%2Fikonica3.png?alt=media&token=f48d0420-0281-4fea-b6d3-0f2e8d46d858"
              alt="profilna slika2"
              className=""
              id="profilnaSlika"
              onClick={(event) => this.promeniProfilnu(event)}
            ></img>
            <img
              src="https://firebasestorage.googleapis.com/v0/b/gunshop-9c4ec.appspot.com/o/ikonice%2Fikonica4.png?alt=media&token=aaf909ca-f2a6-4efe-a3ed-675b5b8b2b36"
              alt="profilna slika3"
              className=""
              id="profilnaSlika"
              onClick={(event) => this.promeniProfilnu(event)}
            ></img>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              className="btnOtkaziEdit"
              onClick={this.showModalProfilnaSlika}
            >
              Otkazi
            </Button>
            <Button
              variant="primary"
              className="btnPotvrdiEdit"
              id="potvrdiProfilnuSliku"
              onClick={(event) => this.promeniProfilnu(event)}
            >
              Potvrdi
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal
          show={this.state.promenaLozinke}
          onHide={() => this.showModalPromenaLozinke()}
          className="ModalPromenaLozinke"
        >
          <Modal.Header closeButton>
            <Modal.Title className="titleSifra">Promenite sifru</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="divPodatak">
              <label className="lPodatak">Stara Sifra: </label>
              <input
                id="staraLozinka"
                className="inputIzmena"
                type={pokaziPass ? "text" : "password"}
              ></input>
              <span
                className={`fa ${
                  pokaziPass ? "fa-eye" : "fa-eye-slash"
                }  okoAukc`}
                onClick={this.klikPass}
              ></span>
            </div>

            <div id="staraSifraGreska" className="greska"></div>

            <div className="divPodatak">
              <label className="lPodatak">Nova Sifra: </label>
              <input
                id="novaLozinka"
                className="inputIzmena"
                type={pokaziPass2 ? "text" : "password"}
              ></input>
              <span
                className={`fa ${
                  pokaziPass2 ? "fa-eye" : "fa-eye-slash"
                }  okoAukc2`}
                onClick={this.klikPass2}
              ></span>
            </div>

            <div id="novaSifraGreska" className="greska"></div>

            <div className="divPodatak">
              <label className="lPodatak">Ponovite novu Sifru: </label>
              <input
                id="novaPotvrdjenaLozinka"
                className="inputIzmena"
                type={pokaziPass3 ? "text" : "password"}
              ></input>
              <span
                className={`fa ${
                  pokaziPass3 ? "fa-eye" : "fa-eye-slash"
                }  okoAukc3`}
                onClick={this.klikPass3}
              ></span>
            </div>
            <div id="ponovljenaNovaSifraGreska" className="greska"></div>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              className="btnOtkaziEdit"
              onClick={() => this.showModalPromenaLozinke()}
            >
              Otkazi
            </Button>
            <Button
              variant="primary"
              className="btnPotvrdiEdit"
              onClick={() => this.promeniLozinku()}
            >
              Potvrdi
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  };
}
export default Profil;
