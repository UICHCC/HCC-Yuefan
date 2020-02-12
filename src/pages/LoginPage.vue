<template>
  <div style="width: 90%; margin-left: 5%;float: left;text-align: left">
    <el-form :model="loginForm" status-icon ref="loginForm">
      <el-form-item label="Username" prop="username" required>
        <el-input type="text" v-model="loginForm.username" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="Password" prop="password" required>
        <el-input type="password" v-model="loginForm.password" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          @click="submitForm('loginForm')"
          native-type="button"
          :loading="loading"
        >Login</el-button>
        <el-button @click="$router.push('/register')">Register</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import util from '../util'

  export default {
    name: "LoginPage",
    data() {
      return {
        loginForm: {
          username: '',
          password: ''
        },
        loading: false
      }
    },
    methods: {
      submitForm: function (formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            const { username, password } = this.loginForm;
            this.loading = true;
            this.$http.post('/api/user', {
              username,
              password: util.getToken(username, password)
            }).then(rsp => {
              this.loading = false;
              util.setStore("token", rsp.data.token);
              this.$message({
                message: "Login succeeded",
                type: "success"
              });
              this.$router.addRoutes(util.routes);
              this.$router.push("/");
            }).catch(() => {
              this.loading = false;
              this.$message.error("Login failed");
            })
          }
        })
      }
    }
  }
</script>

<style scoped>

</style>