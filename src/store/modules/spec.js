import {
  reqspecsList,
  reqspecsNum
} from "../../util/requset";

const state = {
  //管理员列表
  list: [],
  //每一页的条数 
  size: 2,
  // 当前访问页码
  page: 1,
  //管理员总数
  total: 1
}
const mutations = {
  //修改list
  changeList(state, arr) {
    state.list = arr
  },
  //修改管理员总数
  changeTotal(state, num) {
    state.total = num
  },
  //修改页面
  changePage(state, page) {
    state.page = page
  }
}

const actions = {
  reqListAction(context, bool) {
    let params = bool ? {} : {
      page: context.state.page,
      size: context.state.size,
    }
    reqspecsList(params).then(res => {
      let arr = res.data.list ? res.data.list : []
      arr.forEach(item => {
        item.attrs = JSON.parse(item.attrs)
      });
      context.commit("changeList", arr)
    })
  },
  //获取列表数据的总条数
  reqListNum(context) {
    reqspecsNum().then(res => {
      context.commit("changeTotal", res.data.list[0].total)
    })
  },
  //修改page
  changePageAction(context, page) {
    context.commit("changePage", page)
    //重新请求列表数据
    context.dispatch("reqListAction")
  }
}

const getters = {
  list(state) {
    return state.list
  },
  size(state) {
    return state.size
  },
  total(state) {
    return state.total
  },
  page(state) {
    return state.page
  }
}

export default {
  state,
  mutations,
  actions,
  getters,
  namespaced: true
}
