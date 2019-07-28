<template>
  <el-container>
    <div class="login">
      <el-form
        :model="ruleForm"
        status-icon
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="用户名：" prop="userName">
          <el-input placeholder="请输入内容" v-model="ruleForm.userName"></el-input>
        </el-form-item>
        <el-form-item label="密码：" prop="pass">
          <el-input placeholder="请输入密码" v-model="ruleForm.pass" show-password></el-input>
        </el-form-item>
        <el-checkbox v-model="ruleForm.checked">记住账号和密码</el-checkbox>
        <br />
        <el-button type="primary" @click="submitForm('ruleForm')" :loading="loading">立即创建</el-button>
      </el-form>
    </div>
  </el-container>
</template>
<script>
import { setInterval, setTimeout } from "timers";
export default {
  name: "Login",
  data() {
    return {
      loading: false,
      ruleForm: {
        checked: true,
        userName: "",
        pass: ""
			},			
      rules: {
        userName: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 2, max: 5, message: "长度在 2 到 5 个字符", trigger: "blur" }
        ],
        pass: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 20,
            message: "长度在 6 到 20 个字符",
            trigger: "blur"
          }
        ]
      }
    };
  },
  methods: {
    submitForm(ruleForm) {
      this.$refs[ruleForm].validate(valid => {
        if (valid) {
          this.loading = true;
          // 获取token令牌
          this.axios
            .get("/api/common/token")
            .then(res => {
              if (res.data.code == 0) {
                this.$store.commit("setToken", res.data.data.token);
                //获取用户信息
                this.getUserData();
              } else {
                this.$msg.error(this);
              }
            })
            .catch(error => {
              this.$msg.error(this);
            });
        } else {
          return false;
        }
      });
		},
		
    getUserData() {
      this.axios
        .get("/api/admin/checklogin/", {
          params: {
            username: this.ruleForm.userName,
            userpassword: this.ruleForm.pass
          },
          headers: { token: this.$store.state.token }
        })
        .then(res => {
          if (res.data.code == 0) {
            // 登陆成功
            let adminData = res.data.data.admindata;
            let roleData = res.data.data.roledata;
            let moduleData = res.data.data.moduledata;
            this.$store.commit("appInit", {
              adminData,
              roleData,
              moduleData
            });
            // this.$router.go();
            this.$router.push("/");
            this.loading = false;
            this.$msg.success(this);
          } else {
            this.$msg.error(this);
          }
        })
        .catch(error => {
          this.$msg.error(this);
        });
    }
  }
};
</script>
<style scoped>
.el-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  background-color: rgb(84, 92, 100);
}
.login {
  width: 300px;
  border: 1px solid #000;
  border-radius: 10px;
  background-color: #fff;
  padding: 20px;
  box-shadow: 0 0 10px #fff;
}
.login >>> .el-input__inner {
  background-color: #eee;
}
.el-button--primary {
  margin-top: 10px;
  width: 100%;
}
.el-checkbox {
  margin-left: 100px;
}
</style>
