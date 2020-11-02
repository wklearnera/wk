<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- card -->
    <el-card>
      <div style="margin-top: 15px;">
        <!-- 搜索与添加 -->
        <el-row :gutter="20">
          <el-col :span="7">
            <el-input placeholder="请输入内容">
              <el-button
                slot="append"
                icon="el-icon-search"
              ></el-button>
            </el-input>
          </el-col>
          <el-col :span="4">
              <el-button type="primary">添加用户</el-button>
          </el-col>
        </el-row>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
    data() {
        return {
            //获取用户列表的参数对象
            queryInfo: {
                query:'',
                pagenum:1,
                pagesize:2 
            }
        }
    },
    created() {
        this.getUserList();
    },
    methods: {
        async getUserList(){
            const{data:res} = await this.$http.get('users', {params:this.queryInfo})
        }
    },
}
</script>

<style lang="less" scoped>
</style>