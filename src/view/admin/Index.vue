<template>
  <el-container>
		<!-- 编辑区域 -->
    <el-header style="height:auto">
      <subnav :params="params"></subnav>
    </el-header>
		<!-- 主体区域 -->
    <el-main>
			<!-- 表格区域 -->
      <el-table :data="roleData" height="90%" border @selection-change="handleSelectionChange">
        <el-table-column type="selection"></el-table-column>
        <el-table-column prop="id" label="ID" width="60"></el-table-column>
        <el-table-column prop="rolename" label="角色名称" width="180"></el-table-column>
        <el-table-column prop="username" label="用户名" width="180"></el-table-column>
        <el-table-column label="最后一次登录时间">
          <template
            slot-scope="scope"
          >{{scope.row.lastlogintime|timeformate("yyyy-MM-dd hh:mm:ss")}}</template>
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
      <router-view name="admin" class="animated"></router-view>
    </transition>
  </el-container>
</template>
<script>
/*引入子导航组件*/
import Subnav from "@/components/Subnav"
import filters from "@/filter"
import animate from 'animate.css'
export default {
  name: "adminindex",
  data() {
    return {
      row: [],
      params: {},
      roleData: [],
      totalRows: 0,
      currentPage: 1,
      pageSize: 8
    }
	},
	watch:{
    $route(to,from){       
      if(to.path =='/admin/index'){
        this.getData()
      }
    }
  },
  components: { Subnav },
  filters,
  created() {
    this.params = {
      row: this.row,
      currentPath: this.$route.path
    }
  },
  activated() {
    this.getData()
  },
  methods: {
    handleSelectionChange(val) {
      this.params.row = val
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.getData() //获取对应数据
    },
    getData() {
      this.axios
        .get("/api/admin/getData", {
          params: {
            currentpage:this.currentPage,
            pagesize: this.pageSize
          }
        })
        .then(
          (res)=>{
            if (res.data.code == 0) {
							let data=res.data.data
              this.roleData = data.listdata
              this.totalRows = parseInt(data.totalrows)
              this.currentPage = parseInt(data.currentpage)
              this.pageSize = parseInt(data.pagesize)
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
    }
  }
}
</script>
<style scoped>
.el-container .el-main{ height: 200px !important }
</style>
