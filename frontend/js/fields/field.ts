import * as THREE from "three";
import { Coord, Surface } from "../types";
import { settings } from "../settings";
import { Player } from "../player";

interface FieldInterface {
  colorField(): void;
  showPanel(show: boolean, player: Player): void;
  addFieldElement(element: THREE.Mesh): void;
}

export class Field extends THREE.Mesh implements FieldInterface {
  coord: Coord;
  type: Surface;
  nextFields: Field[];
  elementsOnField: THREE.Group;
  isSelected:boolean = false;

  constructor(coord: Coord, type: Surface) {
    super();
    this.coord = coord;
    this.type = type;
    this.elementsOnField = new THREE.Group();
  }

  colorField = () => {
    this.material = new THREE.MeshBasicMaterial({
      color: this.isSelected ? 0xff00ff : 0x26d46e,
    });
  };

  select = () =>{
    this.isSelected = true;
  }

  unSelect = () => {
    this.isSelected = false;
  }

  showPanel = (show: boolean, player: Player) => {};

  addFieldElement = (element: THREE.Mesh) => {
    element.position.set(this.position.x, this.position.y, element.position.z);
    this.elementsOnField.add(element);
  };

  setNextFields = (nextFields: Field[]) => {
    this.nextFields = nextFields;
  };

  getRandomNextField = () => {
    if (this.nextFields.length == 0) {
      return null;
    }
    return this.nextFields[Math.floor(Math.random() * this.nextFields.length)];
  };

  createField = (mapSizeY: number) => {
    this.geometry = new THREE.PlaneGeometry(
      settings.FIELD_SIZE,
      settings.FIELD_SIZE
    );
    this.colorField();
    this.position.set(
      this.coord.x * (settings.FIELD_SIZE + settings.SPACE_BETWEEN) +
        settings.FIELD_SIZE / 2,
      (mapSizeY - this.coord.y - 1) *
        (settings.FIELD_SIZE + settings.SPACE_BETWEEN) +
        settings.FIELD_SIZE / 2,
      0
    );
    this.elementsOnField.add(this);
    return this.elementsOnField;
  };

  highlight = () => {
    this.material = new THREE.MeshBasicMaterial({
      color: 0x42daf5
    });
  }
  getCoords = () => {
    return this.coord
  }

}
