import { createApp } from "vue";
import { store } from "./store";
import App from "./App.vue";
import filtersPlugin from "./plugins/filtersPlugin";

const app = createApp(App);

app.directive("click-outside", {
  mounted: (el, binding) => {
    (el as any).clickOutsideEvent = (event: Event) => {
      if (!event.target) return;
      if (!(el == event.target || el.contains(event.target as Node))) {
        binding.value();
      }
    };
    document.body.addEventListener("click", (el as any).clickOutsideEvent);
    document.body.addEventListener("touchstart", (el as any).clickOutsideEvent);
  },
  beforeUnmount: function (el) {
    document.body.removeEventListener("click", (el as any).clickOutsideEvent);
    document.body.removeEventListener("touchstart", (el as any).clickOutsideEvent);
  },
});

app.use(filtersPlugin);
app.use(store);
app.mount("#app");
