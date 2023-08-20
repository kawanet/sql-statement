#!/usr/bin/env bash -c make

SRC=./sql.js
TESTS=./test/*.js

DOCS_DIR=./gh-pages
DOC_HTML=./gh-pages/SQL.html
DOCS_CSS_SRC=./assets/jsdoc.css
DOCS_CSS_DEST=./gh-pages/styles/jsdoc-default.css

all: esm/sql.mjs jsdoc

esm/sql.mjs: sql.js
	@mkdir -p $(dir $@)
	cp $^ $@
	perl -i -pe 's#^(module.exports =)#// $$1#' $@
	perl -i -pe 's#^(function SQL)#export default $$1#' $@
	perl -i -pe 's#^(function (Pg|mysql))#export $$1#' $@

test: all $(TESTS)
	node_modules/.bin/jshint $(SRC)
	node_modules/.bin/mocha -R spec $(TESTS)
	node -e 'Promise.resolve(require("./sql.js")).then(SQL => console.log(String(SQL("SELECT NOW()"))))'
	node -e 'import("./esm/sql.mjs").then(x => console.log(String(x.default("SELECT NOW()"))))'

# ES2021 - CommonJS
./test/%.js: ./test/%.ts
	./node_modules/.bin/tsc -p tsconfig.json

jsdoc: $(DOC_HTML)

$(DOC_HTML): README.md $(SRC) $(DOCS_CSS_SRC)
	mkdir -p $(DOCS_DIR)
	node_modules/.bin/jsdoc -d $(DOCS_DIR) -R README.md $(SRC)
	cat $(DOCS_CSS_SRC) >> $(DOCS_CSS_DEST)
	rm -f $(DOCS_DIR)/*.js.html
	for f in $(DOCS_DIR)/*.html; do sed 's#</a> on .* 201.* GMT.*##' < $$f > $$f~ && mv $$f~ $$f; done
	for f in $(DOCS_DIR)/*.html; do sed 's#<a href=".*.js.html">.*line.*line.*</a>##' < $$f > $$f~ && mv $$f~ $$f; done

clean:
	/bin/rm -f esm/sql.mjs

.PHONY: all test clean
