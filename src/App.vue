<script setup lang="ts">
  import { computed, ref, onBeforeUnmount, onMounted } from "vue";
  import { appStateStore } from "./store/modules/AppState";
  import { GLOBAL_CONFIG } from "./config/globalConfig";
  import HotBar from "./components/HotBar.vue";
  import Block from "./components/PlacedBlock.vue";
  import GroundTiles from "./components/GroundTiles.vue";
  import Inventory from "./components/Inventory.vue";

  const wrapperElem = ref(null);

  onMounted(() => {
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("contextmenu", onContextMenu);
  });

  onBeforeUnmount(() => {
    document.addEventListener("keydown", onKeyDown);
  });

  const debug = computed(() => {
    return appStateStore.debug;
  });

  function onContextMenu(event: MouseEvent) {
    if (!debug.value) event.preventDefault();
  }

  function onKeyDown(event: KeyboardEvent) {
    switch (event.key) {
      case "Dead":
        appStateStore.setDebugMode(!appStateStore.debug);
        break;

      case "Escape":
        if (appStateStore.inventoryOpen) {
          appStateStore.closeInventory();
        } else {
          appStateStore.removeAllBlocks();
        }
        appStateStore.playSound("click");
        break;

      case "e":
        appStateStore.toggleInventory();
        break;

      case "r":
        if (!wrapperElem.value) return;
        const elem = wrapperElem.value as HTMLElement;

        let { rotateX, rotateY, rotateZ } = elem.dataset;
        if (!rotateX || !rotateY || !rotateZ) return;

        rotateZ = (parseInt(rotateZ) + 90).toString();
        elem.dataset.rotateZ = rotateZ.toString();

        elem.style.transform = `
          rotateX(${parseInt(rotateX)}deg)
          rotateY(${parseInt(rotateY)}deg)
          rotateZ(${parseInt(rotateZ)}deg)
        `;

        appStateStore.playSound("click");
        break;

      default:
        break;
    }
  }
</script>

<template>
  <div v-if="debug" class="debug">
    <div>placedBlocks: {{ appStateStore.placedBlocks.length }}</div>
    <div>vertices: {{ appStateStore.placedBlocks.length * 6 + GLOBAL_CONFIG.MAX_BLOCKS.X * GLOBAL_CONFIG.MAX_BLOCKS.Y }}</div>
  </div>

  <div class="canvas-wrapper">
    <div class="perspective-wrapper">
      <div class="rotation-wrapper" ref="wrapperElem" data-rotate-x="70" data-rotate-y="0" data-rotate-z="45">
        <ground-tiles />
        <block v-for="block in appStateStore.placedBlocks" :block="block" />
      </div>
    </div>
  </div>

  <div class="ui">
    <hot-bar />
  </div>

  <inventory v-if="appStateStore.inventoryOpen" />
</template>

<style lang="scss">
  .ui {
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    pointer-events: none;

    * {
      pointer-events: all;
    }
  }

  .canvas-wrapper {
    position: fixed;
    width: 100%;
    height: 100%;

    &.hide-grid {
      .tile {
        background: transparent;
        box-shadow: none;

        &:hover {
          box-shadow: 0px 0px 0px 6px black inset;
        }
      }
    }
  }

  .perspective-wrapper {
    position: absolute;
    perspective: 6000px;
    left: 50%;
    bottom: 0;
    transform: translate(-50%, 8%);
  }

  .rotation-wrapper {
    transform-style: preserve-3d;
    transition: transform 0.5s;
    transform: rotateX(70deg) rotateY(0deg) rotateZ(45deg);
    // animation: rotate infinite linear 10s;
    // background-image: url(https://www.filterforge.com/filters/11635-v7.jpg);
    // background-size: 100px 100px;
    width: 800px;
    height: 800px;

    @keyframes rotate {
      to {
        transform: rotateX(70deg) rotateY(0deg) rotateZ(360deg);
      }
    }
  }

  .debug {
    position: absolute;
    top: 10px;
    left: 10px;
  }

  @mixin generate-color-classes {
    @each $name, $value in $colors {
      .background-#{$name},
      [data-background-color="#{$name}"] {
        background-color: $value;
      }

      .fill-#{$name},
      [data-fill-color="#{$name}"] {
        fill: $value;
      }

      .color-#{$name} {
        color: $value;
      }

      .border-#{$name} {
        border-color: $value;
      }
    }
  }

  @include generate-color-classes();

  @font-face {
    font-family: "Minecraft";
    src: url("/fonts/minecraft.woff2") format("woff2");
    src: url("/fonts/minecraft.woff") format("woff");
  }

  * {
    font-family: "Minecraft", monospace;
    font-variant-ligatures: none;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    box-sizing: border-box;
  }

  html,
  body {
    margin: 0;
    padding: 0;
  }
</style>
