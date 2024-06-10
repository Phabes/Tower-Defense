import $ from "jquery";
import { Camera } from "./camera";
import { Renderer } from "./renderer";
import { Tower } from "./tower";
import { Player } from "./player";
import { Upgrade } from "./upgrade";
import { Loading } from "./loading";
import { Variant } from "./types";
import { Game } from "./game";
import { BoardCreator } from "./boardCreator";

export const getBoardElement = () => {
  return $("#board");
};

export const clearFieldOptions = () => {
  $("#fieldCoordsTitle").empty();
  $("#coordY").empty();
  $("#coordX").empty();
  $("#fieldButtons").empty();
};

export const setLoadingMessage = (message: string) => {
  $("#loadingMessage").text(message);
};
export const removeLoading = () => {
  $("#loading").remove();
};

export const setErrorMessage = (message: string) => {
  $("#errorMessage").text(message);
};
export const removeWelcome = () => {
  $("#welcome").css("display","none");
};

export const showWelcome = () =>{
  $("#welcome").css("display", "block");;
}

export const showCreator = () => {
  $("#creator").css({ display: "block" });
};

export const windowResize = (camera: Camera, renderer: Renderer) => {
  
  $(window).on("resize", () => {
    const boardElement = getBoardElement();
    camera.aspect = boardElement.width()! / boardElement.height()!;
    camera.updateProjectionMatrix();
    renderer.setRendererSize(boardElement);
  });
};

export const boardMouseMove = (callback: any) => {
  getBoardElement().on("mousemove", callback);
};

export const towerHover = (callback: any) => {
  getBoardElement().on("mousemove", callback);
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
    if (!Loading.getInstance().canStartGame()) {
      return;
    }
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
    const disabledUpgradeActivate = !player.canBuy(
      tower.activeCost.nextUpgradeCost
    );
    const activate = $("<button>")
      .addClass(disabledUpgradeActivate ? "disabledGameButton" : "gameButton")
      .text("ACTIVATE TOWER")
      .on("click", () => upgradeClick(tower, tower.activeCost, player))
      .prop("disabled", disabledUpgradeActivate);

    fieldButtons.append(activate);
    return;
  }

  const disabledUpgradeRange =
    !player.canBuy(tower.range.nextUpgradeCost) || !tower.range.canLevelUp();
  const range = $("<button>")
    .addClass(disabledUpgradeRange ? "disabledGameButton" : "gameButton")
    .text(
      tower.range.canLevelUp()
        ? `UPGRADE RANGE (${tower.range.getUpgradeStatus()})`
        : `MAX RANGE REACHED (${tower.range.getUpgradeStatus()})`
    )
    .on("click", () => upgradeClick(tower, tower.range, player))
    .prop("disabled", disabledUpgradeRange);

  const disabledUpgradePower =
    !player.canBuy(tower.power.nextUpgradeCost) || !tower.power.canLevelUp();
  const power = $("<button>")
    .addClass(disabledUpgradePower ? "disabledGameButton" : "gameButton")
    .text(
      tower.power.canLevelUp()
        ? `UPGRADE POWER (${tower.power.getUpgradeStatus()})`
        : `MAX POWER REACHED (${tower.power.getUpgradeStatus()})`
    )
    .on("click", () => upgradeClick(tower, tower.power, player))
    .prop("disabled", disabledUpgradePower);

  const disabledUpgradeFrequency =
    !player.canBuy(tower.frequency.nextUpgradeCost) ||
    !tower.frequency.canLevelUp();
  const frequency = $("<button>")
    .addClass(disabledUpgradeFrequency ? "disabledGameButton" : "gameButton")
    .text(
      tower.frequency.canLevelUp()
        ? `UPGRADE FREQUENCY (${tower.frequency.getUpgradeStatus()})`
        : `MAX FREQUENCY FREQUENCY (${tower.frequency.getUpgradeStatus()})`
    )
    .on("click", () => upgradeClick(tower, tower.frequency, player))
    .prop("disabled", disabledUpgradeFrequency);

  fieldButtons.append(range);
  fieldButtons.append(power);
  fieldButtons.append(frequency);
};

const upgradeClick = (tower: Tower, upgrade: Upgrade, player: Player) => {
  if (player.canBuy(upgrade.nextUpgradeCost)) {
    player.substractMoney(upgrade.nextUpgradeCost);
    showPlayerStats(player);
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

export const welcomeButtonsHandler = (game: Game) => {
  const startButton = $("#startGame");
  const createButton = $("#createLevel");

  startButton.off("click");
  startButton.on("click", () => {
    game.startGame();
  });

  createButton.off("click");
  createButton.on("click", () => {
    showBoardSizePanel(game);
  });
};

const showBoardSizePanel = (game: Game) => {
  removeWelcome();
  removeLoading();
  showCreator();

  const createBoardButton = $("#createBoard");

  createBoardButton.off("click");
  createBoardButton.on("click", () => {
    const reg = /^\d+$/;
    const width = $("#newBoardWidth").val() as string;
    const height = $("#newBoardHeight").val() as string;
    if (reg.test(width) && reg.test(height)) {
      game.startLevelCreator(parseInt(width), parseInt(height));
      showCreatorFieldsPanel();
    }
  });
};

const showCreatorFieldsPanel = () => {
  $("#boardSize").remove();
  $("#boardFields").css({ display: "flex" });

  const pathFieldPicker = $("#pathFieldPicker td:first-child");
  const towerFieldPicker = $("#towerFieldPicker td:first-child");
  const grassFieldPicker = $("#grassFieldPicker td:first-child");

  pathFieldPicker.off("click");
  towerFieldPicker.off("click");
  grassFieldPicker.off("click");

  pathFieldPicker.on("click", function () {
    $(".selectedFieldPicker").removeClass("selectedFieldPicker");
    pathFieldPicker.addClass("selectedFieldPicker");
    $("#pathFieldPickerRB").prop("checked", true);
  });

  towerFieldPicker.on("click", function () {
    $(".selectedFieldPicker").removeClass("selectedFieldPicker");
    towerFieldPicker.addClass("selectedFieldPicker");
    $("#towerFieldPickerRB").prop("checked", true);
  });

  grassFieldPicker.on("click", function () {
    $(".selectedFieldPicker").removeClass("selectedFieldPicker");
    grassFieldPicker.addClass("selectedFieldPicker");
    $("#grassFieldPickerRB").prop("checked", true);
  });
};

export const getFieldPickerType = () => {
  return $("input[name='fieldPicker']:checked").val();
};

export const acceptCreatedLevel = (board: BoardCreator) => {
  const acceptBoardButton = $("#acceptBoard");
  const acceptStartFieldButton = $("#acceptStartField");
  const acceptEndFieldButton = $("#acceptEndField");
  
  acceptBoardButton.off("click");
  acceptBoardButton.on("click", function () {
    const isValid = board.acceptBoard();
    if (isValid)$("#boardFields").hide();
  });

  acceptStartFieldButton.off("click");
  acceptStartFieldButton.on("click", function () {
    const isValid = board.acceptStartField();
    if (isValid) $("#startFieldPicker").hide();
  });

  acceptEndFieldButton.off("click");
  acceptEndFieldButton.on("click", function () {
    const isValid = board.acceptEndField();
    if (isValid) $("#endFieldPicker").hide();
  });

  
};

export const vaweCreation = (board: BoardCreator)=>{
  const waveMaker = $("#waveMaker");
  const acceptVawes = $("#acceptVawes");
  const createVaweButton = $("#createVaweButton");
  const waveCreationDisplay = $("#waveCreationDisplay");
  
  waveMaker.css("display","flex");

  waveCreationDisplay.find(".waveItem").remove();
  acceptVawes.off("click");
  acceptVawes.on("click",()=>{
    board.save()
  })

  createVaweButton.off("click");
  createVaweButton.on("click",()=>{
    console.log("awdwa")
    const reg = /(\d+(?:\.\d+)?)/;
    const time = $("#waveTimeInput").val() as string;
    const enemies = $("#waveEnemiesInput").val() as string;
    if (reg.test(time) && reg.test(enemies)) {
      const newItem = $('<div>', { class:"waveItem waveContainer"});
      $(`<div class='waveTime'>${time}</div>`).appendTo(newItem);
      $(`<div class='waveEnemies'>${enemies}</div>`).appendTo(newItem);
      $(`<img src="./assets/images/delete.png" alt="delete" class="vaweDeleteIcon"/>`).appendTo(newItem).on("click", (e) => {
        e.target.parentElement?.remove();
      });
      newItem.appendTo(waveCreationDisplay);
    }
  })


}

export const getCreatedVawes=()=>{
  const waveCreationDisplay = $("#waveCreationDisplay");
  const waveItems = waveCreationDisplay.find(".waveItem")
  const waves = []
  for(let i=0;i<waveItems.length;i++){
    const wave = {
      "timer": parseFloat(waveItems[i].children[0].innerHTML),
      "enemies": parseInt(waveItems[i].children[1].innerHTML)
    }
    waves.push(wave)
  }
  
  return waves
}

export const removeWaveMaker = ()=>{
  const waveMaker = $("#waveMaker");
  waveMaker.css("display", "none");
}


export const alertPopup = (message: string) => {
  alert(message);
};

export const refresh = () =>{
  window.location.reload();
}