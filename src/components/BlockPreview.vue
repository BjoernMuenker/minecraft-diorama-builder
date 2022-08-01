<script setup lang="ts">
  import { BlockTypeId } from "../types/BlockTypeId";

  const props = defineProps<{
    blockTypeId: BlockTypeId;
  }>();
</script>

<template>
  <div class="block-preview">
    <div class="face-top" :class="[`texture-${blockTypeId}`, `texture-${blockTypeId}_side`, `texture-${blockTypeId}_top`]"></div>
    <div class="face-left" :class="[`texture-${blockTypeId}`, `texture-${blockTypeId}_side`]"></div>
    <div class="face-right" :class="[`texture-${blockTypeId}`, `texture-${blockTypeId}_side`]"></div>
  </div>
</template>

<style lang="scss" scoped>
  .block-preview {
    position: relative;
    width: 60px;
    height: 54px;
    overflow: hidden;
    [class*="face"] {
      transform-origin: 0 0;
      position: absolute;
      width: 24px;
      height: 24px;
      background-size: calc(22 * 24px) calc(21 * 24px);
      image-rendering: pixelated;
    }
    .face-left {
      transform: rotate(-30deg) skewX(-30deg) translate(36px, 43px) scaleY(0.864);
    }
    .face-top {
      transform: rotate(210deg) skew(-30deg) translate(-50px, -12px) scaleY(0.864);
    }
    .face-right {
      transform: skewY(30deg) scaleX(0.864) translate(12px, 14px);
    }
  }
</style>
