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
      <el-table-column prop="id" label="规格编号" sortable></el-table-column>
      <el-table-column prop="specsname" label="规格名称" sortable></el-table-column>
      <el-table-column prop label="规格属性" width="350">
        <template slot-scope="scope">
          <el-tag type="success" v-for="item in scope.row.attrs" :key="item">{{item}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="状态">
        <template slot-scope="scope">
          <el-button type="primary" v-if="scope.row.status==1">启用</el-button>
          <el-button type="info" v-else>禁用</el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="primary" @click="edit(scope.row.id)">编辑</el-button>
          <v-del @confirm="del(scope.row.id)"></v-del>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :page-size="size"
      layout="prev, pager, next"
      :total="total"
      :current-page="page"
      @current-change="changeCurrentPage"
    ></el-pagination>
  </div>
</template>
<script>
//引入vuex辅助函数
import { mapGetters, mapActions } from "vuex";
//引入封装好的弹窗
import { successAlert, warningAlert } from "../../../util/alert";
//引入删除数据的请求
import { reqspecsDel } from "../../../util/requset";
export default {
  computed: {
    ...mapGetters({
      list: "spec/list",
      size: "spec/size",
      total: "spec/total",
      page: "spec/page",
    }),
  },
  data() {
    return {};
  },
  components: {},
  methods: {
    ...mapActions({
      reqList: "spec/reqListAction",
      reqtotal: "spec/reqListNum",
      changePageAction: "spec/changePageAction",
    }),
    //点击了编辑按钮
    edit(id) {
      this.$emit("emit", id);
    },
    //点击了删除
    del(id) {
      reqspecsDel({ id: id }).then((res) => {
        if (res.data.code == 200) {
          successAlert("删除成功");
          this.reqtotal();
          //页码设置成第一页
          this.changePageAction(1)
        } else {
          warningAlert(res.data.msg);
        }
      });
    },
    //修改当前页码
    changeCurrentPage(p){
      //修改vuex里面的页码
      this.changePageAction(p)
    }
  },
  mounted() {
    //挂载完成发请求
    this.reqList();
    this.reqtotal()
    console.log(this.size);
  },
  beforeDestroy() {},
};
</script>
<style>
</style>