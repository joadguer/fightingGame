const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 576;

c.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 0.7;

const background = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  imgSrc: "./FightingGame/background.png",
});
const shop = new Sprite({
  position: {
    x: 600,
    y: 160,
  },
  imgSrc: "./FightingGame/shop.png",
  scale: 2.5,
  frameMax: 6,
});
const player = new Fighter({
  position: {
    x: 0,
    y: 0,
  },
  timeOut: 800,
  velocity: {
    x: 0,
    y: 0,
  },
  offset: {
    x: 215,
    y: 157,
  },
  imgSrc: "./FightingGame/samuraiMack/Idle.png",
  frameMax: 8,
  scale: 2.5,
  sprites: {
    idle: {
      imgSrc: "./FightingGame/samuraiMack/Idle.png",
      frameMax: 8,
    },
    run: {
      imgSrc: "./FightingGame/samuraiMack/run.png",
      frameMax: 8,
    },
    fall: {
      imgSrc: "./FightingGame/samuraiMack/fall.png",
      frameMax: 2,
    },
    jump: {
      imgSrc: "./FightingGame/samuraiMack/jump.png",
      frameMax: 2,
    },
    attack1: {
      imgSrc: "./FightingGame/samuraiMack/Attack1.png",
      frameMax: 6,
    },
    takeHit: {
      imgSrc: "./FightingGame/samuraiMack/Take Hit.png",
      frameMax: 4,
    },
    death: {imgSrc: "./FightingGame/samuraiMack/Death.png",
      frameMax: 6,
    }

  },
  attackbox: {
    offset: {
      x: 100,
      y: 50,
    },
    width: 158,
    height: 50,
  },
});

const enemy = new Fighter({
  position: {
    x: 915,
    y: 100,
  },
  timeOut: 900,
  velocity: {
    x: 0,
    y: 0,
  },
  color: "blue",
  offset: {
    x: 215,
    y: 167,
  },
  imgSrc: "./FightingGame/kenji/Idle.png",
  frameMax: 4,
  scale: 2.5,
  sprites: {
    idle: {
      imgSrc: "./FightingGame/kenji/Idle.png",
      frameMax: 4,
    },
    run: {
      imgSrc: "./FightingGame/kenji/run.png",
      frameMax: 8,
    },
    fall: {
      imgSrc: "./FightingGame/kenji/fall.png",
      frameMax: 2,
    },
    jump: {
      imgSrc: "./FightingGame/kenji/jump.png",
      frameMax: 2,
    },
    attack1: {
      imgSrc: "./FightingGame/kenji/Attack1.png",
      frameMax: 4,
    },
    takeHit: {
      imgSrc: "./FightingGame/kenji/Take hit.png",
      frameMax: 3,
    },
    death: {imgSrc: "./FightingGame/kenji/Death.png",
      frameMax: 7,
    }
  },
  attackbox: {
    offset: {
      x: -20,
      y: 50,
    },
    width: -158,
    height: 50,
  },
});

const keys = {
  a: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
  w: {
    pressed: false,
  },
  s: {
    pressed: false,
  },
  ArrowLeft: {
    pressed: false,
  },
  ArrowRight: {
    pressed: false,
  },
  ArrowUp: {
    pressed: false,
  },
};

decreaseTimer();

function animate() {
  window.requestAnimationFrame(animate);

  c.fillStyle = "black";
  c.fillRect(0, 0, canvas.width, canvas.height);
  background.update();
  shop.update();
  c.fillStyle = 'rgba(255,255,255,0.1)'
  c.fillRect(0,0, canvas.width, canvas.height)
  player.update();
  enemy.update();
  player.velocity.x = 0;
  enemy.velocity.x = 0;

  if (keys.a.pressed && player.lastKey === "a") {
    player.velocity.x = -5;
    player.switchSprite("run");
  } else if (keys.d.pressed && player.lastKey === "d") {
    player.velocity.x = 5;
    player.switchSprite("run");
  } else {
    player.switchSprite("idle");
  }

  if (player.velocity.y < 0) {
    player.switchSprite("jump");
  } else if (player.velocity.y > 0) {
    player.switchSprite("fall");
  }

  if (keys.ArrowLeft.pressed && enemy.lastKey === "ArrowLeft") {
    enemy.velocity.x = -5;
    enemy.switchSprite("run");
  } else if (keys.ArrowRight.pressed && enemy.lastKey === "ArrowRight") {
    enemy.velocity.x = 5;
    enemy.switchSprite("run");
  } else {
    enemy.switchSprite("idle");
  }
  if (enemy.velocity.y < 0) {
    enemy.switchSprite("jump");
  } else if (enemy.velocity.y > 0) {
    enemy.switchSprite("fall");
  }

  if (
    rectangularCollision({
      rectangule1: player,
      rectangule2: enemy,
    }) &&
    player.isAttacking &&
    // we use frame 4 because it is the exact moment when the player attacks so we reduce the enemylifespan we the attack is completed
    player.frameCurrent === 4 
  ) {
    enemy.takeHit()


    player.isAttacking = false;
 //   document.querySelector("#enemyHealth").style.width = enemy.health + "%";
    gsap.to('#enemyHealth', {
      width: enemy.health + "%"
    })
  }

  //if player misses
  if (player.isAttacking && player.frameCurrent === 4) {
    player.isAttacking = false;
  }

  if (
    rectangularCollision({
      rectangule1: player,
      rectangule2: enemy,
    }) &&
    enemy.isAttacking && enemy.frameCurrent === 2
  ) {
    player.takeHit()
    enemy.isAttacking = false;
    //document.querySelector("#playerHealth").style.width = player.health + "%";
    gsap.to('#playerHealth', {
      width: player.health + "%"
    })
  }

  //if enemy misses
  if (enemy.isAttacking && enemy.frameCurrent === 2) {
    enemy.isAttacking = false;
  }

  if (enemy.health <= 0 || player.health <= 0) {
    determineWinner({ player, enemy });
  }
}

animate();

window.addEventListener("keydown", (event) => {
  if(!player.dead){
    switch (event.key) {
      case "d":
        keys.d.pressed = true;
        player.lastKey = "d";
        break;
      case "a":
        keys.a.pressed = true;
        player.lastKey = "a";
        break;
      case "w":
        keys.w.pressed = true;
        player.lastKey = "w";
        player.velocity.y = -20;
        break;
      case " ":
        player.attack();
        break;
    }
  }
  if(!enemy.dead){  
    switch (event.key) {
      case "ArrowRight":
        keys.ArrowRight.pressed = true;
        enemy.lastKey = "ArrowRight";
        break;
      case "ArrowLeft":
        keys.ArrowLeft.pressed = true;
        enemy.lastKey = "ArrowLeft";
        break;
      case "ArrowUp":
        keys.ArrowUp.pressed = true;
        enemy.lastKey = "ArrowUp";
        enemy.velocity.y = -20;
        break;
      case "ArrowDown":
        enemy.attack();
        break;
    }
  }

});

window.addEventListener("keyup", (event) => {
  switch (event.key) {
    case "a":
      keys.a.pressed = false;
      break;
    case "d":
      keys.d.pressed = false;
      break;

    //enemy keys
    case "w":
      keys.w.pressed = false;
      break;
    case "s":
      keys.s.pressed = false;
      break;
    case "ArrowLeft":
      keys.ArrowLeft.pressed = false;
      break;
    case "ArrowRight":
      keys.ArrowRight.pressed = false;
      break;
  }
});
