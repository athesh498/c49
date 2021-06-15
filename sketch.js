//assigning variables
var tiger,man,obstacle1,obstacle2,obstacle3,obstacle4,bgImage,obstaclesGroup;
var tiger_running,man_running,invisibleGround,man_jumping;
var health = 3;
var gameOver,restart,gameOverImage,restartImage;
var END = 0;
var PLAY = 1;
var gameState = PLAY;
var manJumpingSound,manHittingSound,gameOverSound,tigerJumping,manFell;

//loading sound images and animation
function preload(){
  tiger_running = loadAnimation("images/tiger 1.png","images/tiger 2.png","images/tiger 3.png",
  "images/tiger 4.png","images/tiger 5.png","images/tiger 6.png","images/tiger 7.png","images/tiger 8.png","images/tiger 9.png","images/tiger 10.png");
  man_running   = loadAnimation("images/man-1.png","images/man-2.png","images/man-3.png","images/man-4.png","images/man-5.png","images/man-6.png")
  bgImage       = loadImage("images/bg.jpg");
  man_jumping   = loadAnimation("images/man-1.png");
  tigerJumping  = loadAnimation("images/tiger 1.png")
  obstacle1     = loadImage("images/obstacle-1.png")
  obstacle2     = loadImage("images/obstacle-2.png")
  obstacle3     = loadImage("images/obstacle-3.png")
  obstacle4     = loadImage("images/obstacle-4.png")
  gameOverImage = loadImage("images/gameover.png");
  restartImage  = loadImage("images/restart.png");
  manJumpingSound = loadSound("sound/jumping.mp3");
  manHittingSound = loadSound("sound/hitting.mp3");
  gameOverSound  =loadSound("sound/gameOver.mp3");
  manFell  = loadAnimation("images/man_fell_down.png")
}

function setup() {
  createCanvas(windowWidth,windowHeight);
  //creating sprites
  invisibleGround =  createSprite(0,height-100,width*3,10);

  tiger = createSprite(width/4,height-250,50,50);
  tiger.addAnimation("_running",tiger_running);
  tiger.addAnimation("_jumping",tigerJumping);
  tiger.scale = 0.5;
  tiger.frameDelay = 2;
  tiger.velocityX = 3;
  tiger.x = width/4;
  tiger.setCollider('rectangle',0,0,tiger.width,tiger.height);
  
  man = createSprite(width-width/3,height-250,50,50);
  man.addAnimation("man_running",man_running);
  man.addAnimation("man_jumping",man_jumping);
  man.addAnimation("#fell", manFell);
  man.scale = 0.7;
  man.frameDelay = 2;
  man.x = width-width/3;
  man.velocityX = 3;
  man.setCollider('rectangle',0,0,man.width,man.height);

  gameOver  = createSprite(width/2,height/3,200,200);
  gameOver.shapeColor = "red";
  gameOver.visible = false;
  gameOver.addImage(gameOverImage);
  
  restart = createSprite(width/2,height/2,50,50);
  restart.shapeColor = "green"
  restart.visible = false;
  restart.addImage(restartImage);
  restart.scale = 0.2;
  
  obstaclesGroup = new Group();
}
//draw
function draw() {
  background(bgImage);
  //health
  textSize(32);
  fill("white")
  text("Health: "+health,0,30);
//game state play
if(gameState === PLAY){
  if(man.x > width){
    man.x = width-width/3;
    tiger.x = width/4;
  }
//for man jumping
if(keyWentUp("SPACE") && man.y < 586){
  man.velocityY = -30;
  manJumpingSound.play();
  man.changeAnimation("man_jumping",man_jumping);
}
if(keyWentDown("SPACE") && man.y > 586){
  man.changeAnimation("man_running",man_running);

}
   man.velocityY = man.velocityY + 1.5 
  //AI for tiger to jump
  if(tiger.isTouching(obstaclesGroup)){
    tiger.velocityY = -35 ;
    tiger.changeAnimation("_jumping",tigerJumping);

  }
  tiger.velocityY = tiger.velocityY + 1.5 

  //decreasing health
  if(man.isTouching(obstaclesGroup)){
    health = health-1;
    obstaclesGroup[0].destroy();
    manHittingSound.play();
 }
//game over
 if(health === 0){
   gameState = END;
   gameOverSound.play();
 }
}
   
// game state end
   if(gameState === END){
       tiger.velocityX = 0;
       man.velocityX = 0;
       gameOver.visible = true;
       restart.visible = true;
       obstaclesGroup.setVelocityXEach(0);
       obstaclesGroup.setLifetimeEach(0);
       man.changeAnimation("#fell",manFell);
       tiger.changeAnimation("_jumping",tigerJumping);
       tiger.x = man.x;
       //gameOverSound.play();
       if(mousePressedOver(restart)){
          reset();
       }
   
  }

   
    tiger.collide(invisibleGround);
    man.collide(invisibleGround);
    invisibleGround.visible = false;
    
  spawnObstacles();
  drawSprites();
}
//to spawn obstacles
function spawnObstacles() {
  if(frameCount % 120 === 0) {
    var obstacle = createSprite(width,height-110,20,30);
    obstacle.setCollider('circle',0,0,45)
    //obstacle.debug = true
  
    obstacle.velocityX = -10;
    
    //generate random obstacles
    var rand = Math.round(random(1,2,3,4));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      default: break;
    }
    
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}
//to reset the game
function reset(){
  health = 3;
  gameState = PLAY;
  tiger.velocityX = 3;
  man.velocityX = 3;
  tiger.x = width/4;
  man.x = width-width/3;
  man.changeAnimation("man_running",man_running);
  tiger.changeAnimation("_running",tiger_running)
  //obstaclesGroup[0].destroy();
  restart.visible = false;
  gameOver.visible = false;
}