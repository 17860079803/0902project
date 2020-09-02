<template>
  <div>
    <el-dialog :title="info.title" :visible.sync="info.isShow" @closed="close">
      <el-form :model="form">
        <el-form-item label="角色名称" :label-width="width">
          <el-input v-model="form.rolename" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色权限" :label-width="width">
          <el-tree
            :data="menuList"
            show-checkbox
            node-key="id"
            ref="tree"
            :props="{children:'children',label:'title'}"
          ></el-tree>
        </el-form-item>
        <el-form-item label="角色状态" :label-width="width">
          <el-switch v-model="form.status" :active-value="1" :inactive-value="2"></el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="add" v-if="info.isAdd">添 加</el-button>
        <el-button type="primary" @click="update" v-else>修 改</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
//引入vux辅助函数
import { mapGetters, mapActions } from "vuex";
//引入封装好的弹框
import { successAlert, warningAlert } from "../../../util/alert";
//引入数据请求
import {
  reqAddRole,
  reqRoleDetail,
  reqRoleUpdate,
} from "../../../util/requset";
export default {
  props: ["info"],
  computed: {
    ...mapGetters({
      menuList: "menu/list",
    }),
  },
  data() {
    return {
      width: "100px",
      form: {
        rolename: "",
        menus: [],
        status: 1,
      },
    };
  },
  components: {},
  methods: {
    ...mapActions({
      reqMenuList: "menu/reqListAction",
      reqList: "role/reqListAction",
    }),
    close() {
      // 如果是编辑，取消了，就要清空
      if (!this.info.isAdd) {
        this.empty();
      }
    },
    //点击了取消按钮
    cancel() {
      this.info.isShow = false;
    },
    //重置数据
    empty() {
      this.form = {
        rolename: "",
        menus: [],
        status: 1,
      };
      //重置树形控件
      this.$refs.tree.setCheckedKeys([]);
    },
    add() {
      // this.$refs.tree.getCheckedKeys() 获取树形控件上的选中的key
      this.form.menus = JSON.stringify(this.$refs.tree.getCheckedKeys());
      reqAddRole(this.form).then((res) => {
        if (res.data.code == 200) {
          successAlert("添加成功");
          //弹框消失
          this.cancel();
          //数据重置
          this.empty();
          //刷新角色列表的数据
          this.reqList();
        } else {
          warningAlert(res.data.msg);
        }
      });
    },
    //查看详情
    look(id) {
      reqRoleDetail({ id: id }).then((res) => {
        this.form = res.data.list;
        this.form.id = id;
        this.$refs.tree.setCheckedKeys(JSON.parse(res.data.list.menus));
      });
    },
    //点击了修改
    update() {
      // this.$refs.tree.getCheckedKeys() 获取树形控件上的选中的key
      this.form.menus = JSON.stringify(this.$refs.tree.getCheckedKeys());
      reqRoleUpdate(this.form).then((res) => {
        if (res.data.code == 200) {
          successAlert("修改成功");
          //弹框消失
          this.cancel();
          //数据重置
          this.empty();
          //刷新角色列表的数据
          this.reqList();
        } else {
          warningAlert(res.data.msg);
        }
      });
    },
  },
  mounted() {
    //发求情获取到仓库数据 判断如果数据是空的就发请求
    if (this.menuList.length == 0) {
      this.reqMenuList();
    }
  },
  beforeDestroy() {},
};
</script>
<style>
</style>