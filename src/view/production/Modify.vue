<template>
  <el-dialog
    title="产品修改"
    :visible.sync="dialogTableVisible"
    :before-close="handleclose"
    width="80%"
  >
    <div style="height:400px;">
      <el-form ref="create" :model="form" :rules="rules" label-width="80px">
        <el-tabs v-model="activeName" tab-position="left">
          <!-- 基本参数 -->
          <el-tab-pane label="基本参数" name="base">
            <div style="height:300px;">
              <el-row>
                <el-col :span="12">
                  <el-form-item label="产品分类" prop="categoryid">
                      <el-select v-model="form.categoryid" placeholder="请选择ID">
                        <el-option
                          v-for="item in categoryData"
                          :key="item.id"
                          :label="item.categoryname"
                          :value="item.id"
                          :disabled="item.pid==0?true:false"
                          >
                          |-{{item.neworder|strrepeat('--')}}{{item.categoryname}}
                        </el-option>
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
                      <upload-img @uploaded="uploadedhandle" :imageUrl = 'form.productionphoto'></upload-img>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
          </el-tab-pane>
          <!-- 配置参数 -->
          <el-tab-pane label="配置参数" name="option">
            <div style="height:300px; overflow-y:scroll;">
              <el-form-item label="产品参数" prop="productionparam">
                <template v-for="(item,index) in form.productionparam">
                  <el-row :key="index">
                    <el-input v-model="item.key" style="width:100px;"></el-input>
                    <el-input v-model="item.value" style="width:100px;"></el-input>
                    <el-button
                      icon="el-icon-minus"
                      @click="delparam(index)"
                    ></el-button>
                  </el-row>
                </template>
                <el-button size="mini" icon="el-icon-plus" @click="addparam"></el-button>
              </el-form-item>
              <el-form-item label="产品规格" prop="productionsize">
                <el-row>
                <template v-for="(item,index) in form.productionsize">
                    <el-input style="width:100px;" v-model="form.productionsize[index]" :key="index"></el-input>
                </template>
                </el-row>
                <el-button-group>
                <el-button size="mini" icon="el-icon-plus" @click="addsize"></el-button>
                <el-button size="mini" icon="el-icon-minus" @click="delsize"></el-button>
                </el-button-group>
              </el-form-item>
              <el-form-item label="产品颜色" >
                <el-row>
                <template v-for="(item,index) in form.productioncolor">
                    <el-input prop="productioncolor" style="width:100px;" v-model="form.productioncolor[index]" :key="index"></el-input>
                </template>
                </el-row>
                <el-button-group>
                <el-button type="primary" size="mini" icon="el-icon-plus" @click="addcolor"></el-button>
                <el-button type="primary" size="mini" icon="el-icon-minus" @click="delcolor"></el-button>
                </el-button-group>
              </el-form-item>
            </div>
          </el-tab-pane>
          <!-- 产品详情 -->
          <el-tab-pane label="产品详情" name="detail">
            <div style="">
              <el-form-item label="产品详情" prop="productiondesc">
                <editor @editor="editor" :editorcontent.sync="productiondesc"></editor>
              </el-form-item>
            </div>
          </el-tab-pane>
        </el-tabs>
        <el-form-item>
          <el-button type="primary" @click="submit">提交</el-button>
          <el-button @click="cancel">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
  </el-dialog>
</template>
<script>
import filters from '@/filter'
import uploadImg from "@/components/Upload";
import Editor from '@/components/Editor';
export default {
  name: "Productionmodify",
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
        productionprice: "0.00",
        productionparam: [{ key: "", value: "" }],
        productionphoto: "",
        productiondesc: "",
        productionsize: [""],
        productioncolor: [""]
      },
      rules: {
        categoryid: [
          { required: true, message: "产品分类不能为空", trigger: "blur" }
        ],
        productiontitle: [
          { required: true, message: "产品标题不能为空", trigger: "blur" },
          { min: 10, max: 20, message: "长度在 10 到 22 位", trigger: "blur" }
        ],
        productionprice: [
          { required: true, pattern: '^(([1-9]{1}\\d*)|([0]{1}))(\\.(\\d){0,2})?$', message: "产品价格不能为空，且必须是2位小数", trigger: "blur" },
        ],
        productionphoto: [
          { required: true, message: "产品图片不能为空", trigger: "blur" }
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
  computed: {
    productiondesc() {
      return this.form.productiondesc;
    }
  },
  filters,
  created() {
    this.getAllData();
    this.getrow();
  },
  methods: {
    editor(data){
      this.form.productiondesc=data;
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
    strparam(){
      let arr=this.form.productionparam;
      let strProductionparam='';
      for(let i=0;i<arr.length;i++){
        strProductionparam+=(arr[i]['key']+':'+arr[i]['value']+';')
      }
      return strProductionparam;
    },
    submit() {
      let strlong=this.strparam()
      let _this = this;
      this.$refs["create"].validate(valid => {
        if (valid) {
          _this.axios
            .post("/api/production/edit", {
              params: {
                id:this.$route.query.id,
                categoryid:this.form.categoryid,
                productioncolor:this.form.productioncolor.join('-'),
                productiondesc:this.form.productiondesc,
                productionparam:strlong,
                productionphoto:this.form.productionphoto,
                productionprice:this.form.productionprice,
                productionsize:this.form.productionsize.join('-'),
                productiontitle:this.form.productiontitle
              },
              // headers: { token: token }
            })
            .then(
              function(response) {
                if (response.data.code == 0) {
                  this.$message(response.data.msg);
                  this.$router.go(-1);
                } else {
                  alert(response.data.msg)
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
          this.$message("服务器繁忙，请稍后重试222");
          return false;
        }
      });
    },
    cancel() {
      this.dialogTableVisible = false;
      this.$router.go(-1);
    },
    getAllData(){
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
    getrow(){
      this.axios
      .get("/api/production/getRow", {
        params: {
          id: this.$route.query.id
        }
      })
      .then(
        function(response) {
          if (response.data.code == 0) {
            let paramStr=response.data.data.productionparam;
            this.form.categoryid=response.data.data.categoryid;
            this.form.productiontitle=response.data.data.productiontitle;
            this.form.productionprice=response.data.data.productionprice;
            this.form.productionphoto=response.data.data.productionphoto;
            this.form.productiondesc=response.data.data.productiondesc;
            this.form.productionsize=response.data.data.productionsize.split('-');
            this.form.productioncolor=response.data.data.productioncolor.split('-');
            let arr=[];
            paramStr.split(';').forEach(item => {
              arr.push({key:item.split(':')[0],value:item.split(':')[1]})
            });
            this.form.productionparam=arr;
          } else {
            this.$message(response.data.msg);
          }
        }.bind(this)
      )
      .catch(
        function(error) {
          this.$message("服务器繁忙，请稍后重试");
        }.bind(this)
      );
    }
  }
};
</script>
<style scoped>
.ql-container .ql-snow{ height:300px;}
.ql-editor{ height:300px;}
</style>
