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
</script>

<template>
  <div class="modal">
    <div class="inventory">
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
    background: grey;

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
      box-shadow: 0px 0px 0px 1px inset white;

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
  }
</style>
