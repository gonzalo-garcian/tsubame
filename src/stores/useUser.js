import { defineStore } from "pinia";

export let useUserStore = defineStore("user", {
  state() {
    return {
      currentProject: null,
      id: null,
    };
  },
  actions: {},
});
