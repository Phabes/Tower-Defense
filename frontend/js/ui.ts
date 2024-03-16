import $ from "jquery";
import { Camera } from "./camera";
import { Renderer } from "./renderer";
import { Tower } from "./tower";
import { Player } from "./player";

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
  playerElement.append(`hp: ${player.hp}, money: ${player.money}`);
};

export const showTowerPanel = (tower: Tower | null, player: Player) => {
  if (!tower) {
    clearAction();
    return;
  }
  const action = $("#action");
  action.text(`y: ${tower.building.coord.y}, x: ${tower.building.coord.x}`);
  const range = $("<button>")
    .text("UPGRADE RANGE")
    .on("click", () => {
      tower.upgradeRange();
    });
  const power = $("<button>")
    .text("UPGRADE POWER")
    .on("click", () => {
      tower.upgradePower();
    });
  const speed = $("<button>")
    .text("UPGRADE SPEED")
    .on("click", () => {
      tower.upgradeSpeed();
    });
  action.append(range);
  action.append(power);
  action.append(speed);
  // check money
};
