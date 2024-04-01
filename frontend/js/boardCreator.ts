import * as THREE from "three";
import { Field } from "./fields/field";
import { boardClick, boardMouseMove, getBoardElement, getFieldPickerType } from "./ui";
import { Game } from "./game";
import { Board } from "./board";
import { settings } from "./settings";
import { Path } from "./fields/path";
import { Building } from "./fields/building";

export class BoardCreator extends Board {

  width:number;
  height:number;
  constructor(game: Game, width: number, height: number) {
    super(game)
    this.width=width;
    this.height=height;
  }

  onHover = (event: JQuery.MouseEnterEvent) => {
    const pointer = this.getMouseVector2(event);
    this.raycaster.setFromCamera(pointer, this.game.camera);
    const intersects = this.raycaster.intersectObjects(
      this.boardGroup.children
    );
    if (intersects.length > 0) {
      for (let i = 0; i < intersects.length; i++) {
        const object = intersects[i].object;
        if (object instanceof Field) {
          if ( object != this.hoveredField) {
            this.hoveredField?.colorField();
            this.hoveredField = object;
            object.highlight();
          }
        }
      }
    }
  }

  click = (event: JQuery.ClickEvent) => {
    const pointer = this.getMouseVector2(event);
    this.raycaster.setFromCamera(pointer, this.game.camera);

    const intersects = this.raycaster.intersectObjects(
      this.boardGroup.children
    );
    if (intersects.length > 0) {
      for (let i = 0; i < intersects.length; i++) {
        const object = intersects[i].object;
        if (object instanceof Field){
          const coord = object.getCoords()
          this.boardGroup.remove(this.fields[coord.y][coord.x].elementsOnField)
          switch (getFieldPickerType()){
            case "path":
              this.fields[coord.y][coord.x] = new Path(coord, "path")
              break;
            case "building":
              this.fields[coord.y][coord.x] = new Building(coord, "building")
              break;
            case "grass":
              this.fields[coord.y][coord.x] = new Field(coord, "grass")
              break;
            default:
              console.log("Non");
              break;
          }
          this.boardGroup.add(this.fields[coord.y][coord.x].createField(this.width))
        }
      }
    }
  };

  

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