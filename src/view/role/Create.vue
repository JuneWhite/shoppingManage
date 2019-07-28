<template>
	<el-dialog
    title="角色添加"
    :visible.sync="dialogTableVisible"
    :before-close="handleclose"
    width="60%"
  >
    <el-form ref="create" :model="form" :rules="rules" label-width="80px">
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
        <el-button type="primary" @click="submit">添加</el-button>
        <el-button @click="cancel" type="danger">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
<script>
export default {
  name: "rolecreate",
  data() {
    return {
      dialogTableVisible: true,
      allowPath: [],
      form: {
        rolename: "",
        roleorder: "",
        allowmodule: []
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
    handleclose(down) {
      this.$router.go(-1)
		},
		getData(){
			this.axios
      .get("/api/role/getrow", {
        params: { id: this.$route.query.id }
      })
      .then(
        res=>{
          if (res.data.code == 0) {
            this.allowPath = res.data.data.moduleData
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
				.post("/api/role/create", {
					params: {
						rolename: this.form.rolename,
						roleorder: this.form.roleorder,
						allowmodule: this.form.allowmodule
					}
				})
				.then(
					res=>{
						if (res.data.code == 0) {
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
    }
  }
}
</script>
