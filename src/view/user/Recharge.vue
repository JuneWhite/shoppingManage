<template>
  <div>
    <el-dialog title="充值" :visible.sync="dialogFormVisible" @close="handleClose">
      <!-- 表单 -->
      <el-form
        :model="form"
        status-icon
        :rules="rules"
        ref="form"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="用户名:" prop="username">
          <el-input placeholder="请输入用户名" v-model="form.username"></el-input>
        </el-form-item>
        <el-form-item label="充值金额:" prop="money">
          <el-input placeholder="请输入充值金额" v-model="form.money"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('form')">确 定</el-button>
          <el-button @click="handleCancel">取 消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "recharge",
  data() {
    return {
      dialogFormVisible: true,
      form: {
        username: "",
        money: "",
        accountid: ""
      },
      rules: {
        money: [
          { required: true, message: "请输入充值金额", trigger: "blur" },
          { min: 2, max: 5, message: "长度为2-5位数字", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getData();
  },
  methods: {
    handleClose(value) {
      this.$router.go(-1);
    },
    handleCancel() {
      this.dialogFormVisible = false;
    },
    submitForm(ruleForm) {
      this.dialogFormVisible = false;
      this.$refs[ruleForm].validate(valid => {
        if (valid) {
          // 提交修改
          this.recharge();
        } else {
          return false;
        }
      });
    },
    recharge() {
      alert(this.form.accountid);
      alert(this.form.money);
      this.axios
        .put("/api/user/recharge", {
          params: {
            accountid: this.form.accountid,
            balance: this.form.money
          }
        })
        .then(response => {
          console.log(response.data);
          if (response.data.code == 0) {
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
    getData() {
      let id = this.$route.query.id;
      //用户默认数据
      this.axios
        .get("/api/user/getRow", {
          params: {
            id: id
          }
        })
        .then(response => {
          if (response.data.code == 0) {
            console.log(response.data);
            this.form.username = response.data.data.username;
            this.form.accountid = response.data.data.accountid;
          } else {
            this.$message(response.data.msg, Error);
          }
        })
        .catch(
          function(err) {
            this.$message("服务器繁忙，请稍后重试");
          }.bind(this)
        );
    }
  }
};
</script>

<style>
</style>