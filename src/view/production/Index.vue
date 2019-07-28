<template>
  <el-container>
    <!-- 编辑区域 -->
    <el-header style="height:auto;">
      <subnav :params="params"></subnav>
    </el-header>
    <!-- 主体区域 -->
    <el-main>
      <!-- 产品搜索 -->
      <el-row>
        <el-form :inline="true" class="demo-form-inline">
          <el-form-item label="产品分类">
            <el-select v-model="searchcategoryid" placeholder="请选择产品类别" @change="changecategory">
              <el-option
                v-for="item in categoryData"
                :key="item.id"
                :label="item.categoryname"
                :value="item.id"
                :disabled="item.pid==0?true:false"
              ></el-option>
              <el-option label="全部" value></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="产品分类">
            <el-input v-model="searchname" width="40px" placeholder="请输入搜索名" @blur="changename"></el-input>
          </el-form-item>
        </el-form>
      </el-row>
      <!-- 表格区域 -->
      <el-table
        size="small"
        :default-sort="{prop: 'id', order: 'Ascending'}"
        :data="tableData"
        style="width: 100%"
        height="78%"
        border
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" show-overflow-tooltip></el-table-column>
        <!-- 展开栏 -->
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-row>
              <el-col :span="18">
                <el-row style="height:20px;">
                  <el-col :span="3" style="color:#99a9bf;">商品名称</el-col>
                  <el-col :span="20">{{ props.row.productiontitle }}</el-col>
                </el-row>
                <el-row>
                  <el-col :span="3" style="color:#99a9bf;">商品 ID</el-col>
                  <el-col :span="20">{{ props.row.id }}</el-col>
                </el-row>
                <el-row>
                  <el-col :span="3" style="color:#99a9bf;">商品价格</el-col>
                  <el-col :span="20">{{ props.row.productionprice }}</el-col>
                </el-row>
                <el-row>
                  <el-col :span="3" style="color:#99a9bf;">商品分类</el-col>
                  <el-col :span="20">{{ props.row.categoryname }}</el-col>
                </el-row>
                <el-row>
                  <el-col :span="3" style="color:#99a9bf;">商品规格</el-col>
                  <el-col :span="20">{{ props.row.productionsize }}</el-col>
                </el-row>
                <el-row>
                  <el-col :span="3" style="color:#99a9bf;">商品颜色</el-col>
                  <el-col :span="20">{{ props.row.producitoncolor }}</el-col>
                </el-row>
                <el-row>
                  <el-col :span="3" style="color:#99a9bf;">上架时间</el-col>
                  <el-col :span="20">{{ props.row.addtime|timeformate("yyyy-MM-dd hh:mm:ss") }}</el-col>
                </el-row>
                <el-row>
                  <el-col :span="3" style="color:#99a9bf;">商品描述</el-col>
                  <el-col :span="20">
                    <div class="listbox">
                      <div
                        class="lists"
                        v-for="(item,index) in props.row.productionparam.split(';')"
                        :key="index"
                      >{{ item }}</div>
                    </div>
                  </el-col>
                </el-row>
              </el-col>
              <el-col :span="6">
                <img :src="props.row.productionphoto" />
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column label="商品ID" prop="id" sortable width="100"></el-table-column>
        <el-table-column label="图片" width="80">
          <img slot-scope="scope" :src="scope.row.productionphoto" style="width:50px; height:50px;" />
        </el-table-column>
        <el-table-column label="分类名称" prop="categoryname" sortable></el-table-column>
        <el-table-column label="产品名称" prop="productiontitle" sortable></el-table-column>
        <el-table-column label="价格" prop="productionprice" width="80" sortable></el-table-column>
        <el-table-column label="上架时间" sortable>
          <template slot-scope="scope">{{scope.row.addtime|timeformate("yyyy/MM/dd hh:mm:ss")}}</template>
        </el-table-column>
      </el-table>
      <!-- 分页组件 -->
      <el-pagination
        background
        layout="total,prev, pager, next"
        :total="tolalrows"
        :page-size="pagesize"
        :current-page.sync="currentPage"
        @current-change="handleCurrentChange"
      ></el-pagination>
      <!-- 占位符 -->
      <transition enter-active-class="bounceIn" mode="out-in" leave-active-class="bounceOut">
        <router-view name="production" class="animated"></router-view>
      </transition>
    </el-main>
  </el-container>
</template>
<script>
import animate from 'animate.css'
// 引入子组件
import Subnav from "@/components/Subnav"
// 引入过滤器
import filters from "@/filter"
export default {
  name: "Productionindex",
  data() {
    return {
      categoryData: [],
      searchname: "",
      searchcategoryid: "",
      dialogFormVisible: [],
      tableData: [],
      row: [],
      params: {},
      tolalrows: 10,
      pagesize: 8,
      currentPage: 1,
      actiongroup: []
    }
  },
  components: { Subnav },
  filters,
  created() {
    (this.params = {
      row: this.row,
      currentPath: this.$route.path
    }),
    this.getData()
    let id = this.$route.query.id
    this.getAllData()
  },
  actived() {
    this.getData()
  },
  watch:{
    $route(to,from){       
      if(to.path =='/production/index'){
        this.getData()
      }
    }
  },
  methods: {
    getAllData(){
      this.axios
        .get("/api/category/getAllData")
        .then(
          function(res) {
            if (res.data.code == 0) {
              this.categoryData = res.data.data
            } else {
              this.$message(res.data.msg, "error")
            }
          }.bind(this)
        )
        .catch(
          function(error) {
            this.$message("服务器繁忙，请稍后重试")
          }.bind(this)
        )
    },
    changecategory() {
      this.changename()
    },
    changename() {
      let _this = this
      _this.axios
        .get("/api/production/getdata", {
          params: {
            productiontitle: this.searchname,
            categoryid: this.searchcategoryid
          }
        })
        .then(
          function(res) {
            if (res.data.code == 0) {
              this.tableData = res.data.data.listdata
              this.total = res.data.data.totalrows
              this.pagesize = parseInt(res.data.data.pagesize)
              this.currentPage = parseInt(res.data.data.currentpage)
            } else {
              alert(res.data.msg)
              this.$message(res.data.msg)
            }
          }.bind(this)
        )
        .catch(
          function(error) {
            this.$message(error)
          }.bind(this)
        )
    },
    handleSelectionChange(val) {
      this.params.row = val
    },
    handleSizeChange(val) {
      
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.getData()
    },
    getData() {
      let _this = this
      this.axios
        .get("/api/production/getData", {
          params: {
            currentpage: _this.currentPage,
            pagesize: _this.pagesize
          },
          headers: { token: sessionStorage.getItem("token") }
        })
        .then(
          function(res) {
            if (res.data.code == 0) {
              this.tableData = res.data.data.listdata
              this.tolalrows = res.data.data.totalrows
              this.pagesize = parseInt(res.data.data.pagesize)
              this.currentPage = parseInt(res.data.data.currentpage)
            } else {
              this.$message("获取production数据失败")
            }
          }.bind(this)
        )
        .catch(
          function(error) {
            this.$message("production服务器访问失败")
          }.bind(this)
        )
    }
  }
}
</script>
<style scoped>
.thumbnail {
  width: 50px;
  height: 50px;
  overflow: hidden;
}
img {
  height: 200px;
  width: 200px;
}
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 100px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 100%;
}
.listbox {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}
.listbox .lists {
  display: inline-block;
  height: 20px;
  width: 200px;
  line-height: 20px;
}
</style>
