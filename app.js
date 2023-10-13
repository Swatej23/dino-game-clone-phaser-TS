(()=>{"use strict";var e,t={927:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.GameScene=void 0;class s extends Phaser.Scene{get gameHeight(){return this.game.config.height}get gameWidth(){return this.game.config.width}constructor(e){super(e),this.isGameRunning=!1}}t.GameScene=s},772:(e,t,s)=>{Object.defineProperty(t,"__esModule",{value:!0});const i=s(661),a=s(927),r=s(607);class h extends a.GameScene{constructor(){super("PlayScene"),this.score=0,this.scoreTime=0,this.scoreInterval=100,this.spawnInterval=1500,this.spawnTime=0,this.gameSpeed=8,this.gameSpeedModifier=1}create(){this.createEnvironment(),this.createPlayer(),this.createObstacles(),this.createGameoverContainer(),this.createBirdAnimation(),this.createScoreText(),this.handleGameStart(),this.handleObstacleCollision(),this.handleRestart(),this.progressSound=this.sound.add("progress",{volume:.2})}update(e,t){if(!this.isGameRunning)return;this.spawnTime+=t,this.scoreTime+=t,this.spawnTime>=this.spawnInterval&&(this.spawnObstacle(),this.spawnTime=0),this.scoreTime>=this.scoreInterval&&(this.score++,console.log(this.score),this.scoreTime=0),this.score%100==0&&(this.gameSpeedModifier+=.1,this.progressSound.play(),this.tweens.add({targets:this.scoreText,alpha:0,duration:100,repeat:3,yoyo:!0,onComplete:()=>{this.scoreText.setAlpha(1)}})),Phaser.Actions.IncX(this.obstacles.getChildren(),-this.gameSpeed*this.gameSpeedModifier),Phaser.Actions.IncX(this.clouds.getChildren(),-.8);const s=Array.from(String(this.score),Number);for(let e=0;e<5-String(this.score).length;e++)s.unshift(0);this.scoreText.setText(s.join("")),this.obstacles.getChildren().forEach((e=>{e.getBounds().right<0&&this.obstacles.remove(e)})),this.clouds.getChildren().forEach((e=>{e.getBounds().right<0&&(e.x=this.gameWidth+30)})),this.ground.tilePositionX+=this.gameSpeed*this.gameSpeedModifier}createEnvironment(){this.ground=this.add.tileSprite(0,this.gameHeight,100,26,"ground").setOrigin(0,1),this.clouds=this.add.group(),this.clouds=this.clouds.addMultiple([this.add.image(this.gameWidth/2,170,"cloud"),this.add.image(this.gameWidth-80,70,"cloud"),this.add.image(this.gameWidth/1.3,100,"cloud"),this.add.image(this.gameWidth/3.5,180,"cloud")]),this.clouds.setAlpha(0)}createPlayer(){this.player=new i.Player(this,0,this.gameHeight,"dino-run")}createObstacles(){this.obstacles=this.physics.add.group()}createGameoverContainer(){this.gameOverText=this.add.image(0,0,"gameOverText"),this.restart=this.add.image(0,80,"restart").setInteractive(),this.gameOverContainer=this.add.container(this.gameWidth/2,this.gameHeight/2-60).add([this.gameOverText,this.restart]).setAlpha(0)}createBirdAnimation(){this.anims.create({key:"enemy-bird-fly",frames:this.anims.generateFrameNumbers("enemy-bird"),frameRate:10,repeat:-1})}createScoreText(){this.scoreText=this.add.text(this.gameWidth,0,"00000",{fontSize:30,fontFamily:"Times New Roman",color:"#808080",resolution:5}).setAlpha(0).setOrigin(1,0),this.highScoreText=this.add.text(this.scoreText.getBounds().left-20,0,"00000",{fontSize:30,fontFamily:"Times New Roman",color:"#808080",resolution:5}).setAlpha(0).setOrigin(1,0)}spawnObstacle(){const e=r.PRELOAD_CONFIG.cactusesCount+r.PRELOAD_CONFIG.birdsCount,t=Math.floor(Math.random()*e)+1,s=Phaser.Math.Between(150,300);let i;if(t>r.PRELOAD_CONFIG.cactusesCount){const e=[20,70][Math.floor(2*Math.random())];i=this.obstacles.create(this.gameWidth+s,this.gameHeight-e,"enemy-bird").setOrigin(0,1).setImmovable(),i.play("enemy-bird-fly")}else i=this.obstacles.create(this.gameWidth+s,this.gameHeight,`obstacle-${t}`).setOrigin(0,1).setImmovable()}handleGameStart(){this.startTrigger=this.physics.add.sprite(0,10,null).setOrigin(0,1).setAlpha(0),this.physics.add.overlap(this.startTrigger,this.player,(()=>{if(10===this.startTrigger.y)return void this.startTrigger.body.reset(0,this.gameHeight);this.startTrigger.body.reset(9999,9999);const e=this.time.addEvent({delay:1e3/60,loop:!0,callback:()=>{this.player.playRunAnimation(),this.player.setVelocityX(80),this.ground.width+=34,this.ground.width>=this.gameWidth&&(e.remove(),this.ground.width=this.gameWidth,this.player.setVelocityX(0),this.clouds.setAlpha(1),this.scoreText.setAlpha(1),this.isGameRunning=!0)}})}))}handleObstacleCollision(){this.physics.add.collider(this.player,this.obstacles,(()=>{this.isGameRunning=!1,this.physics.pause(),this.player.die(),this.anims.pauseAll(),this.gameOverContainer.setAlpha(1);const e=this.highScoreText.text.substring(this.highScoreText.text.length-5),t=Number(this.scoreText.text)>Number(e)?this.scoreText.text:e;this.highScoreText.setText("HI "+t),this.highScoreText.setAlpha(1),this.spawnTime=0,this.scoreTime=0,this.gameSpeedModifier=1}))}handleRestart(){this.restart.on("pointerdown",(()=>{this.physics.resume(),this.player.setVelocityY(0),this.obstacles.clear(!0,!0),this.gameOverContainer.setAlpha(0),this.anims.resumeAll(),this.score=0,this.isGameRunning=!0}))}}t.default=h},866:function(e,t,s){var i=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0});const a=i(s(260)),r=s(607);class h extends a.default.Scene{constructor(){super("PreloadScene")}preload(){this.load.image("ground","assets/ground.png"),this.load.image("dino-idle","assets/dino-idle-2.png"),this.load.image("dino-hurt","assets/dino-hurt.png"),this.load.image("cloud","assets/cloud.png"),this.load.image("gameOverText","assets/game-over.png"),this.load.image("restart","assets/restart.png"),this.load.audio("hit","assets/hit.m4a"),this.load.audio("jump","assets/jump.m4a"),this.load.audio("progress","assets/reach.m4a");for(let e=0;e<=r.PRELOAD_CONFIG.cactusesCount;e++){const t=e+1;this.load.image(`obstacle-${t}`,`assets/cactuses_${t}.png`)}this.load.spritesheet("dino-run","assets/dino-run.png",{frameWidth:88,frameHeight:94}),this.load.spritesheet("dino-down","assets/dino-down-2.png",{frameWidth:118,frameHeight:94}),this.load.spritesheet("enemy-bird","assets/enemy-bird.png",{frameWidth:92,frameHeight:77})}create(){this.scene.start("PlayScene")}}t.default=h},661:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.Player=void 0;class s extends Phaser.Physics.Arcade.Sprite{constructor(e,t,s,i){super(e,t,s,i),e.add.existing(this),e.physics.add.existing(this),this.init(),this.scene.events.on(Phaser.Scenes.Events.UPDATE,this.update,this)}init(){this.cursors=this.scene.input.keyboard.createCursorKeys(),this.setOrigin(0,1).setGravityY(5e3).setCollideWorldBounds(!0).setBodySize(44,92).setOffset(20,0).setDepth(1),this.registerAnimations(),this.registerSounds()}update(){const{space:e,down:t}=this.cursors,s=Phaser.Input.Keyboard.JustDown(e),i=Phaser.Input.Keyboard.JustDown(t),a=Phaser.Input.Keyboard.JustUp(t),r=this.body.onFloor();s&&r&&(this.setVelocityY(-1600),this.jumpSound.play()),i&&r&&(this.setBodySize(this.body.width,58),this.setOffset(60,34)),a&&r&&(this.setBodySize(44,92),this.setOffset(20,0)),this.scene.isGameRunning&&(this.body.deltaAbsY()>0?(this.setTexture("dino-run",0),this.anims.stop()):this.playRunAnimation())}registerAnimations(){this.anims.create({key:"dino-run",frames:this.anims.generateFrameNumbers("dino-run",{start:2,end:3}),frameRate:10,repeat:-1}),this.anims.create({key:"dino-down",frames:this.anims.generateFrameNumbers("dino-down"),frameRate:10,repeat:-1})}registerSounds(){this.jumpSound=this.scene.sound.add("jump",{volume:.2}),this.hitSound=this.scene.sound.add("hit",{volume:.2})}playRunAnimation(){this.body.height<=58?this.play("dino-down",!0):this.play("dino-run",!0)}die(){this.anims.pause(),this.hitSound.play(),this.setTexture("dino-hurt")}}t.Player=s},607:function(e,t,s){var i=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0}),t.PRELOAD_CONFIG=void 0;const a=i(s(260)),r=i(s(866)),h=i(s(772));t.PRELOAD_CONFIG={cactusesCount:6,birdsCount:1};const o={type:a.default.AUTO,width:1e3,height:340,pixelArt:!0,transparent:!0,physics:{default:"arcade",arcade:{}},scene:[r.default,h.default]};new a.default.Game(o)}},s={};function i(e){var a=s[e];if(void 0!==a)return a.exports;var r=s[e]={exports:{}};return t[e].call(r.exports,r,r.exports,i),r.exports}i.m=t,e=[],i.O=(t,s,a,r)=>{if(!s){var h=1/0;for(l=0;l<e.length;l++){for(var[s,a,r]=e[l],o=!0,n=0;n<s.length;n++)(!1&r||h>=r)&&Object.keys(i.O).every((e=>i.O[e](s[n])))?s.splice(n--,1):(o=!1,r<h&&(h=r));if(o){e.splice(l--,1);var d=a();void 0!==d&&(t=d)}}return t}r=r||0;for(var l=e.length;l>0&&e[l-1][2]>r;l--)e[l]=e[l-1];e[l]=[s,a,r]},i.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),(()=>{var e={143:0};i.O.j=t=>0===e[t];var t=(t,s)=>{var a,r,[h,o,n]=s,d=0;if(h.some((t=>0!==e[t]))){for(a in o)i.o(o,a)&&(i.m[a]=o[a]);if(n)var l=n(i)}for(t&&t(s);d<h.length;d++)r=h[d],i.o(e,r)&&e[r]&&e[r][0](),e[r]=0;return i.O(l)},s=self.webpackChunkphaser_webpack_boilerplate=self.webpackChunkphaser_webpack_boilerplate||[];s.forEach(t.bind(null,0)),s.push=t.bind(null,s.push.bind(s))})();var a=i.O(void 0,[736],(()=>i(607)));a=i.O(a)})();