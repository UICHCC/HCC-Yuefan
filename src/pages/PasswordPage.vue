<template>
  <div style="width: 90%; margin-left: 5%;float: left;text-align: left">
    <el-form :model="passwordForm" status-icon ref="passwordForm" :rules="rules">
      <el-form-item label="Old Password" prop="old_password" required>
        <el-input type="password" v-model="passwordForm.old_password" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="New Password" prop="new_password" required>
        <el-input type="password" v-model="passwordForm.new_password" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="Confirm New Password" prop="confirm" required>
        <el-input type="password" v-model="passwordForm.confirm" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          @click="submitForm('passwordForm')"
          native-type="button"
          :loading="loading"
        >Change</el-button>
        <el-button @click="$router.push('/')">Cancel</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import util from "../util";

  export default {
    name: "PasswordPage",
    data() {
      const validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('Please enter password again!'));
        } else if (value !== this.passwordForm.new_password) {
          callback(new Error('Password not same!'));
        } else {
          callback();
        }
      };

      return {
        username: this.$store.state.username,
        passwordForm: {
          old_password: '',
          new_password: '',
          confirm: ''
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
            const { old_password, new_password } = this.passwordForm;
            this.$swal.fire({
              title: 'Are you sure?',
              text: 'You are changing your password',
              icon: 'warning',
              showCancelButton: true,
              showLoaderOnConfirm: true,
              confirmButtonText: "Change",
              preConfirm: () => {
                this.loading = true;
                return this.$http.post('/api/user/password', {
                  token: util.getStore("token"),
                  old: util.getToken(this.username, old_password),
                  new: util.getToken(this.username, new_password),
                }).then(() => {
                  this.loading = false;
                  this.$message({
                    message: "Password Reset",
                    type: "success"
                  });
                  this.$router.push("/");
                }).catch(() => {
                  this.loading = false;
                  this.$message.error("Reset password failed");
                });
              }
            })
          }
        })
      }
    }
  }
</script>

<style scoped>

</style>