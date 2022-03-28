# Astro Pizza Cat

![](https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.pinimg.com%2Foriginals%2F54%2F18%2Ff9%2F5418f98e564a12a8f493853021c578f0.jpg&f=1&nofb=1)

This repository has been developed as a group project at Aalborg University by Software Engineering students as their P2 project.

## Structure

App
- HTTP (Controllers)
- Models 

Database
- MongoDB connection

Resources
- css (Styling)
- views (Alt layout - HTML)

Routes
- Auth
- User

## Technologies
- NodeJS (Express)
- EJS Template Engine
- MongoDB
- TailwindCSS

## Installation and usage

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

To run the project run the following command

```shell
npm run start
```


