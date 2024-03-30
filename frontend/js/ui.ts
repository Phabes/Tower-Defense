import $ from "jquery";
import { Camera } from "./camera";
import { Renderer } from "./renderer";
import { Tower } from "./tower";
import { Player } from "./player";
import { Upgrade } from "./upgrade";
import { Variant } from "./types";

export const getBoardElement = () => {
  return $("#board");
};


export const clearFieldOptions = () => {
  $("#fieldCoordsTitle").empty();
  $("#coordY").empty();
  $("#coordX").empty();
  $("#fieldButtons").empty();
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

export const boardMouseMove = (callback: any)=>{
  getBoardElement().on("mousemove", callback);
}


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
  clearFieldOptions();
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
  const playerHP = $("#hpValue");
  playerHP.text(player.hp);
  const playerMoney = $("#moneyValue");
  playerMoney.text(player.money);
};

export const showTowerPanel = (tower: Tower | null, player: Player) => {
  clearFieldOptions();
  if (!tower) {
    return;
  }

  const fieldCoordsTitle = $("#fieldCoordsTitle");
  const coordY = $("#coordY");
  const coordX = $("#coordX");
  const fieldButtons = $("#fieldButtons");

  fieldCoordsTitle.text("Coordinates:");
  coordY.text("Y: " + tower.building.coord.y);
  coordX.text("X: " + tower.building.coord.x);

  if (!tower.active) {
    const activate = $("<button>")
      .addClass("gameButton")
      .text("ACTIVATE TOWER")
      .on("click", () => upgradeClick(tower, tower.activeCost, player))
      .prop("disabled", !player.canBuy(tower.activeCost.nextUpgradeCost));
    fieldButtons.append(activate);
    return;
  }

  const range = $("<button>")
    .addClass("gameButton")
    .text(tower.range.canLevelUp() ? "UPGRADE RANGE" : "MAX RANGE REACHED")
    .on("click", () => upgradeClick(tower, tower.range, player))
    .prop(
      "disabled",
      !player.canBuy(tower.range.nextUpgradeCost) || !tower.range.canLevelUp()
    );

  const power = $("<button>")
    .addClass("gameButton")
    .text(tower.power.canLevelUp() ? "UPGRADE POWER" : "MAX POWER REACHED")
    .on("click", () => upgradeClick(tower, tower.power, player))
    .prop(
      "disabled",
      !player.canBuy(tower.power.nextUpgradeCost) || !tower.power.canLevelUp()
    );

  const frequency = $("<button>")
    .addClass("gameButton")
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

  fieldButtons.append(range);
  fieldButtons.append(power);
  fieldButtons.append(frequency);
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

export const createMessage = (message: string, variant: Variant) => {
  const messageElement = $("<div>")
    .addClass("message")
    .text(message)
    .css("background-color", getMessageColor(variant));
  const messages = $("#messagesContent");
  messages.prepend(messageElement);
  return messageElement;
};

export const removeMessage = (messageElement: JQuery<HTMLElement>) => {
  messageElement.remove();
};

const getMessageColor = (variant: Variant) => {
  return variant === "error"
    ? "#bf0a0a"
    : variant === "success"
    ? "#2a9117"
    : "#1616d9";
};
