import $ from "jquery";
import { Camera } from "./camera";
import { Renderer } from "./renderer";
import { Tower } from "./tower";
import { Player } from "./player";
import { Upgrade } from "./upgrade";

export const getBoardElement = () => {
  return $("#board");
};

export const clearAction = () => {
  $("#action").empty();
};

export const removeLoading = () => {
  $("#loading").remove();
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

export const refreshSelectOptions = (
  possibleLevels: number,
  playerLevel: number
) => {
  const select = $("#levelSelect");
  select.empty();

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
    select.append(option);
  }
};

export const startButtonClick = (prepareGame: (index: number) => void) => {
  const select = $("#levelSelect");
  const button = $("#startLevel");

  button.off("click");
  button.on("click", () => {
    const value = select.val();
    const levelElement = $("#level");
    levelElement.css("display", "none");
    prepareGame(parseInt(value!.toString()));
  });
};

export const showSelectLevel = () => {
  clearAction();
  const levelElement = $("#level");
  levelElement.css("display", "flex");
  // const button = $("#startLevel"); // to delete
  // button.trigger("click"); // to delete
};

export const setTimer = (time: number, startRound: () => void) => {
  const timer = $("#timer");
  const timeElement = $("#timeElement");
  timeElement.text(time--);
  timer.css("display", "flex");

  const interval = setInterval(() => {
    if (time == 0) {
      clearInterval(interval);
      timer.css("display", "none");
      startRound();
      return;
    }
    timeElement.text(time--);
  }, 1000);
};

export const showPlayerStats = (player: Player) => {
  // const playerElement = $("#player");
  // playerElement.text(`hp: ${player.hp}, money: ${player.money}`);
  const playerHP = $("#hpValue");
  playerHP.text(player.hp);
  const playerMoney = $("#moneyValue");
  playerMoney.text(player.money);
};

export const showTowerPanel = (tower: Tower | null, player: Player) => {
  clearAction();
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
    .prop(
      "disabled",
      !player.canBuy(tower.range.nextUpgradeCost) || !tower.range.canLevelUp()
    );

  const power = $("<button>")
    .text(tower.power.canLevelUp() ? "UPGRADE POWER" : "MAX POWER REACHED")
    .on("click", () => upgradeClick(tower, tower.power, player))
    .prop(
      "disabled",
      !player.canBuy(tower.power.nextUpgradeCost) || !tower.power.canLevelUp()
    );

  const frequency = $("<button>")
    .text(
      tower.frequency.canLevelUp()
        ? "UPGRADE FREQUENCY"
        : "MAX FREQUENCY FREQUENCY"
    )
    .on("click", () => upgradeClick(tower, tower.frequency, player))
    .prop(
      "disabled",
      !player.canBuy(tower.frequency.nextUpgradeCost) ||
        !tower.frequency.canLevelUp()
    );

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

export const showAlert = (alertMessage: string, alertAction: () => void) => {
  const alertElement = $("#alert");
  const alertContent = $("#alertContent");
  alertContent.text(alertMessage);

  const button = $("#alertAccept");
  button.off("click");
  button.on("click", () => {
    alertElement.css("display", "none");
    alertAction();
  });

  alertElement.css("display", "flex");
};
