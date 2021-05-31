/* eslint-disable eqeqeq */
import React, { Component } from "react";
import { Link } from "react-router-dom";

import Logic from "../public/logic.png";
import Logic2 from '../public/logic2.png'
import ShoppingCart from "../public/shoppingCart.png";
import fire from "./Konfig";

export class Navigacija extends Component {
  constructor(props) {
    super(props);

    this.state = {
      imeKorisnika: "",
      slikaKorisnika: "",
    };

    this.odjava = this.odjava.bind(this);
  }

  odjava() {
    this.props.logout(false, 0);
    fire.auth().signOut();
    sessionStorage.clear();
    localStorage.clear();
  }

  componentDidMount() {
    setTimeout(() => {
      if (this.props.tipKorisnika == 1) {
        fire
          .firestore()
          .collection("Korisnik")
          .doc(this.props.Korisnik.uid)
          .get()
          .then((data) => {
            let korisnik = data.data();

            this.setState({
              imeKorisnika: korisnik.ime,
              slikaKorisnika: korisnik.profilnaSlika,
            });
          });
      }
    }, 1500);
  }
  componentWillReceiveProps() {
    setTimeout(() => {
      if (this.props.tipKorisnika == 1) {
        fire
          .firestore()
          .collection("Korisnik")
          .doc(this.props.Korisnik.uid)
          .get()
          .then((data) => {
            let korisnik = data.data();

            this.setState({
              imeKorisnika: korisnik.ime,
              slikaKorisnika: korisnik.profilnaSlika,
            });
          });
      }
    }, 1500);
  }

  navSlide = () => {
    const mobileUL = document.querySelector(".mobile-ul");
    const nav = document.querySelector(".navigation");

    nav.classList.toggle("navigation-active");

    mobileUL.classList.toggle("toggle");
  };


  render() {
    return (
      <nav>
        <div className="imegun">
          <Link className="gun" to="/">
            <img
              src= {this.props.darkTheme ? Logic2 : Logic}
              alt="zvanicni logo 4gunshopa"
              className="logoimg"
            ></img>
          </Link>
          <img
            src={this.state.slikaKorisnika}
            alt="slicica za profil"
            className="imgProfilSlika"
            hidden={this.props.tipKorisnika != 1 ? true : false}
          ></img>
          <label
            className="imeuNav"
            hidden={this.props.tipKorisnika != 1 ? true : false}
          >
            {this.state.imeKorisnika}
          </label>
        </div>
        <div className="navigation">
          <ul className="lista">
            <li className="nav-box">
              <Link
                className="active"
                to="/"
                hidden={this.props.tipKorisnika > 1 ? true : false}
              >
                Početna
              </Link>
            </li>
            <li className="nav-box">
              <Link
                className="active"
                to="/narudzbenice"
                hidden={this.props.tipKorisnika < 2 ? true : false}
              >
                Narudzbenice
              </Link>
            </li>
            <li className="nav-box">
              <Link
                className="active"
                to="/rezervacije"
                hidden={this.props.tipKorisnika > 1 ? false : true}
              >
                Rezervacije
              </Link>
            </li>
            <li className="nav-box">
              <Link className="active" to="/prodaja">
                Prodaja
              </Link>
            </li>
            <li className="nav-box">
              <Link className="active" to="/aukcija">
                Aukcija
              </Link>
            </li>
            <li className="nav-box">
              <Link
                className="active"
                to="/profil"
                hidden={this.props.tipKorisnika != 1 ? true : false}
              >
                Profil
              </Link>
            </li>
            <li className="nav-box">
              <Link className="active" to="/kontakt">
                Kontakt
              </Link>
            </li>
            <li>
              <img
                className="imgKorpa"
                hidden={this.props.tipKorisnika == 1 ? false : true}
                src={ShoppingCart}
                onClick={this.props.showCart}
                alt="Korpa"
                height="35px"
                width="35px"
              ></img>
            </li>
            <li className="nav-box" hidden={this.props.loggedIn}>
              {/* eslint-disable-next-line jsx-a11y/anchor-is-valid*/}
              <a className="log-sign" href="/login">
                <span
                  className="fa fa-user"
                  style={{ color: "#7fff00" }}
                ></span>
                Prijava
              </a>
            </li>
            <li className="nav-box" hidden={this.props.loggedIn}>
              {/* eslint-disable-next-line jsx-a11y/anchor-is-valid*/}
              <a className="log-sign" href="/signup">
                <span
                  className="fa fa-sign-in"
                  style={{ color: "#7fff00" }}
                ></span>
                Registracija
              </a>
            </li>

            <li className="nav-box" hidden={!this.props.loggedIn}>
              <a className="log-sign" href="/" onClick={this.odjava}>
                <span
                  className="fa fa-sign-out"
                  style={{ color: "#7fff00" }}
                ></span>
                Odjava
              </a>
            </li>
          </ul>
        </div>
        <div className="mobile-ul" onClick={this.navSlide}>
          <div className="line1"> </div>
          <div className="line2"> </div>
          <div className="line3"> </div>
        </div>
      </nav>
    );
  }
}
export default Navigacija;