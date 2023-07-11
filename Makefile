.PHONY: delete-migrations fixtures generate-jwt generate-migration migrate reset-db run-local-front start-dev start-prod

DC=docker compose -f docker-compose.yml -f docker-compose.override.yml
EXEC_PHP=$(DC) exec php
BIN_CONSOLE=$(EXEC_PHP) bin/console

analyse:
	$(EXEC_PHP) vendor/bin/phpstan analyse ./src --level 9

cs-fixer:
	$(EXEC_PHP) vendor/bin/php-cs-fixer fix src --help

delete-migrations:
	$(DC) exec database psql -U app app -c "delete from doctrine_migration_versions"

fixtures:
	$(BIN_CONSOLE) do:fi:lo --quiet

generate-jwt:
	$(BIN_CONSOLE) lex:jwt:generate-key

generate-migration:
	$(BIN_CONSOLE) make:migration

migrate:
	$(BIN_CONSOLE) do:mi:mi --quiet

psalm:
	$(EXEC_PHP) vendor/bin/psalm

reset-db:
	$(BIN_CONSOLE) do:da:dr --force
	$(BIN_CONSOLE) do:da:cr
	$(MAKE) migrate fixtures

run-local-front:
	cd pwa && pnpm install && pnpm dev

start-dev: ## Run the application in dev
	$(DC) up -d

start-prod: ## Run the application in prod
	$(DC) docker-compose.prod.yml up -d
