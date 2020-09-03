<template>
  <div>
    <el-dialog :title="info.title" :visible.sync="info.isShow" @closed="close">
      <el-form :model="form" :rules="rules">
        <el-form-item label="活动名称" :label-width="width" prop="title">
          <el-input v-model="form.title" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="选择时间" :label-width="width" prop="timer">
          <div class="block">
            <!-- <span class="demonstration">起始日期时刻为 12:00:00</span> -->
            <el-date-picker
              v-model="timer"
              type="datetimerange"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            ></el-date-picker>
          </div>
        </el-form-item>
        <!-- 一级分类 -->
        <el-form-item label="一级分类" :label-width="width" prop="first_cateid">
          <el-select v-model="form.first_cateid" placeholder="请选择商品一级分类" @change="changeFirstId">
            <el-option label="--请选择--" value></el-option>
            <el-option
              v-for="item in cateList"
              :key="item.id"
              :label="item.catename"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- 二级分类-->
        <el-form-item label="二级分类" :label-width="width" prop="second_cateid">
          <el-select v-model="form.second_cateid" placeholder="请选择商品二级分类" @change="changeSecondId">
            <el-option label="--请选择--" value disabled></el-option>
            <el-option
              v-for="item in secondCateList"
              :key="item.id"
              :label="item.catename"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- 选择商品 -->
        <el-form-item label="选择商品" :label-width="width" prop="goodsid">
          <el-select v-model="form.goodsid" placeholder="请选择商品">
            <el-option label="--请选择--" value></el-option>
            <el-option
              v-for="item in goodsattr"
              :key="item.id"
              :label="item.goodsname"
              :value="item.id"
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
  reqAddseck,
  reqseckDetail,
  reqseckUpdate,
  reqAddcate,
  reqCateDetail,
  reqCateUpdate,
} from "../../../util/requset";
//引入封装的弹窗
import { successAlert, warningAlert } from "../../../util/alert";
//引入vuex辅助函数
import { mapGetters, mapActions } from "vuex";
export default {
  props: ["info"],
  computed: {
    ...mapGetters({
      //获取分类列表
      cateList: "cate/list",
      //获取商品列表
      goodsList: "goods/list",
    }),
  },
  data() {
    return {
      //二级分类临时存放地址
      secondCateList: [],
      //商品临时存放
      goodsattr: [],
      //label宽度
      width: "100px",
      timer: null,
      form: {
        first_cateid: "",
        second_cateid: "",
        title: "",
        begintime: "",
        endtime: "",
        goodsid: "",
        status: 1,
      },
      //规则
      rules: {
        first_cateid: [
          { required: true, message: "请选择上级菜单", trigger: "blur" },
        ],
        second_cateid: [
          { required: true, message: "请选择上级菜单", trigger: "blur" },
        ],
        title: [{ required: true, message: "请输入活动名称", trigger: "blur" }],
        timer: [{ required: true, message: "请选择活动时间", trigger: "blur" }],
        goodsid: [{ required: true, message: "请选择商品", trigger: "blur" }],
      },
    };
  },
  components: {},
  methods: {
    ...mapActions({
      //获取分类列表
      reqCateList: "cate/reqListAction",
      //获取商品列表
      reqList: "goods/reqListAction",
      //获取秒杀列表
      reqSeckList: "seck/reqListAction",
    }),
    //当一级分类修改的时候
    changeFirstId() {
      //找到当前first_cateid对应的那条数据的children，赋值给secondCateList,遍历
      this.secondCateList = this.cateList.find(
        (item) => item.id == this.form.first_cateid
      ).children;
      //因为更换了一级分类，二级分类重置
      this.form.second_cateid = "";
    },
    changeSecondId() {
      //当二级分类发生变化的时候,去请求展示需要显示的商品
      this.goodsattr = this.goodsList.filter(
        (item) => item.second_cateid == this.form.second_cateid
      );
      this.form.goodsid = "";
      console.log(this.goodsattr);
      //因为更换了二级分类，商品重置
      this.form.goodsid = "";
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
      if (!this.timer) {
        warningAlert("请选择开始结束时间");
        return;
      }
      if (!this.form.title) {
        warningAlert("请输入活动名称");
        return;
      }
      if (this.form.first_cateid == "") {
        warningAlert("请选择一级分类");
        return;
      }
      if (this.form.second_cateid == "") {
        warningAlert("请选择二级分类");
        return;
      }
      if (this.form.goodsid == "") {
        warningAlert("请选择商品");
        return;
      }
      this.form.begintime = this.timer[0].getTime();
      this.form.endtime = this.timer[1].getTime();
      reqAddseck(this.form).then((res) => {
        if (res.data.code === 200) {
          //添加成功
          successAlert(res.data.msg);
          //弹窗消失
          this.$emit("hide");
          // 重置数据
          this.empty();
          //重置list
          this.reqSeckList();
        } else {
          warningAlert(res.data.msg);
        }
      });
    },
    //清空提交后输入from的数据
    empty() {
      this.form = {
        first_cateid: "",
        second_cateid: "",
        title: "",
        begintime: "",
        endtime: "",
        goodsid: "",
        status: 1,
      };
      //二级分类的列表
      this.secondCateList = [];
      //规格属性的列表
    },
    //查看一条数据
    look(id) {
      reqseckDetail({ id: id }).then((res) => {
        this.form = res.data.list;
        this.form.id = id;
        //计算二级分类的列表
        this.secondCateList = this.cateList.find(
          (item) => item.id == this.form.first_cateid
        ).children;
        //计算商品分类
        this.goodsattr = this.goodsList.filter(
          (item) => item.second_cateid == this.form.second_cateid
        );
        let x = new Date(parseInt(res.data.list.begintime));
        let y = new Date(parseInt(res.data.list.endtime));
        this.timer = [x, y];
      });
    },
    //点击了修改
    update() {
      reqseckUpdate(this.form).then((res) => {
        if (res.data.code == 200) {
          successAlert("更新成功");
          this.$emit("hide");
          this.empty();
          //修改后重新请求
          this.reqSeckList();
        } else {
          warningAlert(res.data.msg);
        }
      });
    },
  },
  mounted() {
    //如果没有分类就请求
    if (this.cateList.length == 0) {
      this.reqCateList();
    }
    // 一进来就请求商品
    this.reqList(true);
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