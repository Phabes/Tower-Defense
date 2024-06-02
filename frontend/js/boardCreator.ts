import * as THREE from "three";
import { Field } from "./fields/field";
import { boardClick, boardMouseMove, getBoardElement, getFieldPickerType, acceptCreatedLevel, showAlert,alertPopup } from "./ui";
import { Game } from "./game";
import { Board } from "./board";
import { settings } from "./settings";
import { Path } from "./fields/path";
import { Building } from "./fields/building";
import { Coord, Level, Square } from "./types";
import { CoordEquals } from "./types/coord";
import { postLevel } from "./net";

export class BoardCreator extends Board {

  width:number;
  height:number;
  onlyPath:boolean = false;
  choosingStart:boolean = false;
  startCoords:Coord[] = [];
  choosingEnd:boolean = false;
  endCoord:Coord|undefined;
  lastChoosenField:Path | undefined;
  parents: Coord[][][]

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
              this.fields[coord.y][coord.x] = new Path(coord, "path", false, false)
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
          this.boardGroup.add(this.fields[coord.y][coord.x].createField(this.height))
        } else if (this.onlyPath && object instanceof Path){
          const coord = object.getCoords();
          if(this.choosingStart){
            if (this.lastChoosenField != undefined)
              this.lastChoosenField.colorField(false);
            this.lastChoosenField = object;
            if(object.isStartField){
              object.isStartField = false;
              this.boardGroup.remove(object.elementsOnField)
              this.boardGroup.add(object.createField(this.height))
              const ind = this.startCoords.indexOf(coord,0)
              if(ind>-1)
                this.startCoords.splice(ind,1)
            }else{
              object.turnToStartingField(this.height);
              this.startCoords.push(coord);
            }
            console.log(this.startCoords)
          }else if(this.choosingEnd && !this.startCoords.includes(coord)){
            if (this.lastChoosenField != undefined)
              this.lastChoosenField.colorField(false);
            this.lastChoosenField = object;
            if(object.isEndField){
              object.isEndField = false;
              this.boardGroup.remove(object.elementsOnField);
              this.boardGroup.add(object.createField(this.height));
              this.endCoord = undefined;
            }else{
              let oldCoords = this.endCoord
              if (oldCoords){
                let old = this.fields[oldCoords.y][oldCoords.x] as Path
                old.isEndField = false;
                this.boardGroup.remove(old.elementsOnField);
                this.boardGroup.add(old.createField(this.height));
              }
              object.turnToEndingField(this.height);
              this.endCoord=coord;
            }
          }
        }
      }
    }
  };

  

  createBoard = () => {
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
    if(this.startCoords.length==0){
      alertPopup("Choose starting field.")
      return false;
    }
    this.choosingStart = false;
    this.choosingEnd = true;
    this.lastChoosenField = undefined;
    return true;
  }

  acceptEndField = ():boolean => {
    if (!this.endCoord) {
      alertPopup("Choose end field.");
      return false;
    }
    this.choosingStart = false;
    this.choosingEnd = false;
    this.lastChoosenField = undefined;
    if(!this.createPath()){
      alertPopup("There is no continues path between start and end.");
      this.fieldNextCoords = []
      return false;
    }
    this.save();
    return true;
  }

  createPath = async ():Promise<boolean> =>{
    if(this.startCoords.length==0 || !this.endCoord)
      return false;
    this.parents = new Array(this.height)
    for (let i = 0; i < this.height; i++) {
      this.parents[i]= new Array(this.height);
      for (let j = 0; j < this.width; j++) {
        this.parents[i][j] = new Array<Coord>();
      }
    }
    console.log(this.startCoords ,this.endCoord)
    const diffs = [{ y: 0, x: -1 }, { y: 0, x: 1 }, { y: -1, x: 0 }, { y: 1, x: 0 }];
    const nextCoords: Coord[] = [];
    nextCoords.push(this.endCoord);
    while (nextCoords.length > 0) {
      let current: Coord = nextCoords.shift();
      for (let i = 0; i < diffs.length; i++) {
        const diff = diffs[i];
        let coord: Coord = { y: current.y + diff.y, x: current.x + diff.x };
        if (coord.x < 0 || coord.x >= this.width || coord.y < 0 || coord.y >= this.height)
          continue;
        if (this.fields[coord.y][coord.x] instanceof Path) {
          if (this.parents[coord.y][coord.x].length == 0 && !this.startCoords.some(e => CoordEquals(e,coord)) && !CoordEquals(coord,this.endCoord)) {
            nextCoords.push(coord);
          }
          if (!this.parents[current.y][current.x].some(e => CoordEquals(e, coord)))
            this.parents[coord.y][coord.x].push(current);
      }
     
    }
    
    }
    return true 
  }
  save = () => {
    const map: Square[][] = new Array(this.height);
    for (let i = 0; i < this.height; i++) {
      map[i] = new Array(this.width);
      for (let j = 0; j < this.width; j++) {
        map[i][j] = { type: this.fields[i][j].type, nextCoords: this.parents[i][j] };
      }
    }
    if (!this.endCoord)
      return
    const level:Level = {
      map: map,
      waves: [{ timer: 10, enemies: 10 }],
      startingCoords: [...this.startCoords],
      endingCoords:[this.endCoord]
    };
    console.log(level)
    postLevel(level);
  }
}

// parents[this.startCoords.y][this.startCoords.x].push(this.startCoords);

// const nextCoords: Coord[] = [];
// nextCoords.push(this.startCoords);
// const diffs = [{ y: 0, x: -1 }, { y: 0, x: 1 }, { y: -1, x: 0 }, { y: 1, x: 0 }];
// while (nextCoords.length > 0) {
//   //@ts-ignore
//   let current: Coord = nextCoords.shift();
//   for (let i = 0; i < diffs.length; i++) {
//     const diff = diffs[i];
//     let coord: Coord = { y: current.y + diff.y, x: current.x + diff.x };
//     if (coord.x < 0 || coord.x >= this.width || coord.y < 0 || coord.y >= this.height)
//       continue;
//     if (this.fields[coord.y][coord.x] instanceof Path) {

//       if (parents[coord.y][coord.x].length == 0 && !CoordEquals(this.endCoords, { y: coord.y, x: coord.x })) {
//         nextCoords.push(coord);
//       }

      // let IsNotParent = true;
      // parents[current.y][current.x].forEach(parent => {
      //   if (CoordEquals(parent, coord))
      //     IsNotParent = false;
      // });

      // if (IsNotParent)
      //   parents[coord.y][coord.x].push(current);
//     }
//   }

// }

// if (parents[this.endCoords.y][this.endCoords.x].length == 0)
//   return false;

// this.fieldNextCoords = new Array(this.height);
// for (let i = 0; i < this.height; i++) {
//   this.fieldNextCoords[i] = new Array(this.height);
//   for (let j = 0; j < this.width; j++) {
//     this.fieldNextCoords[i][j] = new Array<Coord>();
//   }
// }
// nextCoords.push(this.endCoords);
// while (nextCoords.length > 0) {
//   //@ts-ignore
//   let current: Coord = nextCoords.shift();
//   if (CoordEquals(this.startCoords, current))
//     continue;
//   parents[current.y][current.x].forEach(coord => {
//     if (this.fieldNextCoords[coord.y][coord.x].length == 0)
//       nextCoords.push(coord);
//     this.fieldNextCoords[coord.y][coord.x].push(current);
//   });
// }