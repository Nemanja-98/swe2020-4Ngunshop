import React, { Component } from "react";

export class TehnickeSpecifikacije extends Component {
  constructor(props) {
    super(props);

    this.state = {
      proizvodjac: this.props.proizvodjac,
      model: this.props.model,
      kalibar: this.props.kalibar,
      cena: this.props.cena,
      kapacitetOkvira: this.props.magacin,
      tezina: this.props.tezina,
      datumproizvodnje: " ",
      opis: this.props.opis,
      tiporuzja: this.props.tiporuzja,
    };
  }

  componentDidMount() {
    var pom = this.props.datum.toString().split(" ");
    var pom2 = "";
    pom2 += pom[1] + " " + pom[2] + " " + pom[3];
    this.setState({ datumproizvodnje: pom2 });
  }

  render() {
    return (
      <div className="techSpec">
        <h2 className="detaljneSpec">Detaljne tehnicke specifikacije</h2>
        <table className="tabelaSpecifikacije">
          <tbody>
            <tr className="redSpecifikacije">
              <td className="dataSpecifikacije">
                <label className="labelaSpecifikacija">Proizvodjac: </label>{" "}
                {this.state.proizvodjac}
              </td>
              <td className="dataSpecifikacije">
                {" "}
                <label className="labelaSpecifikacija">Model: </label>{" "}
                {this.state.model}{" "}
              </td>
              <td className="dataSpecifikacije">
                <label className="labelaSpecifikacija"> Kalibar: </label>{" "}
                {this.state.kalibar}{" "}
              </td>
            </tr>
            <tr className="redSpecifikacije1">
              <td className="dataSpecifikacije">
                <label className="labelaSpecifikacija">Kapacitet okvira:</label>{" "}
                {this.state.kapacitetOkvira}
              </td>
              <td className="dataSpecifikacije">
                {" "}
                <label className="labelaSpecifikacija">Tezina: </label>{" "}
                {this.state.tezina}{" "}
              </td>
              <td className="dataSpecifikacije">
                <label className="labelaSpecifikacija"> Cena: </label>{" "}
                {this.state.cena} RSD{" "}
              </td>
            </tr>
            <tr className="redSpecifikacije">
              <td colSpan="3" className="dataSpecifikacije">
                <label className="labelaSpecifikacija">
                  Datum Proizvodnje:
                </label>{" "}
                {this.state.datumproizvodnje}
              </td>
            </tr>
          </tbody>
        </table>

        <div className="opisDeo">
          <label className="labelaSpecifikacija">Opis:</label> {this.state.opis}
        </div>
      </div>
    );
  }
}
export default TehnickeSpecifikacije;