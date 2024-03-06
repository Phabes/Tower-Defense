import * as THREE from "three";
import $ from "jquery";
import { getLevels } from "./net";
import { Board } from "./board";
import { Panel } from "./panel";

export class Game {
  constructor() {
    this.levels = [];

    this.playerLevel = this.getPlayerLevel();

    this.retrieveLevels();
  }

  getPlayerLevel = () => {
    const playerLevel = this.getCookie("tower-defence");
    if (playerLevel == "") {
      this.setCookie("tower-defence", 0, 1);
    } else {
      this.setCookie("tower-defence", playerLevel, 1);
    }
    return this.getCookie("tower-defence");
  };

  setCookie = (cname, cvalue, exdays) => {
    const d = new Date();
    d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
    let expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
  };

  getCookie = (cname) => {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(";");
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == " ") {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  };

  retrieveLevels = () => {
    getLevels().done((res) => {
      const levels = res.levels;
      this.levels = levels;
      this.prepareGame();
    });
  };

  prepareGame = () => {
    this.panel = new Panel(this, this.levels, this.playerLevel);
  };

  setBoard = (index) => {
    this.board = new Board(this.levels[index]);
  };
}
