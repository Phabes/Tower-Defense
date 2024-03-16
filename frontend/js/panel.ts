import $ from "jquery";
import { Game } from "./game";
import { Player } from "./player";
import { Field } from "./field";

export class Panel {
  game: Game;
  constructor(game) {
    this.game = game;
  }

  clearLevel = () => {
    $("#level").empty();
  };

  clearTimer = () => {
    $("#timer").empty();
  };

  clearPlayer = () => {
    $("#player").empty();
  };

  clearAction = () => {
    $("#action").empty();
  };

  showSelectLevel = () => {
    this.clearLevel();
    this.clearPlayer();
    this.clearAction();
    const levelElement = $("#level");
    const select = $("<select>").attr("id", "levelSelect");
    const values: string[] = [];

    for (let level = 0; level < this.game.levels.length; level++) {
      const disabled = this.game.player.level < level ? "disabled" : "";
      const selected =
        Math.min(this.game.player.level, this.game.levels.length - 1) == level
          ? "selected"
          : "";

      const option = $("<option>").attr("label", level).attr("value", level);
      if (disabled) {
        option.attr("disabled", "disabled");
      }
      if (selected) {
        option.attr("selected", "selected");
      }
      values.push(level.toString());
      select.append(option);
    }
    levelElement.append(select);
    const button = $("<button>")
      .text("START")
      .on("click", () => {
        const value = $("#levelSelect").val();
        const index = values.indexOf(value!.toString());
        this.clearLevel();
        this.game.prepareGame(index);
      });
    levelElement.append(button);
    // button.trigger("click"); // to delete
  };

  setTimer = (time: number) => {
    this.clearTimer();
    const timer = $("#timer");
    timer.text(time--);
    const interval = setInterval(() => {
      if (time == 0) {
        clearInterval(interval);
        this.clearTimer();
        this.game.startRound();
        return;
      }
      timer.text(time--);
    }, 1000);
  };

  showPlayerStats = (player: Player) => {
    this.clearPlayer();
    const playerElement = $("#player");
    playerElement.append(`hp: ${player.hp}, money: ${player.money}`);
  };

  fieldChange = (field: Field | null) => {
    if (!field) {
      this.clearAction();
      return;
    }
    const action = $("#action");
    action.text(`y: ${field.coord.y}, x: ${field.coord.x}`);
  };
}
