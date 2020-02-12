<template>
  <el-drawer
    title="Select Restaurant"
    :visible="drawer"
    :before-close="handleClose"
    :size="screenWidth"
  >
    <div style="padding: 10px">
      <el-card style="text-align: center">
        <h1>{{ restaurant }}</h1>
        <el-button :type="btnType" @click="generateRestaurant(true)">{{ btnText }}</el-button>
        <el-button @click="clearAll">Clear</el-button>
      </el-card>
      <el-table :data="selected">
        <el-table-column prop="Name" label="Name"></el-table-column>
        <el-table-column>
          <template slot-scope="scope">
            <el-button type="text" @click="handleDelete(scope.row)">Delete</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </el-drawer>
</template>

<script>
  export default {
    name: "SelectedDrawer",
    data() {
      return {
        screenWidth: document.body.clientWidth < 768 ? '100%' : '500px',
        restaurant: 'Restaurant',
        lottery: false,
        btnType: "primary",
        btnText: "Start"
      }
    },
    props: {
      drawer: Boolean,
      selected: Array,
      handleDelete: Function,
      handleClose: Function,
      clearAll: Function
    },
    methods: {
      generateRestaurant: function (click) {
        if (click) {
          this.lottery = !this.lottery;
          this.btnType = this.lottery ? "danger" : "primary";
          this.btnText = this.lottery ? "Stop" : "Start";
        }
        const num = Math.floor(Math.random() * this.selected.length);
        this.restaurant = this.selected[num].Name;
        if (this.lottery)
          setTimeout(this.generateRestaurant, 100, false);
      }
    },
    mounted() {
      const that = this;
      window.onresize = () => {
        that.screenWidth = document.body.clientWidth < 768 ? '100%' : '500px';
      }
    }
  }
</script>

<style scoped>

</style>