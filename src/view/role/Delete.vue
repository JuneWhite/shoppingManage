<template>
</template>
<script>
export default {
  name: 'roleremove',
  created(){
    this.handleRemove()
  },
  methods: {
    handleclose(){
      this.$router.go(-1)
    },
    remove() {
      this.axios.delete('/api/role/delete', {
        params:{id:this.$route.query.id}
      })
        .then((res)=>{
          if (res.data.code == 0) {
            this.$msg.success(this)
          } else {
            this.$msg.error(this)
          }
        })
        .catch(()=>{
          this.$msg.error(this)
        })
    },
    handleRemove(){
      const h = this.$createElement
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
            instance.confirmButtonLoading = true
            instance.confirmButtonText = '删除中...'
            setTimeout(() => {
              this.remove()              
              done()
              setTimeout(() => {
                instance.confirmButtonLoading = false
                this.$router.go(-1)
              }, 300)
            }, 500)
          } else {
            done()
          }
        }
      }).then(action => {//回调函数
        
      }).catch(() => {
        this.$router.go(-1)
      })
    }
  }
}
</script>
