<script setup lang="ts">
  import { GLOBAL_CONFIG } from "../config/globalConfig";
  import { PlacedBlock } from "../types/PlacedBlock";
  import { appStateStore } from "../store/modules/AppState";

  const props = defineProps<{
    block: PlacedBlock;
  }>();

  function getAttributesForBlock(block: PlacedBlock) {
    return {
      "data-x": block.position[0],
      "data-y": block.position[1],
      "data-z": block.position[2],
      key: block.position.join("") + block.id,
      style: {
        left: block.position[0] * GLOBAL_CONFIG.BLOCK_DIMENSIONS.X + "px",
        bottom: block.position[1] * GLOBAL_CONFIG.BLOCK_DIMENSIONS.Y + "px",
        transform: `translateZ(${block.position[2] * GLOBAL_CONFIG.BLOCK_DIMENSIONS.Z + 50}px)`,
      },
    };
  }

  function onClickFace(e: MouseEvent) {
    const target = e.target as HTMLElement;
    if (!target.parentElement?.dataset) return;
    const { x, y, z } = target.parentElement?.dataset;
    if (!x || !y || !z) return;
    appStateStore.removeBlock([parseInt(x), parseInt(y), parseInt(z)]);
  }

  function onRightClickFace(e: MouseEvent) {
    console.log("onRightClickFace");
    const target = e.target as HTMLElement;
    const referenceElement = target.classList.contains("tile") ? target : target.parentElement;

    const { x, y, z } = (referenceElement as HTMLElement).dataset;

    if (!x || !y || !z) return;

    let computedX = parseInt(x);
    let computedY = parseInt(y);
    let computedZ = parseInt(z);

    if (target.classList.contains("face-right")) {
      computedX++;
    }

    if (target.classList.contains("face-left")) {
      computedX--;
    }

    if (target.classList.contains("face-back")) {
      computedY++;
    }

    if (target.classList.contains("face-front")) {
      computedY--;
    }

    if (target.classList.contains("face-top")) {
      computedZ++;
    }

    if (target.classList.contains("face-bottom")) {
      computedZ--;
    }

    appStateStore.addBlock({ id: appStateStore.selectedBlockTypeId, position: [computedX, computedY, computedZ] });
  }
</script>

<template>
  <div class="block" v-bind="getAttributesForBlock(block)">
    <div
      class="face-top"
      @click="onClickFace"
      @contextmenu.prevent="onRightClickFace"
      :class="[`texture-${block.id}`, `texture-${block.id}_side`, `texture-${block.id}_top`]"
    ></div>
    <div
      class="face-bottom"
      @click="onClickFace"
      @contextmenu.prevent="onRightClickFace"
      :class="[`texture-${block.id}`, `texture-${block.id}_side`, `texture-${block.id}_bottom`]"
    ></div>
    <div
      class="face-left"
      @click="onClickFace"
      @contextmenu.prevent="onRightClickFace"
      :class="[`texture-${block.id}`, `texture-${block.id}_side`]"
    ></div>
    <div
      class="face-right"
      @click="onClickFace"
      @contextmenu.prevent="onRightClickFace"
      :class="[`texture-${block.id}`, `texture-${block.id}_side`]"
    ></div>
    <div
      class="face-back"
      @click="onClickFace"
      @contextmenu.prevent="onRightClickFace"
      :class="[`texture-${block.id}`, `texture-${block.id}_side`]"
    ></div>
    <div
      class="face-front"
      @click="onClickFace"
      @contextmenu.prevent="onRightClickFace"
      :class="[`texture-${block.id}`, `texture-${block.id}_side`, `texture-${block.id}_front`]"
    ></div>
  </div>
</template>

<style lang="scss" scoped>
  .block {
    position: absolute;
    width: 100px;
    height: 100px;
    transform-style: preserve-3d;

    &.is-hovered {
      cursor: pointer;

      [class*="face"]::after {
        position: absolute;
        content: "";
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        background: white;
        animation: blink infinite 1s;
      }
    }

    [class*="face"] {
      position: absolute;
      width: 100px;
      height: 100px;
      image-rendering: pixelated;
      backface-visibilty: hidden;
      cursor: pointer;
      // border: 1px solid white;
      // background-color: grey;

      // decrease for debug
      opacity: 1;

      &:hover::after {
        position: absolute;
        content: "";
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        background: rgba(255, 255, 255, 0.5);
      }
    }

    .face-top {
      transform: translateZ(50px);
    }

    .face-right {
      transform: rotateY(90deg) rotateZ(-90deg) translateZ(50px);
    }

    .face-bottom {
      transform: rotateY(180deg) translateZ(50px);
    }

    .face-left {
      transform: rotateY(270deg) rotateZ(90deg) translateZ(50px);
    }

    .face-back {
      transform: rotateX(90deg) rotateZ(180deg) translateZ(50px);
    }

    .face-front {
      transform: rotateX(270deg) translateZ(50px);
    }
  }
</style>
