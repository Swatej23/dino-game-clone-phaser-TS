
import { SpriteWithDynamicBody } from "./Types";
import { Player } from "../entities/Player";
import {GameScene} from "../Scenes/GameScene";
import { PRELOAD_CONFIG } from "..";

class PlayScene extends GameScene{
    player : Player
    startTrigger : SpriteWithDynamicBody;
    ground : Phaser.GameObjects.TileSprite;
    obstacles : Phaser.Physics.Arcade.Group;
    clouds : Phaser.GameObjects.Group;

    scoreText : Phaser.GameObjects.Text;
    highScoreText : Phaser.GameObjects.Text;
    gameOverContainer : Phaser.GameObjects.Container;
    gameOverText : Phaser.GameObjects.Image;
    restart : Phaser.GameObjects.Image;
    
    score: number = 0;
    scoreTime: number = 0;
    scoreInterval: number = 100;

    spawnInterval : number = 1500;
    spawnTime: number = 0;
    gameSpeed: number = 8;
    gameSpeedModifier : number = 1;

    progressSound : Phaser.Sound.HTML5AudioSound;
    constructor(){
        super("PlayScene")       
    }
    
    create(){
        this.createEnvironment();
        this.createPlayer();
        this.createObstacles();
        this.createGameoverContainer();
        this.createBirdAnimation();
        this.createScoreText();

        this.handleGameStart();
        this.handleObstacleCollision();
        this.handleRestart();

        this.progressSound = this.sound.add('progress' , {volume: 0.2}) as Phaser.Sound.HTML5AudioSound;
    
    }

    update(time: number, delta: number): void {
       if(!this.isGameRunning) {return ; }
        
        this.spawnTime += delta ;
        this.scoreTime += delta ;

       if(this.spawnTime >= this.spawnInterval){
        this.spawnObstacle();
        this.spawnTime = 0;
       }
       if(this.scoreTime >= this.scoreInterval){
        this.score++;
        console.log(this.score);
        this.scoreTime = 0;
       }

       if(this.score % 100 === 0 ){
        this.gameSpeedModifier += 0.1 ; 

        this.progressSound.play();
        
        this.tweens.add({
            targets: this.scoreText,
            alpha: 0,
            duration: 100,
            repeat: 3,            // -1: infinity
            yoyo: true,
            onComplete : () => {
                this.scoreText.setAlpha(1);
            }         
          });          
       }

       Phaser.Actions.IncX(this.obstacles.getChildren(), -this.gameSpeed * this.gameSpeedModifier);
       Phaser.Actions.IncX(this.clouds.getChildren(), -0.8);

       const score = Array.from(String(this.score) , Number)

       for(let i = 0 ; i < 5 - String(this.score).length ; i++){
        score.unshift(0);
       }

       this.scoreText.setText(score.join(''));

       this.obstacles.getChildren().forEach((obstacle : SpriteWithDynamicBody) => {
        if(obstacle.getBounds().right < 0){
            this.obstacles.remove(obstacle);
        }
       });

       this.clouds.getChildren().forEach((cloud : SpriteWithDynamicBody) => {
        if(cloud.getBounds().right < 0){
            cloud.x =this.gameWidth + 30;
        }
       });

       this.ground.tilePositionX += (this.gameSpeed * this.gameSpeedModifier ); 

    }

    createEnvironment(){
        this.ground =  this.add.tileSprite(0, this.gameHeight, 100, 26, 'ground').setOrigin(0,1);
        
        this.clouds = this.add.group();
        this.clouds = this.clouds.addMultiple([
            this.add.image(this.gameWidth / 2  , 170 , 'cloud'),
            this.add.image(this.gameWidth - 80 , 70 , 'cloud'),
            this.add.image(this.gameWidth / 1.3 , 100 , 'cloud'),
            this.add.image(this.gameWidth / 3.5  , 180 , 'cloud'),
        ]);

        this.clouds.setAlpha(0);
    }
    createPlayer(){
       this.player = new Player(this , 0 , this.gameHeight , 'dino-run'); 
    }
    createObstacles(){
        this.obstacles = this.physics.add.group();
    }
    createGameoverContainer(){
        this.gameOverText = this.add.image(0, 0, 'gameOverText');
        this.restart = this.add.image(0, 80, 'restart').setInteractive();
        
        this.gameOverContainer = this.add
            .container(this.gameWidth/2 , (this.gameHeight/2) - 60)
            .add([this.gameOverText , this.restart])
            .setAlpha(0);
        
    }
    createBirdAnimation(){
        this.anims.create({
            key: 'enemy-bird-fly' , 
            frames: this.anims.generateFrameNumbers('enemy-bird') , 
            frameRate: 10 , 
            repeat : -1
        })
    }
    createScoreText(){
        this.scoreText = this.add.text(this.gameWidth , 0 , '00000' ,{
            fontSize : 30,
            fontFamily : 'Times New Roman' , 
            color: '#808080',
            resolution : 5
        }).setAlpha(0).setOrigin(1,0);

        this.highScoreText = this.add.text(this.scoreText.getBounds().left - 20, 0 , '00000' ,{
            fontSize : 30,
            fontFamily : 'Times New Roman' , 
            color: '#808080',
            resolution : 5
        }).setAlpha(0).setOrigin(1,0);
        
    }
    spawnObstacle(){
        const obsticleCount = PRELOAD_CONFIG.cactusesCount + PRELOAD_CONFIG.birdsCount;
        const obstacleNum = Math.floor(Math.random() * obsticleCount) + 1; 
        
        const distance = Phaser.Math.Between(150 , 300);
        let obstacle;    

        if(obstacleNum > PRELOAD_CONFIG.cactusesCount){
            const enemyHeightPos = [20 ,70];
            const enemyHeight = enemyHeightPos[Math.floor(Math.random() * 2)];
                  
            obstacle = this.obstacles
            .create(this.gameWidth + distance , this.gameHeight - enemyHeight , 'enemy-bird')
            .setOrigin(0, 1)
            .setImmovable();

            obstacle.play('enemy-bird-fly');
        }else
        {
            obstacle = this.obstacles
            .create(this.gameWidth + distance , this.gameHeight , `obstacle-${obstacleNum}`)
            .setOrigin(0, 1)
            .setImmovable();
        }
    }

    handleGameStart(){
    this.startTrigger = this.physics.add.sprite(0, 10, null).setOrigin(0,1)
    .setAlpha(0);

    this.physics.add.overlap(this.startTrigger , this.player , () => {
        if(this.startTrigger.y === 10){
            this.startTrigger.body.reset(0, this.gameHeight);
            return; 
        }
        this.startTrigger.body.reset(9999,9999);

        const rollOutEvent = this.time.addEvent({
            delay: 1000/60,
            loop: true,
            callback: () => {
                this.player.playRunAnimation();
                this.player.setVelocityX(80);
                this.ground.width += (17 * 2);
            
            if(this.ground.width >= this.gameWidth){
                rollOutEvent.remove();
                this.ground.width = this.gameWidth;
                this.player.setVelocityX(0);
                this.clouds.setAlpha(1);
                this.scoreText.setAlpha(1);
                this.isGameRunning = true;
            }
        }
        })
    })
    }
    handleObstacleCollision(){
        this.physics.add.collider(this.player , this.obstacles , () => {
            this.isGameRunning = false ;
            this.physics.pause();
            this.player.die();
            this.anims.pauseAll();
            this.gameOverContainer.setAlpha(1);
            
            // explain
            const newHighScore = this.highScoreText.text.substring(this.highScoreText.text.length - 5);
            const newScore = Number(this.scoreText.text) > Number(newHighScore) ? this.scoreText.text : newHighScore  

            this.highScoreText.setText('HI ' + newScore);
            this.highScoreText.setAlpha(1);


            this.spawnTime = 0;
            this.scoreTime = 0;
            this.gameSpeedModifier = 1;
        });
    }
    handleRestart(){
        this.restart.on('pointerdown' , () => {
            this.physics.resume();
            this.player.setVelocityY(0);
            this.obstacles.clear(true, true);
            this.gameOverContainer.setAlpha(0);
            this.anims.resumeAll();
            this.score = 0;
            this.isGameRunning = true;
        })
    }

}
export default PlayScene;