import $ from "jquery";
import { Game } from "./game";
import { Player } from "./player";

export class Panel {
  game: Game;
  constructor(game) {
    this.game = game;
  }

  clearPanel = () => {
    $("#panel").empty();
  };

  showSelectLevel = () => {
    this.clearPanel();
    const panel = $("#panel");
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
    panel.append(select);
    const button = $("<button>")
      .text("START")
      .on("click", () => {
        const value = $("#levelSelect").val();
        const index = values.indexOf(value!.toString());
        this.game.prepareGame(index);
      });
    panel.append(button);
    // button.trigger("click"); // to delete
  };

  setTimer = (time: number) => {
    this.clearPanel();
    const timer = $("<div>").text(time--);
    $("#panel").append(timer);
    const interval = setInterval(() => {
      if (time == 0) {
        clearInterval(interval);
        this.clearPanel();
        this.game.startRound();
        return;
      }
      timer.text(time--);
    }, 1000);
  };

  showPlayerStats = (player: Player) => {
    this.clearPanel();
    const panel = $("#panel");
    const hp = $("<div>").text(player.hp);
    const money = $("<div>").text(player.money);
    panel.append(hp);
    panel.append(money);
  };
}
