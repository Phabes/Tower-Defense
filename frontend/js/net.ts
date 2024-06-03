import $ from "jquery";
import { Level } from "./types";

export const getLevels = () => {
  return $.ajax({
    url: "http://localhost:4000/levels/getLevels",
    method: "get",
    dataType: "json",
    contentType: "application/json",
  });
};

export const postLevel = (level: Level) => {
  return $.ajax({
    url: "http://localhost:4000/levels/newlevel",
    method: "post",
    dataType: "json",
    contentType: "application/json",
    traditional: true,
    data: JSON.stringify(level),
    processData: false,
  });
};
