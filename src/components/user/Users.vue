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
            <el-input
              placeholder="请输入内容"
              v-model="queryInfo.query"
              clearable
              @clear="getUserList"
            >
              <el-button
                slot="append"
                icon="el-icon-search"
                @click="getUserList"
              ></el-button>
            </el-input>
          </el-col>
          <el-col :span="4">
            <el-button
              type="primary"
              @click="addDialogVisible = true"
            >添加用户</el-button>
          </el-col>
        </el-row>
        <el-table
          :data="userlist"
          border
          stripe
        >
          <el-table-column type="index">
          </el-table-column>
          <el-table-column
            prop="username"
            label="姓名"
          >
          </el-table-column>
          <el-table-column
            prop="email"
            label="邮箱"
          >
          </el-table-column>
          <el-table-column
            prop="mobile"
            label="电话"
          >
          </el-table-column>
          <el-table-column
            prop="role_name"
            label="角色"
          >
          </el-table-column>
          <el-table-column
            prop="mg_state"
            label="状态"
          >
            <!-- 通过作用域插槽scope拿到具体的数据 -->
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.mg_state"
                @change="userStateChanged(scope.row)"
              ></el-switch>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <!-- 修改 -->
              <el-button
                type="primary"
                icon="el-icon-edit"
                circle
                size="mini"
                @click="queryUserById(scope.row)"
              ></el-button>
              <!-- 删除 -->
              <el-popover
                placement="top"
                width="160"
                trigger="click"
                :ref="`popover-${scope.$index}`"
              >
                <p>这是一段内容这是一段内容确定删除吗？</p>
                <div style="text-align: right; margin: 0">
                  <el-button
                    size="mini"
                    type="text"
                    @click="deletePopoverClose(scope)"
                  >取消</el-button>
                  <el-button
                    type="primary"
                    size="mini"
                    @click="deleteUser(scope)"
                  >确定</el-button>
                </div>
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  circle
                  size="mini"
                  slot="reference"
                  @click=""
                ></el-button>
              </el-popover>
              <!-- 分配角色 -->
              <el-tooltip
                class="item"
                effect="dark"
                content="分配角色"
                placement="top"
                :enterable="false"
              >
                <el-button
                  type="warning"
                  icon="el-icon-setting"
                  circle
                  size="mini"
                ></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页区域 -->
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryInfo.pagenum"
          :page-sizes="[1, 2, 5, 10]"
          :page-size="queryInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        >
        </el-pagination>
        <!-- 添加用户对话框 -->
        <el-dialog
          title="添加用户"
          :visible.sync="addDialogVisible"
          width="50%"
          @closed="addDialogClose"
        >
          <!-- 内容主体区域 -->
          <el-form
            :model="addForm"
            :rules="addFormRules"
            ref="addFormRef"
            label-width="80px"
          >
            <el-form-item
              label="用户名"
              prop="username"
            >
              <el-input v-model="addForm.username"></el-input>
            </el-form-item>
            <el-form-item
              label="用户密码"
              prop="password"
            >
              <el-input v-model="addForm.password"></el-input>
            </el-form-item>
            <el-form-item
              label="邮箱"
              prop="email"
            >
              <el-input v-model="addForm.email"></el-input>
            </el-form-item>
            <el-form-item
              label="手机号"
              prop="mobile"
            >
              <el-input v-model="addForm.mobile"></el-input>
            </el-form-item>
          </el-form>
          <!-- 底部区域 -->
          <span
            slot="footer"
            class="dialog-footer"
          >
            <el-button @click="addDialogVisible = false">取 消</el-button>
            <el-button
              type="primary"
              @click="addUser()"
            >确 定</el-button>
          </span>
        </el-dialog>
        <!-- 修改用户对话框 -->
        <el-dialog
          title="修改用户信息"
          :visible.sync="editDialogVisible"
          width="50%"
          @closed="editDialogClose"
        >
          <el-form
            :model="editForm"
            :rules="editFormRules"
            ref="editFormRef"
            label-width="80px"
          >
            <el-form-item label="用户名">
              <el-input
                v-model="editForm.username"
                disabled
              ></el-input>
            </el-form-item>
            <el-form-item
              label="邮箱"
              prop="email"
            >
              <el-input v-model="editForm.email"></el-input>
            </el-form-item>
            <el-form-item
              label="手机号"
              prop="mobile"
            >
              <el-input v-model="editForm.mobile"></el-input>
            </el-form-item>
          </el-form>
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button
            type="primary"
            @click="editUsers"
          >确 定</el-button>
          </span>
        </el-dialog>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    //验证邮箱规则
    var checkEmail = (rule, value, cb) => {
      const regEmail = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
      if (regEmail.test(value)) {
        return cb()
      }
      cb(new Error('请输入合法的邮箱'))
    }
    // 手机号验证
    var checkMobile = (rule, value, cb) => {
      const regMoblie = /^[1](([3][0-9])|([4][5-9])|([5][0-3,5-9])|([6][5,6])|([7][0-8])|([8][0-9])|([9][1,8,9]))[0-9]{8}$/
      if (regMoblie.test(value)) {
        return cb()
      }
      cb(new Error('请输入合法的手机号'))
    }
    return {
      //获取用户列表的参数对象
      queryInfo: {
        query: '',
        //当前页数
        pagenum: 1,
        //当前页面大小
        pagesize: 2
      },
      userlist: [],
      total: 0,
      //控制添加用户对话框的显示与隐藏
      addDialogVisible: false,
      //控制修改用户对话框的显示
      editDialogVisible: false,
      //添加用户的表单数据
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      //添加表单验证规则
      addFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '用户名的长度在3-10个字符之间', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 3, max: 10, message: '密码的长度在3-10个字符之间', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ],
      },
      editForm: {},
      editFormRules: {
        email: [
          { message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ],
      },
    }
  },
  created() {
    this.getUserList();
  },
  methods: {
    async getUserList() {
      const { data: res } = await this.$http.get('users', { params: this.queryInfo })
      if (res.meta.status !== 200) { return this.$message.error('获取用户列表失败!') }
      this.userlist = res.data.users
      this.total = res.data.total
    },
    //监听pagesize 改变的事件
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getUserList()
    },
    //监听页码值改变
    handleCurrentChange(newpage) {
      this.queryInfo.pagenum = newpage
      this.getUserList()
    },
    //监听 switch ${userInfo.id}以url的方式传递值
    async userStateChanged(userInfo) {
      const { data: res } = await this.$http.put(`users/${userInfo.id}/state/${userInfo.mg_state}`)
      if (res.meta.status !== 200) {
        return this.$message.error('更新用户状态失败')
        userInfo.mg_state = !user.mg_state
      }
      this.$message.success('更新用户状态成功')
    },
    // 监听添加用户的关闭操作
    addDialogClose() {
      // 通过存储在$refs对象中的form表单ref 获取到对应的表单函数执行element的reset方法
      this.$refs.addFormRef.resetFields();
    },
    addUser() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return this.$message.error('数据输入有误');
        const { data: ref } = await this.$http.post('users', this.addForm)
        if (ref.status !== 201) {
          return this.$message.error(res.meta.msg)
        }
        this.$message.success(ref.meta.msg)
        this.addDialogVisible = false
        this.getUserList()
      })
    },
    // 修改用户操作
    // 查询用户
    async queryUserById(userInfo) {
      this.editDialogVisible = true
      const { data: ref } = await this.$http.get(`users/${userInfo.id}`)
      if (ref.meta.status !== 200) {
        return this.$message.error('获取用户信息失败')
      }
      this.$message.success(ref.meta.msg)
      this.editForm = ref.data
    },
    // 编辑用户提交
    editUsers() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return this.$message.error('数据输入有误');
        const { data: ref } = await this.$http.put(`users/${this.editForm.id}`, this.editForm)
        if (ref.meta.status !== 200) {
          return this.$message.error('修改用户信息失败')
        }
        this.getUserList()
        this.$message.success('修改用户信息成功')
        this.editDialogVisible = false
      })
    },
    editDialogClose() {
      // 通过存储在$refs对象中的form表单ref 获取到对应的表单函数执行element的reset方法
      this.$refs.editFormRef.resetFields();
    },
    // 确认框关闭
    deletePopoverClose(scope) {
      scope._self.$refs[`popover-${scope.$index}`].doClose();
      console.log(scope.row);
    },
    // 确认删除操作 this指向组件实例
    async deleteUser(scope) {
      const { data: ref } = await this.$http.delete(`users/${scope.row.id}`)
      if (ref.meta.status !== 200) {
        return this.$message.error('删除失败')
      }
      this.$message.success('删除成功')
      this.deletePopoverClose(scope)
      this.getUserList()
    }
  }
}
</script>

<style lang="less" scoped>
.el-button {
  margin-right: 10px;
}
</style>