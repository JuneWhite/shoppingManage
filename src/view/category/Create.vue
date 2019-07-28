<template>
  <el-dialog title="分类添加" width="40%" :visible.sync="dialogFormVisible" :before-close="headClose" status-icon>
    <!--表单-->
    <el-form ref="form" label-width="80px" :rules="rules" :model="form">
      <el-form-item label="父分类" prop="pid">
        <el-select v-model="form.pid" placeholder="请选择ID">
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
      <el-form-item>
        <el-button type="primary" size="medium" @click="submit('form')">立即添加</el-button>
        <el-button type="primary" size="medium" @click="headClose">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
<script>
import filters from "@/filter";
export default {
  name: "Categorycreate",
  data() {
    return {
      dialogFormVisible: true,
      categoryData: [],
      form: {
        pid: [],
        categoryname: "",
        categoryorder: "",
        categorytype: ""
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
    this.getRoleData();
  },
  methods: {
    getRoleData() {
      let _this = this;
      this.axios
        .get("/api/category/getAlldata")
        .then(res => {
          if (res.data.code == 0) {
            //neworder
            _this.categoryData = res.data.data;
          } else {
            this.message("服务器繁忙，请稍后重试11");
          }
        })
        .catch(function(error) {
          alert("服务器繁忙，请稍后重试22");
        });
    },
    headClose() {
      this.$router.go(-1);
    },
    //传送id
    postId() {
      let _this = this;
      this.axios
        .post("/api/category/create", {
          params: {
            pid: _this.form.pid,
            categoryname: _this.form.categoryname,
            categoryorder: _this.form.categoryorder,
            categorytype: _this.form.categorytype
          }
        })
        .then(res => {
          this.$message(response.data.msg);
        })
        .catch(error => {
          this.$message(response.data.msg);
        });
    },
    submit(form) {
      this.$router.go(-1);
      this.dialogFormVisible = false;
      this.$refs[form].validate(valid => {
        if (valid) {
          this.postId();
          this.$message("成功");
        } else {
          this.$message("失败");
        }
      });
    },
    handleClick() {}
  }
};
</script>

<style scoped="scoped">
</style>
