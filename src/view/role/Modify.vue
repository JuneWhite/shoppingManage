<template>
  <el-dialog 
		title="角色修改" 
		:visible.sync="dialogTableVisible" 
		:before-close="handleclose"
		width="60%">
    <el-form ref="modify" :model="form" :rules="rules" label-width="80px">
      <el-form-item label="角色名称" prop="rolename">
        <el-input v-model="form.rolename" style="width:150px"></el-input>
      </el-form-item>
      <el-form-item label="角色排序" prop="roleorder">
        <el-input v-model="form.roleorder" style="width:150px"></el-input>
      </el-form-item>
      <el-form-item label="权限" prop="allowmodule">
        <el-checkbox-group v-model="form.allowmodule">
          <el-checkbox
            :label="item.id"
            v-for="(item, key) in allowPath"
            :key="key"
          >{{item.modulename}}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submit">修改</el-button>
        <el-button @click="cancel" type="danger">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
<script>
export default {
  name: "roleedit",
  data() {
    return {
      dialogTableVisible: true,
      allowPath: [],
      form: {
        id: 0,
        rolename: "",
        roleorder: "",
        allowmodule: [1, 2, 3, 4]
      },
      rules: {
        rolename: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" }
        ],
        roleorder: [
          { required: true, message: "角色排序不能为空", trigger: "blur" },
          { number: true, message: "角色排序只能是数字", trigger: "blur" },
          { min: 1, max: 2, message: "长度在 1 到 2 位数字", trigger: "blur" }
        ],
        allowmodule: [
          { required: true, message: "角色权限不能为空", trigger: "blur" }
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
				.get("/api/role/getrow", {
					params: { id: this.$route.query.id }
				})
				.then(
					(res)=>{
						if (res.data.code == 0) {
							let data=res.data.data
							this.allowPath = data.moduleData
							this.form.id = data.roleData.id
							this.form.rolename = data.roleData.rolename
							this.form.roleorder = data.roleData.roleorder
							this.form.allowmodule = eval(
								"[" + data.roleData.allowmodule + "]"
							)
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
				.post("/api/role/edit", {
					params: {
						rolename: this.form.rolename,
						roleorder: this.form.roleorder,
						allowmodule: this.form.allowmodule,
						id: this.form.id
					}
				})
				.then(
					(res)=>{
						if (res.data.code == 0) {
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
      this.$refs["modify"].validate(valid => {
        if (valid) {
        this.postData()
        } else {
          this.$msg.error(this)
          return false
        }
      })
		},
		handleclose() {
      this.$router.go(-1)
    },
    cancel() {
      this.$router.go(-1)
    }
  }
}
</script>
