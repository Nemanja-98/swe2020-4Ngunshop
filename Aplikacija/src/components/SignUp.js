/* eslint-disable eqeqeq */
import React, { Component } from "react";
import slika2 from "../public/ikonica1.png";
import "../SignUp.css";
import fire from "./Konfig";

export class SignUp extends Component {
  constructor(props) {
    super(props);

    this.state = {
      pokaziPass: false,
      pokaziPass2: false,
      uspesanreg: 0,
    };
    this.registrovanje = this.registrovanje.bind(this);
  }
  klikPass = () => {
    const { pokaziPass } = this.state;
    this.setState({ pokaziPass: !pokaziPass });
  };
  klikPass2 = () => {
    const { pokaziPass2 } = this.state;
    this.setState({ pokaziPass2: !pokaziPass2 });
  };

  registrovanje() {
    const email = document.querySelector("#Email").value;
    const sifra = document.querySelector("#Sifra").value;
    const proverasifre = document.querySelector("#ProveraSifre").value;
    const Ime = document.querySelector("#Ime").value;
    const Prezime = document.querySelector("#Prezime").value;
    const Jmbg = document.querySelector("#Jmbg").value;

    const greskaProvereZaSifru = document.querySelector(
      "#passwordProveraGreskaSignUp"
    );
    const greskaZaSifru = document.querySelector("#passwordGreskaSignUp");
    const greskaZaEmail = document.querySelector("#emailGreskaSignUp");
    const greskaZaJmbg = document.querySelector("#jmbgGreskaSignUp");

    if (Jmbg.length != 13) {
      greskaZaJmbg.innerHTML = "*Jmbg mora imati 13 cifara";
      greskaZaEmail.innerHTML = "";
      greskaZaSifru.innerHTML = "";
      greskaProvereZaSifru.innerHTML = "";

      greskaZaJmbg.classList.remove("greskaSignUp");
      void greskaZaJmbg.offsetWidth;
      greskaZaJmbg.classList.add("greskaSignUp");

      return;
    }

    if (sifra != proverasifre) {
      greskaZaEmail.innerHTML = "";
      greskaZaSifru.innerHTML = "";
      greskaZaJmbg.innerHTML = "";
      greskaProvereZaSifru.innerHTML = "*Ne podudaraju se sifre";

      greskaProvereZaSifru.classList.remove("greskaSignUp");
      void greskaProvereZaSifru.offsetWidth;
      greskaProvereZaSifru.classList.add("greskaSignUp");

      return;
    }

    fire
      .auth()
      .createUserWithEmailAndPassword(email, sifra)
      .then((cred) => {
        const divBlocker = document.querySelector(".divBlocker");
        divBlocker.children[0].innerHTML = "Uspesna Registracija";
        this.props.blokiraj();

        fire
          .firestore()
          .collection("Korisnik")
          .doc(cred.user.uid)
          .set({
            ime: Ime,
            prezime: Prezime,
            Tip: 1,
            jmbg: Jmbg,
            profilnaSlika:
              "https://firebasestorage.googleapis.com/v0/b/gunshop-9c4ec.appspot.com/o/ikonice%2Fikonica2.png?alt=media&token=0686c08d-42fd-4d0a-bc70-4adae4ca6d97",
            omiljeno: [],
            dozvola1: "Nemate unetu dozvolu",
            dozvola2: "Nemate unetu dozvolu",
            dozvola3: "Nemate unetu dozvolu",
            dozvola4: "Nemate unetu dozvolu",
            email: cred.user.email,
            kontaktTelefon: "",
          })
          .then((korisnik) => {
            this.setState({ uspesanreg: 1 });
          })
          .catch((error) => {
            console.log(error.code);
          });
      })
      .catch((error1) => {
        console.log(error1.code);

        let greske = error1.code.toString().split("/");
        greskaZaJmbg.innerHTML = "";
        greskaProvereZaSifru.innerHTML = "";

        switch (greske[1]) {
          case "invalid-email":
            greskaZaEmail.innerHTML = "*Nevalidan email";
            greskaZaSifru.innerHTML = "";

            greskaZaEmail.classList.remove("greskaSignUp");
            void greskaZaEmail.offsetWidth;
            greskaZaEmail.classList.add("greskaSignUp");

            break;

          case "email-already-in-use":
            greskaZaEmail.innerHTML = "*Ovaj Email je registrovan";
            greskaZaSifru.innerHTML = "";

            greskaZaEmail.classList.remove("greskaSignUp");
            void greskaZaEmail.offsetWidth;
            greskaZaEmail.classList.add("greskaSignUp");
            break;

          case "weak-password":
            greskaZaSifru.innerHTML =
              "*Preslaba Sifra, morate imati minimum 6 karaktera";
            greskaZaEmail.innerHTML = "";

            greskaZaSifru.classList.remove("greskaSignUp");
            void greskaZaSifru.offsetWidth;
            greskaZaSifru.classList.add("greskaSignUp");
            break;

          case "too-many-requests":
            greskaZaEmail.innerHTML = "";
            greskaZaJmbg.innerHTML = "";
            greskaZaEmail.innerHTML = "*Previse pokusaja prijavljivanja";
            greskaZaSifru.innerHTML =
              "Molimo vas pokusajte kasnije ili osvezite stranicu";

            greskaZaSifru.classList.remove("greskaSignUp");
            void greskaZaSifru.offsetWidth;
            greskaZaSifru.classList.add("greskaSignUp");

            greskaZaEmail.classList.remove("greskaSignUp");
            void greskaZaEmail.offsetWidth;
            greskaZaEmail.classList.add("greskaSignUp");
            break;
          default:
        }
      });
  }

  componentDidMount() {
    const inputs = document.querySelectorAll(".inputSignUp");

    function focusFunc() {
      let parent = this.parentNode.parentNode;
      parent.classList.add("focus");
    }

    function blurFunc() {
      let parent = this.parentNode.parentNode;
      if (this.value == "") {
        parent.classList.remove("focus");
      }
    }

    inputs.forEach((input) => {
      input.addEventListener("focus", focusFunc);
      input.addEventListener("blur", blurFunc);
    });

    const register = document.querySelector(".unosPodataka");
    register.addEventListener("submit", (e) => {
      e.preventDefault();

      this.registrovanje();

      setTimeout(() => {
        if (this.state.uspesanreg === 1) window.location.href = "/login";
      }, 2000);
    });
  }
  render = () => {
    const { pokaziPass } = this.state;
    const { pokaziPass2 } = this.state;
    return (
      <div className="containerSignUp">
        <div className="manjiContainerSignUp">
          <div className="leviDiv">
            <h1 className="h1Reg">Registrujte se!</h1>
          </div>
          <div className="desniDiv">
            <form className="unosPodataka">
              <div>
                <img className="avatar" src={slika2} alt="slika profila" />
              </div>
              <div className="input-div1 one">
                <div>
                  <h5>Ime</h5>
                  <input
                    id="Ime"
                    className="inputSignUp"
                    type="text"
                    required
                  />
                </div>
              </div>
              <div className="input-div1 one">
                <div>
                  <h5>Prezime</h5>
                  <input
                    id="Prezime"
                    className="inputSignUp"
                    type="text"
                    required
                  />
                </div>
              </div>
              <div className="input-div1 one">
                <div>
                  <h5>Jmbg</h5>
                  <input
                    id="Jmbg"
                    className="inputSignUp"
                    type="number"
                    required
                  />
                </div>
              </div>
              <div id="jmbgGreskaSignUp" className="greskaSignUp"></div>
              <div className="input-div1 one">
                <div>
                  <h5>Email</h5>
                  <input
                    id="Email"
                    className="inputSignUp"
                    type="text"
                    required
                  />
                </div>
              </div>
              <div id="emailGreskaSignUp" className="greskaSignUp"></div>
              <div className="input-div1 one">
                <div>
                  <h5>Sifra</h5>
                  <input
                    id="Sifra"
                    className="inputSignUp"
                    type={pokaziPass ? "text" : "password"}
                    required
                  />
                  <span
                    className={`fa ${
                      pokaziPass ? "fa-eye" : "fa-eye-slash"
                    }  oko`}
                    onClick={this.klikPass}
                  ></span>
                </div>
              </div>
              <div id="passwordGreskaSignUp" className="greskaSignUp"></div>
              <div className="input-div1 one">
                <div>
                  <h5 className="h5Ponovite">Ponovite Sifru</h5>
                  <input
                    id="ProveraSifre"
                    className="inputSignUp"
                    type={pokaziPass2 ? "text" : "password"}
                    required
                  />
                  <span
                    className={`fa ${
                      pokaziPass2 ? "fa-eye" : "fa-eye-slash"
                    }  oko2`}
                    onClick={this.klikPass2}
                  ></span>
                </div>
              </div>
              <div
                id="passwordProveraGreskaSignUp"
                className="greskaSignUp"
              ></div>

              <div>
                <input
                  type="submit"
                  className="btnSign"
                  value="Registrujte se"
                />
              </div>
              <div>
                <p className="pImateNalog">
                  Imate nalog?{" "}
                  <a className="linkPrijaviSe" href="/login">
                    Prijavite se
                  </a>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  };
}
export default SignUp;