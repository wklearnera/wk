<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 角色列表 -->
      <el-row>
        <el-col>
          <el-button
            type="primary"
            @click="addDialogVisible = true"
          >添加角色</el-button>
        </el-col>
      </el-row>
      <el-table
        :data="rolelist"
        border
        stripe
      >
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              :class="['bdbottom', i1 === 0? 'bdtop' :'','vcent']"
              v-for="(item1,i1) in scope.row.children"
              :key="item1.id"
            >
              <!-- 一级权限 -->
              <el-col :span="5">
                <el-tag
                  closable
                  @close="open(item1,scope)"
                >{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 二级 -->
              <el-col :span="19">
                <el-row
                  v-for="(item2,i2) in item1.children"
                  :key="item2.id"
                  :class="[i2 === 0? '' :'bdtop','vcent']"
                >
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="open(item2,scope)"
                    >{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag
                      v-for="(item3,i3) in item2.children"
                      :key="item3.id"
                      :class="[i3 === 0 ? '' :'bdtop']"
                      type="warning"
                      closable
                      @close="open(item3,scope) "
                    >{{item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index"></el-table-column>
        <el-table-column
          label="角色名称"
          prop="roleName"
        ></el-table-column>
        <el-table-column
          label="角色描述"
          prop="roleDesc"
        ></el-table-column>
        <!-- 操作区域 -->
        <el-table-column label="操作">
          <template slot-scope="scope">
            <!-- 编辑 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="queryRoleById(scope.row)"
            >编辑角色</el-button>
            <!-- 删除 -->
            <el-popover
              placement="top"
              width="160"
              trigger="click"
              :ref="`popover-${scope.$index}`"
            >
              <p>确定删除吗？</p>
              <div style="text-align: right; margin: 0">
                <el-button
                  size="mini"
                  type="text"
                  @click="deletePopoverClose(scope)"
                >取消</el-button>
                <el-button
                  type="primary"
                  size="mini"
                  @click="deleteRoles(scope)"
                >确定</el-button>
              </div>
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                slot="reference"
                @click=""
              >删除角色</el-button>
            </el-popover>
            <!-- 分配权限 -->
            <el-button
              type="warning"
              icon="el-icon-setting"
              size="mini"
              @click="showSetRigntDialog(scope.row)"
            >分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 添加角色对话框 -->
      <el-dialog
        title="添加角色"
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
            label="角色名称"
            prop="roleName"
          >
            <el-input v-model="addForm.roleName"></el-input>
          </el-form-item>
          <el-form-item
            label="角色描述"
            prop="roleDesc"
          >
            <el-input v-model="addForm.roleDesc"></el-input>
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
            @click="addRoles()"
          >确 定</el-button>
        </span>
      </el-dialog>
      <!-- 编辑角色对话框 -->
      <el-dialog
        title="编辑角色"
        :visible.sync="editDialogVisible"
        width="50%"
        @closed="editDialogClose"
      >
        <!-- 内容主体区域 -->
        <el-form
          :model="editForm"
          :rules="addFormRules"
          ref="editFormRef"
          label-width="80px"
        >
          <el-form-item
            label="角色名称"
            prop="roleName"
          >
            <el-input v-model="editForm.roleName"></el-input>
          </el-form-item>
          <el-form-item
            label="角色描述"
            prop="roleDesc"
          >
            <el-input v-model="editForm.roleDesc"></el-input>
          </el-form-item>
        </el-form>
        <!-- 底部区域 -->
        <span
          slot="footer"
          class="dialog-footer"
        >
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button
            type="primary"
            @click="editRoles()"
          >确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
    <!-- 分配权限对话框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="setRightdialogVisible"
      width="50%"
    >
      <!-- 树形权限框 -->
      <el-tree
        :data="rightslist"
        :props="treeProps"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="defKeys"
        ref="treeRef"
      ></el-tree>

      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="setRightdialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="allotRights"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      addDialogVisible: false,
      //所有角色列表
      rolelist: [],
      //添加角色表单数据
      addForm: {
        roleName: '',
        roleDesc: ''
      },
      // 添加角色验证
      addFormRules: {
        roleName: [{ required: true, message: '请输入角色名', trigger: 'blur' }],
      },
      //修改角色表单数据
      editForm: {},
      //修改角色对话框控制
      editDialogVisible: false,
      //控制分配权限对话框
      setRightdialogVisible: false,
      // 所有权限的数据
      rightslist: [],
      //树形数据的属性绑定对象
      treeProps: {
        label: 'authName',
        children: 'children'
      },
      //默认选中的节点id树
      defKeys:[],
      roleId: ''
    }
  },
  created() {
    this.getRoleList()
  },
  methods: {
    // 获取角色列表
    async getRoleList() {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) {
        return this.$message.error('获取角色列表失败！')
      }
      this.rolelist = res.data
    },
    // 监听添加角色关闭
    addDialogClose() {
      this.$refs.addFormRef.resetFields();
    },
    addRoles() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return this.$message.error('数据输入有误');
        const { data: ref } = await this.$http.post('roles', this.addForm)
        if (ref.meta.status !== 201) {
          return this.$message.error("添加失败")
        }
        this.$message.success(ref.meta.msg)
        this.addDialogVisible = false
        this.getRoleList()
      })
    },
    async queryRoleById(roleInfo) {
      console.log(roleInfo);
      const { data: res } = await this.$http.get(`roles/${roleInfo.id}`)
      if (res.meta.status !== 200) {
        return this.$message.error('获取失败')
      }
      this.editForm = res.data
      this.editDialogVisible = true
    },
    //监听
    editDialogClose() {
      this.$refs.editFormRef.resetFields();
    },
    //修改角色
    editRoles() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return this.$message.error('数据输入有误');
        const { data: ref } = await this.$http.put(`roles/${this.editForm.roleId}`, this.editForm)
        if (ref.meta.status !== 200) {
          return this.$message.error('修改角色信息失败')
        }
        this.getRoleList()
        this.$message.success('修改角色信息成功')
        this.editDialogVisible = false
      })
    },
    // 删除角色对话框关闭
    deletePopoverClose(scope) {
      scope._self.$refs[`popover-${scope.$index}`].doClose()
    },
    async deleteRoles(scope) {
      const { data: ref } = await this.$http.delete(`roles/${scope.row.id}`)
      if (ref.meta.status !== 200) {
        return this.$message.error('删除失败')
      }
      this.$message.success('删除成功')
      this.deletePopoverClose(scope)
      this.getRoleList()
    },
    // 删除权限弹出框
    async open(item, scope) {
      const comfirmResult = await
        this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)

      if (comfirmResult === 'comfirm') {
        return this.$message('取消删除')
      }
      const { data: res } = await this.$http.delete(`roles/${scope.row.id}/rights/${item.id}`)
      if (res.meta.status !== 200) {
        return this.$message.error('删除失败')
      }
      this.$message.success('删除成功')
      scop.children = res.data
    },
    // 分配权限
    async showSetRigntDialog(role) {
      //重置
      this.defKeys=[]
      // 获取所有权限的数据
      const { data: res } = await this.$http.get('rights/tree')
      this.getLeafKey(role, this.defKeys)
      this.setRightdialogVisible = true
      if (res.meta.status !== 200) {
        return this.$message.error('获取失败')
      }
      // 获取的权限数据
      this.rightslist = res.data
      // 当前即将分配权限的id
      this.roleId = role.id
    },
    //通过递归的形式获取角色下所有三级权限的id 保存到defkeys中
    getLeafKey(node,arr){
        //如果当前不包含childen 则是三级节点
        if(!node.children){
            return arr.push(node.id)
        }
        node.children.forEach(item => 
            this.getLeafKey(item,arr)
        )
    },
    //选择绑定权限  ...点为展开运算符号
    async allotRights(){
        const keys = [
          ...this.$refs.treeRef.getCheckedKeys(),
          ...this.$refs.treeRef.getHalfCheckedKeys()
        ]
        const idstr = keys.join(',')    

        const {data:res} = await this.$http.post(`roles/${this.roleId}/rights`,{ rids: idstr})

        if(res.meta.status !== 200) {
            return this.$message.error('分配权限失败')
        }
        this.$message.success('分配权限成功')
        this.getRoleList()
        this.setRightdialogVisible = false
    }
  }
}
</script>
<style lang="less" scoped>
.el-tag {
  margin: 7px;
}

.bdtop {
  border-top: 1px solid #eee;
}

.bdbottom {
  border-bottom: 1px solid #eee;
}
.vcent {
  display: flex;
  align-items: center;
}
</style>