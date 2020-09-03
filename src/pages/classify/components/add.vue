<template>
  <div>
    <el-dialog :title="info.title" :visible.sync="info.isShow" @closed="close">
      <el-form :model="form" :rules="rules">
        <el-form-item label="上级分类" :label-width="width" prop="pid">
          <el-select v-model="form.pid" placeholder="请选择活动区域">
            <el-option label="顶级分类" :value="0"></el-option>
            <!-- 少一个动态的数据 -->
            <el-option v-for="item in list" :key="item.id" :label="item.catename" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="分类名称" :label-width="width" prop="catename">
          <el-input v-model="form.catename" autocomplete="off"></el-input>
        </el-form-item>
        <!-- 图片上传 -->
        <el-form-item label="图片" :label-width="width" v-if="form.pid!=0" prop="img">
          <div class="upload-box">
            <h3 class="upload-add">+</h3>
            <img class="upload-img" v-if="imgUrl" :src="imgUrl" alt />
            <input class="upload-file" ref="file" @change="selectImg" type="file" />
          </div>
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
  reqAddcate,
  reqcateDetail,
  reqcateUpdate,
} from "../../../util/requset";
//引入封装的弹窗
import { successAlert, warningAlert } from "../../../util/alert";
//引入vuex辅助函数
import { mapGetters, mapActions } from "vuex";
export default {
  props: ["info"],
  computed: {
    ...mapGetters({
      list: "cate/list",
    }),
  },
  data() {
    return {
      imgUrl: "",
      width: "100px",
      form: {
        pid: 0,
        catename: "",
        img: null,
        status: 1,
      },
      //规则
      rules: {
        catename: [{ required: true, message: "请输入标题", trigger: "blur" }],
        img: [{ required: true, message: "请上传图片", trigger: "blur" }],
        pid: [{ required: true, message: "请选择一级分类", trigger: "blur" }],
      },
    };
  },
  components: {},
  methods: {
    ...mapActions({
      reqList: "cate/reqListAction",
    }),
    //图片上传
    selectImg(e) {
      let file = e.target.files[0];
      //2M
      if (file.size > 2 * 1024 * 1024) {
        warningAlert("文件格式不能超过2M");
        return;
      }
      //图片类型
      let imgTypeArr = [".jpg", ".jpeg", ".png", ".gif", "WEBP"];
      //获取到后缀名
      var extname = file.name.slice(file.name.lastIndexOf("."));
      //判断文件格式是否正确
      if (!imgTypeArr.includes(extname)) {
        warningAlert("请上传正确的图片格式");
        return;
      }
      // 赋值
      this.imgUrl = URL.createObjectURL(file);
      this.form.img = file;
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
      // 表单验证
      if(!this.form.catename&&!this.form.img){
        warningAlert("请输入分类名字,和上传图片")
        return;
      }
      reqAddcate(this.form).then((res) => {
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
        catename: "",
        img: null,
        status: 1,
      };
      this.imgUrl = "";
    },
    //查看一条数据
    look(id) {
      reqcateDetail({ id: id }).then((res) => {
        this.form = res.data.list;
        this.form.id = id;
        this.imgUrl = this.$preImg + res.data.list.img;
      });
    },
    //点击了修改
    update() {
      reqcateUpdate(this.form).then((res) => {
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