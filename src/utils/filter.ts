import { BlockTypeId } from "../types/BlockTypeId";

export const toBlockName = (id: BlockTypeId) => {
  const splitted = id.split("");

  splitted.forEach((char, index) => {
    if (index === 0) splitted[0] = char.toUpperCase();
    if (char === "_") {
      splitted[index] = " ";
      splitted[index + 1] = splitted[index + 1].toUpperCase();
    }
  });

  return splitted.join("");
};
