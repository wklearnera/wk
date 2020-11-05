<template>
  <el-container>
    <!-- 头部 -->
    <el-header>
      <div class="logobox">
        <img
          src="../assets/logo.png"
          alt=""
        >
        <span>电商后台管理系统</span>
      </div>
      <el-button
        type='info'
        @click="logout"
      > 退出</el-button>
    </el-header>
    <!-- 页面主体 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div
          class="toggle-button"
          @click="togglrCollapse"
        >
          |||
        </div>
        <el-menu
          background-color="#373d41"
          text-color="#fff"
          active-text-color="#409eff"
          :router="true"
          :unique-opened="true"
          :collapse="isCollapse"
          :collapse-transition="false"
          :default-active="activePath"
        >
          <!-- 一级 -->
          <!-- index只接受字符串不接受数值 通过在后边拼接空格变为字符串 -->
          <el-submenu
            :index="item.id + ' '"
            v-for="item in menulist"
            :key="item.id"
          >
            <!-- 一级模板 -->
            <template slot="title">
              <!-- 图标 -->
              <i :class="iconObj[item.id]"></i>
              <span>{{item.authName}}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item
              :index="'/' + subItem.path"
              v-for="subItem in item.children"
              :key="subItem.id"
              @click="savenavState('/' + subItem.path)"
            >
              <!-- 二级模板 @click="savenavState("'/' + subItem.path")" -->
              <template slot="title">
                <!-- 图标 -->
                <i class="el-icon-menu"></i>
                <span>{{ subItem.authName }}</span>
              </template>
            </el-menu-item>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右侧内容主体 -->
      <el-main>
          <!-- 路由占位符 -->
          <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      //左侧菜单数据
      menulist: [],
      iconObj: {
        '125': 'iconfont icon-users',
        '103': 'iconfont icon-tijikongjian',
        '101': 'iconfont icon-shangpin',
        '102': 'iconfont icon-danju',
        '145': 'iconfont icon-baobiao'
      },
      isCollapse: false,    
      activePath: ''
    }
  },
  // 钩子函数创建后调用
  created() {
    this.getMenuList()
    this.activePath = window.sessionStorage.getItem('activePath')
  },

  methods: {
    logout() {
      window.sessionStorage.clear();
      this.$router.push('/login')
    },
    // 获取所有菜单
    async getMenuList() {
      //解构赋值
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.menulist = res.data
    },
    // 点击按钮切换菜单的折叠与展开
    togglrCollapse() {
      this.isCollapse = !this.isCollapse
    },
    savenavState(activePath){
        window.sessionStorage.setItem('activePath', activePath)
    }
  },
}
</script>

<style lang="less" scoped>
.el-container {
  height: 100%;
}

.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  padding-left: 0%;
  align-items: center;
  color: #fff;
  font-size: 1.2em;
  > div {
    display: flex;
    align-items: center;
  }
  span {
    margin-left: 15px;
  }
}
.el-aside {
  background-color: #333744;
  .el-menu {
    border-right: none;
  }
}
.el-main {
  background-color: #eaedf1;
}
.iconfont {
  margin-right: 10px;
}
.toggle-button {
  background-color: #4a5064;
  font-size: 10px;
  line-height: 24px;
  text-align: center;
  color: #fff;
  letter-spacing: 0.2em;
  cursor: pointer;
}
.logobox{
  height: 80%;
  width: 30%
}
.logobox img{
  width: 15%;
  height: 100%;
  border-radius: 50%;
}
</style>