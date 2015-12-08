_this = this

_this.CaseType =
  BOMB: -1
  EMPTY: 0

_this.Case = ->
  self = this

  self.init = ->
    self.type = _this.CaseType.EMPTY
    self.isReveal = false

  self.isBomb = ->
    self.type == _this.CaseType.BOMB

  self.isEmpty = ->
    self.type != _this.CaseType.BOMB

  self.setNeighboor = ->
    if (self.type != _this.CaseType.BOMB)
      self.type += 1

  self.hasNeighboor = ->
    self.type > 0

  self.setBomb = ->
    self.type = _this.CaseType.BOMB

  self.getType = ->
    self.type

  self.setReveal = ->
    self.isReveal = true
    self.type

  self.init()
  self

_this.BomberMap = (x, y, difficulty) ->
  self = this

  self.init = (width, height, difficulty) ->
    self.width = width
    self.height = height
    self.content = []
    self.nbBomb = Math.round(difficulty * (width * height) / 100)
    self.toReveal = width * height
    y = 0
    while (y < height)
      x = 0
      while (x < width)
        self.content.push(new _this.Case())
        x += 1
      y += 1
    self.disperseBomb(self.nbBomb)

  self.disperseBomb = (nbBomb) ->
    while (nbBomb > 0)
      x0 = Math.floor(Math.random() * x)
      y0 = Math.floor(Math.random() * y)
      if (!self.isBomb(x0, y0))
        self.setBomb(x0, y0)
        nbBomb -= 1

  self.__reveal = (x0, y0, squares) ->
    type = self.setReveal(x0, y0)

    console.log "Je set #{x0}-#{y0} => #{type}"
    squares.push([x0, y0])
    if (type == 0)
      _y = y0 - 1
      while (_y <= y0 + 1)
        _x = x0 - 1
        while (_x <= x0 + 1)
          if ((_x != x0 || _y != y0) && (_y >= 0 && _x >= 0 && _y < self.height && _x < self.width))
            if (!self.isReveal(_x, _y) && !self.isBomb(_x, _y))
              console.log "Autours de #{x0}-#{y0}: [#{_x}|#{_y}]"
              self.__reveal(_x, _y, squares)
          _x += 1
        _y += 1

  self.reveal = (x, y) ->
    if (self.isBomb(x, y))
      return { action: 'end', params: { _1: false } }
    squares = []
    self.__reveal(x, y, squares)
    console.log squares
    { action: 'drawSquares', params: { _1: squares } }

  self.isBomb = (x, y) ->
    self.content[y * self.width + x].isBomb()

  self.isReveal = (x, y) ->
    self.content[y * self.width + x].isReveal

  self.isEmpty = (x, y) ->
    self.content[y * self.width + x].isEmpty()

  self.getType = (x, y) ->
    self.content[y * self.width + x].getType()

  self.setBomb = (x, y) ->
    self.content[y * self.width + x].setBomb()
    y0 = y - 1
    while (y0 <= y + 1)
      x0 = x - 1
      while (x0 <= x + 1)
        if ((x0 != x || y0 != y) && (y0 >= 0 && x0 >= 0 && y0 < self.height && x0 < self.width))
          self.content[y0 * self.width + x0].setNeighboor()
        x0 += 1
      y0 += 1

  self.setReveal = (x, y) ->
    self.toReveal -= 1
    console.log "je revele donc #{ x } #{ y }"
    console.log  self.content[y * self.width + x]
    self.content[y * self.width + x].setReveal()

  self.isClean = ->
    self.toReveal == self.nbBomb

  self.init(x, y, difficulty)
  self

_this.EndGame = (elem) ->
  self = this
  console.log "init"
  console.log elem

  self.init =  (elem) ->
    self.elem = elem
    console.log "init le engame ---->"
    console.log self

  self.newGame = ->
    console.log "New game du engame"
    console.log self
    self.elem.hide()

  self.loose = ->
    self.elem.find("p").text("Game Over !")
    self.elem.children().css("background-color", "#EB5959")

  self.win = ->
    self.elem.find("p").text("Win !")
    self.elem.children().css("background-color", "#82CD87")

  self.active = (win) ->
    if win then self.win() else self.loose()
    self.elem.show()
    self.elem.click (e) ->
      e.stopPropagation()

  self.init(elem)
  self

_this.Bomber = (canvas, endGame) ->
  self = this
  self.gap = 30
  self.difficulty = 10

  self.init = (canvas, endGame) ->
    self.canvas = canvas
    self.context = self.canvas.get(0).getContext("2d")
    console.log "init1:"
    console.log endGame
    self.endGame = new _this.EndGame(endGame)
    self.setClick(canvas)
    self.bombImage = new Image()
    self.bombImage.src = '/images/demineur.png'
    endGame.find("button").click ->
      self.newGame()

  self.resize = ->
    x = canvas.parent().width()
    y = canvas.parent().height()

    self.context.canvas.width  = x - (x % self.gap)
    self.context.canvas.height = y - (y % self.gap)
    self.margeX = (x % self.gap) / 2
    self.margeY = (y % self.gap) / 2
    canvas.css('margin-top', self.margeX + 'px')
    canvas.css('margin-left',self.margeY + 'px')

  self.newGame = ->
    console.log "---->"
    console.log self.endGame
    self.endGame.newGame()
    self.resize()
    self.bomberMap = new _this.BomberMap(
      self.context.canvas.width / self.gap,
      self.context.canvas.height / self.gap,
      self.difficulty
    )
    self.draw()

  self.onClick = (e, x, y) ->
    x0 = Math.floor(x / self.gap)
    y0 = Math.floor(y / self.gap)

    if (self.bomberMap.isReveal(x0, y0))
      return
    action = self.bomberMap.reveal(x0, y0)
    self[action.action](action.params._1, action.params._2)
    if (self.bomberMap.isClean())
      self.end(true)
    console.log "endclick"
    console.log self.endGame

  self.end = (win) ->
    x = 0

    while (x < self.context.canvas.width)
      y = 0
      while (y < self.context.canvas.height)
        self.drawSquare(x / self.gap, y / self.gap)
        y += self.gap
      x += self.gap
    self.endGame.active(win)
    console.log "end----"
    console.log self.endGame

  self.drawSquare = (x, y, hasBegin) ->
    x0 = x * self.gap
    y0 = y * self.gap
    type = self.bomberMap.getType(x, y)

    if (type == _this.CaseType.BOMB)
      return self.context.drawImage(self.bombImage, x0 + 2, y0 + 2)
    if (!hasBegin)
      self.context.beginPath()
    self.context.rect(x0, y0, self.gap, self.gap)
    self.context.fillStyle = 'grey'
    self.context.lineWidth = 1
    self.context.strokeStyle = 'black'
    self.context.fill()
    if (type > 0)
      self.context.font = 'normal 13pt Arial'
      self.context.fillStyle = 'blue'
      self.context.fillText(type, x0 + 10, y0 + 22)
    if (!hasBegin)
      self.context.stroke()

  self.drawSquares = (squares) ->
    i = 0

    while (i < squares.length)
      self.context.beginPath()
      self.drawSquare(squares[i][0], squares[i][1], true)
      self.context.stroke()
      i += 1

  self.drawLine = (x0, y0, x1, y1) ->
    self.context.moveTo(x0, y0)
    self.context.lineTo(x1, y1)

  self.drawGrid = ->
    i = 0

    self.context.beginPath()
    while (i <= self.context.canvas.height)
      self.drawLine(0, i, self.context.canvas.width, i)
      i += self.gap
    i = 0
    while (i <= self.context.canvas.width)
      self.drawLine(i, 0, i, self.context.canvas.height)
      i += self.gap
    self.context.stroke()

  self.draw = ->
    console.log "draw"
    self.context.beginPath()
    self.context.rect(0, 0, self.context.canvas.width, self.context.canvas.height)
    self.context.fillStyle = '#8E9190'
    self.context.fill()
    self.context.stroke()
    self.drawGrid()

  self.setClick = (canvas) ->
    offset = canvas.offset()

    canvas.click (e) ->
      self.onClick(e, e.offsetX, e.offsetY - 2)

  self.init(canvas, endGame)
  this
