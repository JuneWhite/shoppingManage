import Vue from 'vue'

class Msg {
	success(that) {
		that.$message({
			message: "恭喜你，操作成功了！！！",
			type: 'success'
		})
	}
	error(that) {
		that.$message({
			message: "服务器忙，请稍后重试！！！",
			type: 'error'
		})
	}
	warning(that,content){
		that.$message({
			message: content,
			type: 'warning'
		})
	}
}

Msg.install = function () {
	Vue.mixin({
		beforeCreate() {
			if (this.$options.msg) {
				Vue.prototype.$msg = this.$options.msg;
			}
		}
	})
}

Vue.use(Msg)

export default new Msg()
