# linkml-initializer

A web wrapper for https://github.com/linkml/linkml-project-cookiecutter

## Setup

This repo uses git submodules. When cloning the repo use `git clone --recurse-submodules` 
(or `--recursive` if using Git version 2.12 or lower). 

If the repo was cloned without using `--recurse-submodules`, run the following:

```shell
git submodule update --init
```

## Running with Docker

Use Docker Compose to bring the backend and frontend services up:

```shell
docker compose up
```

Once both services are up, visit http://localhost:80 to view the frontend.

## Development

`TODO`
