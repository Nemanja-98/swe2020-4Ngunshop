import React from "react";

import Video from "../public/video.mp4";
import Mouse from "../public/mouse2.png";

export function Kontakt() {
  return (
    <div className="onama">
      <div className="overlayOnamavideo">
        <p className="pKodNas">Kod nas ste uvek dobrodosli</p>
      </div>

      <div className="videosve">
        <video
          className="onamavideo"
          autoPlay="autoplay"
          loop="loop"
          muted="muted"
          playsInline="playsinline"
        >
          <source
            src={Video}
            type="video/mp4"
            height="1800px"
            width="1080px"
          ></source>
        </video>
      </div>

      <div className="scrollmouse">
        <a href="#scrolldiv">
          <label style={{ color: "white" }}>Spusti</label>
          <img className="mouseDown" src={Mouse} alt="scroll down slika" />
        </a>
      </div>

      <h2 id="scrolldiv" className="naslovonama">
        O nama
      </h2>

      <p className="textonama">
        <a className="linkpocetna" href="/">
          4guNshop{" "}
        </a>
        je oruzarnica koja je nastala 2017 godine, napravljena od strane
        iskusnih oruzara kako bi poboljsala opremljivanje i pripremu za oruzane
        sportove u Srbiji (konkretnije Nisu). Naime 4N-Team je sve ovo zapoceo
        kako bi se ljudima pokazalo da oruzije nije i da ne sluzi samo za
        ratovanje ubijanje i da ljudi u streljani mogu i te kako da se zabave na
        siguran nacin. Tu su i sportska takmicenja poput IPSC-a, gde takmicari
        mogu da testiraju svoje oruzje ili nakon probe kupe novo. Nakon provere
        validnosti dozvola mozemo Vam ponuditi oruzja za lov i licnu
        bezbednost.
      </p>

      <iframe
        title="embedovana google lokacija"
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2902.18048975772!2d21.890005215373613!3d43.331412079133635!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4755b733e84f3ec1%3A0x19e124f773fef639!2z0JDQu9C10LrRgdCw0L3QtNGA0LAg0JzQtdC00LLQtdC00LXQstCwIDE0LCDQndC40YggMTgwMDA!5e0!3m2!1ssr!2srs!4v1586281937920!5m2!1ssr!2srs"
        width="100%"
        height={380}
        frameBorder={0}
        style={{ border: 0 }}
        allowFullScreen
      />

      <p className="naslovKontakt">Kontakt</p>

      <p className="pNaslovRadno">Radno Vreme : </p>
      <div className="radnoVremeCont">
        <div className="textRadnoVreme">
          <label className="labelaDan">Ponedeljak : </label>
          <label className="labelaVreme"> 09:00h - 17:00h </label> <br />
          <label className="labelaDan">Utorak : </label>
          <label className="labelaVreme"> 09:00h - 17:00h </label> <br />
          <label className="labelaDan">Sreda : </label>
          <label className="labelaVreme"> 09:00h - 17:00h </label> <br />
          <label className="labelaDan">Cetvrtak : </label>
          <label className="labelaVreme"> 09:00h - 17:00h </label> <br />
          <label className="labelaDan">Petak : </label>
          <label className="labelaVreme"> 09:00h - 17:00h </label> <br />
        </div>
      </div>

      <div className="osnovnikontakt">
        <div className="telefonKontakt">
          <span className="fa fa-phone telefon"></span>
          <p className="pozoviteText">Pozovite</p>
          <p className="textispodPozovi">
            Zainterestovani ste za oruzje? Pozovite nas i dobicete sve
            informacije lako i jednostavno.
          </p>
          <p className="brojTel">+381 60 0321 3411</p>
        </div>

        <div className="mailKontakt">
          <span className="fa fa-envelope-square mailIkonica"></span>
          <p className="pisiteText">Pisite</p>
          <p className="textMail">
            Zelite razgovor sa nama?Nikakav problem.Napisite nam mail i dobicete
            odgovor u nakracem mogucem roku.{" "}
          </p>
          <a
            href="mailto:4guNshop@gmail.com?Subject=Hello%20again"
            className="mail"
          >
            {" "}
            4guNshop@gmail.com
          </a>
        </div>
      </div>
    </div>
  );
}
export default Kontakt;
