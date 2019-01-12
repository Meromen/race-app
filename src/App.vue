<template>
  <div>
    <div class="container">
      <nav class="navbar navbar-default">
        <div class="container-fluid">
          <div class="navbar-header">
            <router-link to="/" exact class="navbar-brand"><strong>E-commerce Inc.</strong></router-link>
          </div>

          <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
            <ul class="nav navbar-nav">
              <router-link to="/" tag="li" exact active-class="active">
                <a>Game</a>
              </router-link>

              <router-link to="/leaderboard" tag="li" active-class="active">
                <a>Leaderboard</a>
              </router-link>
            </ul>

            <div class="nav navbar-nav navbar-right">
              <ul class="nav navbar-nav">
                <router-link v-if="!auth" :to="{ name: 'login'}" tag="li" exact active-class="active">
                  <a>Sign In</a>
                </router-link>
                
                <li>
                  <a v-if="auth" class="btn" @click="singOut()">Sign Out</a>                  
                </li>

                <router-link v-if="auth" :to="{ name: 'viewProfile' }" tag="li" exact active-class="active">
                  <a>My Profile</a>
                </router-link>
              </ul>
            </div>
          </div>
        </div>
      </nav>

      <transition
        enter-active-class="animated fadeInRight"
        leave-active-class="animated fadeOutLeft"
        mode="out-in">
        <router-view :auth="auth"></router-view>
      </transition>
    </div>
  </div>
</template>

<script>
  import { eventBus } from './main';
  import { fbService } from './main';

  export default {
    data() {
      return {
        auth: false,
        user: { 
          Nickname: '',
          Email: ''
        }
      };
    },
    methods: {
      singOut: function() {
        let vueObj = this
        fbService.auth().signOut().then(function() {
          vueObj.auth = false;
        }).catch(function(error) {
          console.log("sign out error")
        });
        this.$router.push('/login');   
      }
    },
    computed: {
      getUser() {
        let user = fbService.auth().currentUser
        user == null ? console.log("need log in") : console.log("logined");
      }
    },
    created() {
      eventBus.$on('loggedIn', (loggedIn) => {
        this.auth = true;
        this.getUser;
        console.log("bip-bip");
      })
    }
  }
</script>

<style>
  .flex { display:flex }
  .flex.flex-column { flex-direction: column; }
  .flex.flex-row { flex-direction: row; }
  .flex.justify-center { justify-content: center; }
  .flex.justify-left { justify-content: flex-start; }
  .flex.justify-right { justify-content: flex-end; }
  .flex.align-center { align-items: center; }
  .flex.align-left { align-items: flex-start; }
  .flex.align-right { align-items: flex-end; }
  /* Navigation */
  .navbar .stats {
    margin-top: 15px;
  }
</style>
