<template>
  <div style="width: 90%; margin-left: 5%;float: left;text-align: left">
    <el-form :model="registerForm" status-icon ref="registerForm" :rules="rules">
      <el-form-item label="Username" prop="username" required>
        <el-input type="text" v-model="registerForm.username" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="Password" prop="password" required>
        <el-input type="password" v-model="registerForm.password" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="Confirm Password" prop="confirm" required>
        <el-input type="password" v-model="registerForm.confirm" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="Invitation Code" prop="code">
        <el-input type="text" v-model="registerForm.code" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          @click="submitForm('registerForm')"
          native-type="button"
          :loading="loading"
        >Register</el-button>
        <el-button @click="$router.push('/')">Cancel</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import util from "../util";

  export default {
    name: "RegisterPage",
    data() {
      const validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('Please enter password again!'));
        } else if (value !== this.registerForm.password) {
          callback(new Error('Password not same!'));
        } else {
          callback();
        }
      };

      return {
        registerForm: {
          username: '',
          password: '',
          confirm: '',
          code: ''
        },
        loading: false,
        rules: {
          confirm: [
            { validator: validatePass2, trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      submitForm: function (formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            const { username, password, code } = this.registerForm;
            this.loading = true;
            this.$http.post('/api/user/register', {
              username,
              password: util.getToken(username, password),
              code,
              key: util.getKey(username, password)
            }).then(() => {
              this.loading = false;
              this.$message({
                message: "Register succeeded",
                type: "success"
              });
              this.$router.push("/");
            }).catch(() => {
              this.loading = false;
              this.$message.error("Wrong invitation code");
            })
          }
        })
      }
    }
  }
</script>

<style scoped>

</style>