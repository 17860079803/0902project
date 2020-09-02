<template>
  <div>
    <el-table
      :data="list"
      style="width: 90%;margin:10px auto;margin-bottom: 20px;"
      row-key="id"
      border
    >
      <el-table-column prop="id" label="角色编号" sortable width="180"></el-table-column>
      <el-table-column prop="rolename" label="角色名称" sortable width="180"></el-table-column>
 
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
  </div>
</template>
<script>
//引入vuex辅助函数
import { mapGetters, mapActions } from "vuex";
//引入请求
import { reqRoleDel } from "../../../util/requset";
//引入封装好的弹框
import { successAlert, warningAlert } from "../../../util/alert";
export default {
  computed: {
    ...mapGetters({
      list: "role/list",
    }),
  },
  data() {
    return {};
  },
  components: {},
  methods: {
    //获取一下数据
    ...mapActions({
      reqList: "role/reqListAction",
    }),
    //点击了编辑
    edit(id) {
      this.$emit("edit", id);
    },
    //点击了删除
    del(id){
        reqRoleDel({id:id}).then(res=>{
            if(res.data.code==200){
                successAlert(res.data.msg)
            }else{
                warningAlert(res.data.msg)
            }
        })
        //删除后重亲获取列表
        this.reqList()
    }
  },
  mounted() {
    this.reqList();
  },
  beforeDestroy() {},
};
</script>
<style>
</style>