<template>
  <div>
    <el-dialog :title="info.title" :visible.sync="info.isShow" @closed="close">
      <el-form :model="form" :rules="rules">
        <el-form-item label="规格名称" :label-width="width" prop="specsname">
          <el-input v-model="form.specsname" placeholder="请输入规格名称"></el-input>
        </el-form-item>
        <el-form-item
          label="规格属性"
          :label-width="width"
          v-for="(item,index) in attrArr"
          :key="index"
        >
          <el-row>
            <el-col :span="18">
              <el-input v-model="item.value" placeholder="请选择规格属性"></el-input>
            </el-col>
            <el-col :span="4">
              <el-button type="primary" v-if="index==0" @click="addAttr" v-preventReClick>新增规格属性</el-button>
              <el-button type="danger" v-else @click="del(index)" v-preventReClick>删除</el-button>
            </el-col>
          </el-row>
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
  reqAddspecs,
  reqspecsDetail,
  reqspecsUpdate,
} from "../../../util/requset";
//引入封装的弹窗
import { successAlert, warningAlert } from "../../../util/alert";
//引入vuex辅助函数
import { mapGetters, mapActions } from "vuex";
export default {
  props: ["info"],
  computed: {
    ...mapGetters({
      list: "spec/list",
    }),
  },
  data() {
    return {
      attrArr: [
        {
          value: "",
        },
      ],
      width: "100px",
      form: {
        specsname: "",
        attrs: "",
        status: 1,
      },
      //规则
      rules: {
        specsname: [{ required: true, message: "请输入规格名称", trigger: "blur" }],
        attrs: [{ required: true, message: "规格不能为空", trigger: "blur" }],
      },
    };
  },
  methods: {
    ...mapActions({
      reqList: "spec/reqListAction",
      reqTotal: "spec/reqListNum",
    }),
    //点击了新增规格
    addAttr() {
      this.attrArr.push({
        value: "",
      });
    },
    //点击了删除规格属性
    del(index) {
      this.attrArr.splice(index, 1);
    },
    //点击了取消
    cancel() {
      this.$emit("hide");
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
      if(!this.form.specsname){
        warningAlert('请输入规格名')
        return;
      }
      if (this.attrArr.some((item) => item.value === "")) {
        warningAlert("规格属性均不能为空");
        return;
      }
      this.form.attrs = JSON.stringify(this.attrArr.map((item) => item.value));
      reqAddspecs(this.form).then((res) => {
        if (res.data.code === 200) {
          //添加成功
          successAlert(res.data.msg);
          //弹窗消失
          this.$emit("hide");
          // 重置数据
          this.empty();
          //重置list
          this.reqList();
          this.reqTotal();
        } else {
          warningAlert(res.data.msg);
        }
      });
    },
    //清空提交后输入from的数据
    empty() {
      this.form = {
        specsname: "",
        attrs: "",
        status: 1,
      };
      this.attrArr = [{ value: "" }];
    },
    //查看一条数据
    look(id) {
      reqspecsDetail({ id: id }).then((res) => {
        this.form = res.data.list[0];
        this.attrArr = JSON.parse(this.form.attrs).map((item) => ({
          value: item,
        }));
      });
    },
    //点击了修改
    update() {
      if(!this.form.specsname){
        warningAlert('请输入规格名')
        return;
      }
      if (this.attrArr.some((item) => item.value === "")) {
        warningAlert("规格属性均不能为空");
        return;
      }
      this.form.attrs = JSON.stringify(this.attrArr.map((item) => item.value));
      reqspecsUpdate(this.form).then((res) => {
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
  mounted() {
    // this.reqList()
  },
  beforeDestroy() {},
};
</script>
<style scoped>
.upload-box {
  width: 150px;
  height: 150px;
  border: 1px dashed #cccccc;
  position: relative;
}
.upload-add {
  width: 150px;
  height: 150px;
  text-align: center;
  line-height: 150px;
  font-size: 40px;
  color: #666;
  font-weight: 400;
}
.upload-img {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
}
.upload-file {
  width: 150px;
  height: 150px;
  position: absolute;
  left: 0;
  top: 0;
  opacity: 0;
}
</style>