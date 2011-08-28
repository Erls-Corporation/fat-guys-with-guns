function GameView(gameDef, $container) {

  var $foreground = $container.find('.foreground'),
      $background = $container.find('.background'),
      $disco = $background.find('.disco_wall'),
      $paddles = [],
      $ball = null;

  $foreground.width(gameDef.courtWidth);
  $foreground.height(gameDef.courtHeight);

  var colors = ['red','green','blue','yellow'];
  var tileSize = gameDef.tileSize;
  for (var k=0; k<2; k++) {
    for (var i=0; i<4; i++) {
      for (var j=0; j<5; j++) {
        var $div = $(document.createElement('div')).addClass('panel');
        $div.css({
          width: tileSize,
          height: tileSize,
          position: 'absolute',
          top: j * tileSize,
          left: k * gameDef.playerTwo.left +  i * tileSize,
          backgroundColor: colors[Math.floor(Math.random()*colors.length)]
        });
        $disco.append($div);
      }
    }
  }

  this.setState = function(state) {
    this.drawState(state);
  };

  this.drawState = function(state) {
    state.paddles.forEach( function(paddle, i) {
      var $paddle = $paddles[i];
      if(!$paddle) {
        $paddles[i] = $paddle = $(document.createElement('div')).appendTo($foreground);
        $paddle.css({
          position: 'absolute'
        });

        var $paddleInner = $(document.createElement('div')).appendTo($paddle),
            border = 1;
        $paddleInner.css({
          border: border + 'px solid #fff',
          width: gameDef.paddleWidth,
          height: gameDef.paddleHeight,
          backgroundColor: '#333',
          position: 'absolute',
          left: -gameDef.paddleWidth/2 - border,
          top: -gameDef.paddleHeight/2 - border
        });
      }

      var rotateTransform = 'rotate(' + (paddle.r * 180 / Math.PI) + 'deg)';
      $paddle.css({
        left: paddle.x * gameDef.scale,
        top:  paddle.y * gameDef.scale,
        '-webkit-transform': rotateTransform,
        '-moz-transform': rotateTransform
      });
    });

    if(!$ball) {
      $ball = $(document.createElement('div')).appendTo($foreground);
      $ball.css({
        position: 'absolute'
      });

      var $ballInner = $(document.createElement('div')).text('-').appendTo($ball);
      $ballInner.css({
        width: gameDef.ballRadius * 2,
        height: gameDef.ballRadius * 2,
        backgroundColor: '#333',
        position: 'absolute',
        left: -gameDef.ballRadius,
        top: -gameDef.ballRadius,
        borderRadius: gameDef.ballRadius,
        color: '#fff'
      });
    }
    $ball.css({
      left: state.ball.x * gameDef.scale,
      top:  state.ball.y * gameDef.scale
    });
  };
}
