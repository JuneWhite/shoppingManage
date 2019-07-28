<template>
  <el-dialog 
		title="角色添加" 
		:visible.sync="dialogTableVisible" 
		:before-close="handleclose"
		width="40%">
    <el-form ref="create" :model="form" :rules="rules" label-width="80px">
      <el-form-item label="用户名" prop="username">
        <el-input v-model="form.username"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="userpassword">
        <el-input v-model="form.userpassword" type="password"></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="repassword">
        <el-input v-model="form.repassword" type="password"></el-input>
      </el-form-item>
      <el-form-item label="权限" prop="roleid">
        <el-select v-model="form.roleid" placeholder="请选择">
          <el-option
            v-for="item in roleData"
            :key="item.id"
            :label="item.rolename"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submit">添加</el-button>
        <el-button @click="cancel" type="danger">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
<script>
export default {
  name: "admincreate",
  data() {
    return {
      dialogTableVisible: true,
      roleData: [],
      form: {
        username: "",
        userpassword: "",
        repassword: "",
        roleid: []
      },
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" }
        ],
        userpassword: [
          { required: true, message: "密码不能为空", trigger: "blur" },
          { min: 5, max: 20, message: "长度在 5 到 20 位数字", trigger: "blur" }
        ],
        repassword: [
          { required: true, message: "确认密码不能为空", trigger: "blur" },
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
        ],
        roleid: [{ required: true, message: "权限不能为空", trigger: "blur" }]
      }
    }
  },
  created() {
    this.getData()
  },
  methods: {
    getData(){
			this.axios
				.get("/api/role/getalldata")
				.then(
					(res)=>{
						if (res.data.code == 0) {
							this.roleData = res.data.data
						} else {
							this.$msg.error(this)
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
				.post("/api/admin/create", {
					params: {
						username: this.form.username,
						userpassword: this.form.userpassword,
						roleid: this.form.roleid
					}
				})
				.then(
					(res)=>{
						if (res.data.code == 0) {
							this.$message(res.data.msg)
							this.dialogTableVisible = false
							this.$msg.success(this)
							this.$router.go(-1)
						} else {							
							this.$msg.error(this)
						}
					}
				)
				.catch(
					()=>{
						this.$msg.error(this)
					}
				)
		},
    submit() {
      this.$refs["create"].validate(valid => {
        if (valid) {
					this.postData()
        } else {
          return false
        }
      })
    },
    cancel() {
      this.$router.go(-1)
		},
		handleclose() {
      this.$router.go(-1)
    }
  }
}
</script>
