<template>
  <span>
    <el-dialog title="管理员密码修改" :visible.sync="dialogFormVisible" @close="handleClose">
      <!-- 表单 -->
      <el-form
        :model="form"
        status-icon
        :rules="rules"
        ref="modify"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="用户名：" prop="userName">
          <el-input placeholder="请输入用户名" v-model="form.username" disabled="disabled"></el-input>
        </el-form-item>
        <el-form-item label="密码：" prop="userpassword">
          <el-input placeholder="请输入新密码" v-model="form.userpassword" show-password></el-input>
        </el-form-item>
        <el-form-item label="确认密码：" prop="repassword">
          <el-input placeholder="请再次输入密码" v-model="form.repassword" show-password></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="handleCancel">取 消</el-button>
          <el-button type="primary" @click="submit">确 定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </span>
</template>
<script>
export default {
  name: "admineditpassword",
  data() {
    return {
      form: {
        id: "",
        username: "",
        userpassword: "",
        repassword: ""
      },
      dialogFormVisible: true,
      rules: {
        userpassword: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, max: 20, message: "长度在 6 到 20 个字符", trigger: "blur" }
        ],
        repassword: [
          { required: true, message: "请再次输入密码", trigger: "blur" },
          {
            validator: function(rule, value, callback) {
              if (value != this.form.userpassword) {
                callback(new Error("确认密码不正确"))
              } else {
                callback()
              }
            }.bind(this),
            trigger: "blur"
          }
        ]
      }
    }
  },
  created() {
    this.getData()
  },
  methods: {
    getData(){
      this.axios
        .get("/api/admin/getrow", {
          params: { id: this.$route.query.id }
        })
        .then(
          (res)=>{
            if (res.data.code == 0) {
              this.form.id = res.data.data.id
              this.form.username = res.data.data.username
            } else {
              this.$msg.success(this)
            }
          }
        )
        .catch(
          ()=>{
            this.$msg.error(this)
          }
        )
    },
    postData(){
      this.axios
        .post("/api/admin/edit", {
          params: {
            username: this.form.username,
            userpassword: this.form.userpassword,
            id: this.form.id
          }
        })
        .then(res => {
          this.$message(res.msg)
          this.dialogFormVisible = false
        })
        .catch(() => {
          this.$msg.error(this)
        })
    },
    submit() {
      this.$refs['modify'].validate(valid => {
        if (valid) {
          this.postData()
        } else {
          return false
        }
      })
    },
    handleCancel() {
      this.dialogFormVisible = false
    },
    handleClose(down) {
      this.$router.go(-1)
    }
  }
}
</script>
<style scoped>
</style>
