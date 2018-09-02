develop:
	./node_modules/nodemon/bin/nodemon.js -L --ignore node_modules/ --ignore notes/tweets.json --ignore config.json index.js

start:
	./node_modules/forever/bin/forever start index.js

list:
	./node_modules/forever/bin/forever list

stop:
	./node_modules/forever/bin/forever stop 0
