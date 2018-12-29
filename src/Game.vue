<template>
  <div class="container">
    <canvas tabindex="1" id="canvas" width="500" height="500"></canvas>
  </div>
</template>

<script>

	class gameObj {
		constructor(type, x, y) {
			this.type = type;
			this.x = x;
			this.y = y;
			this.image = new Image(50, 100);
			this.type == 0 ? this.image.src = "src/assets/car.png" :  this.image.src = "src/assets/logo.png";
		}
	}

	let tempHero = new gameObj(0, 200, 400);
  let bg = new Image();
  bg.src = "src/assets/road.png";

  export default {
  	data() {
  		return {
  			canvas: null,
  			game: null,
  			lvl: 1,
  			gameSpeed: null,
  			heroSpeed: 10,
  			gameScore: 0,
  			objList: [
  				tempHero,
  				new gameObj(1, Math.random() * 450 , 0),
  				new gameObj(1, Math.random() * 450 , -100),
  				new gameObj(1, Math.random() * 450 , -200),
  				new gameObj(1, Math.random() * 450 , -300),
  				new gameObj(1, Math.random() * 450 , -400),
  				new gameObj(1, Math.random() * 450 , -500),
  				new gameObj(1, Math.random() * 450 , -600),
  				new gameObj(1, Math.random() * 450 , -700),
  			],
  			hero: null
  		}
  	},
  	methods: {
  		startGame: function() {
  			let vueObj = this
  			this.game.fillStyle = "#FF0000";
  			this.game.fillRect(0, 0, 500, 500);
  			this.gameSpeed = this.lvl * 2;
  			console.log("drawing");
  			let gameLoop = setInterval(function() {
  				vueObj.game.drawImage(bg, 0, 0, 500, 500)

  				vueObj.objList.forEach((obj) => {
  					if (obj.type == 1){
  						obj.y += vueObj.gameSpeed;
  						if(obj.y > 500){
  							obj.y = -300;
  							obj.x = Math.random() * 450;
  						}
  					}  					
  				})

  				vueObj.objList.forEach((obj) => {
  					// obj.type == 0 ? vueObj.game.fillStyle = "green" : vueObj.game.fillStyle = "blue";
  					vueObj.game.drawImage(obj.image, obj.x, obj.y, 50, 100);
  				})

          vueObj.objList.forEach((obj) => {
            if (obj.type === 1) {
              if (obj.y + 80 > vueObj.hero.y && obj.y + 80 < vueObj.hero.y + 80 ||
                  obj.y > vueObj.hero.y && obj.y < vueObj.hero.y + 80) {
                if(obj.x + 30 > vueObj.hero.x && obj.x + 30 < vueObj.hero.x + 30 ||
                  obj.x > vueObj.hero.x && obj.x < vueObj.hero.x + 30){
                  alert("sosat'")
                }
              }
            }
          })

  				vueObj.gameScore += vueObj.gameSpeed;
  				vueObj.lvl = (vueObj.gameScore / 3000) + 1;
  				vueObj.gameSpeed = vueObj.lvl * 2;
  			}, 1000 / 60)

  		},
  		heroLeft: function() {
  			if (this.hero.x > 0)
  				this.hero.x -= this.heroSpeed;
  		},
  		heroRight: function() {
  			if (this.hero.x < 450)
  				this.hero.x += this.heroSpeed;
  		}
  	},
  	mounted() {
  		this.canvas = document.getElementById("canvas");
  		console.log(this.canvas);
  		this.game = this.canvas.getContext("2d");
  		this.hero = this.objList[0];
  		let vueObj = this;
  		window.addEventListener("keydown", function(event) {
  			if (event.keyCode === 37) {
  				vueObj.heroLeft()
  			}

  			if (event.keyCode === 39) {
  				vueObj.heroRight()
  			}
  		}, true);
  		this.startGame();
  	}
  }
</script>
