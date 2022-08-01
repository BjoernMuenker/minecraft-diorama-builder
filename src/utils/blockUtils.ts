import { appStateStore } from "../store/modules/AppState";
import { BlockPosition } from "../types/blockPosition";
import { GLOBAL_CONFIG } from "../config/globalConfig";

export const isOutOfBounds = (position: BlockPosition) => {
  let result = false;

  for (const [index, value] of position.entries()) {
    if (
      value < 0 ||
      (index === 0 && value > GLOBAL_CONFIG.MAX_BLOCKS.X - 1) ||
      (index === 1 && value > GLOBAL_CONFIG.MAX_BLOCKS.Y - 1) ||
      (index === 2 && value > GLOBAL_CONFIG.MAX_BLOCKS.Z - 1)
    ) {
      console.error("out of bounds");
      result = true;
      break;
    }
  }

  return result;
};

export const isSpaceAlreadyTaken = (position: BlockPosition) => {
  let result = false;

  if (appStateStore.placedBlocks.find((block) => block.position.join("") === position.join(""))) {
    console.error("space already taken by another block");
    result = true;
  }

  return result;
};
