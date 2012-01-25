#compiler = 6g
#linker = 6l
compiler = ~/src/go-unstable/bin/6g
linker = ~/src/go-unstable/bin/6l
preprocessor = qpp-1.0.jar

all: app client
	@echo "Woo! You're done!"

app: app/bin/webchat
client: js static

clean: cleanapp cleanclient
cleanapp:
	@rm -rf app/bin
cleanclient:
	@rm -rf www

# Main app files
app/bin/webchat: app/bin/webchat.6
	@$(linker) -o app/bin/webchat app/bin/webchat.6
	@rm app/bin/*.6

app/bin/webchat.6: app/webchat.go
	@$(compiler) -o app/bin/webchat.6 app/webchat.go

js:
	@mkdir -p www/js
	@java -jar bin/$(preprocessor) www-src/js/webchat.js www/js/webchat.js

static:
	@mkdir -p www
	@cp -r www-src/static/* www