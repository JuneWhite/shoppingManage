<template>
  <div class="Roledelete">
    <el-dialog title="提示" :visible.sync="dialogFormVisible">
      <span>删除？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel">取消</el-button>
        <el-button @click="remove">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "cateDelete",
  data() {
    return {
      dialogFormVisible: true
    };
  },
  methods: {
    handleclose(down) {
      this.$router.go(-1);
    },
    cancel() {
      this.$router.go(-1);
    },
    remove() {
      let id = this.$route.query.id;

      this.axios
        .delete("/api/category/delete", {
          params: { id: id }
        })
        .then(
          function(response) {
            if (response.data.code == 0) {
              console.log(response);
              this.$message("成功");
              this.$router.go(-1);
            } else {
              this.$message("访问错误");
            }
          }.bind(this)
        )
        .catch(
          function(error) {
            this.$message("获取失败");
          }.bind(this)
        );
    }
  } //methods结束
};
</script>

<style>
</style>