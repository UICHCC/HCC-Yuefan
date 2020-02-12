<template>
  <div class="homepage">
    <el-input v-model="keyword" placeholder="Search" clearable></el-input>

    <!-- Drawer Button -->
    <el-badge
      :value="selected.length"
      style="margin-top: 20px"
      :hidden="selected.length === 0"
      :max="99"
    >
      <el-button type="primary" @click="drawer=!drawer">Selected</el-button>
    </el-badge>

    <!-- Main Table -->
    <el-table
      :data="results"
      style="margin-top: 20px"
      v-loading="loading"
    >
      <el-table-column prop="Name" label="Name"></el-table-column>
      <el-table-column label="Operation">
        <template slot-scope="scope">
          <el-button type="text" @click="handleClick(scope.row)">
            {{ selected.indexOf(scope.row) > -1 ? 'Delete' : 'Add' }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- Drawers -->
    <SelectedDrawer
      :drawer="drawer"
      :selected="selected"
      :handle-delete="handleClick"
      :handle-close="handleClose"
      :clear-all="clearAll"
    />
  </div>
</template>

<script>
  import SelectedDrawer from "../components/SelectedDrawer";
  import util from "../util";
  import pinyin from "../plugins/Convert_Pinyin";

  export default {
    name: "HomePage",
    components: { SelectedDrawer },
    data() {
      return {
        keyword: '',
        restaurants: [],
        selected: [],
        loading: true,
        drawer: false
      }
    },
    methods: {
      clearAll: function() {
        this.selected = []
      },
      handleClick: function (row) {
        const index = this.selected.indexOf(row);
        if (index > -1) {
          this.selected.splice(index, 1)
        } else {
          this.selected.push(row)
        }
      },
      handleClose: function () {
        this.drawer = false
      },
      updateRestaurant() {
        this.$http.get("/api/restaurants").then(rsp => {
          this.restaurants = rsp.data.restaurants;
          this.loading = false;
          const token = util.getStore("token");
          if (token !== null) {
            this.$http.post("/api/restaurants", {
              token
            }).then(rsp => {
              const restaurants = rsp.data.restaurants;
              restaurants.map(item => this.restaurants.push(item))
            }).catch(err => {
              window.console.log(err)
            })
          }
        })
      }
    },
    mounted() {
      this.updateRestaurant();
    },
    computed: {
      results() {
        return this.restaurants.filter(item => {
          return item.Name.match(this.keyword.toLowerCase()) ||
            pinyin.getFullChars(item.Name).toLowerCase().match(this.keyword.toLowerCase())
        })
      }
    },
    watch: {
      '$store.state.username': function () {
        if (util.getStore("token") === null)
          this.updateRestaurant();
      }
    }
  }
</script>

<style scoped>
  .homepage {
    margin-left: 20%;
    width: 60%;
    text-align: left;
  }

  @media (max-width: 767px) {
    .homepage {
      margin-left: 5%;
      width: 90%;
    }
  }

</style>