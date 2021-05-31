/* eslint-disable eqeqeq */
import React, { Component } from "react";
import "../Login.css";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import fire from "./Konfig";
import Preloader from "../public/preloader.gif";

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      status: false,
      pokaziPass: false,
      show: false,
    };

    this.login = this.login.bind(this);
    this.resetujSifru = this.resetujSifru.bind(this);
  }
  klikPass = () => {
    const { pokaziPass } = this.state;
    this.setState({ pokaziPass: !pokaziPass });
  };

  resetujSifru() {
    const ModelEmail = document.querySelector("#ModelEmailZaResetujSifru")
      .value;
    const resetPasswordGreska = document.querySelector("#ResetPasswordGreska");

    fire
      .auth()
      .sendPasswordResetEmail(ModelEmail)
      .then(() => {
        const pomtekst = document.querySelector(".pomTekst");
        pomtekst.innerHTML = "Poslat vam je link na Email za resetovanje sifre";
        this.showModal();
      })
      .catch((error) => {
        console.log(error);
        const greske = error.code.toString().split("/");
        console.log(greske);

        switch (greske[1]) {
          case "invalid-email":
            resetPasswordGreska.innerHTML = "*Pogresno ste ukucali Email";
            break;

          default:
            //case "user-not-found":
            resetPasswordGreska.innerHTML = "*Email nije registrovan u bazi";
            break;
        }

        resetPasswordGreska.classList.remove("greskaZaboravljenaLozinka");
        void resetPasswordGreska.offsetWidth;
        resetPasswordGreska.classList.add("greskaZaboravljenaLozinka");
      });
  }

  login() {
    const divPreloader = document.querySelector(".divPreloader");
    divPreloader.hidden = false;
    console.log("login from firebase called");
    const email = document.querySelector("#Email").value;
    const sifra = document.querySelector("#Sifra").value;

    fire
      .auth()
      .signInWithEmailAndPassword(email, sifra)
      .then((cred) => {
        this.props.blokiraj();
        fire
          .firestore()
          .collection("Korisnik")
          .doc(cred.user.uid)
          .get()
          .then((data) => {
            let vrednost = data.data().Tip;

            this.props.loggedIn(vrednost, true);

            sessionStorage.setItem("tipprivilegije", vrednost);
            this.setState({ status: true });
          })
          .catch((error) => {
            divPreloader.hidden = true;
          });
      })
      .catch((error2) => {
        console.log(error2.code);

        const greske = error2.code.toString().split("/");
        const greskaZaEmail = document.querySelector("#emailGreskaLogin");
        const greskaZaSifru = document.querySelector("#passwordGreskaLogin");

        switch (greske[1]) {
          case "invalid-email":
            greskaZaEmail.innerHTML = "*Pogresno ste ukucali Email";
            greskaZaSifru.innerHTML = "";

            greskaZaEmail.classList.remove("greskaLogin");
            void greskaZaEmail.offsetWidth;
            greskaZaEmail.classList.add("greskaLogin");

            break;

          case "user-not-found":
            greskaZaEmail.innerHTML = "*Ne postoji ukucani Email u bazi";
            greskaZaSifru.innerHTML = "";

            greskaZaEmail.classList.remove("greskaLogin");
            void greskaZaEmail.offsetWidth;
            greskaZaEmail.classList.add("greskaLogin");

            break;

          case "wrong-password":
            greskaZaSifru.innerHTML = "*Pogresna sifra";
            greskaZaEmail.innerHTML = "";

            greskaZaSifru.classList.remove("greskaLogin");
            void greskaZaSifru.offsetWidth;
            greskaZaSifru.classList.add("greskaLogin");

            break;

          case "too-many-requests":
            greskaZaEmail.innerHTML = "*Previse pokusaja prijavljivanja";
            greskaZaSifru.innerHTML =
              "*Molimo vas pokusajte kasnije ili osvezite stranicu";

            greskaZaEmail.classList.remove("greskaLogin");
            void greskaZaEmail.offsetWidth;
            greskaZaEmail.classList.add("greskaLogin");

            greskaZaSifru.classList.remove("greskaLogin");
            void greskaZaSifru.offsetWidth;
            greskaZaSifru.classList.add("greskaLogin");

            break;

          case "user-disabled":
            greskaZaEmail.innerHTML = "*Korisnik je blokiran";
            greskaZaSifru.innerHTML =
              "*Zbog loseg dosijea ili pokusaja prevare ";

            greskaZaEmail.classList.remove("greskaLogin");
            void greskaZaEmail.offsetWidth;
            greskaZaEmail.classList.add("greskaLogin");

            greskaZaSifru.classList.remove("greskaLogin");
            void greskaZaSifru.offsetWidth;
            greskaZaSifru.classList.add("greskaLogin");

            break;
          default:
        }

        divPreloader.hidden = true;
      });
  }

  componentDidMount() {
    this.props.loggedIn(false, 0);
    fire.auth().signOut();
    sessionStorage.clear();
    localStorage.clear();

    const inputs = document.querySelectorAll(".inputLogin");
    if (inputs == null) return;

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

    const loginpage = document.querySelector(".login-container");

    if (loginpage == null) return;

    loginpage.addEventListener("submit", (e) => {
      e.preventDefault();
      this.login();

      setTimeout(() => {
        if (this.state.status) {
          this.props.tipKorisnika < 2
            ? (window.location.href = "/profil")
            : (window.location.href = "/narudzbenice");
        }
      }, 2500);
    });
  }

  showModal = () => {
    this.setState({ show: !this.state.show });
  };
  render = () => {
    const { pokaziPass } = this.state;
    return (
      <div>
        <div className="containerLogin">
          <div className="imgLogin">
            <div className="textprekoSlike">
              <p className="pWelcome">Dobrodošli Nazad</p>
              <p className="pTextIspod">
                Nadamo se da ce te naci ono sto trazite
                <br />
                Molimo Vas, prijavite se.
              </p>
            </div>
          </div>

          <div className="login-container">
            <form className="formLogin">
              <p className="pomTekst"></p>
              <p className="pPrijavise">Prijava</p>
              <div className="input-div one">
                <div className="divI">
                  <span className="fa fa-user user"></span>
                </div>
                <div>
                  <h5>Email</h5>
                  <input
                    id="Email"
                    className="inputLogin"
                    type="text"
                    required
                  />
                </div>
              </div>

              <div id="emailGreskaLogin" className="greskaLogin"></div>

              <div className="input-div one">
                <div className="divI">
                  <span className="fa fa-lock lock"></span>
                </div>
                <div>
                  <h5>Šifra</h5>
                  <input
                    id="Sifra"
                    className="inputLogin"
                    type={pokaziPass ? "text" : "password"}
                    required
                  />
                  <span
                    className={`fa ${
                      pokaziPass ? "fa-eye" : "fa-eye-slash"
                    }  okoLog`}
                    onClick={this.klikPass}
                  ></span>
                </div>
              </div>

              <div id="passwordGreskaLogin" className="greskaLogin"></div>

              <div className="divForgotPass">
                <a
                  className="forgotPass"
                  href="#modalResetPassword"
                  data-toggle="modal"
                  onClick={this.showModal}
                >
                  Zaboravljena lozinka?
                </a>
              </div>

              <input type="submit" className="btnLogin" value="Prijavi se" />

              <div className="divPreloader" hidden={true}>
                <img src={Preloader} alt="gif" className="imgPreloader"></img>
              </div>

              <p className="nemateText">
                Nemate nalog?{" "}
                <a className="napraviNalog" href="/signup">
                  Registrujte Se
                </a>
              </p>
            </form>
          </div>
        </div>
        <Modal
          show={this.state.show}
          onHide={this.showModal}
          id="modalResetPassword"
          className="modal-ResetPassword"
        >
          <Modal.Header closeButton>
            <Modal.Title className="urediText">Resetuj lozinku</Modal.Title>
          </Modal.Header>
          <Modal.Body className="urediTextBody">
            <div className="container">
              <div className="row">
                <label className="col-2 mailZaboravljena">Email:</label>
                <input
                  id="ModelEmailZaResetujSifru"
                  className="col-8 inputZaboravljena"
                  type="email"
                ></input>
              </div>
              <div
                id="ResetPasswordGreska"
                className="greskaZaboravljenaLozinka"
              />
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              className="btnOtkaziEdit"
              onClick={this.showModal}
            >
              Otkazi
            </Button>
            <Button
              variant="primary"
              className="btnPotvrdiEdit"
              onClick={this.resetujSifru}
            >
              Potvrdi
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  };
}
export default Login;
