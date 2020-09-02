import Vue from 'vue'
import Router from 'vue-router'
import store from "../store"
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

//路由独享守卫判断
function beforeEnter(url, next) {
  store.state.user.info.menus_url.some(item => item == url) ? next() : next("/")
}
export const indexRouter = [{
    path: "banner",
    component: banner,
    name:"轮播图管理",
    beforeEnter(to, from, next) {
      beforeEnter("/banner", next)
    }
  },
  {
    path: "goods",
    component: goods,
    name:"商品管理",
    beforeEnter(to, from, next) {
      beforeEnter("/goods", next)
    }
  },
  {
    path: "classify",
    component: classify,
    name:"分类管理",
    beforeEnter(to, from, next) {
      beforeEnter("/classify", next)
    }
  },
  {
    path: "manage",
    component: manage,
    name:"管理员管理",
    beforeEnter(to, from, next) {
      beforeEnter("/manage", next)
    }
  },
  {
    path: "member",
    component: member,
    name:"会员管理",
    beforeEnter(to, from, next) {
      beforeEnter("/member", next)
    }
  },
  {
    path: "menu",
    component: menu,
    name:"菜单管理",
    beforeEnter(to, from, next) {
      beforeEnter("/menu", next)
    }
  },
  {
    path: "role",
    component: role,
    name:"角色管理",
    beforeEnter(to, from, next) {
      beforeEnter("/role", next)
    }
  },
  {
    path: "seckill",
    component: seckill,
    name:"秒杀管理",
    beforeEnter(to, from, next) {
      beforeEnter("/seckill", next)
    }
  },
  {
    path: "spec",
    component: spec,
    name:"商品规格",
    beforeEnter(to, from, next) {
      beforeEnter("/spec", next)
    }
  },
]
const router = new Router({
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

//全局登录拦截

router.beforeEach((to,from,next)=>{
  //如果取得是登录 next
  if(to.path==="/login"){
    next();
    return;
  }

  //如果取得不是登录,就判断是否登陆过了,登录过了就放行
  if(store.state.user.info.id){
    next();
    return;
  }
  //去的不是登录，也没有登录过
  next("/login")
})
export default router
