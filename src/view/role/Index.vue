<template>
  <el-container>
		<!-- 编辑区域 -->
    <el-header style="height:auto;">
      <subnav :params="params"></subnav>
    </el-header>
		<!-- 列表区域 -->
    <el-main>
      <el-table :data="roleData" border @selection-change="handleSelectionChange" height="90%">
        <el-table-column type="selection"></el-table-column>
        <el-table-column prop="id" label="ID" width="60"></el-table-column>
        <el-table-column prop="rolename" label="角色名称" width="180"></el-table-column>
        <el-table-column prop="roleorder" label="排序" width="180"></el-table-column>
        <el-table-column label="权限">
          <template slot-scope="scope">{{scope.row.allowpathname.join(',')}}</template>
        </el-table-column>
      </el-table>
			<!-- 分页组件 -->
      <el-pagination
        background
        layout="total, prev, pager, next"
        :page-size="pageSize"
        :total="totalRows"
        :current-page="currentPage"
        @current-change="handleCurrentChange"
      ></el-pagination>
    </el-main>
		<!-- 占位符 -->
    <transition enter-active-class="bounceIn" mode="out-in" leave-active-class="bounceOut">
      <router-view name="role" class="animated"></router-view>
    </transition>
  </el-container>
</template>
<script>
/*引入子导航组件*/
import Subnav from "@/components/Subnav";
import animate from 'animate.css'
export default {
  name: "roleindex",
  data() {
    return {
      row: [],
      params: {},
      roleData: [],
      totalRows: 0,
      currentPage: 1,
      pageSize: 8
    };
  },
  activated() {
    this.getData();
  },
  components: { Subnav },
  created() {
    this.params = {
      row: this.row,
      currentPath: this.$route.path,
      adminId: this.$store.state.adminData.roleid
    };
    this.getData();
	},
	watch:{
    $route(to,from){       
      if(to.path =='/role/index'){
        this.getData()
      }
    }
  },
  methods: {
    getData() {
      this.axios
        .get("/api/role/getData", {
          params: {
            currentpage: this.currentPage,
            pagesize: this.pageSize
          }
        })
        .then(
          res=> {
            if (res.data.code == 0) {
							let data=res.data.data
              this.roleData = data.listdata;
              this.totalRows = parseInt(data.totalrows);
              this.currentPage = parseInt(data.currentpage);
              this.pageSize = parseInt(data.pagesize);
            } else {
              this.$msg.error(this)
            }
          }
        )
        .catch(
          ()=>{
            this.$msg.error(this)
          }
        );
    },
    handleSelectionChange(val) {
      this.params.row = val;
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getData();
    }
  }
};
</script>
<style scoped>

</style>