<script setup lang="ts">
  import { computed } from "@vue/reactivity";
  import { onMounted, Ref, ref } from "vue";
  import { BlockTypeId } from "../types/BlockTypeId";
  import { toBlockName } from "../utils/filter";
  import BlockPreview from "./BlockPreview.vue";
  import { appStateStore } from "../store/modules/AppState";
  import { gsap } from "gsap";
  import { Draggable } from "gsap/Draggable";

  const label: Ref<BlockTypeId | null> = ref(null);
  const inventoryRef: Ref<HTMLElement | null> = ref(null);
  const scrollWrapperRef: Ref<HTMLElement | null> = ref(null);
  const scrollBarHandlerRef: Ref<HTMLElement | null> = ref(null);
  const focusedBlockName = computed(() => {
    return label.value ? toBlockName(label.value) : "";
  });

  onMounted(() => {
    scrollWrapperRef.value?.addEventListener("scroll", onScroll, true);
    setScrollBarHandlerHeight();

    gsap.registerPlugin(Draggable);

    const dropZones = inventoryRef.value?.querySelectorAll(".hot-bar .slot") as NodeListOf<HTMLElement>;
    const scrollBarInner = document.querySelector(".scroll-bar .inner");
    const scrollBarHandlerHeight = scrollBarHandlerRef.value!.clientHeight;
    const hitTestTreshold = "20%";
    const willDropClass = "will-drop";

    // needs some more work
    // Draggable.create(scrollBarHandlerRef.value, {
    //   type: "y",
    //   bounds: scrollBarInner,
    //   onDrag: function () {
    //     const scrollPercentage = (this.y / (scrollBarInner!.clientHeight - scrollBarHandlerHeight)) * 100;
    //     scrollWrapperRef.value!.scrollTop = (scrollWrapperRef.value!.scrollHeight / 100) * scrollPercentage;
    //   },
    // });

    Draggable.create("[draggable]", {
      bounds: inventoryRef.value,
      onDrag: function () {
        dropZones.forEach((zone) => zone.classList.remove(willDropClass));
        for (let i = 0; i < dropZones.length; i++) {
          if (Draggable.hitTest(this.target, dropZones[i], hitTestTreshold)) {
            dropZones[i].classList.add(willDropClass);
            break;
          }
        }
      },
      onDragEnd: function () {
        for (let i = 0; i < dropZones.length; i++) {
          if (Draggable.hitTest(this.target, dropZones[i], hitTestTreshold)) {
            const blockTypeId = this.target.dataset.blockTypeId;
            appStateStore.updateHotBarItem({ index: i, blockTypeId });
            dropZones[i].classList.remove(willDropClass);
            break;
          }
        }
        gsap.set(this.target, { autoAlpha: 0, clearProps: "transform" });
      },
    });
  });

  function triggerDrag(event: MouseEvent | TouchEvent, index: number) {
    const clone = inventoryRef.value?.querySelector(`.clones .block-preview:nth-child(${index + 1})`) as HTMLElement;
    if (!clone) return;

    const { left, top } = getDistanceToWrapper(event.target as HTMLElement);
    gsap.set(clone, { left, top, autoAlpha: 1 });

    const draggableInstance = Draggable.get(clone);
    draggableInstance.startDrag(event);
  }

  function getDistanceToWrapper(element: HTMLElement) {
    var e1Rect = element.getBoundingClientRect();
    var e2Rect = scrollWrapperRef.value!.getBoundingClientRect();
    const left = e1Rect.left - e2Rect.left;
    const top = e1Rect.top - e2Rect.top;
    return { left, top };
  }

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

  function onScroll(event: Event) {
    const wrapper = scrollWrapperRef.value!;
    scrollBarHandlerRef.value!.style.top = (wrapper.scrollTop / wrapper.scrollHeight) * 100 + "%";
  }

  function setScrollBarHandlerHeight() {
    if (!scrollBarHandlerRef.value || !scrollWrapperRef.value) return;
    const fullHeight = scrollWrapperRef.value.scrollHeight;
    const visibleHeight = scrollWrapperRef.value.clientHeight;
    const visiblePercentage = (visibleHeight / fullHeight) * 100;
    scrollBarHandlerRef.value.style.height = visiblePercentage + "%";
  }
</script>

<template>
  <div class="modal" @click="closeInventory">
    <div class="inventory" ref="inventoryRef">
      <div class="main">
        <div class="search-bar">
          <label for="search-input">Search Items</label>
          <input type="text" id="search-input" />
        </div>
        <div class="clones">
          <block-preview v-for="block in Object.values(BlockTypeId)" :key="block" :block-type-id="block" draggable="true" />
        </div>
        <div class="slots" ref="scrollWrapperRef">
          <div
            v-for="(block, index) in Object.values(BlockTypeId)"
            :key="block"
            class="slot"
            @mouseenter="showLabel($event, block)"
            @mouseleave="hideLabel"
          >
            <block-preview
              :block-type-id="block"
              @mousedown="triggerDrag($event, index)"
              @touchstart="triggerDrag($event, index)"
            />
            <div class="label">{{ focusedBlockName }}</div>
          </div>
        </div>
        <div class="hot-bar">
          <div v-for="item in appStateStore.hotBarItems" class="slot">
            <block-preview :block-type-id="item" />
          </div>
        </div>
      </div>
      <div class="scroll-bar">
        <div class="inner">
          <div class="handler" ref="scrollBarHandlerRef"></div>
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
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .inventory {
    position: relative;
    display: flex;
    padding: 20px;
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

    .scroll-bar {
      position: relative;
      margin-left: 20px;
      box-shadow: 3px 3px 0 0 rgba(black, 0.6) inset, -3px -3px 0 0 white inset;
      background: #8a8a8a;
      width: 40px;
      height: inherit;
      .inner {
        position: absolute;
        left: 3px;
        top: 3px;
        height: calc(100% - 6px);
        width: calc(100% - 6px);
      }

      .handler {
        position: absolute;
        top: 0;
        height: 100px;
        width: 100%;
        background: #c6c6c6;
        box-shadow: -3px -3px 0 0 rgba(black, 0.6) inset, 3px 3px 0 0 white inset;

        &::after {
          position: absolute;
          content: "";
          width: calc(100% - 12px);
          height: calc(100% - 12px);
          top: 6px;
          left: 6px;
          background: repeating-linear-gradient(#8d8d8d, #8d8d8d 3px, #c6c6c6 3px, #c6c6c6 6px);
        }
      }
    }

    .clones {
      position: absolute;

      .block-preview {
        position: absolute;
        opacity: 0;
        visibility: hidden;
      }
    }

    .slots {
      display: flex;
      flex-wrap: wrap;
      height: 60px * 3;
      width: 60px * 9;
      overflow: auto;
      z-index: 10;
      -ms-overflow-style: none;
      scrollbar-width: none;

      &::-webkit-scrollbar {
        display: none;
      }
    }

    .hot-bar {
      display: flex;
      margin-top: 20px;
      bottom: 20px;
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
      user-select: none;

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

      &:hover,
      &.will-drop {
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
