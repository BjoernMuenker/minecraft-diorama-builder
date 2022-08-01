<script setup lang="ts">
  import { computed } from "@vue/reactivity";
  import { appStateStore } from "../store/modules/AppState";
  import { toBlockName } from "../utils/filter";
  import BlockPreview from "./BlockPreview.vue";

  const selectedBlockName = computed(() => {
    return toBlockName(appStateStore.selectedBlockTypeId);
  });
</script>

<template>
  <div class="hot-bar">
    <div class="selected-block-type">{{ selectedBlockName }}</div>
    <div
      v-for="block in appStateStore.hotBarItems"
      class="quick-slot"
      :class="{ active: block === appStateStore.selectedBlockTypeId }"
      @mouseenter="appStateStore.setSelectedBlockTypeId(block)"
    >
      <block-preview :block-type-id="block" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .hot-bar {
    position: absolute;
    bottom: 3px;
    background: grey;
    width: 540px;
    height: 60px;
    display: flex;
    left: 50%;
    transform: translateX(-50%);
    background-size: cover;
    image-rendering: pixelated;
    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAALQAAAAUCAYAAAAk0RfcAAAACXBIWXMAAAsTAAALEwEAmpwYAAAIkmlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNy4yLWMwMDAgNzkuNTY2ZWJjNWI0LCAyMDIyLzA1LzA5LTA4OjI1OjU1ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0RXZ0PSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VFdmVudCMiIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczpwaG90b3Nob3A9Imh0dHA6Ly9ucy5hZG9iZS5jb20vcGhvdG9zaG9wLzEuMC8iIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIDIzLjQgKE1hY2ludG9zaCkiIHhtcDpDcmVhdGVEYXRlPSIyMDIyLTA3LTI1VDIyOjA5OjI0KzAyOjAwIiB4bXA6TWV0YWRhdGFEYXRlPSIyMDIyLTA3LTI1VDIyOjA5OjM0KzAyOjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyMi0wNy0yNVQyMjowOTozNCswMjowMCIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NWQxMzU2MWMtZTFjNS00ZGYzLWEzNTctNGZjYTM1ZmE0MTA5IiB4bXBNTTpEb2N1bWVudElEPSJhZG9iZTpkb2NpZDpwaG90b3Nob3A6OWI5Yzk5MGItODVkZS1mYTRmLWI4MzUtOWU1MTM4MTYwZmUxIiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6ZjgyNmIwZjktYmZjZS00NTc0LWFjNjYtZGFlM2ZhOWNlZThjIiBwaG90b3Nob3A6Q29sb3JNb2RlPSIzIj4gPHhtcE1NOkhpc3Rvcnk+IDxyZGY6U2VxPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0iY3JlYXRlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDpmODI2YjBmOS1iZmNlLTQ1NzQtYWM2Ni1kYWUzZmE5Y2VlOGMiIHN0RXZ0OndoZW49IjIwMjItMDctMjVUMjI6MDk6MjQrMDI6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCAyMy40IChNYWNpbnRvc2gpIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDo5ZWRkNTA5Yi0wNWUyLTQ0YjEtYWU1NS1lMjhmZmI1NTYxZDIiIHN0RXZ0OndoZW49IjIwMjItMDctMjVUMjI6MDk6MzQrMDI6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCAyMy40IChNYWNpbnRvc2gpIiBzdEV2dDpjaGFuZ2VkPSIvIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJjb252ZXJ0ZWQiIHN0RXZ0OnBhcmFtZXRlcnM9ImZyb20gYXBwbGljYXRpb24vdm5kLmFkb2JlLnBob3Rvc2hvcCB0byBpbWFnZS9wbmciLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249ImRlcml2ZWQiIHN0RXZ0OnBhcmFtZXRlcnM9ImNvbnZlcnRlZCBmcm9tIGFwcGxpY2F0aW9uL3ZuZC5hZG9iZS5waG90b3Nob3AgdG8gaW1hZ2UvcG5nIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDo1ZDEzNTYx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);

    &::before {
      position: absolute;
      content: "";
      top: -3px;
      left: -3px;
      width: calc(100% + 0px);
      height: calc(100% + 0px);
      border: 3px solid black;
    }

    .quick-slot {
      position: relative;
      width: 60px;
      height: 60px;
      flex-shrink: 0;
      cursor: pointer;

      &.active::before,
      &:hover::before {
        content: "";
        position: absolute;
        width: calc(100% + 12px);
        height: calc(100% + 12px);
        top: -6px;
        left: -6px;
        background-size: cover;
        image-rendering: pixelated;
        background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAACP0lEQVRIibWWy4rUQBSGv7ql0j3S42QvoojPouBGX8GFWxmUQfAtfAJB1+5cKONlIYh4GxHBpRtBGaaZmZ5OJZVUuYiptplZ2Zl/E5Ii5/vPqZxTEUDkFKW11k+899dDCFRVhVCCn+UPzk8u8f33VwCqqiLLMoQQGGPw3gOglKJtW5xz5Hm+FPj9uw/cvHHriQZo25bHTx+mxbquybI36T7GyGQyYXd3F2st0+mUoihwzmGtpaoqrLUAjEYjyrJk+9mLLgMA33aOXm2/ps/EWktd1xhjEEIkWO9aCIH3Hq01IQSklABcvXYFrXV6RwPkWZdeCIGHDx4tov2HNrdux88fd9K9BPj2a4e1tbVV4iZtbGwApJLJfuHo6GgQwOHhIdDt2xJgaNV1vQAM5f4kSWCw+vf6tyckgBDiWKP8r5RSOOcoy3IBiDHinBsEkGUZAEVRLADGGACaplkZ0Ds/ODhYALz3SCnTzg+h3rSErilCCCmtISWhm5awqN+q8t6nmCmDpmmYzWaDAIwx6auUAHt7e2itU5uvorquUUot78FoNGI2mw1SojzPadt2eVRIKRmPx2mmr6ILZy8TQmA+nwN/zwMhBFJK7tzbZOv+3diDlFKUZYmUEq01bduilDoxsDGGc2cuEmNMhhOgH607n74wHo+ZTqfkeZ6eO+coioL5fE7TNGitU+Ae2l3fEkJYOgE1dAf0i+cvkxPoJqxSKjm21iKEODZSYozkeU5VVayvr7O/v09ZlikDwSn/tvwBTZD5ifEzNAsAAAAASUVORK5CYII=);
      }
    }

    .selected-block-type {
      position: absolute;
      top: -40px;
      width: 100%;
      text-align: center;
      font-size: 18px;
    }
  }

  .tile {
    position: absolute;
    width: 100px;
    height: 100px;
    cursor: pointer;
    box-shadow: 0px 0px 0px 2px inset white;
    // border: 2px solid #eee;
    background: #ccc;

    &:hover {
      animation: blink infinite 1s;
    }
  }
</style>
