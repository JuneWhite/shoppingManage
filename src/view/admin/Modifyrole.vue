<template>
  <span>
    <el-dialog title="管理员权限修改" :visible.sync="dialogFormVisible" @close="handleClose">
      <!-- 表单 -->
      <el-form
        :model="form"
        status-icon
        :rules="rules"
        ref="form"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="用户名：" prop="username">
          <el-input placeholder="请输入用户名" v-model="form.username" disabled="disabled"></el-input>
        </el-form-item>
        <el-form-item label="角色名称" prop="roleid">
          <el-select v-model="form.roleid" placeholder="请选择角色">
            <el-option
              v-for="item in form.roleData"
              :key="item.id"
              :label="item.rolename"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button @click="handleCancel">取 消</el-button>
          <el-button type="primary" @click="submitForm">确 定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </span>
</template>
<script>
export default {
  name: "adminModifyRole",
  data() {
    return {
      form: {
        username: "",
        roleData: [],
        roleid: "",
        id: ""
      },
      dialogFormVisible: true,
      formLabelWidth: "80px",
      rules: {
        roleid:{ required: true, message: "请输入密码", trigger: "blur" }
      }
    }
  },
  created() {
    this.getData()
    this.getRoleData()
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
              this.form.roleid = res.data.data.roleid
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
    getRoleData() {
      this.axios
        .get("/api/role/getalldata")
        .then(res => {
          if (res.data.code == 0) {
            this.form.roleData = res.data.data
          } else {
            this.$msg.success(this)
          }
        })
        .catch(error => {
          this.$msg.error(this)
        })
    },
    postData(){
      this.axios
        .post("/api/admin/edit", {
          params: {
            id: this.form.id,
            username: this.form.username,
            roleid: this.form.roleid
          }
        })
        .then(res => {
          // 修改成功
          this.$msg.success(this)
        })
        .catch(error => {
          this.$msg.error(this)
        })
    },   
    submitForm() {
      this.dialogFormVisible = false
      this.$refs['form'].validate(valid => {
        if (valid) {
          // 提交修改
          this.postData()
        } else {
          return false
        }
      })
    },
    handleClose() {
      this.$router.go(-1)
    },
    handleCancel() {
      this.dialogFormVisible = false
    }
  }
}
</script>
<style scoped>
</style>
