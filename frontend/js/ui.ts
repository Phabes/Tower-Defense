import $ from "jquery";
import { Camera } from "./camera";
import { Renderer } from "./renderer";
import { Tower } from "./tower";
import { Player } from "./player";
import { Upgrade } from "./upgrade";

export const getBoardElement = () => {
  return $("#board");
};

export const clearLevel = () => {
  $("#level").empty();
};

export const clearTimer = () => {
  $("#timer").empty();
};

export const clearPlayer = () => {
  $("#player").empty();
};

export const clearAction = () => {
  $("#action").empty();
};

export const windowResize = (camera: Camera, renderer: Renderer) => {
  $(window).on("resize", () => {
    const boardElement = getBoardElement();
    camera.aspect = boardElement.width()! / boardElement.height()!;
    camera.updateProjectionMatrix();
    renderer.setRendererSize(boardElement);
  });
};

export const boardClick = (callback: any) => {
  getBoardElement().on("click", callback);
};

export const boardOffClick = () => {
  getBoardElement().off("click");
};

export const showSelectLevel = (
  possibleLevels: number,
  playerLevel: number,
  prepareGame: (index: number) => void
) => {
  clearLevel();
  clearPlayer();
  clearAction();
  const levelElement = $("#level");
  const select = $("<select>").attr("id", "levelSelect");
  const values: string[] = [];

  for (let level = 0; level < possibleLevels; level++) {
    const disabled = playerLevel < level ? "disabled" : "";
    const selected =
      Math.min(playerLevel, possibleLevels - 1) == level ? "selected" : "";

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
      clearLevel();
      prepareGame(index);
    });
  levelElement.append(button);
  // button.trigger("click"); // to delete
};

export const setTimer = (time: number, startRound: () => void) => {
  clearTimer();
  const timer = $("#timer");
  timer.text(time--);
  const interval = setInterval(() => {
    if (time == 0) {
      clearInterval(interval);
      clearTimer();
      startRound();
      return;
    }
    timer.text(time--);
  }, 1000);
};

export const showPlayerStats = (player: Player) => {
  clearPlayer();
  const playerElement = $("#player");
  playerElement.text(`hp: ${player.hp}, money: ${player.money}`);
};

export const showTowerPanel = (tower: Tower | null, player: Player) => {
  clearAction();
  showPlayerStats(player);
  if (!tower) {
    return;
  }

  const action = $("#action");
  action.text(`y: ${tower.building.coord.y}, x: ${tower.building.coord.x}`);

  if (!tower.active) {
    const activate = $("<button>")
      .text("ACTIVATE TOWER")
      .on("click", () => upgradeClick(tower, tower.activeCost, player))
      .prop("disabled", !player.canBuy(tower.activeCost.nextUpgradeCost));
    action.append(activate);
    return;
  }

  const range = $("<button>")
    .text(tower.range.canLevelUp() ? "UPGRADE RANGE" : "MAX RANGE REACHED")
    .on("click", () => upgradeClick(tower, tower.range, player))
    .prop("disabled", !player.canBuy(tower.range.nextUpgradeCost));

  const power = $("<button>")
    .text(tower.power.canLevelUp() ? "UPGRADE POWER" : "MAX POWER REACHED")
    .on("click", () => upgradeClick(tower, tower.power, player))
    .prop("disabled", !player.canBuy(tower.power.nextUpgradeCost));

  const frequency = $("<button>")
    .text(
      tower.frequency.canLevelUp()
        ? "UPGRADE FREQUENCY"
        : "MAX FREQUENCY FREQUENCY"
    )
    .on("click", () => upgradeClick(tower, tower.frequency, player))
    .prop("disabled", !player.canBuy(tower.frequency.nextUpgradeCost));

  action.append(range);
  action.append(power);
  action.append(frequency);
};

const upgradeClick = (tower: Tower, upgrade: Upgrade, player: Player) => {
  if (player.canBuy(upgrade.nextUpgradeCost)) {
    player.substractMoney(upgrade.nextUpgradeCost);
    upgrade.levelUp();
    showTowerPanel(tower, player);
  }
};
