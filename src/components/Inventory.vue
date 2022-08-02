<script setup lang="ts">
  import { computed } from "@vue/reactivity";
  import { Ref, ref } from "vue";
  import { BlockTypeId } from "../types/BlockTypeId";
  import { toBlockName } from "../utils/filter";
  import BlockPreview from "./BlockPreview.vue";
  import { appStateStore } from "../store/modules/AppState";

  const label: Ref<BlockTypeId | null> = ref(null);
  const focusedBlockName = computed(() => {
    return label.value ? toBlockName(label.value) : "";
  });

  function showLabel(e: MouseEvent, id: BlockTypeId) {
    const target = e.target as HTMLElement;
    if (!target) return;

    const bounds = target.getBoundingClientRect();
    const distToLeft = bounds.left;
    const distToRight = window.innerWidth - bounds.right;

    const labelElem = target.querySelector(".label")! as HTMLElement;
    labelElem.dataset.direction = distToLeft > distToRight ? "left" : "right";
    label.value = id;
  }

  function hideLabel() {
    label.value = null;
  }

  function closeInventory(event: MouseEvent) {
    if (!event.target) return;
    if ((event.target as HTMLElement).classList.contains("modal")) appStateStore.closeInventory();
  }
</script>

<template>
  <div class="modal" @click="closeInventory">
    <div class="inventory">
      <div class="search-bar">
        <label for="search-input">Search Items</label>
        <input type="text" id="search-input" />
      </div>
      <div class="slots">
        <div
          v-for="block in Object.values(BlockTypeId)"
          :key="block"
          class="slot"
          @mouseenter="showLabel($event, block)"
          @mouseleave="hideLabel"
        >
          <block-preview :block-type-id="block" />
          <div class="label">{{ focusedBlockName }}</div>
        </div>
      </div>
      <div class="hot-bar">
        <div v-for="item in appStateStore.hotBarItems" class="slot">
          <block-preview :block-type-id="item" />
        </div>
      </div>
      <div class="top-left-corner"></div>
      <div class="top-right-corner"></div>
      <div class="bottom-right-corner"></div>
      <div class="bottom-left-corner"></div>
      <div class="top-left-shadow"></div>
      <div class="top-right-shadow"></div>
      <div class="bottom-right-shadow"></div>
      <div class="bottom-left-shadow"></div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .modal {
    position: fixed;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    background: rgba(0, 0, 0, 0.7);
  }

  .inventory {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 20px;
    background: red;
    background: #c6c6c6;
    border: 3px solid black;
    box-shadow: -6px -6px 0 0 rgba(black, 0.6) inset, 6px 6px 0 0 rgba(white, 1) inset;
    clip-path: polygon(
      3px 0%,
      calc(100% - 9px) 0%,
      calc(100% - 9px) 3px,
      calc(100% - 6px) 3px,
      calc(100% - 6px) 6px,
      calc(100% - 3px) 6px,
      calc(100% - 3px) 9px,
      100% 9px,
      100% calc(100% - 6px),
      calc(100% - 3px) calc(100% - 6px),
      calc(100% - 3px) calc(100% - 3px),
      calc(100% - 6px) calc(100% - 3px),
      calc(100% - 6px) 100%,
      9px 100%,
      9px calc(100% - 3px),
      6px calc(100% - 3px),
      6px calc(100% - 6px),
      3px calc(100% - 6px),
      3px calc(100% - 9px),
      0% calc(100% - 9px),
      0% 6px,
      3px 6px,
      3px 3px,
      6px 3px,
      6px 0%
    );

    .search-bar {
      display: flex;
      align-items: center;
      margin-bottom: 9px;

      label {
        flex-shrink: 0;
        width: 180px;
        font-size: 21px;
        transform: translateY(-0.15em);
        color: #414141;
      }

      #search-input {
        width: 100%;
        box-shadow: 3px 3px 0 0 rgba(black, 0.6) inset, -3px -3px 0 0 rgba(white, 1) inset;
        border: 0;
        padding: 6px 10px 10px 10px;
        background: #8a8a8a;
        color: white;
        text-shadow: 2px 2px black;
        font-size: 18px;

        &:hover:not(:focus) {
          background: rgba(255, 255, 255, 0.5);
        }

        &:focus {
          outline: 0;
        }
      }
    }

    .slots {
      display: flex;
      flex-wrap: wrap;
      height: 60px * 5;
      width: 60px * 9;
      overflow: auto;
    }

    .hot-bar {
      display: flex;
      margin-top: 20px;
    }

    .label {
      display: none;
      pointer-events: none;
      position: absolute;
      background: black;
      color: white;
      z-index: 1;
      top: 0;
      padding: 5px 10px;
      white-space: nowrap;
      // width: max-content;
      // max-width: 200px;

      &[data-direction="right"] {
        left: 100%;
      }

      &[data-direction="left"] {
        right: 100%;
        text-align: right;
      }
    }

    .slot {
      position: relative;
      width: 60px;
      height: 60px;
      box-shadow: 3px 3px 0 0 rgba(black, 0.6) inset, -3px -3px 0 0 rgba(white, 1) inset;
      background: #8a8a8a;

      &:hover {
        background: rgba(255, 255, 255, 0.5);

        .label {
          display: inline-block;
        }
      }
    }

    .block-preview {
      overflow: visible;
    }

    [class*="corner"],
    [class*="shadow"] {
      position: absolute;
      pointer-events: none;
      background: black;
    }

    [class*="shadow"] {
      width: 3px;
      height: 3px;
    }

    .top-left-corner {
      left: 0;
      top: 0;
      width: 3px;
      height: 3px;
    }

    .top-right-corner {
      right: 0;
      top: 0;
      width: 6px;
      height: 6px;
      clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 50% 100%, 50% 50%, 0% 50%);
    }

    .bottom-right-corner {
      right: 0;
      bottom: 0;
      width: 3px;
      height: 3px;
    }

    .bottom-left-corner {
      left: 0;
      bottom: 0;
      width: 6px;
      height: 6px;
      clip-path: polygon(0% 0%, 50% 0%, 50% 50%, 100% 50%, 100% 100%, 0% 100%);
    }

    .top-left-shadow {
      background: white;
      left: 6px;
      top: 6px;
    }

    .top-right-shadow {
      background: white;
      right: 3px;
      top: 3px;
    }

    .bottom-right-shadow {
      background: rgba(black, 0.6);
      right: 6px;
      bottom: 6px;
    }

    .bottom-left-shadow {
      background: rgba(white, 0.6);
      left: 3px;
      bottom: 3px;
    }
  }
</style>
