import * as THREE from "three";
import { Coord, Surface } from "../types";
import { settings } from "../settings";
import { Player } from "../player";
import { Models } from "../models";
import { Loading } from "../loading";

interface FieldInterface {
  colorField(selected:boolean): void;
  showPanel(show: boolean, player: Player): void;
  addFieldElement(element: THREE.Mesh): void;
  createField(mapSizeY: number): THREE.Group<THREE.Object3DEventMap>;
}

export class Field extends THREE.Mesh implements FieldInterface {
  coord: Coord;
  type: Surface;
  nextFields: Field[];
  color:string;
  elementsOnField: THREE.Group;
  isSelected:boolean = false;
  isFirstField:boolean = false;

  constructor(coord: Coord, type: Surface) {
    super();
    this.coord = coord;
    this.type = type;
    this.nextFields = [];
    this.elementsOnField = new THREE.Group();
    this.color = this.isSelected ? "#ff00ff" : "#26d46e"
  }

  colorField = (selected: boolean) => {
    const models = Models.getInstance();
    const modelsLoaded = models.getModelsLoadedStatus();
    const color = selected ? 0xff00ff : 0x26d46e;

    this.material = new THREE.MeshBasicMaterial({
      map: modelsLoaded ? models.getGrassTexture() : undefined,
      color: !modelsLoaded ? color : undefined,
    });
  };

  select = () =>{
    this.isSelected = true;
  }

  unSelect = () => {
    this.isSelected = false;
  }

  showPanel = (show: boolean, player: Player) => {};

  addFieldElement = (element: THREE.Object3D) => {
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
    this.colorField(false);
    this.position.set(
      this.coord.x * (settings.FIELD_SIZE + settings.SPACE_BETWEEN) +
        settings.FIELD_SIZE / 2,
      (mapSizeY - this.coord.y - 1) *
        (settings.FIELD_SIZE + settings.SPACE_BETWEEN) +
        settings.FIELD_SIZE / 2,
      0
    );
    this.elementsOnField.add(this);

    const createTree = Math.random();
    const createHouse = Math.random();

    if (createTree < settings.TREE_CREATION_CHANCE) {
      const grass = Models.getInstance().getTreeModelClone();
      grass.position.set(
        this.coord.x * (settings.FIELD_SIZE + settings.SPACE_BETWEEN) +
          settings.FIELD_SIZE / 2,
        (mapSizeY - this.coord.y - 1) *
          (settings.FIELD_SIZE + settings.SPACE_BETWEEN) +
          settings.FIELD_SIZE / 2,
        0
      );
      this.elementsOnField.add(grass);
    } else if (createHouse < settings.HOUSE_CREATION_CHANCE) {
      const house = Models.getInstance().getHouseModelClone();
      house.position.set(
        this.coord.x * (settings.FIELD_SIZE + settings.SPACE_BETWEEN) +
          settings.FIELD_SIZE / 2,
        (mapSizeY - this.coord.y - 1) *
          (settings.FIELD_SIZE + settings.SPACE_BETWEEN) +
          settings.FIELD_SIZE / 2,
        0
      );
      this.elementsOnField.add(house);
    }

    return this.elementsOnField;
  };

  highlight = () => {
    (this.material as THREE.MeshBasicMaterial).color.set("#42daf5")
  }
  
  getCoords = () => {
    return this.coord
  }

}
