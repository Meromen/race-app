<template>
    <div>
        <h2>Register</h2>
        <form @submit.prevent="handleSubmit">
            <div class="form-group">
                <label for="nickname">Nickname</label>
                <input id="nickname" type="text" v-model="user.nickname" v-validate="'required'" name="nickname" class="form-control" :class="{ 'is-invalid': submitted && errors.has('nickname') }" />
                <div v-if="submitted && errors.has('nickname')" class="invalid-feedback">{{ errors.first('nickname') }}</div>
            </div>            
            <div class="form-group">
                <label for="username">Username(Email)</label>
                <input id="username" type="email" v-model="user.username" v-validate="'required'" name="username" class="form-control" :class="{ 'is-invalid': submitted && errors.has('username') }" />
                <div v-if="submitted && errors.has('username')" class="invalid-feedback">{{ errors.first('username') }}</div>
            </div>
            <div class="form-group">
                <label htmlFor="password">Password</label>
                <input id="password" type="password" v-model="user.password" v-validate="{ required: true, min: 6 }" name="password" class="form-control" :class="{ 'is-invalid': submitted && errors.has('password') }" />
                <div v-if="submitted && errors.has('password')" class="invalid-feedback">{{ errors.first('password') }}</div>
            </div>
            <div class="form-group">
            	<ul>
				  <li v-for="group in errors.collect()">
				    <ul>
				      <li v-for="error in group">{{ error }}</li>
				    </ul>
				  </li>
				</ul>
           	</div>
            <div class="form-group">
                <button class="btn btn-primary" :disabled="status.registering">Register</button>
                <img v-show="status.registering" src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==" />
                <router-link to="/login" class="btn btn-link">Cancel</router-link>
            </div>
        </form>
    </div>
</template>

<script>
import { fbService } from './main';
import { routes } from './routes';

export default {
  data () {
    return {
      user: {
        nickname: '',
        username: '',
        password: ''
      },
      status: {
        registering: false
      },
      submitted: false
    }
  },
  methods: {
    handleSubmit() {
      let vueObj = this;
      this.submitted = true;
      this.status.registering = true;
      fbService.auth().createUserWithEmailAndPassword(this.user.username, this.user.password).then(function(user) {
        fbService.auth().currentUser.updateProfile({
          displayName: vueObj.user.nickname,
          photoURL: "0"
        }).then(function() {
          console.log("update suc");
          vueObj.$router.push('/login');   
        }).catch(function(error) {
          console.log(error);
          vueObj.submitted = false;
          vueObj.status.registering = false;
        });
      }).catch(function(error) {    
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorMessage)
        vueObj.submitted = false;
        vueObj.status.registering = false;
      })
    }
  }
}
</script>