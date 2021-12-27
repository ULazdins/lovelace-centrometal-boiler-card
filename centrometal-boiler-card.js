import {
  html,
  LitElement,
} from "https://unpkg.com/lit-element@2.0.1/lit-element.js?module";

import PelTecDisplay from "./peltec-display.js"

class LoveaceCentrometalBoilerCard extends LitElement {
  display = new PelTecDisplay()

  parameters = [
    "peltec_state", "peltec_fire_sensor", "peltec_fan",
    "peltec_boiler_pump", "peltec_boiler_pump_demand", "peltec_electric_heater",
    "peltec_buffer_tank_temparature_up", "peltec_buffer_tank_temparature_down",
    "peltec_lambda_sensor", "peltec_tank_level", "peltec_configuration",
    "peltec_boiler_temperature", "peltec_mixer_temperature", "peltec_mixing_valve",
    "peltec_flue_gas", "peltec_active_command"];

  optional_parameters = [ "peltec_outdoor_temperature" ]

  static get properties() {
    return {
      hass: {},
      config: {}
    };
  }

  hasParameterChanged(oldHass, parameter) {
    const oldValue = oldHass.states[this.config[parameter]];
    const newValue = this.hass.states[this.config[parameter]];
    if (oldValue != newValue) {
      console.log("%s : %s != %s", parameter, oldValue.state, newValue.state);
      return true;
    }
    return false;
  }

  shouldUpdate(changedProperties) {
    if (changedProperties.has("config")) {
      console.log("config changed");
      return true;
    }
    if (changedProperties.has("hass")) {
      console.log("hass changed");
      const oldHass = changedProperties.get("hass");
      for (var i = 0; i < this.parameters.length; i++) {
        if (this.hasParameterChanged(oldHass, this.parameters[i])) return true;
      }
      for (var i = 0; i < this.optional_parameters.length; i++) {
        if (this.hasParameterChanged(oldHass, this.optional_parameters[i])) return true;
      };
      return false;
    }
    return false;
  }

  render() {
    return html`
      <ha-card>${this.display.createContent(this.hass, this.config)}</ha-card>`;
  }

  checkMissingParameters(parameters) {
    var missing = [];
    this.parameters.forEach((parameter) => {
      if (!(parameter in this.config)) {
        missing.push(parameter);
      }
    });
    return missing;
  }

  setConfig(config) {
    this.config = config;
    const missing = this.checkMissingParameters();
    if (missing.length > 0) {
      throw new Error("You need to define: " + missing.join(","));
    }
    this.style.cssText = "display: block;";
  }

  getCardSize() {
    return 6;
  }

}

customElements.define('centrometal-boiler-card', LoveaceCentrometalBoilerCard);