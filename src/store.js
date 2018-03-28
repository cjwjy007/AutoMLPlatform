import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)


export default new Vuex.Store({
  modules: {
    graph: {
      namespaced: true,
      state: {
        curGraph: {
          'id': 'canvas'
        },
        curComp: null
      },
      actions: {
        setCurrentGraph(store, data) {
          store.commit('CURGRAPH', data);
        },
        setCurrentComp(store, data) {
          store.commit('CURCOMP', data);
        }
      },
      mutations: {
        CURGRAPH(state, action) {
          state.curGraph = action;
        },
        CURCOMP(state, action) {
          state.curComp = action;
        },
        CLEARGRAPH(state) {
          state.curGraph = null;
        },
        CLEARCOMP(state) {
          state.curComp = null;
        }
      }
    },
  }
})
