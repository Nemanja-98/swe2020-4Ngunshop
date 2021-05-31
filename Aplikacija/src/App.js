/* eslint-disable eqeqeq */
import React, { Component } from "react";
import "./App.css";
import Navigacija from "./components/Navigacija";
import Pocetna from "./components/Pocetna";
import Kontakt from "./components/Kontakt.js";
import Prodaja from "./components/Prodaja.js";
import Aukcija from "./components/Aukcija.js";
import Profil from "./components/Profil.js";
import Footer from "./components/Footer.js";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Korpa from "./components/Korpa";
import Login from "./components/Login";
import SignUp from "./components/SignUp.js";
import fire from "./components/Konfig";
import Narudzbenice from "./components/Narudzbenice";
import Rezervacije from "./components/Rezervacije";
import Preloader from "./public/preloader.gif";
import PreloaderDark from './public/preloaderDark.gif';
import Darkmode from "darkmode-js";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      shoppingCart: [],
      hiddenCart: true,
      loggedIn: false,
      userPrivilage: 0, //1 - kupac   // 2 - radnik //  3 - administrator  // 0 - logged out
      user: "",
      profilnaSlika: "",
      korisnikIme: "",
      darkTheme: false,
      darkWidget: new Darkmode({
        bottom: "130px", // default: '32px'
        right: "40px", // default: '32px'
        left: "unset", // default: 'unset'
        time: "0.5s", // default: '0.3s'
        mixColor: "#dcdcdc", // default: '#fff'
        backgroundColor: "#ffffff", // default: '#fff'
        buttonColorDark: "#fffc", // default: '#100f2c'
        buttonColorLight: "#fff", // default: '#fff'
        saveInCookies: false, // default: true,
        label: "🌓", // default: ''
        autoMatchOsTheme: false, // default: true
        zindex: 99999999999,
      }),
    };

  }
  blokiraj = () => {
    const divBlocker = document.querySelector(".divBlocker");
    console.log("blokiram", divBlocker);
    divBlocker.hidden = false;
    setTimeout(() => {
      console.log("odblokiram", divBlocker);
      divBlocker.hidden = true;
    }, 2500);
  };
  checkLogin = (privilege, logIn) => {
    this.setState({ loggedIn: logIn, userPrivilage: privilege });
  };

  showCart = () => {
    this.setState({ hiddenCart: !this.state.hiddenCart });
  };

  kupiKliknuto = (params) => {
    let niz = this.state.shoppingCart;
    let ind = -1;
    let naso = false;
    let index_el = -1;
    niz.forEach((el) => {
      ind++;
      if (el.id == params.id) {
        naso = true;
        index_el = ind;
      }
    });

    if (naso === true) niz[index_el].kolicina += 1;
    else {
      niz.push(params);
    }
    this.setState({ shoppingCart: niz });
    setTimeout(() => {
      this.saveLocalStorage();
    }, 1500);
  };

  saveLocalStorage = () => {
    const pom = [];
    this.state.shoppingCart.forEach((el) => {
      pom.push({
        id: el.id,
        cena: el.cena,
        kolicina: el.kolicina,
        model: el.model,
        proizvodjac: el.proizvodjac,
      });
    });
    localStorage.setItem("ShoppingCart", JSON.stringify(pom));
  };
  // themeToggle = (e) => {
  //   // this.setState({ dark: !this.state.dark });
  //   // console.log(
  //   //   "toggling theme 33",
  //   //   this.state.darkWidget,
  //   //   "dark state",
  //   //   this.state.dark,
  //   //   "state ov button",
  //   //   e.target.checked
  //   // );
  //   // localStorage.setItem("darkThemeSliderOn", e.target.checked);
  //   // // if (!this.state.darkWidget) {
  //   // //   this.setState({
  //   // //     darkWidget: new Darkmode({
  //   // //       bottom: "64px", // default: '32px'
  //   // //       right: "40px", // default: '32px'
  //   // //       left: "unset", // default: 'unset'
  //   // //       time: "0.5s", // default: '0.3s'
  //   // //       mixColor: "#dcdcdc", // default: '#fff'
  //   // //       backgroundColor: "#ffffff", // default: '#fff'
  //   // //       buttonColorDark: "#fffc", // default: '#100f2c'
  //   // //       buttonColorLight: "#fff", // default: '#fff'
  //   // //       saveInCookies: true, // default: true,
  //   // //       label: "🌓", // default: ''
  //   // //       autoMatchOsTheme: true, // default: true
  //   // //     }),
  //   // //   });
  //   // // }
  //   // setTimeout(() => {
  //   //   if (this.state.darkWidget) {
  //   //     this.state.darkWidget.showWidget();
  //   //     //this.state.darkWidget.toggle();
  //   //     const stateRepresentationObject = {
  //   //       widget: this.state.darkWidget,
  //   //       //toggled:this.state.darkWidget.isActivated(),
  //   //     };
  //   //     console.log("setting storage to", stateRepresentationObject);
  //   //     localStorage.setItem("DarkThemeWidgetState", stateRepresentationObject);
  //   //   }
  //   // }, 1500);
  // };
  componentWillUnmount(){
  
  }
  componentDidMount() {
    //Kada se pokrene live server isprobati

    // if ("serviceWorker" in navigator) {
    //   navigator.serviceWorker
    //     .register("./firebase-messaging-sw.js")
    //     .then(function (registration) {
    //       console.log("Registration successful, scope is:", registration.scope);
    //     })
    //     .catch(function (err) {
    //       console.log("Service worker registration failed, error:", err);
    //     });
    // }
    setTimeout(() => {
      if (this.state.userPrivilage == 1) {
        this.state.darkWidget.showWidget();
      
        // document.addEventListener('click', (event)=> {
        //   console.log("clicking", event.target)
        // })
        const btnDarkTheme = document.querySelector(".darkmode-toggle");
        console.log(btnDarkTheme);
        btnDarkTheme.addEventListener('click', ()=>{
          this.setState({darkTheme: ! this.state.darkTheme});
        })
      }
    }, 2500);


    if (sessionStorage.getItem("tipprivilegije") === null) {
      console.log("Nije ulogovan");
    } else {
      this.checkLogin(sessionStorage.getItem("tipprivilegije"), true);

      fire.auth().onAuthStateChanged((korisnik) => {
        this.setState({ user: korisnik });
      });
    }
    const pom = localStorage.getItem("ShoppingCart");
    if (pom == null) {
      console.log("nema prethodno sacuvanog sadrzaja korpe");
    } else {
      const retOBJ = JSON.parse(pom);
      this.setState({ shoppingCart: retOBJ });
      //console.log("preuzeo sacuvan sadrzaj prethodne korpe",pom,"json",JSON.parse(pom));
    }
  }
  updateIme = (ime) => {
    this.setState({ korisnikIme: ime });
  };
  updateSlika = (slika) => {
    this.setState({ profilnaSlika: slika });
  };
  render() {
    return (
      <div>
        <div className="divBlocker" hidden={true}>
          <h3 className="h3Sacekajte"> </h3>
          <h3 className="sacekajteDiv"> Molimo vas sacekajte.</h3>
          <img src={this.state.darkTheme ? PreloaderDark:Preloader} alt="gif"></img>
        </div>
        <Router>
          <Navigacija
            logout = {this.checkLogin}
            loggedIn = {this.state.loggedIn}
            tipKorisnika = {this.state.userPrivilage}
            showCart = {this.showCart}
            Korisnik = {this.state.user}
            slika = {this.state.profilnaSlika}
            korisnikIme = {this.state.korisnikIme}
            darkTheme = {this.state.darkTheme}
          />
          <div className="containerStranice">
            <Korpa
              setShoppingCart={(niz) => {
                this.setState({ shoppingCart: niz });
                setTimeout(() => {
                  this.saveLocalStorage();
                }, 1000);
              }}
              shoppingCart={this.state.shoppingCart}
              hiddenCart={this.state.hiddenCart}
              blokiraj={this.blokiraj}
            ></Korpa>
            <Route exact path="/" component={Pocetna} />
            <Route exact path="/prodaja">
              <Prodaja
                blokiraj={this.blokiraj}
                Korisnik={this.state.user}
                TipKorisnika={this.state.userPrivilage}
                kupiKliknuto={this.kupiKliknuto}
              ></Prodaja>
            </Route>
            <Route exact path="/rezervacije" component={Rezervacije} />
            <Route exact path="/narudzbenice" component={Narudzbenice} />
            <Route exact path="/aukcija">
              <Aukcija
                tipKorisnika={this.state.userPrivilage}
                blokiraj={this.blokiraj}
              ></Aukcija>
            </Route>
            <Route exact path="/profil">
              <Profil
                Korisnik={this.state.user}
                blokiraj={this.blokiraj}
                updateNavIme={this.updateIme}
                updateNavSlika={this.updateSlika}
              ></Profil>
            </Route>
            <Route exact path="/kontakt" component={Kontakt} />
            {/*<Route exact path='/puskaTest' component={Puska} />*/}
            <Route exact path="/login">
              <Login
                blokiraj={this.blokiraj}
                loggedIn={this.checkLogin}
                tipKorisnika={this.state.userPrivilage}
              ></Login>
            </Route>
            <Route exact path="/signup">
              <SignUp blokiraj={this.blokiraj}></SignUp>
            </Route>
          </div>
          <Footer />
        </Router>
      </div>
    );
  }
}
export default App;
