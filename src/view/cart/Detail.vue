<template>
  <el-dialog
    title="购物详情"
    :visible.sync="dialogFormVisible"
    :before-close="headClose"
    status-icon
    width="80%"
  >
    <el-row>
      <el-col :span="7">
        <div class="top" :model="cardData">
          <div class="img">
            <img :src="cardData.avatarUrl" />
          </div>
          <div class="content">
            <span>姓名:{{cardData.username}}</span>
            <span>电话:{{cardData.telphone}}</span>
            <span>订单量:{{cardData.productiontotal}}</span>
          </div>
        </div>
      </el-col>
      <el-col :span="17">
        <el-table :data="cartData" height="400" border style="width: 100%">
          <el-table-column prop="accountid" label="商品 ID"></el-table-column>
          <el-table-column prop="productiontitle" label="商品名称" width="180"></el-table-column>
          <el-table-column prop="productionnum" label="数量"></el-table-column>
          <el-table-column label="图片" style="width: 100px;">
            <template slot-scope="scope">
              <img :src="scope.row.productionphoto" style="width:50px; height:50px;" />
            </template>
          </el-table-column>
          <el-table-column prop="productionsize" label="尺寸"></el-table-column>
          <el-table-column prop="productioncolor" label="颜色"></el-table-column>
          <el-table-column prop="productionprice" label="价格"></el-table-column>
        </el-table>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import filters from "@/filter";
export default {
  name: "Cartdetail",
  data() {
    return {
      cardData: [], //卡片
      dialogFormVisible: true,
      cartData: [] //表格
    };
  },
  filters,
  created() {
    this.getData();
  },
  beforeRouteUpdate(to, from, next) {
    this.getData();
    next();
  },
  methods: {
    headClose() {
      this.$router.go(-1);
    },
    getData() {
      let _this = this;
      this.axios
        .get("/api/cart/getpageRow", {
          params: {
            id: this.$route.query.id
          }
        })
        .then(
          function(response) {
            if (response.data.code == 0) {
              let data = response.data.data;
              this.cartData = response.data.cartdetaildata;
              console.log(this.cartData);
              this.cardData = response.data.data;
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
    }
  }
};
</script>

<style scoped="scoped">
.top {
  width: 200px;
  border: #000 1px solid;
  border-radius: 5px;
  text-align: center;
  margin: 10px auto;
}
.top .img {
  width: 60%;

  margin-left: 20%;
}
.content {
  margin-top: 20px;
  margin-bottom: 20px;
  line-height: 30px;
}
.content span {
  text-align: center;
  display: block;
}
img {
  width: 100px;
  height: 100px;
}
</style>
