<template>
  <el-container>
    <el-header style="height:auto">
      <subnav :params="params"></subnav>
    </el-header>
    <el-main>
      <el-table
        :data="userData"
        border
        style="width: 100%"
        height="90%"
        @selection-change="handleSlectionChange"
      >
        <el-table-column type="selection" fixed></el-table-column>
        <el-table-column prop="avatarUrl" label="头像" fixed width="80">
          <template slot-scope="scope">
            <img :src="scope.row.avatarUrl" />
          </template>
        </el-table-column>
        <el-table-column prop="username" fixed label="姓名" width="80"></el-table-column>
        <el-table-column prop="telphone" fixed label="手机号" width="120"></el-table-column>
        <el-table-column prop="nickName" label="昵称" width="80"></el-table-column>
        <el-table-column prop="id" label="ID" width="80"></el-table-column>
        <el-table-column prop="openid" label="openid" width="80"></el-table-column>
        <el-table-column prop="gender" label="性别" width="80"></el-table-column>
        <el-table-column prop="province" label="省份" width="80"></el-table-column>
        <el-table-column prop="city" label="城市" width="80"></el-table-column>
        <el-table-column prop="authority" label="认证状态" width="80"></el-table-column>
        <el-table-column prop="authoritytime" label="认证时间" width="180">
          <template
            slot-scope="scope"
          >{{ scope.row.authoritytime|timeformate('yyyy/MM/dd hh:mm:ss') }}</template>
        </el-table-column>
        <el-table-column prop="addtime" label="添加时间" width="180">
          <template slot-scope="scope">{{ scope.row.addtime|timeformate('yyyy/MM/dd hh:mm:ss') }}</template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        @current-change="handleCurrentChange"
        :current-page.sync="currentPage"
        :page-size="pageSize"
        layout="total, prev, pager, next"
        :total="rowsTotal"
      ></el-pagination>
    </el-main>
    <transition enter-active-class="bounceIn" mode="out-in" leave-active-class="bounceOut">
      <router-view name="user" class="animated"></router-view>
    </transition>
  </el-container>
</template>
<script>
import animate from 'animate.css'
import Subnav from "@/components/Subnav"
import filters from "@/filter"
export default {
  created() {
    this.getData()
  },
  data() {
    return {
      row: [],
      params: {},
      userData: [],
      currentPage: 1,
      pageSize: 8,
      rowsTotal: 1,
      selected: []
    }
  },
  watch:{
    $route(to,from){       
      if(to.path =='/user/index'){
        this.getData()
      }
    }
  },
  components: {
    Subnav
  },
  filters,
  created() {
    (this.params = {
      row: this.row,
      currentPath: this.$route.path
    }),
      this.getData()
  },
  methods: {
    handleSlectionChange(val) {
      this.params.row = val
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.getData() //获取对应数据
    },
    //异步请求获取数据
    getData() {
      this.axios
        .get("/api/user/getData", {
          params: {
            currentpage: this.currentPage,
            pagesize: this.pagesize
          }
        })
        .then(res => {
          if (res.data.code == 0) {
            const data = res.data.data
            // 初始化数据
            this.userData = data.listdata
            this.currentpage = parseInt(data.currentpage)
            this.pagesize = parseInt(data.pagesize)
            this.rowsTotal = parseInt(data.totalrows)
          } else {
            this.$msg.error(this)
          }
        })
        .catch(error => {
          this.$msg.error(this)
        })
    }
  }
}
</script>
<style scoped>
img {
  width: 50px;
  height: 50px
}
</style>
