<template>
</template>
<script>
export default {
  name:'adminRemove',
  data() {
    return {
      id:[]
    }
  },
  created(){
    // 获取id数据
    let arr=this.$route.query.id
    if(arr){
      arr.forEach(item => {
        this.id.push(item)
      })
    }
    // 执行删除操作
    this.handleRemove()
  },
  methods:{
    // 删除axios发送
    deleteAdminData(){
      this.axios.delete('/api/admin/delete',{
        params:{
          id:this.id
        }
      }).then((res)=>{ 
        // 删除成功
        this.$msg.success(this)
      }).catch((error)=>{
        this.$msg.error(this)
      })
    },
    // 删除弹出页面
    handleRemove(){
      const h = this.$createElement;
      this.$msgbox({
        title: '删除确认',
        message: h('p', null, [
          h('span', null, '您确定删除该项吗？'),
          h('span', { style: 'color: red' }, '（删除之后不可恢复）')
        ]),
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        beforeClose: (action, instance, done) => {
          // action、instance、done 都是组件自带的
          // action标记你当前的操作——confirm（确认）
          if (action === 'confirm') {
            instance.confirmButtonLoading = true;
            instance.confirmButtonText = '删除中...';
            setTimeout(() => {
              this.deleteAdminData()              
              done();
              setTimeout(() => {
                instance.confirmButtonLoading = false;
                this.$router.go(-1)
              }, 300);
            }, 500);
          } else {
            done();
          }
        }
      }).then(action => {//回调函数
        
      }).catch(() => {
        this.$router.go(-1)
      })
    },
    handleclose(){
      this.$router.go(-1)
    }
  }
}
</script>
<style scoped>

</style>


