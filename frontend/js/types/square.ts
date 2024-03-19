import { Coord } from "./coord";
import { Surface } from "./surface";

export type Square = {
  type: Surface;
  nextCoords?: Coord[];
};
