<template>
  <div>
  	<h1>Profile</h1>
  	<p>Nickname: {{ nickname }}</p>
  	<p>Email: {{ email }}</p>
  	<p>Personal Record: {{ personalBest }}</p>
  </div>



</template>

<script>
	import { fbService } from './main';


    export default {
    	props: {
			auth: {
				required: true
			}
		},
        data(){
        	return {
        		nickname: null,
        		personalBest: null,
        		email: null
        	}	
        },

        mounted() {
        	if (this.auth) {
	        	let user = fbService.auth().currentUser;

	        	console.log(user)

	        	this.nickname = user.displayName;

	        	this.email = user.email;

	        	this.personalBest = Math.ceil(+user.photoURL);        		
        	} else {
        		this.$router.push('/login');   
        	}

        }
    }
</script>
