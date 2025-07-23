all: build run


build:
	docker compose build 

run:
	docker compose up -d

down:
	docker compose down

imgclean:
	docker compose down --rmi all

volclean:
	docker compose down --rmi all -v


.SILENT: