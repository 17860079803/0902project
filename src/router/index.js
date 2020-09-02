import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)
//设置懒加载,读取到该页面在加载该页面的路由
const login = () => import("../pages/login/login")
const index = () => import("../pages/index/index")
//二级路由组件
const home = () => import("../pages/home/home")
const banner = () => import("../pages/banner/banner")
const goods = () => import("../pages/goods/goods")
const classify = () => import("../pages/classify/classify")
const manage = () => import("../pages/manage/manage")
const member = () => import("../pages/member/member")
const menu = () => import("../pages/menu/menu")
const role = () => import("../pages/role/role")
const seckill = () => import("../pages/seckill/seckill")
const spec = () => import("../pages/spec/spec")

//首页下面的二级路由规则
export const indexRouter = [{
    path: "banner",
    component: banner,
    name:"轮播图管理"
  },
  {
    path: "goods",
    component: goods,
    name:"商品管理"
  },
  {
    path: "classify",
    component: classify,
    name:"分类管理"
  },
  {
    path: "manage",
    component: manage,
    name:"管理员管理"
  },
  {
    path: "member",
    component: member,
    name:"会员管理"
  },
  {
    path: "menu",
    component: menu,
    name:"菜单管理"
  },
  {
    path: "role",
    component: role,
    name:"角色管理"
  },
  {
    path: "seckill",
    component: seckill,
    name:"秒杀管理"
  },
  {
    path: "spec",
    component: spec,
    name:"商品规格"
  },
]
export default new Router({
  routes: [{
      path: "/",
      component: index,
      children: [{
        path: "",
        component: home,
      },
      ...indexRouter
    ]
    },
    {
      path: "/login",
      component: login
    }
  ]
})
