<template>
  <div class="managepage">
    <el-input clearable v-model="keyword" placeholder="Search" style="margin-bottom: 20px"></el-input>
    <el-input clearable v-model="add" placeholder="New Restaurant" style="width: 80%"></el-input>
    <el-button type="primary" style="width: 20%" @click="handleAdd">Add</el-button>

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
            Delete
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  import util from "../util"
  import pinyin from "../plugins/Convert_Pinyin";

  export default {
    name: "ManagePage",
    data() {
      return {
        restaurants: [],
        keyword: '',
        loading: true,
        add: ''
      }
    },
    props: {
      custom: Number
    },
    methods: {
      getCustomRestaurants: function() {
        this.loading = true;
        this.$http.post("/api/restaurants", {
          token: util.getStore("token")
        }).then(rsp => {
          this.restaurants = rsp.data.restaurants;
          this.loading = false;
        }).catch(err => {
          window.console.log(err);
          this.loading = false;
          this.$message.error("Failed to get custom restaurants");
        });
      },
      getRestaurants: function() {
        this.loading = true;
        this.$http.get("/api/restaurants").then(rsp => {
          this.restaurants = rsp.data.restaurants;
          this.loading = false;
        }).catch(err => {
          window.console.log(err);
          this.loading = false;
          this.$message.error("Failed to get restaurants");
        });
      },
      handleAdd: function() {
        this.$swal.fire({
          title: "Are you sure?",
          text: `You are adding ${this.add}`,
          icon: 'warning',
          showCancelButton: true,
          showLoaderOnConfirm: true,
          confirmButtonText: "Add",
          preConfirm: () => {
            return this.$http.post("/api/restaurant", {
              token: util.getStore("token"),
              restaurant: {
                name: this.add,
                custom: this.custom
              }
            }).then(() => {
              this.custom === 0 ? this.getRestaurants() : this.getCustomRestaurants();
              this.$message.success(`Successfully added ${this.add}`);
              this.add = "";
            }).catch(err => {
              window.console.log(err);
              this.$message.error("Duplicated name");
            })
          }
        });
      },
      handleClick: function (row) {
        this.$swal.fire({
          title: "Are you sure?",
          text: `You are deleting ${row.Name}`,
          icon: 'warning',
          showCancelButton: true,
          showLoaderOnConfirm: true,
          confirmButtonText: "Delete",
          confirmButtonColor: '#ff5e52',
          preConfirm: () => {
            return this.$http.delete("/api/restaurant", {
              params: {
                token: util.getStore("token"),
                id: row.Id
              }
            }).then(() => {
              this.custom === 0 ? this.getRestaurants() : this.getCustomRestaurants();
              this.$message.success(`Successfully deleted ${row.Name}`);
            }).catch(err => {
              window.console.log(err);
              this.$message.error("Delete failed");
            })
          }
        });
      }
    },
    computed: {
      results() {
        return this.restaurants.filter(item => {
          return item.Name.match(this.keyword.toLowerCase()) ||
            pinyin.getFullChars(item.Name).toLowerCase().match(this.keyword.toLowerCase())
        })
      }
    },
    mounted() {
      this.custom === 0 ? this.getRestaurants() : this.getCustomRestaurants();
    },
    watch: {
      $route () {
        this.custom === 0 ? this.getRestaurants() : this.getCustomRestaurants();
      }
    }
  }
</script>

<style scoped>
  .managepage {
    margin-left: 5%;
    width: 90%;
    text-align: left;
  }
</style>