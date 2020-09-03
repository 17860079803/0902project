<template>
  <div>
    <el-dialog :title="info.title" :visible.sync="info.isShow" @closed="close">
      <el-form :model="form" :rules="rules">
        <el-form-item label="菜单名称" :label-width="width" prop="title">
          <el-input v-model="form.title" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="上级菜单" :label-width="width" prop="pid">
          <el-select v-model="form.pid" placeholder="请选择菜单类型" @change="changePid">
            <el-option label="顶级菜单" :value="0"></el-option>
            <!-- 少一个动态的数据 -->
            <el-option v-for="item in list" :key="item.id" :label="item.title" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="菜单类型" :label-width="width">
          <el-radio v-model="form.type" :label="1" disabled>目录</el-radio>
          <el-radio v-model="form.type" :label="2" disabled>菜单</el-radio>
        </el-form-item>
        <el-form-item label="菜单图标" :label-width="width" v-if="form.type==1" prop="icon">
          <el-select v-model="form.icon" placeholder="请选择目录图标">
            <el-option value="el-icon-setting">
              <i class="el-icon-setting"></i>
            </el-option>
            <el-option value="el-icon-goods">
              <i class="el-icon-goods"></i>
            </el-option>
            <el-option value="el-icon-user">
              <i class="el-icon-user"></i>
            </el-option>
            <el-option value="el-icon-camera">
              <i class="el-icon-camera"></i>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="菜单地址" :label-width="width" v-else prop="url">
          <el-select v-model="form.url">
            <el-option value label="--请选择--" disabled></el-option>
            <el-option
              v-for="item in indexRouter"
              :key="item.path"
              :label="item.name"
              :value="'/'+item.path"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态" :label-width="width">
          <el-switch v-model="form.status" :active-value="1" :inactive-value="2"></el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel" v-preventReClick>取 消</el-button>
        <el-button type="primary" @click="add" v-if="info.isAdd" v-preventReClick>添 加</el-button>
        <el-button type="primary" @click="update" v-else v-preventReClick>修 改</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
//引入请求信息在util文件夹下
import {
  reqAddMenu,
  reqMenuDetail,
  reqMenuUpdate,
} from "../../../util/requset";
//引入封装的弹窗
import { successAlert, warningAlert } from "../../../util/alert";
//引入二级路由name
import { indexRouter } from "../../../router/index";
//引入vuex辅助函数
import { mapGetters, mapActions } from "vuex";
export default {
  props: ["info"],
  computed: {
    ...mapGetters({
      list: "menu/list",
    }),
  },
  data() {
    return {
      indexRouter: indexRouter,
      width: "100px",
      form: {
        pid: "",
        title: "",
        icon: "",
        type: 1,
        url: "",
        status: 1,
      },
      //规则
      rules: {
        pid: [{ required: true, message: "请选择上级菜单", trigger: "blur" }],
        title: [{ required: true, message: "请输入菜单名称", trigger: "blur" }],
        icon: [{ required: true, message: "请选择菜单图标", trigger: "blur" }],
        url: [{ required: true, message: "请选择菜单地址", trigger: "blur" }],
      },
    };
  },
  components: {},
  methods: {
    ...mapActions({
      reqList: "menu/reqListAction",
    }),
    //点击了取消
    cancel() {
      this.$emit("hide");
    },
    changePid() {
      this.form.type = this.form.pid == 0 ? 1 : 2;
    },
    //弹框关闭完成
    close() {
      // 如果是编辑，取消了，就要清空
      if (!this.info.isAdd) {
        this.empty();
      }
    },
    //添加菜单
    add() {
      // 表单验证
      if (!this.form.title) {
        warningAlert("请填写菜单名称");
        return;
      }
      if (this.form.type == 1 && this.form.icon == "") {
        warningAlert("请选择菜单图标");
        return;
      }
      if (this.form.type == 2 && this.form.url == "") {
        warningAlert("请选择菜单地址");
        return;
      }
      if (this.form.pid == "") {
        warningAlert("请选择上级菜单");
        return;
      }
      reqAddMenu(this.form).then((res) => {
        if (res.data.code === 200) {
          //添加成功
          successAlert(res.data.msg);
          //弹窗消失
          this.$emit("hide");
          // 重置数据
          this.empty();
          //重置list
          this.reqList();
        } else {
          warningAlert(res.data.msg);
        }
      });
    },
    //清空提交后输入from的数据
    empty() {
      this.form = {
        pid: 0,
        title: "",
        icon: "",
        type: 1,
        url: "",
        status: 1,
      };
    },
    //查看一条数据
    look(id) {
      reqMenuDetail({ id: id }).then((res) => {
        this.form = res.data.list;
        this.form.id = id;
      });
    },
    //点击了修改
    update() {
      reqMenuUpdate(this.form).then((res) => {
        if (res.data.code == 200) {
          successAlert("更新成功");
          this.$emit("hide");
          this.empty();
          //修改后重新请求
          this.reqList();
        } else {
          warningAlert(res.data.msg);
        }
      });
    },
  },
  mounted() {},
  beforeDestroy() {},
};
</script>
<style>
</style>