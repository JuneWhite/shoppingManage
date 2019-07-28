<template>
  <el-container>
    <el-header style="height:auto;">
      <subnav :params="params"></subnav>
    </el-header>
    <el-main>
      <el-table :data="categoryData" height="90%" border @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="id" label="Id" width="180"></el-table-column>
        <el-table-column prop="pid" label="pid" width="180"></el-table-column>
        <el-table-column label="分类名称" width="180">
          <template
            slot-scope="scope"
          >|-{{scope.row.neworder | strrepeat('--')}}{{scope.row.categoryname}}</template>
        </el-table-column>
        <el-table-column prop="categoryorder" label="分类排序" width="180"></el-table-column>
        <el-table-column label="添加时间" width="180">
          <template slot-scope="scope">{{scope.row.addtime | timeformate("yyyy-MM-dd hh:mm:ss")}}</template>
        </el-table-column>
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
      <router-view name="category" class="animated"></router-view>
    </transition>
  </el-container>
</template>

<script>
import Subnav from "@/components/Subnav";
import filters from "@/filter";
import animate from 'animate.css'
export default {
  name: "categoryindex",
  data() {
    return {
      row: [],
      categoryData: [],
      tolalrows: 0, //总记录数
      pageSize: 10, //每页显示多少条
      currentPage: 1, //当前页
      params: {}
    };
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
      this.getData();
  },
  activated() {
    this.getData();
  },
  watch:{
    $route(to,from){       
      if(to.path =='/category/index'){
        this.getData()
      }
    }
  },
  methods: {
    handleSelectionChange(val) {
      this.params.row = val;
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getData(); //获取对应数据
    },
    getData() {
      this.axios
        .get("/api/category/getdata",{
          params:{
            currentpage: this.currentPage,
            pagesize: this.pageSize
          }
        })
        .then(
          function(response) {
            if (response.data.code == 0) {
              let data = response.data.data;
              console.log(data)
              this.categoryData = data.listdata;
              this.tolalrows = parseInt(data.totalrows);
              this.currentPage = parseInt(data.currentpage);
              this.pageSize = parseInt(data.pagesize);
            } else {
              this.$message("服务器繁忙，请稍后重试");
            }
          }.bind(this)
        )
        .catch(
          function(error) {
            this.$message("服务器繁忙，请稍后重试");
          }.bind(this)
        );
    }
  }
};
</script>

<style>
</style>
