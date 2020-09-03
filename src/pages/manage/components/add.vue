<template>
  <div>
    <el-dialog :title="info.title" :visible.sync="info.isShow" @closed="close">
      <el-form :model="form" :rules="rules">
        <!-- 选择所属角色 -->
        <el-form-item label="所属角色" :label-width="width" prop="roleid">
          <el-select v-model="form.roleid">
            <el-option value label="--请选择--" disabled></el-option>
            <el-option
              v-for="item in roleList"
              :key="item.id"
              :label="item.rolename"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- 用户名 -->
        <el-form-item label="用户名称" :label-width="width" prop="username">
          <el-input v-model="form.username" autocomplete="off"></el-input>
        </el-form-item>
        <!-- 设置密码 -->
        <el-form-item label="密码" :label-width="width" prop="password">
          <el-input v-model="form.password" autocomplete="off"></el-input>
        </el-form-item>
        <!-- 选择角色状态 -->
        <el-form-item label="角色状态" :label-width="width">
          <el-switch v-model="form.status" :active-value="1" :inactive-value="2"></el-switch>
        </el-form-item>
      </el-form>
      <!-- 底部按钮 -->
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel" v-preventReClick>取 消</el-button>
        <el-button type="primary" @click="add" v-if="info.isAdd" v-preventReClick>添 加</el-button>
        <el-button type="primary" @click="update" v-else v-preventReClick>修 改</el-button>
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
  reqUserAdd,
  reqUserDetail,
  reqUserUpdate,
} from "../../../util/requset";
export default {
  props: ["info"],
  computed: {
    ...mapGetters({
      roleList: "role/list",
    }),
  },
  data() {
    return {
      width: "100px",
      form: {
        roleid: "",
        username: "",
        password: "",
        status: 1,
      },
      //规则
      rules: {
        roleid: [{ required: true, message: "请选择角色", trigger: "blur" }],
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
      },
    };
  },
  components: {},
  methods: {
    ...mapActions({
      //获取管理员的方法
      reqRoleList: "role/reqListAction",
      //获取列表数据的方法
      reqUserList: "manage/reqListAction",
    }),
    //点击了取消按钮
    cancel() {
      this.info.isShow = false;
    },
    //弹框消失
    close() {
      !this.info.isAdd && this.empty();
    },
    //重置数据
    empty() {
      this.form = {
        roleid: "",
        username: "",
        password: "",
        status: 1,
      };
      //重置树形控件
    },
    add() {
      // 表单验证
      if (
        !this.form.username &&
        !this.form.password 
      ) {
        warningAlert("请填写必填项,*为必填项");
        return;
      };
      if(this.form.roleid==''){
         warningAlert("请填写必填项,*为必填项");
        return;
      }
      reqUserAdd(this.form).then((res) => {
        if (res.data.code == 200) {
          successAlert("添加成功");
          //弹框消失
          this.cancel();
          //数据重置
          this.empty();
          //刷新角色列表的数据
          this.reqUserList();
        } else {
          warningAlert(res.data.msg);
        }
      });
    },
    //查看详情
    look(id) {
      reqUserDetail({ uid: id }).then((res) => {
        this.form = res.data.list;
        this.form.password = "";
      });
    },
    //点击了修改
    update() {
      reqUserUpdate(this.form).then((res) => {
        if (res.data.code == 200) {
          successAlert("修改成功");
          //弹框消失
          this.cancel();
          //数据重置
          this.empty();
          //刷新角色列表的数据
          this.reqUserList();
        } else {
          warningAlert(res.data.msg);
        }
      });
    },
  },
  mounted() {
    //发求情获取到仓库数据 判断如果数据是空的就发请求
    if (this.roleList.length == 0) {
      this.reqRoleList();
    }
  },
  beforeDestroy() {},
};
</script>
<style>
</style>