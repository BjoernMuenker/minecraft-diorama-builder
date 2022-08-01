<script setup lang="ts"></script>

<template>
  <button class="app-button">
    <slot />
  </button>
</template>

<style lang="scss" scoped>
  .app-button {
    cursor: pointer;
    outline: 0;
    font-family: "Minecraft";
    position: relative;
    display: inline-block;
    border: 3px solid black;
    padding: 4px 20px 10px;
    background: #999;
    color: white;
    text-shadow: 2px 2px 0px black;
    font-size: 18px;

    &::before,
    &::after {
      position: absolute;
      content: "";
      top: 0;
      left: 0;
      width: calc(100% - 3px);
      height: calc(100% - 5px);
    }

    &::before {
      border-top: 3px solid #cdcdcd;
      border-left: 3px solid #cdcdcd;
    }

    &::after {
      border-bottom: 5px solid #777;
      border-right: 3px solid #777;
    }

    &:focus {
      outline: 0;
    }
  }
</style>
