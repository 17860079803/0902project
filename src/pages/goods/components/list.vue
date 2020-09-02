<template>
  <div>
    <el-table
      :data="list"
      style="width: 90%;margin:10px auto;margin-bottom: 20px;"
      row-key="id"
      border
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >
      <el-table-column prop="id" label="编号" sortable></el-table-column>
      <el-table-column prop="goodsname" label="名称" sortable width="180"></el-table-column>
      <el-table-column label="图片">
        <template slot-scope="scope">
          <img :src="$preImg+scope.row.img" alt />
        </template>
      </el-table-column>
      <el-table-column label="新品">
        <template slot-scope="scope">
          <el-button type="primary" v-if="scope.row.isnew==1">是</el-button>
          <el-button type="danger" v-else>否</el-button>
        </template>
      </el-table-column>
      <el-table-column label="热卖">
        <template slot-scope="scope">
          <el-button type="primary" v-if="scope.row.ishot==1">是</el-button>
          <el-button type="danger" v-else>否</el-button>
        </template>
      </el-table-column>

      <el-table-column label="状态">
        <template slot-scope="scope">
          <el-button type="primary" v-if="scope.row.status==1">启用</el-button>
          <el-button type="info" v-else>禁用</el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200px">
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
import { mapGetters, mapActions } from "vuex";
import { reqgoodsDel } from "../../../util/requset";
import { successAlert, warningAlert } from "../../../util/alert";
export default {
  components: {},
  computed: {
    ...mapGetters({
      list: "goods/list",
      size: "goods/size",
      total: "goods/total",
      page: "goods/page",
    }),
  },
  data() {
    return {};
  },
  methods: {
    ...mapActions({
      reqList: "goods/reqListAction",
      reqtotal: "goods/reqListNum",
      changePageAction: "goods/changePageAction",
    }),
    //点击了编辑按钮
    edit(id) {
      this.$emit("emit", id);
    },
    //删除
    del(id) {
      //点击了确定，发起删除请求
      reqgoodsDel({ id: id }).then((res) => {
        if (res.data.code == 200) {
          successAlert("删除成功");
          this.reqtotal();
          //页码设置成第一页
          this.changePageAction(1);
        } else {
          warningAlert(res.data.msg);
        }
      });
    },
    //修改当前页码
    changeCurrentPage(p) {
      //修改vuex里面的页码
      this.changePageAction(p);
    },
  },
  mounted() {
    //一进来 走请求
    this.reqList();
    this.reqtotal();
  },
};
</script>
<style scoped>
img {
  width: 80px;
  height: 80px;
}
</style>