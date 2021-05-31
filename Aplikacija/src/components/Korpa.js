/* eslint-disable eqeqeq */
import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import Deliveries from "../public/deliveries.png";
import fire from "./Konfig";

function Korpa(props) {
  const [kupovina, setKupovina] = useState(false);
  
  const modifyAmount = (tip, index) => {
    const noviCart = props.shoppingCart;
    tip === "-"
      ? noviCart[index].kolicina === 1
        ? noviCart.splice(index, 1)
        : noviCart[index].kolicina--
      : noviCart[index].kolicina++;

    props.setShoppingCart(noviCart);
  };
  
  const dostava = () => {
    const div = document.querySelector(".divDostava");
    const p = document.querySelector(".pDostava");
    console.log("divdostava", div);
    if (div) {
      div.hidden = !div.hidden;
      if (p) p.hidden = !p.hidden;
    }
  };

  const potvrdiKupovinu = () => {
    const adresakupovine = document.querySelector("#adresaKupovine");
    const gradkupovine = document.querySelector("#gradKupovine");
    const postanskibrojkupovine = document.querySelector(
      "#postanskiBrojKupovine"
    );
    const p = document.querySelector(".pDostava");
    const greska = document.querySelector(".greskaPotvrdeKupovine");

    let tipNarudzbine = "";

    if (p.hidden == true) {
      if (
        adresakupovine.value.length == 0 ||
        gradkupovine.value.length == 0 ||
        postanskibrojkupovine.value.length == 0
      ) {
        greska.innerHTML = "*Morate uneti sva obavezna polja";

        adresakupovine.style.borderBottom = "1px #ff4000 solid";
        gradkupovine.style.borderBottom = "1px #ff4000 solid";
        postanskibrojkupovine.style.borderBottom = "1px #ff4000 solid";

        greska.classList.remove("greskaPotvrdeKupovine");
        void greska.offsetWidth;
        greska.classList.add("greskaPotvrdeKupovine");

        return;
      }
      tipNarudzbine =
        "Poslati narudzbinu na: " +
        " " +
        adresakupovine.value +
        " " +
        gradkupovine.value +
        " " +
        postanskibrojkupovine.value;
    } else tipNarudzbine = "Doci ce porucilac po narudzbinu";

    setKupovina(!kupovina);

    fire
      .firestore()
      .collection("Narudzbenica")
      .add({
        korisnik: fire.auth().currentUser.uid,
        proizvod: props.shoppingCart,
        status: "Neobradjeno",
        tipnarudzbine: tipNarudzbine,
        vremenarudzbine: new Date(Date.now()),
      })
      .then(() => {
        const divBlocker = document.querySelector(".divBlocker");
        divBlocker.children[0].innerHTML = "Uspesno poslata narudzbenica";

        props.blokiraj();
      })
      .catch((error) => {
        console.log(error.code);
      });

    localStorage.clear();
    const niz = [];
    props.setShoppingCart(niz);
  };

  return (
    <div
      className="shoppingCart"
      style={props.hiddenCart ? { display: "none" } : {}}
    >
      <div className="container">
        <h5 className="h5VasaKorpa">Vasa korpa:</h5>
        <div className="row">
          <div className="col-3 colProizvodjac">
            <label>Proizvodjac</label>
          </div>
          <div className="col-3 colModel">
            <label>Model</label>
          </div>
          <div className="col-3 colCena">
            <label>Cena</label>
          </div>
          <div className="col-3 colKolicina">
            <label>Kolicina</label>
          </div>
        </div>
        <div className="container scrollOverflow">
          {props.shoppingCart.map((el, index) => {
            return (
              <div className="row" key={el.model}>
                <div className="col-3 colProizvodjac">{el.proizvodjac}</div>
                <div className="col-3 colModel">{el.model}</div>
                <div className="col-3 colCena">{el.cena}</div>
                <div className="col-3 colKolicina">
                  <button
                    onClick={(e) => modifyAmount("-", index)}
                    className="btnKorpa"
                  >
                    -
                  </button>
                  {el.kolicina}
                  <button
                    onClick={(e) => modifyAmount("+", index)}
                    className="btnKorpa"
                  >
                    +
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="container">
        <div className="row">
          <div className="col-12">
            <Button
              disabled={props.shoppingCart.length === 0 ? true : false}
              className="btn btn-secondary btnCheckout"
              onClick={() => setKupovina(!kupovina)}
            >
              Potvrdi Kupovinu
            </Button>
          </div>
        </div>
      </div>

      <Modal
        show={kupovina}
        onHide={() => setKupovina(!kupovina)}
        className="ModalKupovina"
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title className="titleKupovina">
            Kupite 
            <div className="greskaPotvrdeKupovine"></div>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="container">
            <div className="row">
              <div className="col-6">
                <img
                  src={Deliveries}
                  className="col-12"
                  alt="ukrasna slika"
                ></img>
              </div>

              <div className="col-6">
                <label className="col-12">
                  Ako ne zelite dostavu mozete doci kod nas i pokupiti
                  porudzbinu licno! <br></br>
                  <label className="obavestenjeDostava">
                    (oznacite ukoliko zelete da porudzbinu preuzmete licno u
                    nasoj oruzarnci)
                  </label>{" "}
                </label>

                <label className="col-6">
                  <input
                    type="checkbox"
                    id="chbxDostava"
                    onClick={dostava}
                    className="col-6"
                  ></input>
                  Dolazim!
                </label>

                <div className="divDostava" hidden={false}>
                  <label className="unesiteLabel">
                    Unesite informacije za dostavu:
                  </label>

                  <br></br>
                  <label className="lbDostava">
                    Adresa: <label className="obaveznoZvezda">*</label>
                  </label>

                  <input
                    id="adresaKupovine"
                    required
                    className="inputDostava"
                  ></input>
                  <br></br>

                  <label className="lbDostava">
                    Grad: <label className="obaveznoZvezda">*</label>
                  </label>

                  <input
                    id="gradKupovine"
                    required
                    className="inputDostava"
                  ></input>
                  <br></br>

                  <label className="lbDostava">
                    Postanski broj: <label className="obaveznoZvezda">*</label>
                  </label>

                  <input
                    id="postanskiBrojKupovine"
                    required
                    className="inputDostava"
                  ></input>
                  <br></br>

                </div>

                <p className="pDostava" hidden={true}>
                  Mozete preuzeti svakog radnog dana
                  <br />
                  od 09:00h do 17:00h
                  <br />
                  Nasa Adresa: Vojvode Misica 22
                  <br />
                  Broj Telefona: +381 60 0321 3411
                </p>
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            className="btnOtkaziEdit"
            onClick={() => setKupovina(!kupovina)}
          >
            Otkazi
          </Button>
          <Button
            variant="primary"
            className="btnPotvrdiEdit"
            onClick={potvrdiKupovinu}
          >
            Potvrdi
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
export default Korpa;