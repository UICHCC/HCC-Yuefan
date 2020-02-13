<template>
  <div id="app">
    <el-header>
      <!-- Title -->
      <h3 style="float: left;margin-left: 10px">
        <router-link to="/" class="link">HCC Yuefan</router-link>
      </h3>

      <!-- Dropdown -->
      <div style="float: right;margin-top: 20px">
        <el-dropdown trigger="click">
          <span class="el-dropdown-link">
            {{ username }}<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item v-if="!logged">
              <router-link to="/login" class="link">Login</router-link>
            </el-dropdown-item>
            <el-dropdown-item v-if="!logged">
              <router-link to="/register" class="link">Register</router-link>
            </el-dropdown-item>
            <el-dropdown-item v-if="logged">
              <router-link to="/password" class="link">Change Password</router-link>
            </el-dropdown-item>
            <el-dropdown-item v-if="logged">
              <router-link to="/custom" class="link">Custom Restaurant</router-link>
            </el-dropdown-item>
            <el-dropdown-item v-if="admin">
              <router-link to="/manage" class="link">Restaurant Management</router-link>
            </el-dropdown-item>
            <el-dropdown-item v-if="logged">
              <a class="link" @click="logout">Logout</a>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </el-header>

    <!-- Main Body -->
    <router-view></router-view>
  </div>
</template>

<script>
  import util from './util'

  export default {
    name: 'app',
    computed: {
      username() {
        const { username } = this.$store.state;
        return username.length > 0 ? username : 'Login';
      },
      logged() {
        return this.$store.state.username.length > 0
      },
      admin() {
        return this.$store.state.admin;
      }
    },
    methods: {
      updateUsername: function () {
        let user = this.$store.state.username;
        if (util.getStore("token") !== null && user.length === 0) {
          this.$http.get("/api/user", {
            params: {
              token: util.getStore("token")
            }
          }).then(rsp => {
            const { admin, username } = rsp.data;
            this.$store.dispatch(admin ? 'isAdmin' : 'notAdmin');
            this.$store.dispatch('setUser', username);
            this.$router.addRoutes(util.routes);
          }).catch(err => {
            this.$message.error("Failed to get user information");
            util.removeStore("token");
            window.console.log(err);
          });
        }
      },
      logout: function () {
        this.$http.post("/api/user/logout", {
          token: util.getStore("token")
        }).then(() => {
          util.removeStore("token");
          this.$store.dispatch('delUser');
          this.$store.dispatch('notAdmin');
          this.$message.success("Logout succeeded");
          this.$router.push("/");
        }).catch(err => {
          window.console.log(err);
          this.$message.error("Logout Failed");
        })
      }
    },
    mounted() {
      this.updateUsername();
    },
    watch: {
      $route() {
        this.updateUsername();
      }
    }
  }
</script>

<style>
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
  }

  .link {
    text-decoration: none;
    color: #2c3e50;
  }

</style>
