<template>
  <h1>Change headline Update</h1>
  <div v-if="debug">debug is here</div>
</template>

<script setup lang="ts">
  import { computed, onBeforeUnmount, onMounted } from "vue";
  import { appStateStore } from "./store/modules/AppState";

  onMounted(() => {
    console.log("mounted App.vue");
    document.addEventListener("keydown", onKeyDown);
  });

  onBeforeUnmount(() => {
    document.addEventListener("keydown", onKeyDown);
  });

  const debug = computed(() => {
    return appStateStore.debug;
  });

  function onKeyDown(event: KeyboardEvent) {
    switch (event.key) {
      case "Dead":
        appStateStore.setDebugMode(!appStateStore.debug);
        break;

      default:
        break;
    }
  }
</script>

<style lang="scss">
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
    box-sizing: border-box;
  }

  html,
  body {
    margin: 0;
    padding: 0;
  }

  #app {
    font-family: "Minecraft", monospace;
    font-variant-ligatures: none;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
</style>
