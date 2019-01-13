<template>
  <table class="table table-hover">
    <thead>
      <tr>
        <th scope="col">#</th>
        <th scope="col">Nickname</th>
        <th scope="col">Score</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(item, index) in leaderboard">
        <th scope="row">{{ index + 1 }}</th>
        <td>{{ item.nickname }}</td>
        <td>{{ item.score }}</td>
      </tr>
    </tbody>
</table>
</template>

<script>    
  import { fbService } from './main';

  export default {
    name: "Leaderboard",
    data() {
      return {
        leaderboard: []
      }
    },
    mounted() {
      console.log("mounted")
      let vueObj = this;
      fbService.database().ref("leaderboard").orderByChild("score").limitToLast(15).on("child_added", function(data) {
        vueObj.leaderboard.unshift(data.val())
      })
    }    
  }
</script>
