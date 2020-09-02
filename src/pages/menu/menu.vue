<template>
  <div>
    <!-- 添加菜单按钮 -->
    <el-button type="primary" @click="wallAdd">添加</el-button>
    <!-- 加载add组件 -->
    <v-add :info="info" @hide="hide" ref="add"></v-add>
    <!-- 加载list列表数据组件 -->
    <v-list @emit="emit($event)"></v-list>
  </div>
</template>
<script>
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
    vList
  },
  methods: {
    // 弹框消失
    hide() {
      this.info.isShow = false;
    },
    //点击了添加按钮
    wallAdd() {
      this.info = {
        isShow: true,
        title: "添加菜单",
        isAdd: true,
      };
    },
    //触发了编辑按钮
    emit(id){
      this.info = {
        isShow:true,
        title:"修改菜单",
        isAdd:false
      }
      this.$refs.add.look(id)
    }
  },
  mounted() {},
  beforeDestroy() {},
};
</script>
<style>
</style>