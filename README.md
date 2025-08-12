# RSE Admin - Web App
A VueJS based SPA for the RSE Admin Tool

## About

The RSE Admin tool is for tracking the assignment of RSEs to projects, cost recovery and project status. The app brings together data from HubSpot, University financial reports and assignment data from the API.

### Project Team
Mark Turner, Newcastle University  ([mark.turner@newcastle.ac.uk](mailto:mark.turner@newcastle.ac.uk))    
Kate Court, Newcastle University  ([kate.court@newcastle.ac.uk](mailto:kate.court@newcastle.ac.uk))  
Becky Osselton, Newcastle University  ([rebecca.osselton@newcastle.ac.uk](mailto:rebecca.osselton@newcastle.ac.uk))   

### RSE Contact
Mark Turner  
RSE Team  
Newcastle University  
([mark.turner@newcastle.ac.uk](mailto:mark.turner@newcastle.ac.uk))  

## Built With

The application uses Vue to manage routes and daa binding, with Vuex for state management. Charts are implemented with HighCharts and layout uses TailwindCCS.

[VueJS](https://v3.vuejs.org/guide/introduction.html)  
[Vuex](https://vuex.vuejs.org/)  
[HighCharts](https://www.highcharts.com/)  
[Tailwind](https://tailwindcss.com/)  

## Getting Started

### Prerequisites

A local version of NodeJS ([nvm](https://github.com/nvm-sh/nvm) is recommended) and a local [MySQL Community Server](https://dev.mysql.com/downloads/mysql/) running for development. Whilst possible to interact with the database via an interactive shell, it is recommended to use a GUI tool such as [MySQL Workbench](https://dev.mysql.com/downloads/workbench/).

### Installation

Install dependencies

```
yarn install
```

### Running Locally

Run with hot reload for development

```
yarn serve
```

If using Node 18 You may need to run this command if `yarn serve` fails with an 'digital envelope routines::unsupported' error.

`export NODE_OPTIONS=--openssl-legacy-provider`

or switch to Node 16.

Running locally with vite:

`yarn dev`


### Running Tests

Detect linting errors

```
yarn lint
```

## Deployment

### Local

Deploying to a production style setup but on the local system. Command builds and minifies files into `dist` folder.

```
yarn build
```

### Production

Deploying to the production system. Examples of this would include cloud, HPC or virtual machine. 

## Usage

Any links to production environment, video demos and screenshots.

## Roadmap

- [x] Initial Research  
- [x] Minimum viable product
- [ ] Alpha Release  
- [ ] Feature-Complete Release  

## Contributing

### Main Branch
Protected and can only be pushed to via pull requests. Should be considered stable and a representation of production code.

### Dev Branch
Should be considered fragile, code should compile and run but features may be prone to errors.

### Feature Branches
A branch per feature being worked on.

https://nvie.com/posts/a-successful-git-branching-model/

## License
