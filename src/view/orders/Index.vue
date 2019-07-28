<template>
  <div>
    <!-- 下拉选框 -->
    <div class="select">
      订单支付状态：
      <el-select v-model="value" placeholder="订单状态" @change="handleChange">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
    </div>
    <el-main>
      <el-table 
        :data="orderData" 
        height="500" 
        border 
        show-summary
        :summary-method="getSummaries"
        style="width: 100%"
      >
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-table :data="props.row.children" border style="width: 100%">
              <el-table-column prop="productionphoto" label="图片" width="150">
                <template slot-scope="scope">
                  <div class="cover-img">
                    <img :src="scope.row.productionphoto" width="50" />
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="productiontitle" label="标题"></el-table-column>
              <el-table-column prop="productionprice" label="价格" width="150"></el-table-column>
              <el-table-column prop="productionsize" label="尺码" width="150"></el-table-column>
              <el-table-column prop="productioncolor" label="颜色" width="150"></el-table-column>
            </el-table>
          </template>
        </el-table-column>
        <el-table-column prop="username" label="用户名" width="100"></el-table-column>
        <el-table-column prop="telphone" label="手机号" width="180"></el-table-column>
        <el-table-column prop="ordersn" label="订单编号"></el-table-column>
        <el-table-column prop="totalprice" label="订单金额"></el-table-column>
        <el-table-column prop="paymentstatus" label="订单状态">
          <template slot-scope="props">
            <el-button type="success" v-if="props.row.paymentstatus==1" plain size="mini">已支付</el-button>
            <el-button type="danger" v-else plain size="mini">未支付</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="addtime" label="下单时间">
          <template slot-scope="scope">{{ scope.row.addtime|timeformate('yyyy/MM/dd hh:mm:ss') }}</template>
        </el-table-column>
        <el-table-column prop="type" label="订单类型"></el-table-column>
      </el-table>
      <!-- <p class="total">
        <span>订单统计：</span>
        <span>共有{{orderNum}}个订单</span>
        <span>累计金额{{total}}.00元</span>
      </p> -->
      <el-pagination
        background
        :current-page.sync="currentPage"
        :page-size="pageSize"
        layout="prev, pager, next"
        @current-change="handleCurrentChange"
        :total="rowsTotal"
      ></el-pagination>
    </el-main>
  </div>
</template>
<script>
import filters from "@/filter";
export default {
  name: "OrdersIndex",
  data() {
    return {
      currentPage: 1,
      pageSize: 8,
      rowsTotal: 0,
      data: [],
      total:0,
      orderNum:0,
      orderData: [],
      options: [
        {
          value: "1",
          label: "已支付"
        },
        {
          value: "0",
          label: "未支付"
        },
        {
          value: "2",
          label: "全部订单"
        }
      ],
      value: "2"
    };
  },
  filters,
  watch:{
    $route(to,from){       
      if(to.path =='/orders/index'){
        this.getData()
      }
    }
  },
  created() {
    (this.params = {
      row: this.row,
      currentPath: this.$route.path
    }),
      this.getData();
  },
  methods: {
    getTotal(){
      this.orderNum=0
      this.total=0
      this.orderData.forEach(item=>{
        this.total+=parseFloat(item.totalprice)
        this.orderNum++
      })
    },
    filterData() {
      if (this.value == 0) {
        this.orderData = this.data.filter(item => {
          return item.paymentstatus == 0;
        });
      } else if (this.value == 1) {
        this.orderData = this.data.filter(item => {
          return item.paymentstatus == 1;
        });
      } else if (this.value == 2) {
        this.orderData = this.data;
      }
      this.getTotal()
    },
    handleChange() {
      this.filterData();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getData(); //获取对应数据
    },
    getData() {
      this.axios
        .get("/api/order/getAllData", {
          params: {
            currentpage: this.currentPage,
            pagesize: this.pageSize
          }
        })
        .then(res => {
          if (res.data.code == 0) {
            const data = res.data.data;
            // 初始化数据
            this.data = data.listdata;
            this.filterData();
            this.currentPage = parseInt(data.currentpage);
            this.pageSize = parseInt(data.pagesize);
            this.rowsTotal = parseInt(data.totalrows);
          } else {
            // alert(1)
            this.$msg.error(this);
          }
        })
        .catch(error => {
          console.log(error)
          this.$msg.error(this);
        });
    },
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 2) {
          sums[index] = "合计";
            return;
        }else  if (index == 4) {
          sums[index] = this.total+"元";
          return;
        }else  if (index == 3) {
          sums[index] = this.orderNum+"个订单";
          return;
        }
      })  
      return sums;
    }
  }
};
</script>
<style scoped>
.select {
  padding-left: 20px;
}
.select >>> .el-input {
  width: 120px;
}
.total span{
  display: inline-block;
  margin-right: 100px;
}
</style>
