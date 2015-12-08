tcBomber = ($log) ->

  link = (scope, element, attrs) ->
    description = element.children(".description")
    console.log("Je vais crer mon Bomber")
    scope.bomber = new this.Bomber element.children('#bomber'), element.children("#endGame")
    scope.bomber.newGame()

    description.click ->
      description.hide()

  directive = {
    restrict: 'E'
    templateUrl: '/libs/bomber/bomber.html'
    transclude: true
    link: link
  }

#TODO use require instead of this
angular.module('bomber').directive 'tcBomber', ['$log', tcBomber]

# window.onresize = init
