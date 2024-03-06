import $ from "jquery";

export class Panel {
  constructor(game, levels, playerLevel) {
    this.createLevelSelect(game, levels, playerLevel);
  }

  clearPanel = () => {
    $("#panel").empty();
  };

  createLevelSelect = (game, levels, playerLevel) => {
    const select = $("<select>").attr("id", "levelSelect");
    for (let level in levels) {
      const option = $("<option>")
        .attr("disabled", playerLevel < level)
        .attr("selected", playerLevel == level)
        .attr("label", level)
        .attr("value", level);
      select.append(option);
    }
    $("#panel").append(select);
    const button = $("<button>")
      .text("START")
      .on("click", () => {
        game.setBoard($("#levelSelect").val());
        this.clearPanel();
      });
    $("#panel").append(button);
  };
}
