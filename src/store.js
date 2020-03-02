'use strict'

import Vue from 'vue'
import Vuex from 'vuex'

import { createPersistedState, createSharedMutations } from 'vuex-electron'

Vue.use(Vuex)
export default new Vuex.Store({
  state: {
    mails: []
  },
  mutations: {
    addMail (state, payload) {
      state.mails.unshift(payload.mail);
    },
    deleteMail (state, payload) {
      state.mails.splice(payload.index, 1);
    }
  },
  actions: {
    addMail (context, { mail }) {
      return context.commit('addMail', {
        mail: mail
      });
    },
    deleteMail (context, { index }) {
      return context.commit('deleteMail', {
        index: index
      });
    }
  },
  getters: {},
  plugins: [
    createPersistedState(),
    createSharedMutations()
  ]
})
