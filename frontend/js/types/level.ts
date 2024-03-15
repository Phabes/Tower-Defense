import { Map } from "./map";
import { Coord } from "./coord";
import { Wave } from "./wave";

export type Level = {
  map: Map;
  waves: Wave[];
  startingCoords: Coord[];
};
