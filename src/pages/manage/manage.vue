<template>
  <div>
    <!-- 添加按钮 -->
    <el-button type="primary" @click="willAdd" v-preventReClick>添加</el-button>
    <!-- 添加弹框组件 -->
    <v-add :info="info" ref="add"></v-add>
    <!-- 列表组件 -->
    <v-list @edit="edit"></v-list>
  </div>
</template>
<script>
//引入两个组件 
import vAdd from "./components/add";
import vList from "./components/list";
export default {
  data() {
    return {
      //传递给子组件的信息
      info: {
        //添加弹框出现状态
        isShow: false,
        title: "添加管理员",
        isAdd: true,
      },
    };
  },
  components: {
    vAdd,
    vList,
  },
  methods: {
    //点击了添加
    willAdd() {
      this.info = {
        isShow: true,
        title: "添加管理员",
        isAdd: true,
      };
    },
    //当子组件点击了编辑按钮触发了父组件的编辑事件,父组件通知子组件展示编辑弹框,并且携带数据
    edit(id) {
      this.info = {
        isShow: true,
        title: "修改管理员",
        isAdd: false,
      };
      this.$refs.add.look(id);
    },
  },
  mounted() {},
  beforeDestroy() {},
};
</script>
<style>
</style>