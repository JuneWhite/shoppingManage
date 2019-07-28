<template>
  <div class="el-container">
    <el-main>
      <el-row>
        <el-col :span="18">
          <div id="myChart" :style="{height: '250px'}"></div>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="8">
          <h3>订单分析</h3>
          <div id="myChart2" :style="{height: '250px',width:'300px'}"></div>
        </el-col>
        <el-col :span="16">
          <h3>销量TOP10</h3>
          <div id="myChart3" :style="{height: '250px',width:'1000px'}"></div>
        </el-col>
      </el-row>
    </el-main>
  </div>
</template>
<script>
export default {
  name: "Home",
  data() {
    return {
      xAxisData: [],
      seriesData: [],
      orderSeriesData: [],
      htoGoodsTitle:[],
      hotGoodsSeriesData:[]
    };
  },
  mounted() {
    this.getProductionData();
    this.getOrderData();
    this.getHotGoodsData()
  },
  methods: {
    getProductionData() {
      this.axios
        .get("/api/production/getStatisticsData")
        .then(
          function(response) {
            if (response.data.code == 0) {
              for (let i in response.data.data) {
                this.xAxisData.push(response.data.data[i]["categoryname"]);
                this.seriesData.push(response.data.data[i]["total"]);
              }
              this.drawLine();
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
    },
    getOrderData() {
      this.axios
        .get("/api/order/getStatisticsData")
        .then(
          function(response) {
            if (response.data.code == 0) {
              for (let i in response.data.data) {
                if (response.data.data[i]["paymentstatus"] == 0) {
                  this.orderSeriesData.push({
                    value: response.data.data[i]["total"],
                    name: "未支付"
                  });
                } else {
                  this.orderSeriesData.push({
                    value: response.data.data[i]["total"],
                    name: "已支付"
                  });
                }
                this.drawPie2();
              }
              this.drawLine();
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
    },
    getHotGoodsData(){
      this.axios
        .get("/api/order/getTop10StatisticsData")
        .then(
          function(response) {
            if (response.data.code == 0) {
              console.log(response.data.data)
              for (let i in response.data.data) {
                this.hotGoodsSeriesData.push({
                    value: response.data.data[i]["total"],
                    name: response.data.data[i]["productiontitle"]
                  })
                  this.htoGoodsTitle.push(response.data.data[i]["productiontitle"])
                this.drawPie3();
              }
              this.drawLine();
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
    },
    drawLine() {
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(document.getElementById("myChart"));
      // 绘制图表
      myChart.setOption({
        title: { text: "产品分析" },
        xAxis: {
          data: this.xAxisData
        },
        yAxis: {},
        series: [
          {
            name: "销量",
            type: "bar",
            data: this.seriesData
          }
        ]
      });
    },
    drawPie2() {
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(document.getElementById("myChart2"));
      myChart.setOption({
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b}: {c} ({d}%)"
        },
        legend: {
          orient: "vertical",
          x: "left",
          data: ["已支付", "未支付"]
        },
        series: [
          {
            name: "订单状态",
            type: "pie",
            radius: ["50%", "70%"],
            avoidLabelOverlap: true,
            label: {
              normal: {
                show: false,
                position: "center"
              },
              emphasis: {
                show: true,
                textStyle: {
                  fontSize: "30",
                  fontWeight: "bold"
                }
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            data: this.orderSeriesData
          }
        ]
      });
    },
    drawPie3() {
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(document.getElementById("myChart3"));
      myChart.setOption({
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b}: {c} ({d}%)"
        },
        legend: {
          orient: "vertical",
          x: "left",
          data: this.htoGoodsTitle
        },
        series: [
          {
            name: "销量Top10",
            type: "pie",
            radius: ["50%", "70%"],
            avoidLabelOverlap: true,
            label: {
              normal: {
                show: false,
                position: "center"
              },
              emphasis: {
                show: true,
                textStyle: {
                  fontSize: "14"
                }
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            data: this.hotGoodsSeriesData
          }
        ]
      });
    }
  }
};
</script>
<style scoped>
</style>
