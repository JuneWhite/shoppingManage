<template>
  <el-button-group>
    <el-button
			type="primary"
			size="small"
      @click="action(item);"
      v-for="(item, key) in actiongroup"
      :key="key"
    >{{item.modulename}}</el-button>
  </el-button-group>
</template>
<script>
export default {
  name: "subnav",
  props: ["params"],
  data() {
    return {
      actiongroup: []
    };
  },
  created() {
    for (let i in this.$store.state.moduleData) {
      if (
        this.$store.state.moduleData[i]["modulepath"] == this.params.currentPath
      ) {
        this.actiongroup = this.$store.state.moduleData[i]["children"];
        break;
      }
    }
  },
  methods: {
    action(actionmodule) {
			// 添加
      if (actionmodule.actiontype == 0) {
        let id = 0;
        if (this.params.adminId) {
          id = this.params.adminId;
        }
        this.$router.push({ path: actionmodule.modulepath, query: { id: id } });
      } else if (actionmodule.actiontype == 1) {
        // 修改 必须有一个必选
        if (this.params.row.length == 1) {
          this.$router.push({
            path: actionmodule.modulepath,
            query: { id: this.params.row[0].id }
          });
        } else {
					this.$msg.warning(this,'必须选择一项')
        }
      } else {
        // 删除 至少选一个
        if (this.params.row.length >= 1) {
          let ids = [];
          for (let i in this.params.row) {
            ids.push(this.params.row[i]["id"]);
          }
          this.$router.push({
            path: actionmodule.modulepath,
            query: { id: ids }
          });
        } else {
					this.$msg.warning(this,'至少选择一项')
        }
      }
    }
  }
};
</script>
