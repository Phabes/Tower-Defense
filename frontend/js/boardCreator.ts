import * as THREE from "three";
import { Field } from "./fields/field";
import { boardClick, boardMouseMove, getBoardElement } from "./ui";
import { Game } from "./game";
import { Board } from "./board";
import { settings } from "./settings";

export class BoardCreator extends Board {

  width:number;
  height:number;
  constructor(game: Game, width: number, height: number) {
    super(game)
    this.width=width;
    this.height=height;
  }

  createBoard = () => {
    console.log("Control")
    this.clearBoard();
    this.setGroupPosition(this.boardGroup);

    const mapSizeY = this.height;
    for (let i = 0; i < this.height; i++) {
      const row: Field[] = [];
      for (let j = 0; j < this.width; j++) {
        const coord = { y: i, x: j };
        const field = new Field(coord, "grass")
        row.push(field);
        this.boardGroup.add(field.createField(mapSizeY));
      }
      this.fields.push(row);
    }
    this.game.scene.add(this.boardGroup);

    this.setPath();
    boardClick(this.click);
    boardMouseMove(this.onHover);
    this.animate();
  };

  setGroupPosition = (element: THREE.Group) => {
    element.position.set(
      -(
        this.width * settings.FIELD_SIZE +
        (this.width - 1) * 2
      ) / 2,
      -(
        this.height * settings.FIELD_SIZE +
        (this.height - 1) * 2
      ) / 2,
      0
    );
  };
  
  clearBoard = () => {
    this.boardGroup.clear();
    this.fields = [];
  };

}