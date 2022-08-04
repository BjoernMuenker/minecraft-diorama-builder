import { VuexModule, Mutation, Module, getModule } from "vuex-module-decorators";
import { store } from "../";
import { BlockTypeId } from "../../types/BlockTypeId";
import { PlacedBlock } from "../../types/PlacedBlock";
import { BlockPosition } from "../../types/blockPosition";
import { isSpaceAlreadyTaken, isOutOfBounds } from "../../utils/blockUtils";
import { Howl } from "howler";
import { randFromArray } from "../../utils/objectUtils";
import { GLOBAL_CONFIG } from "../../config/globalConfig";
@Module({ dynamic: true, store, namespaced: true, name: "AppStateStoreModule" })
class AppStateStoreModule extends VuexModule {
  private _hotBarItems = [
    BlockTypeId.ACACIA_LOG,
    BlockTypeId.ACACIA_PLANKS,
    BlockTypeId.AMETHYST_BLOCK,
    BlockTypeId.BOOKSHELF,
    BlockTypeId.BONE_BLOCK,
    BlockTypeId.BEACON,
    BlockTypeId.BLUE_CONCRETE_POWDER,
    BlockTypeId.BEEHIVE,
    BlockTypeId.BIRCH_LOG,
  ];
  private _selectedBlockTypeId = this.hotBarItems[0];
  private _debug = false;
  private _sound = new Howl({
    src: ["/sounds/audio.ogg", "/sounds/audio.m4a", "/sounds/audio.mp3", "/sounds/audio.ac3"],
    sprite: {
      click: [0, 297.50566893424036],
      cloth1: [2000, 207.52834467120175],
      cloth2: [4000, 207.52834467120175],
      cloth3: [6000, 213.33333333333292],
      cloth4: [8000, 207.52834467120175],
      coral1: [10000, 518.0952380952384],
      coral2: [12000, 506.48526077097597],
      coral3: [14000, 576.1451247165539],
      coral4: [16000, 515.192743764171],
      grass1: [18000, 509.3877551020398],
      grass2: [20000, 520.9977324263023],
      grass3: [22000, 518.0952380952384],
      grass4: [24000, 506.48526077097597],
      gravel1: [26000, 503.5827664399086],
      gravel2: [28000, 506.48526077097597],
      gravel3: [30000, 515.192743764171],
      gravel4: [32000, 506.48526077097245],
      sand1: [34000, 320.7256235827671],
      sand2: [36000, 320.7256235827671],
      sand3: [38000, 320.7256235827671],
      sand4: [40000, 317.82312925169975],
      snow1: [42000, 460.0453514739229],
      snow2: [44000, 442.63038548752576],
      snow3: [46000, 457.1428571428555],
      snow4: [48000, 460.0453514739229],
      stone1: [50000, 503.5827664399122],
      stone2: [52000, 506.48526077097245],
      stone3: [54000, 503.5827664399122],
      stone4: [56000, 503.5827664399122],
      wet_grass1: [58000, 489.0702947845824],
      wet_grass2: [60000, 515.1927437641746],
      wet_grass3: [62000, 515.1927437641746],
      wet_grass4: [64000, 489.0702947845824],
      wood1: [66000, 503.5827664399051],
      wood2: [68000, 503.5827664399051],
      wood3: [70000, 506.48526077097245],
      wood4: [72000, 503.5827664399051],
    },
  });

  // TODO make it a map/set to prevent blocks with same coordinates?
  private _placedBlocks: PlacedBlock[] = [
    { id: BlockTypeId.ACACIA_LOG, position: [0, 2, 0] },
    { id: BlockTypeId.BEACON, position: [0, 2, 1] },
    { id: BlockTypeId.BOOKSHELF, position: [0, 4, 0] },
    { id: BlockTypeId.BEE_NEST, position: [0, 1, 0] },
  ];
  private _inventoryOpen = false;

  get hotBarItems() {
    return this._hotBarItems;
  }

  get selectedBlockTypeId() {
    return this._selectedBlockTypeId;
  }

  get placedBlocks() {
    return this._placedBlocks;
  }

  get debug() {
    return this._debug;
  }

  get inventoryOpen() {
    return this._inventoryOpen;
  }

  @Mutation
  playSound(id: string) {
    this._sound.play(id);
  }

  @Mutation
  setSelectedBlockTypeId(id: BlockTypeId) {
    this._selectedBlockTypeId = id;
  }

  @Mutation
  setDebugMode(value: boolean) {
    this._debug = value;
  }

  @Mutation
  addBlock(block: PlacedBlock) {
    if (isOutOfBounds(block.position) || isSpaceAlreadyTaken(block.position)) return;
    this._sound.play(randFromArray(["stone1", "stone2", "stone3", "stone4"]));
    this._placedBlocks.push(block);
  }

  @Mutation
  removeBlock(position: BlockPosition) {
    const idxToRemove = this._placedBlocks.findIndex((block) => block.position.join("") === position.join(""));

    if (idxToRemove > -1) {
      this._sound.play(randFromArray(["stone1", "stone2", "stone3", "stone4"]));
      this._placedBlocks.splice(idxToRemove, 1);
    }
  }

  @Mutation
  removeAllBlocks() {
    this._placedBlocks = [];
  }

  @Mutation
  openInventory() {
    this._sound.play("click");
    this._inventoryOpen = true;
  }

  @Mutation
  closeInventory() {
    this._sound.play("click");
    this._inventoryOpen = false;
  }

  @Mutation
  toggleInventory() {
    this._sound.play("click");
    this._inventoryOpen = !this._inventoryOpen;
  }

  @Mutation
  updateHotBarItem(payload: { index: number; blockTypeId: BlockTypeId }) {
    if (payload.index >= 0 && payload.index < GLOBAL_CONFIG.MAX_HOT_BAR_SLOTS) {
      this._hotBarItems[payload.index] = payload.blockTypeId;
    }
  }
}

export const appStateStore = getModule(AppStateStoreModule);
