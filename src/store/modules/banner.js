import {
    reqbannerList
  } from '@/util/requset'
  const state = {
    //菜单列表
    list: []
  }
  
  const mutations = {
    //修改list
    changeList(state, arr) {
      state.list = arr;
    }
  }
  
  const actions = {
    //请求
    reqListAction(context) {
        reqbannerList({
        istree: true
      }).then(res => {
        context.commit("changeList", res.data.list)
      })
    }
  }
  const getters = {
    list(state) {
      return state.list
    }
  }
  export default {
    state,
    mutations,
    actions,
    getters,
    //命名空间
    namespaced: true
  }
  