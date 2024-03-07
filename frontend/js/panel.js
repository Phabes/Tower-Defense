import $ from "jquery";

export class Panel {
  constructor(game) {
    this.game = game;
  }

  clearPanel = () => {
    $("#panel").empty();
  };

  showSelectLevel = () => {
    const select = $("<select>").attr("id", "levelSelect");
    for (let level in this.game.levels) {
      const option = $("<option>")
        .attr("disabled", this.game.playerLevel < level)
        .attr("selected", this.game.playerLevel == level)
        .attr("label", level)
        .attr("value", level);
      select.append(option);
    }
    $("#panel").append(select);
    const button = $("<button>")
      .text("START")
      .on("click", () => {
        this.game.prepareGame($("#levelSelect").val());
        this.clearPanel();
      });
    $("#panel").append(button);
    button.trigger("click"); // to delete
  };
}
