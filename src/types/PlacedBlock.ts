import { BlockPosition } from "./blockPosition";
import { BlockTypeId } from "./BlockTypeId";

export interface PlacedBlock {
  id: BlockTypeId;
  position: BlockPosition;
}
