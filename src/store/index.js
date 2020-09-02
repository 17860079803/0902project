import vue from "vue";
import vuex from "vuex"
vue.use(vuex)
import actions from "./actions"
import {state,mutations,getters} from '@/store/mutations'
//引入模块
import menu from "./modules/menu"//菜单管理
import role from "./modules/role"//角色管理
import manage from "./modules/manage"//管理员管理带分页
//导入会员列表分仓库
import member from './modules/member'
//导入cate分类管理仓库
import cate from "./modules/cate"
//导入spec规格属性仓库
import spec from '@/store/modules/spec'
//导入banner
import banner from '@/store/modules/banner'
//导入goods
import goods from '@/store/modules/goods'
//导入login
import user from '@/store/modules/user'
export default new vuex.Store({
  state,
  mutations,
  actions,
  getters, 
  modules: {
    menu,
    role,
    manage,
    member,
    cate,
    spec,
    banner,
    goods,
    user
  }
})
