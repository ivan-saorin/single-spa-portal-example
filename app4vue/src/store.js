import Vuex from "vuex";
import Vue from "vue";

Vue.use(Vuex);

export const storeInstance = new Vuex.Store({
  state: {
    count: 0
  },
  mutations: {
    INCREMENT(state) {
      state.count++;
    },
    DECREMENT(state) {
      state.count--;
    }
  },
  actions: {
    INCREMENT(context) {
      context.commit("INCREMENT");
    },
    DECREMENT(context) {
      context.commit("DECREMENT");
    }
  }
})
