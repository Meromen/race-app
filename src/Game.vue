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
        this.image.src = "src/assets/HeroCar.png";        
      } else 
      if (this.type == 1) {
        this.image.src = "src/assets/EnemyCar.png";        
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
  			heroSpeed: 5,
  			gameScore: 0,
  			objList: [],
        gameLoop: null,
        hero: null,
        keyState: {},
        gameState: {
          menuMod: {            
            main: true,
            credits: false
          },
          gameMod: false
        },
        menuImg: {
          backGround: null,
          newGameBut: null,
          creditsBut: null,
          credits: null,
          backBut: null
        }
  		}
  	},
  	methods: {
  		startGame: function() {
  			let vueObj = this
        
        this.initGame();
        
  			this.gameLoop = setInterval(function() {

          if (vueObj.gameState.menuMod.main || vueObj.gameState.menuMod.credits) {
            vueObj.drawMenu();
          }

          if (vueObj.gameState.gameMod) {
            vueObj.checkKyes();
          
            vueObj.moveObjects();
            
            vueObj.drawScene();

            vueObj.checkBonuses();

            vueObj.findCollision();

            vueObj.drawInfo();

            vueObj.updateStats();          
          }                    
  			}, 1000 / 60)
      },
      
      initMenu: function() {
        this.menuImg.newGameBut = new Image();

        this.menuImg.creditsBut = new Image();

        this.menuImg.credits = new Image();

        this.menuImg.backBut = new Image();

        this.menuImg.backGround = new Image();

        this.menuImg.backGround.src = "src/assets/background.jpg";

        this.menuImg.newGameBut.src =  "src/assets/ngb.png";
        this.menuImg.newGameBut.x1 = 156;
        this.menuImg.newGameBut.x2 = 356;
        this.menuImg.newGameBut.y1 = 100;
        this.menuImg.newGameBut.y2 = 150;
        this.menuImg.newGameBut.NGBSelected = false;

        this.menuImg.creditsBut.src = "src/assets/cb.png";
        this.menuImg.creditsBut.x1 = 156;
        this.menuImg.creditsBut.x2 = 356;
        this.menuImg.creditsBut.y1 = 300;
        this.menuImg.creditsBut.y2 = 350;
        this.menuImg.creditsBut.CBSelected = false;

        this.menuImg.credits.src = "src/assets/credits.png";
        this.menuImg.credits.x1 = 0;
        this.menuImg.credits.x2 = 512;
        this.menuImg.credits.y1 = 0;
        this.menuImg.credits.y2 = 512;

        this.menuImg.backBut.src = "src/assets/bb.png";
        this.menuImg.backBut.x1 = 156;
        this.menuImg.backBut.x2 = 356;
        this.menuImg.backBut.y1 = 400;
        this.menuImg.backBut.y2 = 450;
        this.menuImg.backBut.BBSelected = false;
      },

      initGame: function() {
        this.objList = [
          tempHero,
          new gameObj(1, Math.random() * 450 , 0),
          new gameObj(1, Math.random() * 450 , -200),
          new gameObj(1, Math.random() * 450 , -400),
          new gameObj(1, Math.random() * 450 , -600),
          new gameObj(1, Math.random() * 450 , -800),
          new gameObj(1, Math.random() * 450 , -1000),
          new gameObj(1, Math.random() * 450 , -1200),
          new gameObj(1, Math.random() * 450 , -1400),
          new gameObj(1, Math.random() * 450 , -1600),
          new gameObj(1, Math.random() * 450 , -1800),
          new gameObj(1, Math.random() * 450 , -2000),
          new gameObj(1, Math.random() * 450 , -2200),
          new gameObj(1, Math.random() * 450 , -2400),
          new gameObj(2, Math.random() * 450 , -2600),                 
        ]
        this.hero = this.objList[0];   
        this.gameScore = 0;
        this.lvl = 1;
        this.gameSpeed = this.lvl * 1.54;
        
  			this.game.fillStyle = "#FF0000";
  			this.game.fillRect(0, 0, 500, 500);        
        

        console.log("drawing");
      },

      moveObjects: function () {
        this.objList.forEach((obj) => {
          if (obj.type == 1) {
            obj.y += this.gameSpeed;
            if(obj.y > 500) {
              obj.y = -2300;
              obj.x = Math.random() * 450;
            }
          } else 
          if (obj.type == 2) {
            obj.y += this.gameSpeed;
            if(obj.y > 500) {
              obj.y = -2300;
              obj.x = Math.random() * 450;
            }
          }
  			})
      },

      findCollision: function () {
        this.objList.forEach((obj) => {            
            if (obj.y + 80 > this.hero.y && obj.y + 80 < this.hero.y + 80 ||
                obj.y > this.hero.y && obj.y < this.hero.y + 80) {
              if (obj.x + 45 > this.hero.x && obj.x + 45 < this.hero.x + 45 ||
                obj.x > this.hero.x && obj.x < this.hero.x + 45){
                if (obj.type === 1) {   
                  if (this.hero.bonusStatus.bonusActive) {
                    this.hero.bonusStatus.bonusActive = false;
                    this.hero.bonusStatus.bonusTimer = 0;
                    obj.x = Math.random() * 450;
                    obj.y = -2300 - (500 - obj.y);
                  } else {
                    this.endGame();                    
                  }
                }

                if (obj.type === 2) {
                  this.hero.bonusStatus.bonusActive = true;
                  this.hero.bonusStatus.bonusTimer = 10000;
                  this.hero.bonusStatus.bonusType = obj.bonusStatus.bonusType;
                  obj.x = Math.random() * 450;
                  obj.y = -2300 - (500 - obj.y);
                }
              }
            }
          })
      },
      
      drawMenu: function() {
        let images = this.menuImg

        this.game.clearRect(0, 0, 512, 512);
        this.game.drawImage(images.backGround, 0, 0);
        if (this.gameState.menuMod.main) {
          this.game.drawImage(images.newGameBut, images.newGameBut.x1, images.newGameBut.y1 );
          this.game.drawImage(images.creditsBut, images.creditsBut.x1, images.creditsBut.y1 );

          if (images.creditsBut.CBSelected){
              this.game.beginPath();
              this.game.rect(images.creditsBut.x1, images.creditsBut.y1, images.creditsBut.x2 - images.creditsBut.x1, images.creditsBut.y2 - images.creditsBut.y1);
              this.game.lineWidth = "4";
              this.game.strokeStyle = "#BB0060";
              this.game.stroke();
          }

          if (images.newGameBut.NGBSelected){
              this.game.beginPath();
              this.game.rect(images.newGameBut.x1, images.newGameBut.y1, images.newGameBut.x2 - images.newGameBut.x1, images.newGameBut.y2 - images.newGameBut.y1);
              this.game.lineWidth = "4";
              this.game.strokeStyle = "#BB0060";
              this.game.stroke();
          }
        }
        
        if (this.gameState.menuMod.credits) {
          this.game.drawImage(images.credits, images.credits.x1, images.credits.y1 );
          this.game.drawImage(images.backBut, images.backBut.x1, images.backBut.y1 );

          if (images.backBut.BBSelected){
              this.game.beginPath();
              this.game.rect(images.backBut.x1, images.backBut.y1, images.backBut.x2 - images.backBut.x1, images.backBut.y2 - images.backBut.y1);
              this.game.lineWidth = "4";
              this.game.strokeStyle = "#BB0060";
              this.game.stroke();
          }
        }
      },

      drawScene: function() {
        this.game.drawImage(bg, 0, 0, 500, 500)  				

        this.objList.forEach((obj) => {
          this.game.drawImage(obj.image, obj.x, obj.y, 50, 100);
        })
      },

      drawInfo: function() {
        let scoreString = "Score: " + Math.ceil(this.gameScore);
        let lvlString = "Level: " + Math.floor(this.lvl);
        this.game.fillStyle = "#FF0000";
        this.game.font = "30px Arial";
        this.game.fillText(scoreString, 50, 50)
        this.game.fillText(lvlString, 50, 100)

        if (this.hero.bonusStatus.bonusActive) {
          if (this.hero.bonusStatus.bonusTimer <= 1) {
            this.hero.bonusStatus.bonusActive = false;
          }
          this.hero.bonusStatus.bonusTimer -= (1000 / 60)
          let tiemerString = "Bonus: " + Math.floor(this.hero.bonusStatus.bonusTimer / 1000) + "s"
          this.game.fillStyle = "#FF0000";
          this.game.font = "30px Arial";
          this.game.fillText(tiemerString, 350, 50)
        }
      },
      
      drawShield: function() {
        this.game.beginPath();
            this.game.arc(this.hero.x + 25, this.hero.y + 50, 52, 0, 2 * Math.PI);
            this.game.strokeStyle = "blue";
            this.game.stroke();
            this.game.fillStyle = "rgba(92, 117, 206, 0.4)";
            this.game.fill();
      },

      updateStats: function() {
        this.gameScore += this.gameSpeed;
        this.lvl = (this.gameScore / 3000) + 1;
        this.gameSpeed = this.lvl * 1.54;
      },

      checkBonuses: function() {
        if (this.hero.bonusStatus.bonusActive){
            this.drawShield();
        }
      },

      checkKyes: function() {
        if (this.keyState[37] || this.keyState[65]) {
          this.heroLeft()
        }

        if (this.keyState[39] || this.keyState[68]) {
          this.heroRight()
        }
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
      },

      mouseMove: function(event) {
        let rect = this.canvas.getBoundingClientRect();
        let images = this.menuImg

        let posX = event.clientX - rect.left;
        let posY = event.clientY - rect.top;
        if (this.gameState.menuMod.credits || this.gameState.menuMod.main)
          if (this.gameState.menuMod.credits) {
            if (posX >= images.backBut.x1 && posX <= images.backBut.x2 && posY >= images.backBut.y1 && posY <= images.backBut.y2) {
              this.butSelectionOff();
              images.backBut.BBSelected = true
            } else this.butSelectionOff()
          } else {
            if (posX >= images.newGameBut.x1 && posX <= images.newGameBut.x2 && posY >= images.newGameBut.y1 && posY <= images.newGameBut.y2) {
              this.butSelectionOff();
              images.newGameBut.NGBSelected = true;
            } else
            if (posX >= images.creditsBut.x1 && posX <= images.creditsBut.x2 && posY >= images.creditsBut.y1 && posY <= images.creditsBut.y2) {
              this.butSelectionOff();
              images.creditsBut.CBSelected = true;
          } else this.butSelectionOff()
        }        
      },
      
      mouseDown: function(event) {
        let images = this.menuImg;

        let rect = this.canvas.getBoundingClientRect();
        let posX = event.clientX - rect.left;
        let posY = event.clientY - rect.top;

        if (this.gameState.menuMod.credits || this.gameState.menuMod.main){
          if (this.gameState.menuMod.credits){
            if(posX >= images.backBut.x1 && posX <= images.backBut.x2 && posY >= images.backBut.y1 && posY <= images.backBut.y2){
                this.gameState.menuMod.credits = false;
                this.gameState.menuMod.main = true;
            }
          } else {
            if(posX >= images.newGameBut.x1 && posX <= images.newGameBut.x2 && posY >= images.newGameBut.y1 && posY <= images.newGameBut.y2){
                this.gameState.menuMod.main = false;
                this.gameState.gameMod = true;
            }

            if(posX >= images.creditsBut.x1 && posX <= images.creditsBut.x2 && posY >= images.creditsBut.y1 && posY <= images.creditsBut.y2){
                this.gameState.menuMod.main = false;
                this.gameState.menuMod.credits = true;
            }
          }
        }
      },

      butSelectionOff: function() {
        this.menuImg.newGameBut.NGBSelected = false;
        this.menuImg.backBut.BBSelected = false;
        this.menuImg.creditsBut.CBSelected = false;
      },
    },

     

  	mounted() {		
			if (this.auth) {
				this.canvas = document.getElementById("canvas");
				console.log(this.canvas);
				this.game = this.canvas.getContext("2d");
				this.hero = this.objList[0];
        let vueObj = this;
        this.initMenu();  
        this.canvas.addEventListener("mousedown", function(event) {vueObj.mouseDown(event)});
        this.canvas.addEventListener("mousemove", function(event) {vueObj.mouseMove(event)});
        window.addEventListener('keydown',function(e){
          vueObj.keyState[e.keyCode || e.which] = true;
        },true);    
        window.addEventListener('keyup',function(e){
          vueObj.keyState[e.keyCode || e.which] = false;
        },true);
          
        
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
