<template>
  <div class="container">
    <canvas tabindex="1" id="canvas" width="500" height="500"></canvas>
  </div>
</template>

<script>
  import { fbService } from './main';

	class gameObj {
		constructor(type, x, y) {
			this.type = type;
			this.x = x;
			this.y = y;
			this.image = new Image(50, 100);
      if (this.type == 0) {
        this.image.src = "src/assets/car.png";        
      } else 
      if (this.type == 1) {
        this.image.src = "src/assets/logo.png";        
      } else
      if (this.type == 2) {
        this.image.src = "src/assets/bonus.png"
      }

      this.bonusStatus = {
        bonusType: 0,
        bonusActive: false,
        bonusTimer: 0
      }
		}
	}

	let tempHero = new gameObj(0, 200, 400);
  let bg = new Image();
  bg.src = "src/assets/road.png";

  export default {
		props: {
			auth: {
				required: true
			}
		},
  	data() {
  		return {
  			canvas: null,
  			game: null,
  			lvl: 1,
  			gameSpeed: null,
  			heroSpeed: 20,
  			gameScore: 0,
  			objList: [],
        gameLoop: null,
  			hero: null
  		}
  	},
  	methods: {
  		startGame: function() {
  			let vueObj = this
        this.objList = [
          tempHero,
          new gameObj(1, Math.random() * 450 , 0),
          new gameObj(1, Math.random() * 450 , -100),
          new gameObj(1, Math.random() * 450 , -200),
          new gameObj(1, Math.random() * 450 , -300),
          new gameObj(1, Math.random() * 450 , -400),
          new gameObj(1, Math.random() * 450 , -500),
          new gameObj(1, Math.random() * 450 , -600),
          new gameObj(1, Math.random() * 450 , -700),
          new gameObj(2, Math.random() * 450 , -1500),          
          ]
        this.hero = this.objList[0];   
        this.gameScore = 0;
        this.lvl = 1;
        this.gameSpeed = this.lvl * 2; 

  			this.game.fillStyle = "#FF0000";
  			this.game.fillRect(0, 0, 500, 500);
  			this.gameSpeed = this.lvl * 1.54;
  			console.log("drawing");
  			this.gameLoop = setInterval(function() {
  				vueObj.game.drawImage(bg, 0, 0, 500, 500)
  				vueObj.objList.forEach((obj) => {
  					if (obj.type == 1) {
  						obj.y += vueObj.gameSpeed;
  						if(obj.y > 500) {
  							obj.y = -300;
  							obj.x = Math.random() * 450;
  						}
  					} else 
            if (obj.type == 2) {
              obj.y += vueObj.gameSpeed;
              if(obj.y > 500) {
                obj.y = -3000;
                obj.x = Math.random() * 450;
              }
            }
  				})

  				vueObj.objList.forEach((obj) => {
  					vueObj.game.drawImage(obj.image, obj.x, obj.y, 50, 100);
  				})

          if (vueObj.hero.bonusStatus.bonusActive){
            vueObj.game.beginPath();
            vueObj.game.arc(vueObj.hero.x + 25, vueObj.hero.y + 50, 52, 0, 2 * Math.PI);
            vueObj.game.strokeStyle = "blue";
            vueObj.game.stroke();
            vueObj.game.fillStyle = "rgba(92, 117, 206, 0.4)";
            vueObj.game.fill();
          }


          let scoreString = "Score: " + Math.ceil(vueObj.gameScore);
          let lvlString = "Level: " + Math.floor(vueObj.lvl);
          vueObj.game.fillStyle = "#FF0000";
          vueObj.game.font = "30px Arial";
          vueObj.game.fillText(scoreString, 50, 50)
          vueObj.game.fillText(lvlString, 50, 100)

          vueObj.objList.forEach((obj) => {            
            if (obj.y + 80 > vueObj.hero.y && obj.y + 80 < vueObj.hero.y + 80 ||
                obj.y > vueObj.hero.y && obj.y < vueObj.hero.y + 80) {
              if (obj.x + 30 > vueObj.hero.x && obj.x + 30 < vueObj.hero.x + 30 ||
                obj.x > vueObj.hero.x && obj.x < vueObj.hero.x + 30){
                if (obj.type === 1) {   
                  if (vueObj.hero.bonusStatus.bonusActive) {
                    vueObj.hero.bonusStatus.bonusActive = false;
                    vueObj.hero.bonusStatus.bonusTimer = 0;
                    obj.x = Math.random() * 450;
                    obj.y = -300 - (500 - obj.y);
                  } else {
                    vueObj.endGame();                    
                  }
                }

                if (obj.type === 2) {
                  vueObj.hero.bonusStatus.bonusActive = true;
                  vueObj.hero.bonusStatus.bonusTimer = 10000;
                  vueObj.hero.bonusStatus.bonusType = obj.bonusStatus.bonusType;
                  obj.x = Math.random() * 450;
                  obj.y = -3000 - (500 - obj.y);
                }
              }
            }
          })

          if (vueObj.hero.bonusStatus.bonusActive) {
            if (vueObj.hero.bonusStatus.bonusTimer <= 1) {
              vueObj.hero.bonusStatus.bonusActive = false;
            }
            vueObj.hero.bonusStatus.bonusTimer -= (1000 / 60)
            let tiemerString = "Bonus: " + Math.floor(vueObj.hero.bonusStatus.bonusTimer / 1000) + "s"
            vueObj.game.fillStyle = "#FF0000";
            vueObj.game.font = "30px Arial";
            vueObj.game.fillText(tiemerString, 350, 50)
          }

  				vueObj.gameScore += vueObj.gameSpeed;
  				vueObj.lvl = (vueObj.gameScore / 3000) + 1;
  				vueObj.gameSpeed = vueObj.lvl * 1.54;
  			}, 1000 / 60)
  		},
      endGame: function() {
        let user = this.getUser();

        let data = {
          id: user.uid,
          nickname: user.displayName,
          score: Math.ceil(this.gameScore)
        }

        fbService.database().ref().child('leaderboard').push(data);
        let isNewGame = confirm("Do you wanna play again?")
        if(isNewGame) {
          clearInterval(this.gameLoop);
          this.startGame();          
        }
        else {
          clearInterval(this.gameLoop);
          this.$router.push('/leaderboard');   
        }
      },
  		heroLeft: function() {
  			if (this.hero.x > 0)
  				this.hero.x -= this.heroSpeed;
  		},
  		heroRight: function() {
  			if (this.hero.x < 450)
  				this.hero.x += this.heroSpeed;
  		},
      getUser: function() {
        return fbService.auth().currentUser;
      }
  	},
  	mounted() {		
			if (this.auth) {
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
			}	else {
				this.$router.push('/login');   
			}
  		
		},
		destroyed() {
			clearInterval(this.gameLoop);
		}
  }
</script>
