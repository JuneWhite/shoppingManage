<template>
  <el-dialog
    title="产品添加"
    :visible.sync="dialogTableVisible"
    :before-close="handleclose"
    width="80%"
  >
    <div style="height:400px;">
      <el-form ref="create" :model="form" :rules="rules" label-width="80px">
        <el-tabs v-model="activeName" tab-position="left">
          <el-tab-pane label="基本参数" name="base">
            <div style="height:300px;">
              <el-row>
                <el-col :span="12">
                  <el-form-item label="产品分类" prop="categoryid">
                    <el-select v-model="form.categoryid" prop="categoryid" placeholder="请选择分类">
                      <el-option
                        v-for="item in categoryData"
                        :key="item.id"
                        :label="item.categoryname"
                        :value="item.id"
                        :disabled="item.pid==0?true:false"
                      >|-{{item.neworder|strrepeat('--')}}{{item.categoryname}}</el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="产品标题" prop="productiontitle">
                    <el-input v-model="form.productiontitle"></el-input>
                  </el-form-item>
                  <el-form-item label="产品价格" prop="productionprice">
                    <el-input v-model="form.productionprice"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="产品图片" prop="productionphoto">
                    <upload-img @uploaded="uploadedhandle" :imageUrl="form.productionphoto"></upload-img>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
          </el-tab-pane>
          <el-tab-pane label="配置参数" name="option">
            <div style="height:300px; overflow-y:scroll;">
              <el-form-item label="产品参数" prop="productionparam">
                <template v-for="(item,index) in form.productionparam">
                  <el-row :key="item.key">
                    <el-input v-model="item.key" style="width:100px;"></el-input>
                    <el-input v-model="item.value" style="width:100px;"></el-input>
                    <el-button icon="el-icon-minus" @click="delparam(index)"></el-button>
                  </el-row>
                </template>
                <el-button size="mini" icon="el-icon-plus" @click="addparam"></el-button>
              </el-form-item>
              <el-form-item label="产品规格" prop="productionsize">
                <el-row>
                  <template v-for="(item,index) in form.productionsize">
                    <el-input
                      style="width:100px;"
                      v-model="form.productionsize[index]"
                      :key="index"
                    ></el-input>
                  </template>
                </el-row>
                <el-button-group>
                  <el-button size="mini" icon="el-icon-plus" @click="addsize"></el-button>
                  <el-button size="mini" icon="el-icon-minus" @click="delsize"></el-button>
                </el-button-group>
              </el-form-item>
              <el-form-item label="产品颜色" prop="productioncolor">
                <el-row>
                  <template v-for="(item,index) in form.productioncolor">
                    <el-input
                      style="width:100px;"
                      v-model="form.productioncolor[index]"
                      :key="index"
                    ></el-input>
                  </template>
                </el-row>
                <el-button-group>
                  <el-button size="mini" icon="el-icon-plus" @click="addcolor"></el-button>
                  <el-button size="mini" icon="el-icon-minus" @click="delcolor"></el-button>
                </el-button-group>
              </el-form-item>
            </div>
          </el-tab-pane>
          <el-tab-pane label="产品详情" name="detail">
            <div class="editor-container">
              <el-form-item label="产品详情" prop="productiondesc">
                  <editor
                    @editor="editor"
                    :editorcontent="this.form.productiondesc"
                    style="height:200px;"
                  ></editor>
              </el-form-item>
            </div>
          </el-tab-pane>
        </el-tabs>
        <el-form-item>
          <el-button type="primary" @click="submit">立即创建</el-button>
          <el-button @click="cancel">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
  </el-dialog>
</template>
<script>
import filters from "@/filter";
import uploadImg from "@/components/Upload";
import Editor from "@/components/Editor";
export default {
  name: "Productioncreate",
  components: {
    uploadImg,
    Editor
  },
  data() {
    return {
      activeName: "base",
      dialogTableVisible: true,
      categoryData: [],
      form: {
        categoryid: "",
        productiontitle: "",
        productionprice: "",
        productionparam: [{ key: "", value: "" }],
        productionphoto: "",
        productiondesc: "",
        productionsize: [""],
        productioncolor: [""]
      },
      rules: {
        categoryid: [
          { required: true, message: "产品分类不能为空", trigger: "blur" },
          {
            validator: function(rule, value, callback) {
              if (value == "") {
                this.activeName = "base";
                callback(new Error("产品分类不能为空"));
              } else {
                callback();
              }
            }.bind(this),
            trigger: "blur"
          }
        ],
        productiontitle: [
          { required: true, message: "产品标题不能为空", trigger: "blur" },
          { min: 10, max: 20, message: "长度在 10 到 22 位", trigger: "blur" },
          {
            validator: function(rule, value, callback) {
              if (value == "") {
                this.activeName = "base";
                callback(new Error("产品标题不能为空"));
              } else {
                callback();
              }
            }.bind(this),
            trigger: "blur"
          }
        ],
        productionprice: [
          {
            required: true,
            regexp: "^d+.d{2}$",
            message: "产品价格不能为空，且必须是2位小数",
            trigger: "blur"
          },
          {
            validator: function(rule, value, callback) {
              if (value == "") {
                this.activeName = "base";
                callback(new Error("产品价格不能为空，且必须是2位小数"));
              } else {
                callback();
              }
            }.bind(this),
            trigger: "blur"
          }
        ],
        productionphoto: [
          { required: true, message: "产品图片不能为空", trigger: "blur" },
          {
            validator: function(rule, value, callback) {
              if (value == "") {
                this.activeName = "base";
                callback(new Error("产品图片不能为空"));
              } else {
                callback();
              }
            }.bind(this),
            trigger: "blur"
          }
        ],
        productionparam: [
          { required: true, message: "产品参数不能为空", trigger: "blur" },
          {
            validator: function(rule, value, callback) {
              if (value == "") {
                this.activeName = "option";
                callback(new Error("产品参数不能为空"));
              } else {
                callback();
              }
            }.bind(this),
            trigger: "blur"
          }
        ],
        productionsize: [
          { required: true, message: "产品尺码不能为空", trigger: "blur" },
          {
            validator: function(rule, value, callback) {
              if (value == "") {
                this.activeName = "option";
                callback(new Error("产品尺码不能为空"));
              } else {
                callback();
              }
            }.bind(this),
            trigger: "blur"
          }
        ],
        productioncolor: [
          { required: true, message: "产品颜色不能为空", trigger: "blur" },
          {
            validator: function(rule, value, callback) {
              if (value == "") {
                this.activeName = "option";
                callback(new Error("产品颜色不能为空"));
              } else {
                callback();
              }
            }.bind(this),
            trigger: "blur"
          }
        ],
        productiondesc: [
          { required: true, message: "产品详情不能为空", trigger: "blur" },
          {
            validator: function(rule, value, callback) {
              if (value == "") {
                this.activeName = "detail";
                callback(new Error("产品详情不能为空"));
              } else {
                callback();
              }
            }.bind(this),
            trigger: "blur"
          }
        ]
      }
    };
  },
  filters,
  created() {
    let id = this.$route.query.id;
    this.getCategoryData();
  },
  methods: {
    getCategoryData() {
      this.axios
        .get("/api/category/getAllData")
        .then(
          function(response) {
            if (response.data.code == 0) {
              this.categoryData = response.data.data;
            } else {
              this.$message("服务器繁忙，请稍后重试");
            }
          }.bind(this)
        )
        .catch(
          function(error) {
            this.$message("服务器繁忙，请稍后重试");
          }.bind(this)
        );
    },
    editor(html) {
      if(html){
        this.form.productiondesc = html;
      }      
    },
    uploadedhandle(src) {
      this.form.productionphoto = src;
    },
    addparam() {
      this.form.productionparam.push({ key: "", value: "" });
    },
    delparam(idx) {
      let lastKey = this.form.productionparam.length - 1;
      if (lastKey > 0) {
        this.form.productionparam.splice(idx, 1);
      }
    },
    addsize() {
      this.form.productionsize.push("");
    },
    delsize() {
      let lastKey = this.form.productionsize.length - 1;
      if (lastKey > 0) {
        this.form.productionsize.pop();
      }
    },
    addcolor() {
      this.form.productioncolor.push("");
    },
    delcolor() {
      let lastKey = this.form.productioncolor.length - 1;
      if (lastKey > 0) {
        this.form.productioncolor.pop();
      }
    },
    handleclose(down) {
      this.$router.go(-1);
    },
    strparam() {
      let arr = this.form.productionparam;
      let strProductionparam = "";
      for (let i = 0; i < arr.length; i++) {
        strProductionparam += arr[i]["key"] + ":" + arr[i]["value"] + ";";
      }
      return strProductionparam;
    },
    submit() {
      let strlong = this.strparam();
      let _this = this;
      this.$refs["create"].validate(valid => {
        if (valid) {
          _this.axios
            .post("/api/production/create", {
              params: {
                categoryid: this.form.categoryid,
                productioncolor: _this.form.productioncolor.join("-"),
                productiondesc: _this.form.productiondesc,
                productionparam: strlong,
                productionphoto: _this.form.productionphoto,
                productionprice: _this.form.productionprice,
                productionsize: _this.form.productionsize.join("-"),
                productiontitle: _this.form.productiontitle
              }
            })
            .then(
              function(response) {
                if (response.data.code == 0) {
                  this.$message(response.data.msg);
                  this.$router.go(-1);
                } else {
                  this.$message(response.data.msg);
                }
              }.bind(this)
            )
            .catch(
              function(error) {
                this.$message(error);
              }.bind(this)
            );
        } else {
          this.$message("服务器繁忙，请稍后重试");
          return false;
        }
      });
    },
    cancel() {
      this.$router.go(-1);
    }
  }
};
</script>
<style scoped>
.editor-container >>> .ql-editor {
  height: 200px;
}
</style>
