export type Coord = {
  y: number;
  x: number;
};

export const CoordEquals = (a:Coord, b:Coord):boolean => {
    return (a.x == b.x && a.y == b.y) ? true : false
}