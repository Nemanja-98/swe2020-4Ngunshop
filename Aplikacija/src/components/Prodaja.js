/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable eqeqeq */
/* eslint-disa  le eqeqeq */
import React, { Component } from "react";
import Puska from "./Puska.js";

import Pistol from "../public/pistol.png";
import Revolver from "../public/revolver.png";
import Shotgun from "../public/shotgun.png";
import Carabine from "../public/carabine.png";
import SemiAuto from "../public/poluauto.png";
import fire from "./Konfig.js";

export class Prodaja extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listapusaka: [],
      omiljenePuske: [],
      dozvole: [],
    };

    this.filterClick = this.filterClick.bind(this);
    this.updateTextInput = this.updateTextInput.bind(this);
  }

  componentWillUnmount() {
    if (this.props.Korisnik && this.props.TipKorisnika == 1) {
      fire
        .firestore()
        .collection("Korisnik")
        .doc(this.props.Korisnik.uid)
        .update({
          omiljeno: this.state.omiljenePuske,
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }

  componentDidMount() {
    setTimeout(() => {
      const Top = document.querySelector(".btnTop");
      window.addEventListener("scroll", () => {
        if (window.pageYOffset > 800 && Top) Top.style.visibility = "visible";
        else {
          if (Top) Top.style.visibility = "hidden";
        }
      });

      const nizOmiljenih = sessionStorage.getItem("OmiljenePuske");
      if (nizOmiljenih != null) {
        const niz = nizOmiljenih.split(",");
        this.setState({ omiljenePuske: niz });
      } else {
        if (this.props.Korisnik) {
          fire
            .firestore()
            .collection("Korisnik")
            .doc(this.props.Korisnik.uid)
            .get()
            .then((data) => {
              let korisnik = data.data();
              let niz = korisnik.omiljeno;
              this.setState({ omiljenePuske: niz });
              sessionStorage.setItem("OmiljenePuske", niz);
            });
        }
      }

      if (this.props.TipKorisnika == 1) {
        fire
          .firestore()
          .collection("Korisnik")
          .doc(this.props.Korisnik.uid)
          .get()
          .then((data) => {
            let korisnik = data.data();
            let niz = [
              korisnik.dozvola1,
              korisnik.dozvola2,
              korisnik.dozvola3,
              korisnik.dozvola4,
            ];
            niz = this.proveriValidnostDozvola(niz);
            this.setState({ dozvole: niz });
          });
      }
      const svoOruzje = fire.firestore().collection("Oruzje");
      svoOruzje.onSnapshot(() => {
        let lista = [];
        fire
          .firestore()
          .collection("Oruzje")
          .orderBy("proizvodjac")
          .get()
          .then((promena) => {
            promena.docs.forEach((data) => {
              if (data.id !== "Count") {
                let puska = data.data();
                if (puska.BrojNaRaspolaganju > 0) {
                  lista.push(
                    <li key={data.id}>
                      <a id={data.id}>
                        <Puska
                          blokiraj={this.props.blokiraj}
                          listaValidnihDozvola={this.state.dozvole}
                          TipKorisnika={this.props.TipKorisnika}
                          nizOmiljeno={this.updateOmiljeno}
                          niz={this.state.omiljenePuske}
                          dataId={data.id}
                          proizvodjac={puska.proizvodjac}
                          model={puska.model}
                          kalibar={puska.kalibar}
                          cena={puska.cenaRSD}
                          magacin={puska.Magacin}
                          tezina={puska.tezina}
                          datum={puska.DatumProizvodnje.toDate()}
                          opis={puska.opis}
                          tipdozvole={puska.TIPDOZVOLE}
                          tiporuzja={puska.TIPORUZJA}
                          slika={puska.slika1}
                          slika2={puska.slika2}
                          slika3={puska.slika3}
                          kupiKliknuto={this.props.kupiKliknuto}
                        />
                      </a>
                    </li>
                  );
                }
              }
            });
            this.setState({
              listapusaka: lista,
            });
          });
      });
    }, 1500);
  }

  filterClick(event) {
    event.target.className === "filterOn"
      ? (event.target.className = "filterOff")
      : (event.target.className = "filterOn");
    this.filterDisplay();
  }

  updateTextInput(event, num) {
    const prvi = document.querySelector(".leviSlajder");
    const drugi = document.querySelector(".desniSlajder");
    let text;

    if (num === 1) {
      text = document.querySelector(".textMinCena");
      prvi.value = event.target.value;
      drugi.min = event.target.value;
    } else {
      prvi.max = event.target.value;
      text = document.querySelector(".textMaxCena");
      drugi.value = event.target.value;
    }
    text.innerHTML = event.target.value;

    this.filterDisplay();
  }

  filterDisplay = () => {
    let nacinSortiranja;
    let redosledSortiranja;
    const val = document.querySelector(".SortPusaka1").value;
    switch (val) {
      case "1":
        nacinSortiranja = "cenaRSD";
        redosledSortiranja = "asc";
        break;

      case "2":
        nacinSortiranja = "cenaRSD";
        redosledSortiranja = "desc";
        break;
      default:
        nacinSortiranja = "proizvodjac";
        redosledSortiranja = "asc";
    }
    //kontejner svih filtera
    const container = document.querySelector(".containerFilteri");
    //filteri za tip
    const filtersOn = container.querySelectorAll(".filterOn");
    const nizTip = [];
    filtersOn.forEach((el) => {
      nizTip.push(el.alt[0]);
    });

    const divProizvodjac = container.querySelector(".filterProizvodjac");
    const nizProizvodjac = [];
    divProizvodjac.childNodes.forEach((el) => {
      if (el.childNodes[0].checked) nizProizvodjac.push(el.childNodes[1].data);
    });
    console.log(nizProizvodjac);
    const divKalibar = container.querySelector(".filterKalibar");
    const nizKalibar = [];
    divKalibar.childNodes.forEach((el) => {
      if (el.childNodes[0].checked) nizKalibar.push(el.childNodes[1].data);
    });

    let MinCena = container.querySelector(".textMinCena").innerHTML;
    let MaxCena = container.querySelector(".textMaxCena").innerHTML;

    let lista = [];

    fire
      .firestore()
      .collection("Oruzje")
      .orderBy(nacinSortiranja, redosledSortiranja)
      .get()
      .then((promena) => {
        promena.docs.forEach((data) => {
          if (data.id !== "Count") {
            let puska = data.data();
            if (
              puska.cenaRSD >= MinCena &&
              puska.cenaRSD <= MaxCena &&
              puska.BrojNaRaspolaganju > 0
            ) {
              lista.push(
                <li key={data.id}>
                  <Puska
                    listaValidnihDozvola={this.state.dozvole}
                    TipKorisnika={this.props.TipKorisnika}
                    nizOmiljeno={this.updateOmiljeno}
                    niz={this.state.omiljenePuske}
                    dataId={data.id}
                    proizvodjac={puska.proizvodjac}
                    model={puska.model}
                    kalibar={puska.kalibar}
                    cena={puska.cenaRSD}
                    magacin={puska.Magacin}
                    tezina={puska.tezina}
                    datum={puska.DatumProizvodnje.toDate()}
                    opis={puska.opis}
                    tipdozvole={puska.TIPDOZVOLE}
                    tiporuzja={puska.TIPORUZJA}
                    slika={puska.slika1}
                    slika2={puska.slika2}
                    slika3={puska.slika3}
                    kupiKliknuto={this.props.kupiKliknuto}
                  />
                </li>
              );
            }
          }
        });
        if (nizTip.length != 0)
          lista = lista.filter((el) =>
            nizTip.includes(String(el.props.children.props.tiporuzja))
          );
        if (nizProizvodjac.length != 0)
          lista = lista.filter((el) =>
            nizProizvodjac.includes(el.props.children.props.proizvodjac)
          );
        if (nizKalibar.length != 0)
          lista = lista.filter((el) =>
            nizKalibar.includes(el.props.children.props.kalibar)
          );

        this.setState({ listapusaka: lista });
      });
  };

  updateOmiljeno = (niz) => {
    this.setState({ omiljenePuske: niz });
    setTimeout(() => {
      sessionStorage.setItem("OmiljenePuske", this.state.omiljenePuske);
    }, 1500);
  };

  proveriValidnostDozvola = (niz) => {
    let pom = [];
    niz.forEach((el) => {
      el.length == 9 ? pom.push(true) : pom.push(false);
    });
    return pom;
  };
  render() {
    return (
      <div id="top" className="prodavnicaOruzja">
        <h2 className="h2ProdajeSe">Prodaje se:</h2>
        <div className="kontejnerSort">
          <div
            className="badge badge-pill badge-danger dangerProfil"
            hidden={this.props.TipKorisnika == 1 ? false : true}
          >
            *Mozete kupovati samo oruzije za koje imate dozvolu
          </div>
          <div
            className="row divContainerNotLoggedInShop"
            hidden={this.props.TipKorisnika == 1 ? true : false}
          >
            <label className="badge badge-pill badge-danger labelNotLoggedInShop">
              Trenutno ste u rezimu za pregled, ulogujte se da bi omogucili
              interakciju.
            </label>
          </div>

          <h2 className="sortirajText">Sortiraj po: </h2>

          <div className="sortcol1">
            <select onChange={this.filterDisplay} className="SortPusaka1">
              <option value="0">Alfabet</option>
              <option value="1">Cena/Rastuce</option>
              <option value="2">Cena/Opadajuce</option>
            </select>
          </div>
        </div>

        <div className="containerPusaka">
          <div className="containerFilteri">
            <h2 className="FilterNaslovIkonica">
              Filteri <span className="fa fa-filter filterIkonica"></span>
            </h2>
            <h2 className="naslovFilter1">Tip oruzja</h2>
            <div className="container">
              <div className="prviRedTipova">
                <div className="tipFilter">
                  <div className="divHoverTip">
                    <p className="hoverTipPuske">Pistolji</p>
                  </div>
                  <img
                    src={Pistol}
                    alt="0/filter:Pistolj"
                    className="filterOn"
                    onClick={this.filterClick}
                  ></img>
                </div>
                <div className="tipFilter">
                  <div className="divHoverTip">
                    <p className="hoverTipPuske">Revolveri</p>
                  </div>
                  <img
                    src={Revolver}
                    alt="1/filter:Revolver"
                    className="filterOn"
                    onClick={this.filterClick}
                  ></img>
                </div>
              </div>
              <div className="prviRedTipova">
                <div className="tipFilter">
                  <div className="divHoverTip1">
                    <p className="hoverTipPuske">Sacmare</p>
                  </div>
                  <img
                    src={Shotgun}
                    alt="2/filter:Shotgun"
                    className="filterOn"
                    onClick={this.filterClick}
                  ></img>
                </div>
                <div className="tipFilter">
                  <div className="divHoverTip1">
                    <p className="hoverTipPuske">Karabini</p>
                  </div>
                  <img
                    src={Carabine}
                    alt="3/filter:Carabine"
                    className="filterOn"
                    onClick={this.filterClick}
                  ></img>
                </div>
              </div>
              <div className="tipFilter">
                <div className="divHoverTip2">
                  <p className="hoverTipPuske">Poluautomati</p>
                </div>
                <img
                  src={SemiAuto}
                  alt="4/filter:SemiAuto"
                  className="filterOn"
                  onClick={this.filterClick}
                ></img>
              </div>
            </div>
            <h2 className="naslovFilter2">Cena</h2>
            <div className="filterCena">
              <div className="dvaSlajdera">
                <input
                  className="leviSlajder"
                  type="range"
                  min="0"
                  defaultValue="0"
                  max="600000"
                  step="10000"
                  onChange={(event) => this.updateTextInput(event, 1)}
                ></input>
                <input
                  className="desniSlajder"
                  type="range"
                  defaultValue="600000"
                  min="0"
                  max="600000"
                  step="10000"
                  onChange={(event) => this.updateTextInput(event, 2)}
                ></input>
                <br />
                <div className="pokrivacSlajdera"></div>
              </div>
              <label>Od:</label>
              <label className="textMinCena">0 </label>
              <br className="noviRedCena" />
              <label className="doCena">Do:</label>
              {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
              <label className="textMaxCena"> 600000</label>
            </div>
            <h3 className="naslovFilter2">Proizvodjac</h3>
            <div className="filterProizvodjac">
              <label
                className="labelSelektuj"
                onClick={() => this.filterDisplay()}
              >
                <input type="checkbox"></input>Glock
              </label>
              <label className="labelSelektuj" onClick={this.filterDisplay}>
                <input type="checkbox"></input>Baikal IŽ
              </label>
              <label className="labelSelektuj" onClick={this.filterDisplay}>
                <input type="checkbox"></input>Blaser
              </label>
              <label className="labelSelektuj" onClick={this.filterDisplay}>
                <input type="checkbox"></input>Sauer
              </label>
              <label className="labelSelektuj" onClick={this.filterDisplay}>
                <input type="checkbox"></input>Tikka
              </label>
              <label className="labelSelektuj" onClick={this.filterDisplay}>
                <input type="checkbox"></input>Mauser
              </label>
              <label className="labelSelektuj" onClick={this.filterDisplay}>
                <input type="checkbox"></input>
                {"S&W"}
              </label>
              <label className="labelSelektuj" onClick={this.filterDisplay}>
                <input type="checkbox"></input>GSG
              </label>
              <label className="labelSelektuj" onClick={this.filterDisplay}>
                <input type="checkbox"></input>New Frontier Armory
              </label>
              <label className="labelSelektuj" onClick={this.filterDisplay}>
                <input type="checkbox"></input>Češka Zbrojovka
              </label>
              <label className="labelSelektuj" onClick={this.filterDisplay}>
                <input type="checkbox"></input>Beretta
              </label>
              <label className="labelSelektuj" onClick={this.filterDisplay}>
                <input type="checkbox"></input>CZ
              </label>
              <label className="labelSelektuj" onClick={this.filterDisplay}>
                <input type="checkbox"></input>Zastava
              </label>
              <label className="labelSelektuj" onClick={this.filterDisplay}>
                <input type="checkbox"></input>Yildiz
              </label>
            </div>
            <h3 className="naslovFilter2">Kalibar</h3>
            <div className="filterKalibar">
              <label className="labelSelektuj" onClick={this.filterDisplay}>
                <input type="checkbox"></input>9x19mm
              </label>
              <label className="labelSelektuj" onClick={this.filterDisplay}>
                <input type="checkbox"></input>12/76
              </label>
              <label className="labelSelektuj" onClick={this.filterDisplay}>
                <input type="checkbox"></input>.270 win
              </label>
              <label className="labelSelektuj" onClick={this.filterDisplay}>
                <input type="checkbox"></input>.300 win
              </label>
              <label className="labelSelektuj" onClick={this.filterDisplay}>
                <input type="checkbox"></input>5.56mm
              </label>
              <label className="labelSelektuj" onClick={this.filterDisplay}>
                <input type="checkbox"></input>22. LR
              </label>
              <label className="labelSelektuj" onClick={this.filterDisplay}>
                <input type="checkbox"></input>9mm
              </label>
              <label className="labelSelektuj" onClick={this.filterDisplay}>
                <input type="checkbox"></input>7.65mm
              </label>
              <label className="labelSelektuj" onClick={this.filterDisplay}>
                <input type="checkbox"></input>7.62mm
              </label>
              <label className="labelSelektuj" onClick={this.filterDisplay}>
                <input type="checkbox"></input>44 magnum
              </label>
              <label className="labelSelektuj" onClick={this.filterDisplay}>
                <input type="checkbox"></input>357 magnum
              </label>
              <label className="labelSelektuj" onClick={this.filterDisplay}>
                <input type="checkbox"></input>12/89
              </label>
              <label className="labelSelektuj" onClick={this.filterDisplay}>
                <input type="checkbox"></input>20/76
              </label>
            </div>
          </div>
          <div className="listaSvihOruzja">
            <ul className="listaOruzja">{this.state.listapusaka}</ul>

            <button className="btnTop" onClick={() => window.scrollTo(0, 0)}>
              <span className="fa fa-angle-up strelicaTop"></span>
            </button>
          </div>
        </div>
      </div>
    );
  }
}
export default Prodaja;
