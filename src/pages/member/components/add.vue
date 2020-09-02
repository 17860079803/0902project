<template>
  <div>
    <el-dialog :title="info.title" :visible.sync="info.isShow">
      <el-form :model="form">
        <el-form-item label="手机号" :label-width="width">
          <el-input v-model="form.phone" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="昵称" :label-width="width">
            <el-input v-model="form.nickname" autocomplete="off"></el-input>
        </el-form-item>
          <el-form-item label="新密码" :label-width="width">
            <el-input v-model="form.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色状态" :label-width="width">
          <el-switch v-model="form.status" :active-value="1" :inactive-value="2"></el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="update">修 改</el-button>
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
  reqmemberDetail,
  reqmemberUpdate,
} from "../../../util/requset";
export default {
  props: ["info"],
  computed: {
    ...mapGetters({
      memberlist: "member/list",
    }),
  },
  data() {
    return {
      width: "100px",
      form: {
        nickname: "",
        phone: '',
        status: 1,
        password:''
      },
    };
  },
  components: {},
  methods: {
    ...mapActions({
      reqMemberList: "member/reqListAction",
    }),
    //点击了取消按钮
    cancel() {
      this.info.isShow = false;
    },
    //重置数据
    empty() {
      this.form = {
        nickname: "",
        phone: [],
        status: 1,
        password:''
      };
      //重置树形控件
    },
    //查看详情
    look(id) {
      reqmemberDetail({ uid: id }).then((res) => {
        this.form = res.data.list;
        this.form.password = ""
      });
    },
    //点击了修改
    update() {
      reqmemberUpdate(this.form).then((res) => {
        if (res.data.code == 200) {
          successAlert("修改成功");
          //弹框消失
          this.cancel();
          //数据重置
          this.empty();
          //刷新角色列表的数据
          this.reqMemberList();
        } else {
          warningAlert(res.data.msg);
        }
      });
    },
  },
  mounted() {
    //发求情获取到仓库数据 判断如果数据是空的就发请求
    if (this.memberlist.length == 0) {
      this.reqMemberList();
    }
  },
  beforeDestroy() {},
};
</script>
<style>
</style>