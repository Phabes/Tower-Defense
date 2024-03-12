import $ from "jquery";

export class Panel {
  constructor(game) {
    this.game = game;
  }

  clearPanel = () => {
    $("#panel").empty();
  };

  showSelectLevel = () => {
    this.clearPanel();
    const select = $("<select>").attr("id", "levelSelect");
    for (let level in this.game.levels) {
      const option = $("<option>")
        .attr("disabled", this.game.player.level < level)
        .attr(
          "selected",
          Math.min(this.game.player.level, this.game.levels.length - 1) == level
        )
        .attr("label", level)
        .attr("value", level);
      select.append(option);
    }
    $("#panel").append(select);
    const button = $("<button>")
      .text("START")
      .on("click", () => {
        this.game.prepareGame($("#levelSelect").val());
      });
    $("#panel").append(button);
    // button.trigger("click"); // to delete
  };

  setTimer = (time) => {
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

  showPlayerStats = (player) => {
    this.clearPanel();
    const panel = $("#panel");
    const hp = $("<div>").text(player.hp);
    const money = $("<div>").text(player.money);
    panel.append(hp);
    panel.append(money);
  };
}
