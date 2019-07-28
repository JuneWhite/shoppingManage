<template>
  <div class="el-container is-vertical">
    <!-- 顶部导航栏 -->
    <header class="el-header">
      <el-menu
        :default-active="$route.path"
        class="el-menu-demo"
        mode="horizontal"
        background-color="#545c64"
        text-color="#fff"
        :router="true"
        active-text-color="#ffd04b"
      >
        <el-menu-item index="/home" style="min-width:160px;">电商管理中心</el-menu-item>
        <template v-for="nav in headerNav">
          <el-menu-item
            :key="nav.index"
            v-if="nav.moduletype == 1"
            :index="nav.modulepath"
          >{{nav.modulename}}</el-menu-item>
        </template>
        <el-submenu index="2" style="float:right;">
          <template
            slot="title"
          >{{this.$store.state.roleData.rolename}}-{{this.$store.state.adminData.username}}</template>
          <el-menu-item index="/admin/info">会员中心</el-menu-item>
          <el-menu-item index="/logout">退出</el-menu-item>
        </el-submenu>
      </el-menu>
    </header>
    <!-- 侧边栏 -->
    <div class="el-container" style="height:100%;">
      <div class="el-aside">
        <el-menu
          :default-active="$route.path"
          class="el-menu-vertical-demo"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
          :router="true"
        >
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>内容管理</span>
            </template>
            <template v-for="nav in headerNav">
              <el-menu-item
                :index="nav.modulepath"
                :key="nav.index"
                v-if="nav.moduletype == 2"
              >{{nav.modulename}}</el-menu-item>
            </template>
          </el-submenu>
          <el-submenu index="2">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>商城管理</span>
            </template>
            <template v-for="nav in headerNav">
              <el-menu-item
                :index="nav.modulepath"
                :key="nav.index"
                v-if="nav.moduletype == 3"
              >{{nav.modulename}}</el-menu-item>
            </template>
          </el-submenu>
        </el-menu>
      </div>
      <!-- 标签页 -->
      <div class="el-container is-vertical nav-tabs">
        <el-tabs
          type="card"
          closable
          v-model="activeName"
          @tab-remove="deletetabs"
          @tab-click="tabclick"
        >
          <el-tab-pane
            :label="item.label"
            :name="item.name"
            :key="item.key"
            v-for="item in editableTabs"
          ></el-tab-pane>
        </el-tabs>
        <!-- 主体区域 -->
        <div class="el-main">
          <transition enter-active-class="fadeIn" mode="out-in" :duration="{enter:500,leave:0}">
            <keep-alive>
              <router-view name="main" class="animated"></router-view>
            </keep-alive>
          </transition>
        </div>
        <!-- 页脚区域 -->
        <div class="el-footer">
          <span>联系方式：180XXXXXXXX</span>
          <span>联系地址：陕西省西安市雁塔区</span>
          <span>联系人：李XX</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import animate from "animate.css";
import {addRoute} from '@/function/tool'
export default {
  name: "platformindex",
  data() {
    return {
      activeIndex2: "/home",
      editableTabs: [],
      headerNav: []
    };
  },
  beforeCreate(){
    addRoute()
  },
  created() {
    let moduleData = this.$store.state.moduleData;
    this.headerNav = moduleData;
    this.editableTabs = this.$store.state.editableTabs;
  },
  computed: {
    activeName: {
      set() {
        return this.$store.state.activeName;
      },
      get() {
        return this.$store.state.activeName;
      }
    }
  },
  mounted() {
    this.$router.push(this.activeName);
  },
  methods: {
    tabclick(tab) {
      this.$router.push(tab.name);
    },
    deletetabs(tabname) {
      this.$store.commit("deleteTab", tabname);
      //最后一项
      let lastTab = this.$store.getters.editableTabsLast;
      this.$router.push(lastTab.name);
    }
  }
};
</script>
<style scoped>
.el-container {
  height: 100%;
}
.el-header {
  padding: 0;
}
.el-container {
  flex-direction: colume;
}
.el-aside {
  width: 160px;
  background: rgb(84, 92, 100);
  height: 100%;
}
.el-footer {
  height: 50px;
  line-height: 50px;
  background: #ccc;
  display: flex;
  justify-content: space-around;
}
.el-footer span {
  display: inline-block;
  font-size: 14px;
  color: #666;
}
.el-main {
  padding: 0;
}
.el-aside >>> .el-menu-item {
  min-width: 160px !important;
  padding-right: 0;
}
.nav-tabs >>> .is-active {
  /* background: #eee !important; */
}
</style>
