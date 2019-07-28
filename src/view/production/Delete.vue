<template></template>
<script>
export default {
  name: "Admindelete",
  data() {
    return {};
  },
  methods: {
    delAxios() {
      this.axios
        .delete("/api/production/delete", {
          params: {
            id: this.$route.query.id
          },
          headers: { token: sessionStorage.getItem("token") }
        })
        .then(
          function(response) {
            if (response.data.code == 0) {
              this.$router.go(-1);
            } else {
              this.$message("获取getrow数据失败");
            }
          }.bind(this)
        )
        .catch(
          function(error) {
            this.$message("getrow服务器访问失败");
          }.bind(this)
        );
    }
  },
  created() {
    this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    })
      .then(() => {
        this.delAxios();
        this.$message({
          type: "success",
          message: "删除成功!"
        });
      })
      .catch(() => {
        // this.$router.go(-1)
        this.$message({
          type: "info",
          message: "已取消删除"
        });
      });
  }
};
</script>
