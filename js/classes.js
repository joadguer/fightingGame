class Sprite {
    constructor({ position, imgSrc }) {
      this.position = position;
      this.height = 150;
      this.width = 50;
      this.image  = new Image()
      this.image.src = imgSrc
    }
    draw() {
        c.drawImage(this.image, this.position.x, this.position.y)
    }
    update() {
      this.draw();
    }
  
  }
  class Fighter {
    constructor({ position, velocity, color = "red", offset }) {
      this.position = position;
      this.velocity = velocity;
      this.height = 150;
      this.width = 50;
      this.lastKey;
      this.attackbox = {
        position: {
          x: this.position.x,
          y: this.position.y,
        },
        offset,
        width: 100,
        height: 50,
      };
      this.color = color;
      this.isAttacking;
      this.health = 100;
    }
  
    draw() {
      c.fillStyle = this.color;
      c.fillRect(this.position.x, this.position.y, this.width, this.height);
  
      if (this.isAttacking) {
        c.fillStyle = "yellow";
        c.fillRect(
          this.attackbox.position.x,
          this.attackbox.position.y,
          this.attackbox.width,
          this.attackbox.height
        );
      }
    }
  
    update() {
      this.draw();
  
      this.attackbox.position.x = this.position.x + this.attackbox.offset.x;
      this.attackbox.position.y = this.position.y;
  
      this.position.x += this.velocity.x;
      this.position.y += this.velocity.y;
      //this.position.x += 0
  
      if (this.position.y + this.height + this.velocity.y >= canvas.height) {
        this.velocity.y = 0;
      } else this.velocity.y += gravity;
    }
    attack() {
      this.isAttacking = true;
      setTimeout(() => {
        this.isAttacking = false;
      }, 100);
    }
  }