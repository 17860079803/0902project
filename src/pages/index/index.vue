<template>
  <div>
    <el-container class="con">
      <el-aside width="200px">
        <!-- 左侧导航 -->
        <!-- router 启用路由模式 index直接对应path -->
        <el-menu
          router
          default-active="/"
          unique-opened
          class="el-menu-vertical-demo"
          background-color="#20222A"
          text-color="#fff"
          active-text-color="#ffd04b"
        >
          <el-menu-item index="/">
            <i class="el-icon-menu"></i>
            <span slot="title">首页</span>
          </el-menu-item>
          <div v-for="item in info.menus" :key="item.id">
            <!-- 这个是目录 -->
            <el-submenu v-if="item.children" :index="item.id+''">
              <template slot="title">
                <i :class="item.icon"></i>
                <span>{{item.title}}</span>
              </template>
              <el-menu-item-group>
                <el-menu-item :index="i.url" v-for="i in item.children" :key="i.id">{{i.title}}</el-menu-item>
              </el-menu-item-group>
            </el-submenu>

            <!-- 这个直接是菜单 -->
            <el-menu-item v-else :index="item.url">{{item.title}}</el-menu-item>
          </div>
          <!-- <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>系统设置</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="/menu">菜单管理</el-menu-item>
              <el-menu-item index="/role">角色管理</el-menu-item>
              <el-menu-item index="/manage">管理员管理</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
          <el-submenu index="2">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>商城管理</span>
            </template>
            <el-menu-item-group>
              <el-menu-item index="/classify">商品分类</el-menu-item>
              <el-menu-item index="/spec">商品规格</el-menu-item>
              <el-menu-item index="/goods">商品管理</el-menu-item>
              <el-menu-item index="/member">会员管理</el-menu-item>
              <el-menu-item index="/banner">轮播图管理</el-menu-item>
              <el-menu-item index="/seckill">秒杀活动</el-menu-item>
            </el-menu-item-group>
          </el-submenu>-->
        </el-menu>
      </el-aside>
      <el-container>
        <el-header>
          小U商城后台管理系统欢迎您
          <div class="con-box">
            <div class="name">{{info.username}}</div>
            <el-button class="btn" type="primary" @click="logout">退出</el-button>
          </div>
        </el-header>
        <el-main>
          <!-- 2级路由出口 -->
          <!-- 面包屑 -->
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>{{$route.name}}</el-breadcrumb-item>
          </el-breadcrumb>
          <router-view class="router"></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
export default {
  computed: {
    ...mapGetters({
      info: "user/info",
    }),
  },
  components: {},
  data() {
    return {};
  },
  methods: {
    ...mapActions({
      ...mapActions({
        changeInfoAction: "user/changeInfoAction",
      }),
      logout() {
        this.changeInfoAction({});
        this.$router.push("/login");
      },
    }),
  },
  mounted() {},
};
</script>
<style scoped>
.con {
  height: 100vh;
}
.el-aside {
  background: #20222a;
}
.el-header {
  background: #b3c0d1;
}
.router {
  margin: 15px 0;
}
.el-header {
  font-size: 25px;
  line-height: 60px;
  color: #fff;
}
.view {
  padding-top: 30px;
}
.con-box {
  float: right;
}
.name {
  line-height: 60px;
  color: #ffffff;
  float: left;
  margin-right: 20px;
}
.btn {
  float: left;
  margin-top: 10px;
}
</style>