import { Coord } from "./coord";

export type Square = {
  type: "grass" | "path";
  nextCoords?: Coord[];
};
