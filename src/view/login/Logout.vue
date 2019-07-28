<template>
  <div class="logout">
    <el-card class="box-card">
      <div class="text item" style="text-align:center;">安全退出</div>
      <div class="text item">
        <el-button @click="back" type="primary">返回</el-button>
        <el-button @click="quit" type="danger">退出</el-button>
      </div>
    </el-card>
  </div>
</template>
<script>
export default {
  name: "Logout",
  methods: {
		
    back() {
      this.$router.go(-1);
		},
		
    quit() {
      this.axios
        .get("/api/common/cleartoken")
        .then(res => {
          if (res.data.code == 0) {
            this.$store.commit("logout");
            this.$router.push("/login");
          } else {
            this.$msg.success(this)
          }
        })
        .catch(error => {
          this.$msg.error(this)
        });
    }
  }
};
</script>
<style scoped>
.logout {
  height: 100%;
  overflow: hidden;
  background-color: rgb(84, 92, 100);
}
.box-card {
  width: 300px;
  margin: 0 auto;
  margin-top: 20%;
}
.item {
  text-align: center;
  margin-top: 24px;
}
</style>
