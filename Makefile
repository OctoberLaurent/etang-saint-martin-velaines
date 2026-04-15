.PHONY: lighthouse compile format lint

URL ?= https://etang-saint-martin-velaines.be

lighthouse:
	npx lighthouse $(URL) --output=html --output=json --output-path=./lighthouse-report --chrome-flags="--headless" --quiet
	@echo "✅ Rapport généré : lighthouse-report.report.html"

compile:
	node build.js

format:
	npm run format

lint:
	npm run lint
