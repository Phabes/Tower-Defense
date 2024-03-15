import $ from "jquery";

export const getLevels = () => {
  return $.ajax({
    url: "http://localhost:4000/levels",
    method: "get",
    dataType: "json",
    contentType: "application/json",
  });
};
