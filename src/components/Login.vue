<template>
  <div class="login_container">
    <div class="login_box">
      <div class="logo-box">
        <img
          src="../assets/logo.png"
          alt=""
        />
      </div>
      <!-- 登陆表单 ref 通过此prop 获取到实例对象 -->
      <el-form
        ref="loginFormRef"
        class="login-form"
        :model="loginForm"
        :rules="loginFormRules"
        v-if="loginForm"
      >
        <!-- user -->
        <el-form-item prop="username">
          <el-input
            prefix-icon="el-icon-user"
            v-model="loginForm.username"
          ></el-input>
        </el-form-item>
        <!-- passwd -->
        <el-form-item prop="password">
          <el-input
            prefix-icon="el-icon-lock"
            v-model="loginForm.password"
            type="password"
          ></el-input>
        </el-form-item>
        <!-- butten -->
        <el-form-item class="btns">
          <el-button
            type="primary"
            @click="login"
          >登录</el-button>
          <el-button
            type="info"
            @click="resetLoginForm"
          >重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    var validatePass = (rule, value, callback) => {
      const reg = /[a-zA-Z0-9]/
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (!reg.test(value)) {
          callback(new Error('请输入3-10位密码'))
        }
        callback()
      }
    }
    return {
      // 登录表单数据验证对象
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      // 表单验证规则
      loginFormRules: {
        // 验证用户名
        username: [
          { required: true, message: '请输入username', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        // 验证密码
        password: [
          { validator: validatePass, trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 通过 this 直接获取到form应用对象
    resetLoginForm() {
      this.$refs.loginFormRef.resetFields();
    },
    login() {
      this.$refs.loginFormRef.validate(async valid => {
        if (!valid) return;
        // 通过{}解析data获取data中的res属性
        const { data: res } = await this.$http.post('login', this.loginForm);
        if (res.meta.status !== 200) return this.$message.error('登录失败')
        this.$message.success('登录成功');
        // 1 将登录成功后的token 保存到客户端sessionstorage中
        // 1.1 项目中出现登录之为的其他API接口 必须在登录之后访问
        // 1.2 token 只能在当前网站打开期间生效 所以同肯保存在session storage中
        window.sessionStorage.setItem('token', res.data.token)
        // 2 通过编程式导航跳转到后台主页 路由地址为 /homes
        this.$router.push("/home")
      })
    }
  }
}
</script>

<style lang="less" scoped>
.login_container {
  background-color: #666;
  height: 100%;
}

.login_box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
.logo-box {
  height: 130px;
  width: 130px;
  border-radius: 50%;
  border: 1px solid #eee;
  padding: 10px;
  box-shadow: 0 0 10px #ddd;
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;
}

.logo-box img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: #eee;
}

.btns {
  display: flex;
  justify-content: flex-end;
}

.login-form {
  position: absolute;
  bottom: 0;
  width: 95%;
  left: 50%;
  transform: translate(-50%, 0);
  box-sizing: border-box;
}
</style>