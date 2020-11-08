<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!-- 头部输入框    -->
      <el-row>
        <el-col :span="7">
          <el-input
            placeholder="请输入内容"
            v-model="queryGood.query"
            clearable
            @clear="getGoodsList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getGoodsList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button
            type="primary"
            class="goodsbutton"
            @click="goAddpage"
          >添加商品</el-button>
        </el-col>
      </el-row>
      <!-- 列表区域 -->
      <el-table
        :data="goodslist"
        border
        stripe
      >
        <el-table-column type="index">
        </el-table-column>
        <el-table-column
          prop="goods_name"
          label="商品名称"
        >
        </el-table-column>
        <el-table-column
          label="商品价格(元)"
          prop="goods_price"
        ></el-table-column>
        <el-table-column
          prop="goods_weight"
          label="重量"
        >
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="goAddpage"
            >编辑</el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeById(scope.row.goods_id)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryGood.pagenum"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="queryGood.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="400"
      >
      </el-pagination>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      // 商品列表数据
      goodslist: [],
      // 商品查询数据
      queryGood: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      // 总数据条数
      total: 0
    }
  },
  created() {
    this.getGoodsList()
  },
  methods: {
    // 获取商品列表
    async getGoodsList() {
      const { data: res } = await this.$http.get('goods', { params: this.queryGood })
      if (res.meta.status !== 200) {
        return this.$message.error("获取商品表单失败")
      }
      this.goodslist = res.data.goods
    },
    // 监听页数 和 页码
    handleSizeChange(newsize) {
      this.queryGood.pagesize = newsize
      this.getGoodsList()
    },
    handleCurrentChange(newnum) {
      this.queryGood.pagenum = newnum
      this.getGoodsList()
    },
     async removeById(id) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除该商品, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)

      if (confirmResult !== 'confirm') {
        return this.$message.info('已经取消删除！')
      }

      const { data: res } = await this.$http.delete(`goods/${id}`)

      if (res.meta.status !== 200) {
        return this.$message.error('删除失败！')
      }

      this.$message.success('删除成功！')
      this.getGoodsList()
    },
    // 跳转到添加页面；。 
    goAddpage() {
      console.log("qaa");
      this.$router.push('/goods/add')
    }
  },
}
</script>
<style lang="less" scoped>
.goodsbutton {
  margin-left: 15px;
}
</style>