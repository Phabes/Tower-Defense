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


export const postLevel = (level:Level) => {
  console.log(JSON.stringify(level))
  // return $.post("http://localhost:4000/levels/newlevel",JSON.stringify(level))
  return $.ajax({
    url: "http://localhost:4000/levels/newlevel",
    method: "post",
    dataType: "json",
    contentType: "application/json",
    traditional: true,
    data:JSON.stringify(level),
    processData:false
  });

  
};
