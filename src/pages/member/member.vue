<template>
  <div>
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
        title: "添加菜单",
        isAdd: true,
      },
    };
  },
  components: {
    vAdd,
    vList,
  },
  methods: {
    //当子组件点击了编辑按钮触发了父组件的编辑事件,父组件通知子组件展示编辑弹框,并且携带数据
    edit(id) {
      this.info = {
        isShow: true,
        title: "修改会员",
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