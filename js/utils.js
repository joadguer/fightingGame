let gameEnded = false; 

function rectangularCollision({ rectangule1, rectangule2 }) {
    return (
      rectangule1.attackbox.position.x + rectangule1.attackbox.width >=
        rectangule2.position.x &&
      rectangule1.attackbox.position.x <=
        rectangule2.position.x + rectangule2.width &&
      rectangule1.attackbox.position.y + rectangule1.attackbox.height >=
        rectangule2.position.y &&
      rectangule1.attackbox.position.y <=
        rectangule2.position.y + rectangule2.height
    );
  }


  function determineWinner({ player, enemy, timerId }) {
    clearTimeout(timerId);
    document.querySelector('#displayText').style.display = 'flex';
  
    if (player.health === enemy.health) {
      document.querySelector('#displayText').innerHTML = 'Tie';
    } else if (player.health > enemy.health) {
      document.querySelector('#displayText').innerHTML = 'Player 1 Wins';
    } else if (player.health < enemy.health) {
      document.querySelector('#displayText').innerHTML = 'Player 2 Wins';
    }
  
    gameEnded = true; // Marca el juego como terminado
  }
  
  let timer = 60;
  let timerId;
  
  function decreaseTimer() {
    if (timer > 0 && !gameEnded) { // Verifica si el juego aún no ha terminado
      timerId = setTimeout(decreaseTimer, 1000);
      timer--;
      document.querySelector('#timer').innerHTML = timer;
    }
  
    if (timer === 0 || gameEnded) { // Verifica si el temporizador ha llegado a cero o el juego ha terminado
      determineWinner({ player, enemy, timerId });
    }
  }