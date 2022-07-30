import { Store } from "vuex";

declare module "@vue/runtime-core" {
  // declare your own store states
  interface State {
    count: number;
  }

  // provide typings for `this.$store`
  interface ComponentCustomProperties {
    $store: Store<State>;
    $filters: {
      capitalizeFirstLetter: (string: string) => string;
      toKebabCase: (string: string) => string;
      toPascalCase: (string: string) => string;
    };
    $modal: ModalWindowService;
  }
}
