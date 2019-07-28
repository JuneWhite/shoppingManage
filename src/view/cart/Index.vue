<template>
  <el-container>
    <el-header style="height:auto;">
      <subnav :params="params"></subnav>
    </el-header>
    <el-main>
      <el-table :data="cartData" height="90%" border @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="avatarUrl" label="头像" width="120">
          <template slot-scope="scope">
            <img :src="scope.row.avatarUrl" style="width:50px; height:50px;" />
          </template>
        </el-table-column>
        <el-table-column prop="username" label="姓名" width="180"></el-table-column>
        <el-table-column prop="telphone" label="电话" width="180"></el-table-column>
        <el-table-column prop="productiontotal" label="总量" width="180"></el-table-column>
      </el-table>
      <el-pagination
        background
        layout="total,prev, pager, next"
        :total="tolalrows"
        :page-size="pageSize"
        :current-page.sync="currentPage"
        @current-change="handleCurrentChange"
      ></el-pagination>
    </el-main>
    <transition enter-active-class="bounceIn" mode="out-in" leave-active-class="bounceOut">
      <router-view name="cart" class="animated"></router-view>
    </transition>
  </el-container>
</template>

<script>
import animate from 'animate.css'
import Subnav from "@/components/Subnav";
import filters from "@/filter";
export default {
  name: "Cartindex",
  data() {
    return {
      row: [],
      expands: [],
      cartData: [],
      tolalrows: 0, //总记录数
      pageSize: 1, //每页显示多少条
      currentPage: 1, //当前页
      params: []
    };
  },
  watch:{
    $route(to,from){       
      if(to.path =='/cart/index'){
        this.getData()
      }
    }
  },
  created() {
    this.params = {
      row: this.row,
      currentPath: this.$route.path
    };
    this.getData();
  },
  filters,
  components: { Subnav },
  methods: {
    getData() {
      this.axios
        .get("/api/cart/getData")
        .then(
          function(response) {
            if (response.data.code == 0) {
              let data = response.data.data;
              this.cartData = data.listdata;
              this.tolalrows = data.totalrows;
              this.currentPage = data.currentpage;
              this.pageSize = data.pagesize;
            } else {
              this.$message("服务器繁忙，请稍后重试1");
            }
          }.bind(this)
        )
        .catch(
          function(error) {
            this.$message("服务器繁忙，请稍后重试2");
          }.bind(this)
        );
    },

    handleCurrentChange(val) {
      this.row = val;
    },
    handleSelectionChange(val) {
      this.params.row = val;
    }
  }
};
</script>

<style scoped="scoped">
img {
  width: 100px;
  height: 100px;
}
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
</style>
