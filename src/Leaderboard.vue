<template>
    <h1>Leaderboar asdd</h1>
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
      fbService.database().ref("leaderboard").orderByChild("score").limitToLast(10).on("child_added", function(data) {
        vueObj.leaderboard.unshift(data.val())
      })
    }    
  }
</script>
