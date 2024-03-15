import $ from "jquery";
import { Camera } from "./camera";
import { Renderer } from "./renderer";

export const getBoardElement = () => {
  return $("#board");
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
