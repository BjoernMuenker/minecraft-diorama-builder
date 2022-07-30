import { VuexModule, Mutation, Module, getModule } from "vuex-module-decorators";
import { store } from "../";

@Module({ dynamic: true, store, namespaced: true, name: "AppStateStoreModule" })
class AppStateStoreModule extends VuexModule {
  private _debug = false;

  get debug() {
    return this._debug;
  }

  @Mutation
  setDebugMode(value: boolean) {
    this._debug = value;
  }
}

export const appStateStore = getModule(AppStateStoreModule);
