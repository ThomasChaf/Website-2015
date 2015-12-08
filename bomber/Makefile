css_path=	.
less_path=	.

coffee_in=      module.coffee ./**/*.coffee
coffee_out=     bomber.js

all:
	lessc $(less_path)/bomber.less > $(css_path)/bomber.css
	coffee -c -p $(coffee_in) > $(coffee_out)
