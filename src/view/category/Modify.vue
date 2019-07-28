<template>
  <el-dialog title="分类修改" width="40%" :visible.sync="dialogTableVisible" :before-close="handleclose">
    <el-form ref="create" :model="form" :rules="rules" label-width="80px">
      <el-form-item label="父分类" prop="pid">
        <el-select v-model="form.pid" placeholder="请选择角色">
          <el-option label="|-根分类" value="0"></el-option>
          <el-option
            v-for="item in categoryData"
            :key="item.id"
            :label="item.categoryname"
            :value="item.neworder"
          >|-{{item.neworder|strrepeat('--')}}{{item.categoryname}}</el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="分类名称" prop="categoryname">
        <el-input v-model="form.categoryname" autocomplete="off"></el-input>
      </el-form-item>

      <el-form-item label="分类排序" prop="categoryorder">
        <el-input v-model="form.categoryorder" autocomplete="off"></el-input>
      </el-form-item>
      <!--按钮-->
      <el-form-item>
        <el-button type="primary" @click="submit">立即创建</el-button>
        <el-button @click="handleCancel">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
<script>
import filters from "@/filter";
export default {
  name: "modifycreate",

  data() {
    return {
      dialogTableVisible: true,
      disabled: true,
      categoryData: [],
      form: {
        pid: "",
        categoryname: "",
        categoryorder: "",
        id: ""
      },
      rules: {
        pid: [
          {
            required: true,
            message: "请输入角色管理",
            trigger: "blur"
          }
        ],
        categoryname: [
          {
            required: true,
            message: "请输入角色管理",
            trigger: "blur"
          },
          {
            min: 2,
            max: 6,
            message: "长度在 2到 6个字符",
            trigger: "blur"
          }
        ],
        categoryorder: [
          {
            required: true,
            message: "请输入分类排序",
            trigger: "blur"
          },
          {
            min: 1,
            max: 2,
            message: "长度在 1 到 2个字符",
            trigger: "blur"
          }
        ]
      }
    };
  },
  filters,
  created() {
    //获取pid
    this.axios
      .get("/api/category/getAllData")
      .then(
        function(response) {
          if (response.data.code == 0) {
            this.categoryData = response.data.data;
          } else {
            this.$message(response.data.data.msg, "Error");
          }
        }.bind(this)
      )
      .catch(
        function(err) {
          this.message("服务器繁忙，请稍后重试11");
        }.bind(this)
      );
    this.getData();
  },
  methods: {
    handleclose(down) {
      this.$router.go(-1);
    },
    getData() {
      //用户默认数据
      let id = parseInt(this.$route.query.id);
      this.axios
        .get("/api/category/getRow", {
          params: { id: id }
        })
        .then(response => {
          if (response.data.code == 0) {
            this.form.pid = response.data.data.pid;
            this.form.categoryname = response.data.data.categoryname;
            this.form.categoryorder = response.data.data.categoryorder;
            this.form.id = response.data.data.id;
          } else {
            this.$message(response.data.msg, Error);
          }
        })
        .catch(
          function(err) {
            this.$message("服务器繁忙，请稍后重试");
          }.bind(this)
        );
    },
    //点击修改
    submit() {
      let _this = this;
      this.$refs["create"].validate(valid => {
        if (valid) {
          _this.axios
            .post("/api/category/edit", {
              params: {
                id: _this.form.id,
                categoryname: _this.form.categoryname,
                pid: _this.form.pid,
                categoryorder: _this.form.categoryorder
              }
            })
            .then(
              function(response) {
                alert(response.data.code);
                if (response.data.code == 0) {
                  this.dialogTableVisible = false;
                  this.$router.go(-1);
                } else {
                  console.log(response.data.msg);
                }
              }.bind(this)
            )
            .catch(
              function(error) {
                alert(error);
              }.bind(this)
            );
        } else {
          return false;
        }
      });
    },
    //返回上一级
    handleCancel() {
      this.dialogTableVisible = false;
      this.$router.go(-1);
    }
  }
};
</script>
