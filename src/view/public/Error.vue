<template>
  <div class="error">      
    <el-button type="success" plain @click="goBack">返回首页</el-button>   
    <h1>404 . . . . . . </h1>   
    <h1>你访问的页面已丢失</h1>   
    </div>
</template>
<script>
export default {
  methods: {
    goBack() {
      this.$router.push('/home')
    }
  }
}
</script>
<style scoped>
.error{
  padding: 20px;
  background-color:rgb(84, 92, 100);
  height: 100%;
}
h1{
  text-align: center;
  margin: 20px 0;
  color: white;
}
</style>
