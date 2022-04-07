# Astro Pizza Cat

![](https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.pinimg.com%2Foriginals%2F54%2F18%2Ff9%2F5418f98e564a12a8f493853021c578f0.jpg&f=1&nofb=1)

## 📖 Overview

The project is developed by software engineering students as their P2 project. The project tries to eliminate all "metawork" in the startup phase. Metawork is something like setting up github repository, discord server, overleaf documents and more.


## 👌 Requirements
- NodeJS (<a href="https://github.com/nodesource/distributions">Installation Linux</a> )
- MongoDB server ( <a href="https://github.com/KB885/Astro/blob/dev/instructions-database-linux.txt">Installation Linux</a> )

## ⚡ Quick start

Clone the git down to your desired folder.

```shell
git clone https://github.com/KB885/Astro.git
```

`cd` into the folder and install the needed libs needed. Eg. Tailwindcss, Express

```shell
npm install
```

`cd` into the src folder and rename the configuration file to .env
```shell
cp .env.example .env
```

Compile the needed frontend

```shell
npm run build:css
```

A secret key has to be generated. This key needs to be copied into the .env file under `SECRET_KEY`

```shell
npm run generate:key
```

Before the database works, some settings have to be set, e.g. whether it should run on cloud or local. This means you need to have a mongodb server running locally or on the cloud. For the installation of this referr to the documentation <a href="https://github.com/KB885/Astro/blob/dev/instructions-database-linux.txt">here (Linux)</a>

## 🛠️ Configuration


## ⚠️ License
You can see the license <a href="https://github.com/KB885/Astro/blob/dev/LICENSE">here</a>
