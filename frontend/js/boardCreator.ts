import * as THREE from "three";
import { Field } from "./fields/field";
import { boardClick, boardMouseMove, getBoardElement, getFieldPickerType, acceptCreatedLevel, showAlert,alertPopup } from "./ui";
import { Game } from "./game";
import { Board } from "./board";
import { settings } from "./settings";
import { Path } from "./fields/path";
import { Building } from "./fields/building";
import { Coord } from "./types";

export class BoardCreator extends Board {

  width:number;
  height:number;
  onlyPath:boolean = false;
  choosingStart:boolean = false;
  startCoords:Coord;
  choosingEnd:boolean = false;
  endCoords:Coord;
  lastChoosenField:Path | undefined;

  constructor(game: Game, width: number, height: number) {
    super(game)
    this.width=width;
    this.height=height;
    acceptCreatedLevel(this)
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
        if (!this.onlyPath && object instanceof Field) {
          if ( object != this.hoveredField) {
            this.hoveredField?.colorField();
            this.hoveredField = object;
            object.highlight();
          }
        } else if (this.onlyPath && object instanceof Path){
          if (object != this.hoveredField) {
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
        if (object instanceof Field && !this.onlyPath){
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
        } else if (this.onlyPath && object instanceof Path){
          const coord = object.getCoords();
          if(this.choosingStart){
            if (this.lastChoosenField != undefined)
              this.lastChoosenField.changeColor("default");
            this.lastChoosenField = object;
            object.changeColor("start");
            this.startCoords = coord;
          }else if(this.choosingEnd && this.startCoords != coord){
            if (this.lastChoosenField != undefined)
              this.lastChoosenField.changeColor("default");
            this.lastChoosenField = object;
            object.changeColor("end");
            this.endCoords = coord;
          }
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

  acceptBoard = () =>{
    this.onlyPath = true;
    this.choosingStart = true;
  }

  acceptStartField = ():boolean=>{
    if(!this.startCoords){
      alertPopup("Choose starting field.")
      return false;
    }
    this.choosingStart = false;
    this.choosingEnd = true;
    this.lastChoosenField = undefined;
    return true;
  }
  
  acceptEndField = ():boolean => {
    if (!this.endCoords) {
      alertPopup("Choose end field.");
      return false;
    }
    this.choosingStart = false;
    this.choosingEnd = false;
    this.lastChoosenField = undefined;
    return true;
  }


}