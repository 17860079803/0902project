<template>
  <div>
    <el-table
      :data="list"
      style="width: 90%;margin:10px auto;margin-bottom: 20px;"
      row-key="id"
      border
      default-expand-all
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >
      <el-table-column prop="id" label="菜单编号" sortable width="180"></el-table-column>
      <el-table-column prop="title" label="菜单名称" sortable width="180"></el-table-column>
      <el-table-column prop label="菜单图标">
        <template slot-scope="scope">
          <i :class="scope.row.icon"></i>
        </template>
      </el-table-column>
      <el-table-column prop="url" label="地址"></el-table-column>
      <el-table-column label="状态">
        <template slot-scope="scope">
          <el-button type="primary" v-if="scope.row.status==1">启用</el-button>
          <el-button type="info" v-else>禁用</el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="primary" @click="edit(scope.row.id)">编辑</el-button>
          <el-button type="danger" @click="del(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
//引入vuex辅助函数
import { mapGetters, mapActions } from "vuex";
//引入封装好的弹窗
import { successAlert, warningAlert } from "../../../util/alert";
//引入删除数据的请求
import { reqMenuDel } from "../../../util/requset";
export default {
  computed: {
    ...mapGetters({
      list: "menu/list",
    }),
  },
  data() {
    return {};
  },
  components: {},
  methods: {
    ...mapActions({
      reqList: "menu/reqListAction",
    }),
    //点击了编辑按钮
    edit(id) {
      this.$emit("emit", id);
    },
    //点击了删除
    del(id) {
      this.$confirm("你确定要删除吗?", "提示", {
        confirmButtonText: "删除",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          reqMenuDel({ id: id }).then((res) => {
            if (res.data.code == 200) {
              successAlert("删除成功");
              this.reqList();
            } else {
              warningAlert(res.data.msg);
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
  },
  mounted() {
    //挂载完成发请求
    this.reqList();
  },
  beforeDestroy() {},
};
</script>
<style>
</style>