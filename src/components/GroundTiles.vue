<script setup lang="ts">
  import { GLOBAL_CONFIG } from "../config/globalConfig";
  import { appStateStore } from "../store/modules/AppState";

  const amountOfTiles = GLOBAL_CONFIG.MAX_BLOCKS.X * GLOBAL_CONFIG.MAX_BLOCKS.Y;

  function getAttributesForTile(index: number) {
    // TODO: calc will only work for square ground --> max_blocks.x === max.blocks.y
    const verticalOffset = Math.trunc(index / GLOBAL_CONFIG.MAX_BLOCKS.Y);
    const horizontalOffset = index - verticalOffset * GLOBAL_CONFIG.MAX_BLOCKS.X;

    return {
      "data-x": horizontalOffset,
      "data-y": verticalOffset,
      "data-z": 0,
      style: {
        left: `${horizontalOffset * GLOBAL_CONFIG.BLOCK_DIMENSIONS.X}px`,
        bottom: `${verticalOffset * GLOBAL_CONFIG.BLOCK_DIMENSIONS.Y}px`,
      },
    };
  }

  function onRightClickFace(e: MouseEvent) {
    const target = e.target as HTMLElement;

    const { x, y, z } = target.dataset;
    if (!x || !y || !z) return;

    appStateStore.addBlock({ id: appStateStore.selectedBlockTypeId, position: [parseInt(x), parseInt(y), parseInt(z)] });
  }
</script>

<template>
  <div
    v-for="(tile, index) in amountOfTiles"
    :key="index"
    class="tile"
    v-bind="getAttributesForTile(index)"
    @contextmenu.prevent="onRightClickFace"
  ></div>
</template>

<style lang="scss" scoped>
  .tile {
    position: absolute;
    width: 100px;
    height: 100px;
    cursor: pointer;
    box-shadow: 0px 0px 0px 2px inset white;
    background: #ccc;

    &:hover {
      background: #fff;
    }
  }
</style>
