<template>
  <el-row :gutter="40">
    <el-col :span="8">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>用户信息</span>
        </div>
        <div class="text item">用户名: {{this.$store.state.adminData.username}}</div>
        <div class="text item">
          最近登录:
          {{this.$store.state.adminData.lastlogintime|timeformate("yyyy-MM-dd hh:mm:ss")}}
        </div>
      </el-card>
    </el-col>
    <el-col :span="8">
      <el-card class="box-card grid-content">
        <div slot="header" class="clearfix">
          <span>角色信息</span>
        </div>
        <div class="text item">角色名称: {{this.$store.state.roleData.rolename}}</div>
        <div class="text item">
          角色排序:
          {{this.$store.state.roleData.roleorder}}
        </div>
      </el-card>
    </el-col>
    <el-col :span="8">
      <el-card class="box-card grid-content">
        <div slot="header" class="clearfix">
          <span>权限信息</span>
        </div>
        <div class="text item">
          <el-tree :data="treeData" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
        </div>
      </el-card>
    </el-col>
  </el-row>
</template>
<script>
import filters from "@/filter";
export default {
  name: "Admininfo",
  computed: {
    treeData() {
      for (let i in this.$store.state.moduleData) {
        this.$store.state.moduleData[i]["label"] = this.$store.state.moduleData[
          i
        ]["modulename"];
        if (this.$store.state.moduleData[i]["children"]) {
          for (let j in this.$store.state.moduleData[i]["children"]) {
            this.$store.state.moduleData[i]["children"][j][
              "label"
            ] = this.$store.state.moduleData[i]["children"][j]["modulename"];
          }
        }
      }
      return this.$store.state.moduleData;
    }
  },
  data() {
    return {
      allowPath: [],
      defaultProps:'',
      form: [
        {
          username: "11",
          rolename: "11",
          lastlogintime: ""
        }
      ],
      id: ""
    };
  },
  methods:{
    handleNodeClick(){
      
    }
  },
  filters
};
</script>
<style scoped>
.el-row {
  margin-bottom: 20px;
  width: 80%;
  margin-left: 10% !important;
  margin-top: 20px;
}
.el-row:last-child {
  margin-bottom: 0;
}
.el-col {
  border-radius: 4px;
}
.bg-purple-dark {
  background: #99a9bf;
}
.bg-purple {
  background: #d3dce6;
}
.bg-purple-light {
  background: #e5e9f2;
}
.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}
</style>
