import $ from "jquery";

export const getBoardElement = () => {
  return $("#board");
};

export const windowResize = (camera, renderer) => {
  $(window).on("resize", () => {
    const boardElement = getBoardElement();
    camera.aspect = boardElement.width() / boardElement.height();
    camera.updateProjectionMatrix();
    renderer.setRendererSize(boardElement);
  });
};

export const boardClick = (callback) => {
  getBoardElement().on("click", callback);
};
