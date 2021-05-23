var PLAY = 1;
var END = 0;
var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;
var frames = 70;
var oFrames = 20;
var state = "start";
var spawnGap = 89;
var ducking = false;
var jumping = false;

var auto = false;

var score = 0;

var cloudsGroup;
var obstaclesGroup;
var phtGroup;
var coinGroup;

function preload(){
  trex_standing = loadAnimation("MarioStand.png");
  trex_jumping = loadAnimation("MarioRun1.png")
  trex_running = loadAnimation("MarioRun1.png",  "MarioRun5.png");
  trex_collided = loadImage("MarioDie.png");
  trex_ducking = loadAnimation("MarioDucking1.png", "MarioDucking2.png", "MarioDucking3.png");
  trex_jump = loadSound("jump3.wav");
  Trex_die = loadSound("Die.mp3")
  
  groundImage = loadImage("MarioGround2.png");
  
  cloudImageOne = loadImage("CloudOne.png");
  cloudImageTwo = loadImage("CloudTwo.png");
  cloudImageThree = loadImage("CloudThree.png");
  
  obstacleImage1 = loadImage("MarioPipe1.png")
  obstacleImage2 = loadImage("MarioPipe2.png")
  obstacleImage3 = loadImage("MarioPipe3.png")
  
  gameOverImg = loadImage("gameOver2.png");
  restartImg = loadImage("restart.png");
  
  titleG = loadImage("superByju.png");
  coinIm = loadImage("MarioCoin.png");
}

function setup() {
  
  createCanvas(windowWidth, windowHeight);

  //create a ground sprite
  ground = createSprite(windowWidth,windowHeight-8,windowWidth,20);
  ground.addImage("ground",groundImage);
  ground.velocityX = -0;
  ground.scale = 0.8;
  
  //creating invisible ground
  invisibleGround = createSprite(windowWidth/2,windowHeight-8,windowWidth,15);
  invisibleGround.visible = false;
  
 //create a trex sprite
  trex = createSprite(50,windowHeight-150,20,50);
  trex.setCollider("rectangle");
  trex.addAnimation("standing", trex_standing);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("jumping", trex_jumping);
  trex.addAnimation("ducking", trex_ducking);
  trex.addImage("collided", trex_collided);
  
  trex.scale = 1.9;
  tBox = createSprite(trex.x, trex.y-10, 35, 35);
  tBox.visible = false;
  
  tSensor = createSprite(100, trex.y+100, 5, 50)
  tSensor.visible = false;
  
  // create Obstacles and Cloud groups
  obstaclesGroup = new Group();
  cloudsGroup = new Group();
  coinGroup = new Group();
  
  restart = createSprite(windowWidth/2, windowHeight/2, 20, 20);
  restart.addImage(restartImg);
  restart.scale = 0.5;
  
  gameOver = createSprite(restart.x, restart.y-65, 200, 40);
  gameOver.addImage(gameOverImg);
  gameOver.scale = 0.4;
  
  title=createSprite(gameOver.x, gameOver.y-130, 20, 20);
  title.addImage(titleG);
  title.scale=0.9
}

function draw() {
  //set background color
  background("#add8e6");
  tBox.collide(ground);
  
  if (keyWentDown("Q") && auto==false){
      auto = true;
    } else if (keyWentDown("Q") && auto==true){
      auto = false;
    }
  
  if (keyWentDown("space")||keyWentDown("up")||keyWentDown("w") ||touches.length>0){
      if(auto==false){
        jumping=true;
        trex_jump.play();
        touches=[];
      }
    }else{
      jumping=false;
    }
  
  
  //state set
  lastState=state;
  if (ducking==false && state != "start"){
    state="play";
  }
  
  if (keyDown("s") || keyDown("down")){
    ducking=true;
    }else{
      ducking=false;
    }
  
  tBox.y = trex.y-5;
  
  //hitbox change
  if (state=="duck"){
  tBox.height=20;
  }else{
  tBox.height=40;
  }
  
  tSensor.x = Math.round(random(70, 145));
  
   if(tBox.y != trex.y-5){
    trex.y=tBox.y;
  }
  
  //Start state
    if (state=="start")
    {
      
      score = 0; 
      
      trex.collide(invisibleGround);
      
      trex.velocityY = trex.velocityY + 3.5;
      
      gameOver.visible = false;
      restart.visible = false;
      
     if(windowWidth>500){
      text("Press Q for auto play", 20, 20);
     }
      
      textSize(25)
      text("Press Space to start", windowWidth/2.5, windowHeight/2);
      trex.changeAnimation("standing")
      textSize(12)
      
      //jump when space key is pressed to start game
      if(jumping==true)
      {
      trex.changeAnimation("jumping", trex_jumping);
      trex.velocityY = -28;
      state="jump"
      }
    }
  
  if(state=="jump"){
    trex.velocityY = trex.velocityY + 3.5;
    if(trex.isTouching(invisibleGround)){
      state="play";
    }
  }
  
  //play state
  if(state=="play" || state=="duck")
  {
    title.visible=false;
    //Ducking
    if (ducking==true){
      state="duck"
    }
    
     
  if (auto==true){
      text("Auto-Play", 20, 20)
  }
    
    if(state=="duck"){
      trex.changeAnimation("ducking")
    }
    score = score + ground.velocityX/22*-1;
    gameOver.visible = false;
    restart.visible = false;
    
    if(frameCount % 4==0){
   nextFrame();
   }
      
    if(trex.isTouching(coinGroup)){
      coinGroup.destroyEach();
    }
    
    //increasing speed
    ground.velocityX=-(17+(score/500));
    //if (score<500){
  //ground.velocityX = -17;
  //spawnGap = 90;
//}else if (score>500 && score<1000) {
 // ground.velocityX = -20;
 // spawnGap = 85;
//}else if (score>1000 && score<1500) {
 // ground.velocityX = -23;
 // spawnGap = 80;
//}else if (score>1500 && score<2000) {
 // ground.velocityX = -26;
 // spawnGap = 75;
//}else if (score>2000 && score<2500){
 // ground.velocityX = -28;
//}else if (score>2500 && score<3000){
 // ground.velocityX = -29;
//}else if (score>3000){
 // ground.velocityX = -32;
//}
    frames = frames + Math.round(random(2, 4));
    oFrames = oFrames + Math.round(random(2, 4));
    
    if(tSensor.isTouching(obstaclesGroup) && state=="play" && auto==true){
      jumping=true;
    }else if (state=="end"){
      jumping=false;
    }
    
  // jump when the space key is pressed
    if(jumping==true && trex.collide(ground))
    {
      trex.velocityY = -28;
      trex.changeAnimation("jumping", trex_jumping);
     } else if (state=="play" && trex.isTouching(ground)) {
      trex.changeAnimation("running", trex_running);
    }
  
    if(state!=="start"){
  trex.velocityY = trex.velocityY + 3.5;
    }
  
  if (ground.x < 800){
    ground.x = 1250;
  }
  
  //stop trex from falling down
  trex.collide(invisibleGround);
    
  //Spawn Clouds
  if (frames>110)
    {
     spawnClouds();
     frames = 0;
    }
  if (oFrames>spawnGap){
    spawnObstacles();
    oFrames = 0;
  }
   //if(obstaclesGroup.legth>1){
   // for (var i=0; i<obstaclesGroup.length; i++){
     // if(obstaclesGroup.get(i).x<trex.x+100){
        //  console.log("hello world")
       //  jumping=true;
     // }
//}
  //}
  }
 
  //end state
  if(tBox.isTouching(obstaclesGroup)){
    state="end";
    trex.changeImage("collided");
    trex.velocityY = 0;
    ground.velocityX = 0;
    invisibleGround.velocityX = 0;
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    coinGroup.setVelocityXEach(0);
    
    obstaclesGroup.setLifetimeEach(10);
    cloudsGroup.setLifetimeEach(10);
  }
  
  if(state=="end"){
    if (trex.y>160){
      trex.y = windowHeight-45;
    }
    frames = 0;
    oFrames = 0;
    gameOver.visible = true;
    restart.visible = true;
    restart.depth = gameOver.depth+1
    
    if (jumping || mousePressedOver(restart)){
    resetGame();
  }
    
  }
  drawSprites();
  
  textSize(20);
  text("Score: " + Math.round(score), windowWidth-150, 25);
  textSize(14);
}

//function to spawn the clouds
function spawnClouds(){
  //Create clouds
  var cloudRandoImage = Math.round(random(1,3));
  randoY = Math.round(random(0, windowHeight/2))
  cloud = createSprite(windowWidth+100, randoY, 10, 10)
  cloud.scale = 0.8
  //cloud.lifetime = 700/3;
  cloud.lifetime = windowWidth/8;
  switch (cloudRandoImage) {
    case 1: cloud.addImage(cloudImageOne);
    break;
    case 2: cloud.addImage(cloudImageTwo);
    break;
    case 3: cloud.addImage(cloudImageThree);
    break;
    default:
    break;
  }
  
  //Increase speed
  cloudsGroup.setVelocityXEach(-(17+(score/500)));
 // if (score<500){
 // cloudsGroup.setVelocityXEach(-17);
//}else if (score>500 && score<1000) {
//  cloudsGroup.setVelocityXEach(-20);
//}else if (score>1000 && score<1500) {
 //cloudsGroup.setVelocityXEach = (-23);
//}else if (score>1500 && score<2000) {
// cloudsGroup.setVelocityXEach = (-26); 
//}else if (score>2000 && score<2500){
 // cloudsGroup.setVelocityXEach = (-28);
//}else if (score>2500 && score<3000){
// cloudsGroup.setVelocityXEach = (-29);
//}else if (score>3000){
 // cloudsGroup.setVelocityXEach = (-32);
//}
  
    //adding cloud to the group
   cloudsGroup.add(cloud);
  
  cloud.depth = gameOver.depth-1;
  trex.depth = cloud.depth+1;
}

function spawnP(){
  PhtY = Math.round(random(30, 50));
  Pht = createSprite(750, PhtY, 20, 20);
  Pht.lifetime = windowWidth/8;
  
  PhtGroup.add(Pht);
  PhtGroup.setVelocityXEach(-(17+(score/500)));
}

function spawnObstacles() {
  randoImage = Math.round(random(1, 3));
  obstacles = createSprite(windowWidth+20, ground.y-10, 10, 10);
  //obstacles.lifetime = 700/3;
  obstacles.lifetime = windowWidth/8;
  
  coin = createSprite(obstacles.x, obstacles.y-80, 20, 20);
  coin.addImage(coinIm);
  coin.scale = 0.19;
  coin.visible=false;
  coinGroup.add(coin)
  coinGroup.setVelocityXEach(-(17+(score/500)));
  
  //adding obstacles to the group
  obstaclesGroup.add(obstacles);
  obstaclesGroup.setVelocityXEach(-(17+(score/500)));
  
  //increase speed
  //if (score<500){
 // obstaclesGroup.setVelocityXEach(-17);
//}else if (score>500 && score<1000) {
//  obstaclesGroup.setVelocityXEach(-20);
//}else if (score>1000 && score<1500) {
 // obstaclesGroup.setVelocityXEach(-23);
//}else if (score>1500 && score<2000) {
 //obstaclesGroup.setVelocityXEach(-26); 
//}else if (score>2000 && score<2500){
 // obstaclesGroup.setVelocityXEach(-28);
//}else if (score>2500 && score<3000){
 // obstaclesGroup.setVelocityXEach(-29);
//}else if (score>3000){
 // obstaclesGroup.setVelocityXEach(-32);
//}
  obstacles.scale = 0.28;
  switch (randoImage) {
    case 1: obstacles.addImage(obstacleImage1);
    break;
    case 2: obstacles.addImage(obstacleImage2);
    break;
    case 3: obstacles.addImage(obstacleImage3);
    break;
    default:
    break;
  }
  
  obstacles.depth = trex.depth-1;
}

function resetGame(){
  frames = 70;
  oFrames = 20;
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  coinGroup.destroyEach();
  score = 0; 
  state="play"
}
//Other spawn option
//Divides by 100  and checks for the remainder
//If the remainder  = 0 it makes a sprite
//Less will spawn more often
//if (framecount % 100==0){
//spawn...

//}

function nextFrame(){
  trex.nextFrame();
}
