<template>
  <div>
    <el-dialog :title="info.title" :visible.sync="info.isShow" @closed="close" @opened="createEditor">
      <el-form :model="form" :rules="rules">
        <!-- 一级分类 -->
        <el-form-item label="一级分类" :label-width="width" prop="first_cateid">
          <el-select v-model="form.first_cateid" placeholder="请选择商品规格" @change="changeFirstId">
            <el-option label="--请选择--" value></el-option>
            <el-option
              v-for="item in cateList"
              :key="item.id"
              :label="item.catename"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- 商品属性-->
        <el-form-item label="二级分类" :label-width="width" prop="second_cateid">
          <el-select v-model="form.second_cateid" placeholder="请选择商品规格">
            <el-option label="--请选择--" value disabled></el-option>
            <el-option
              v-for="item in secondCateList"
              :key="item.id"
              :label="item.catename"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="商品名称" :label-width="width" prop="goodsname">
          <el-input v-model="form.goodsname" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="商品价格" :label-width="width" prop="price">
          <el-input v-model="form.price" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="市场价格" :label-width="width" prop="market_price">
          <el-input v-model="form.market_price" autocomplete="off"></el-input>
        </el-form-item>
        <!-- 图片上传 -->
        <el-form-item label="图片" :label-width="width" v-if="form.pid!=0" prop="img">
          <div class="upload-box">
            <h3 class="upload-add">+</h3>
            <img class="upload-img" v-if="imgUrl" :src="imgUrl" alt />
            <input class="upload-file" ref="file" @change="selectImg" type="file" />
          </div>
        </el-form-item>
        <!-- 商品规格 -->
        <el-form-item label="商品规格" :label-width="width" prop="specsid">
          <el-select v-model="form.specsid" placeholder="请选择商品规格" @change="changeSpecId">
            <el-option label="--请选择--" value disabled></el-option>
            <el-option
              v-for="item in specList"
              :key="item.id"
              :label="item.specsname"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- 商品属性 -->
        <el-form-item label="商品属性" :label-width="width" prop="specsattr">
          <el-select v-model="form.specsattr" placeholder="请选择商品规格属性" multiple>
            <el-option label="--请选择--" value></el-option>
            <el-option v-for="item in attrList" :key="item" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="是否新品" :label-width="width">
          <el-radio :label="1" v-model="form.isnew">是</el-radio>
          <el-radio :label="2" v-model="form.isnew">否</el-radio>
        </el-form-item>
        <el-form-item label="是否热卖" :label-width="width">
          <el-radio :label="1" v-model="form.ishot">是</el-radio>
          <el-radio :label="2" v-model="form.ishot">否</el-radio>
        </el-form-item>

        <el-form-item label="状态" :label-width="width">
          <el-switch v-model="form.status" :active-value="1" :inactive-value="2"></el-switch>
        </el-form-item>
        <el-form-item label="商品描述" :label-width="width" prop="description">
          <!-- 富文本编辑器的节点 -->
          <div id="editor" v-if="info.isShow"></div>
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
  reqgoodsAdd,
  reqgoodsDetail,
  reqgoodsUpdate,
  reqAddcate,
  reqCateDetail,
  reqCateUpdate,
} from "../../../util/requset";
//引入封装的弹窗
import { successAlert, warningAlert } from "../../../util/alert";
//引入vuex辅助函数
import { mapGetters, mapActions } from "vuex";
//引入富文本编辑器
import E from "wangeditor";
export default {
  props: ["info"],
  computed: {
    ...mapGetters({
      //获取分类列表
      cateList: "cate/list",
      //获取规格列表
      specList: "spec/list",
    }),
  },
  data() {
    return {
      //图片临时存放地址
      imgUrl: "",
      //二级分类临时存放地址
      secondCateList: [],
      //规格属性临时存放地址
      attrList: [],
      //label宽度
      width: "100px",
      form: {
        first_cateid: "",
        second_cateid: "",
        goodsname: "",
        price: "",
        market_price: "",
        img: null,
        description: "",
        specsid: "",
        specsattr: [],
        isnew: 1,
        ishot: 1,
        status: 1,
      },
      //规则
      rules: {
        first_cateid: [
          { required: true, message: "请输入商品名称", trigger: "blur" },
        ],
        second_cateid: [
          { required: true, message: "请输入商品名称", trigger: "blur" },
        ],
        goodsname: [
          { required: true, message: "请输入商品名称", trigger: "blur" },
        ],
        img: [{ required: true, message: "请上传图片", trigger: "blur" }],
        price: [{ required: true, message: "请输入价格", trigger: "blur" }],
        market_price: [
          { required: true, message: "请输入市场价格", trigger: "blur" },
        ],
        description: [
          { required: true, message: "请输入描述", trigger: "blur" },
        ],
        specsid: [{ required: true, message: "请输入描述", trigger: "blur" }],
        specsattr: [{ required: true, message: "请输入描述", trigger: "blur" }],
      },
    };
  },
  components: {},
  methods: {
    //富文本编辑器
    createEditor() {
      //创建编辑器
      this.editor = new E("#editor");
      this.editor.create();
      //给富文本编辑器赋值
      this.editor.txt.html(this.form.description);
    },
    ...mapActions({
      //获取分类列表
      reqCateList: "cate/reqListAction",
      // 获取规格列表
      reqSpecList: "spec/reqListAction",
      //获取分类列表
      reqList: "goods/reqListAction",
      //获取一下总数
      reqtotal: "goods/reqListNum",
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
    //修改了商品规格  取到相应的商品属性
    changeSpecId() {
      console.log(111);
      //当商品规格变了，就计算一下商品属性要展示的数组列表
      this.attrList = this.specList.find(
        (item) => item.id == this.form.specsid
      ).attrs;

      //选中的商品属性重置
      this.form.specsattr = [];
    },
    //文件上传处理
    selectImg(e) {
      let file = e.target.files[0];
      //2M
      if (file.size > 2 * 1024 * 1024) {
        warningAlert("文件格式不能超过2M");
        return;
      }
      //规定图片类型
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
      if (
        !this.form.goodsname &&
        !this.form.img &&
        !this.price &&
        !this.market_price &&
        !this.description
      ) {
        warningAlert("请填写必填项,*为必填项");
        return;
      }
      if (
        this.form.first_cateid == "" &&
        this.form.second_cateid == "" &&
        this.form.specsid == "" &&
        this.form.specsattr == []
      ) {
        warningAlert("请填写必填项,*为必填项");
        return;
      }
      //取出富文本编辑器的内容，赋值给form的description
      this.form.description = this.editor.txt.html();
      reqgoodsAdd(this.form).then((res) => {
        if (res.data.code === 200) {
          //添加成功
          successAlert(res.data.msg);
          //弹窗消失
          this.$emit("hide");
          // 重置数据
          this.empty();
          //重置list
          this.reqList();
          this.reqtotal();
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
        goodsname: "",
        price: "",
        market_price: "",
        img: null,
        description: "",
        specsid: "",
        specsattr: [],
        isnew: 1,
        ishot: 1,
        status: 1,
      };
      //清除图片
      this.imgUrl = "";
      //二级分类的列表
      this.secondCateList = [];
      //规格属性的列表
      this.attrList = [];
    },
    //查看一条数据
    look(id) {
      reqgoodsDetail({ id: id }).then((res) => {
        this.form = res.data.list;
        this.form.id = id;
        this.imgUrl = this.$preImg + res.data.list.img;
        this.form.specsattr = this.form.specsattr.split(",");
        //计算二级分类的列表
        this.secondCateList = this.cateList.find(
          (item) => item.id == this.form.first_cateid
        ).children;
        //计算属性列表
        this.attrList = this.specList.find(
          (item) => item.id == this.form.specsid
        ).attrs;
      });
    },
    //点击了修改
    update() {
      //取出富文本编辑器的内容，赋值给form的description
      this.form.description = this.editor.txt.html();
      reqgoodsUpdate(this.form).then((res) => {
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
    //如果没有分类就请求
    if (this.cateList.length == 0) {
      this.reqCateList();
    }
    //请求全部的规格
    this.reqSpecList(true);
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