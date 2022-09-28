<a name="readme-top"></a>

<!-- PROJECT SHIELDS -->

[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]
[![LinkedIn][linkedin-shield]][linkedin-url]

<!-- PROJECT TITLE & LOGO -->

<div align="center">
  <h1 align="center">JS-CRUSH</h1>

  <img src="./assets/readme/javascriptGem.svg" alt="jsCrush" height="80">
  <img src="./assets/readme/javascriptGem.svg" alt="jsCrush" height="80">
  <img src="./assets/readme/javascriptGem.svg" alt="jsCrush" height="80">

  <p align="center">
    a match-three puzzle game created with vanilla JS -- my take on the candy-crushing classic
    <br />
    <a href="https://marshall-strong.github.io/js-crush/">View Demo Site</a>
    ·
    <a href="https://github.com/marshall-strong/js-crush/issues">Report Bug</a>
    ·
    <a href="https://github.com/marshall-strong/js-crush/issues">Request Feature</a>
  </p>
</div>

<!-- TABLE OF CONTENTS -->

<!-- While the README is still being updated, use the automatically generated ToC -->
<!-- Once the README is ready to be published, update and use the collapsable HTML ToC -->

- [About The Project](#about-the-project)
  - [Built With](#built-with)
- [Getting Started](#getting-started)
  - [1. Install Prerequisites](#1-install-prerequisites)
  - [2. Clone the GitHub Repository and Install Dependencies](#2-clone-the-github-repository-and-install-dependencies)
  - [3. Run the Project](#3-run-the-project)
- [Features](#features)
  - [the site fetches photos using the Pexels API without exposing the API key to end users](#the-site-fetches-photos-using-the-pexels-api-without-exposing-the-api-key-to-end-users)
- [Project Style](#project-style)
  - [Pre-commit](#pre-commit)
  - [Prettier](#prettier)
  - [Stylelint](#stylelint)
- [Production Deployment](#production-deployment)
- [Project Roadmap](#project-roadmap)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)
- [Acknowledgments](#acknowledgments)

<!-- <details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details> -->

<!-- ABOUT THE PROJECT -->

## About The Project

[![Project Screenshot][project-screenshot]][project-production-url]

a match-three puzzle game created with vanilla JS -- my take on the candy-crushing classic

A production deployment of this project can be viewed at [marshall-strong.github.io/js-crush](https://marshall-strong.github.io/js-crush/).

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Built With

Canvas API, CSS3, ESLint, GitHub, GitHub Pages, Google Chrome, HTML5, JavaScript, Markdown, pre-commit, Prettier, stylelint

[![JavaScript][javascript-shield]][javascript-url]

- JavaScript description...

[![Canvas API][canvasapi-shield]][canvasapi-url]

- Canvas API description...

[![HTML5][html5-shield]][html5-url]

- HTML5 description...

[![CSS3][css3-shield]][css3-url]

- CSS3 description...

[![GitHub Pages][github-shield]][githubpages-url]

- GitHub Pages description...

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- GETTING STARTED -->

## Getting Started

To set up and run a local copy of this project on your own machine, do the following:

### 1. Install Prerequisites

No installation prerequisites?

<!-- Node.js is a back-end runtime environment that executes JavaScript code outside a web browser, and npm is its default package manager. Both must be installed locally in order to run this project.

- `Node.js`

  The recommended way of installing Node.js is with a Node version manager.
  Different operating systems use different Node version managers:

  _Node version managers for OSX and Linux:_

  - `nvm` - [installation instructions](https://github.com/creationix/nvm)
  - `n` - [installation instructions](https://github.com/tj/n)

  _Node version managers for Windows:_

  - `nodist` - [installation instructions](https://github.com/marcelklehr/nodist)
  - `nvm-windows` - [installation instructions](https://github.com/coreybutler/nvm-windows)

  Choose an appropriate Node version manager for your operating system and follow the installation instructions linked above to install both the version manager and Node.js.

  To confirm that Node.js has been installed successfully, run the following command to check the installed version:

  ```sh
  node -v
  ```

- `npm`

  Once Node.js is installed, download and install the latest version of npm by running the following command from the command line:

  ```sh
  npm install npm@latest -g
  ```

  To confirm that npm has been installed successfully, run the following command to check the installed version:

  ```sh
  npm -v
  ```

For additional information or help installing Node.js, npm, and Node version managers, consult the official npm documentation on [Downloading and installing Node.js and npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm). -->

### 2. Clone the GitHub Repository and Install Dependencies

The GitHub repository for this project can be found at <https://github.com/marshall-strong/js-crush>.

Click on the "Code" button and select which method to use to clone the repository: HTTPS, SSH, the GitHub CLI, or Download a ZIP file.

To clone the repository using the GitHub CLI, run the following command from the command line:

```sh
gh repo clone marshall-strong/js-crush
```

Navigate into the project's root directory:

```sh
cd js-crush
```

Install project dependencies:

```sh
npm install
```

<!-- ### 3. Acquire an API Key

All of the images this site displays are retrieved from Pexels, and are requested and received via the Pexels API. An API key is required in order to interact with the Pexels API. **A Pexels API Key is NOT included in this repository -- you must get your own (free) API key from Pexels.**

Follow these steps to register with Pexels and obtain a Pexels API Key:

- Create a free Pexels account at <https://www.pexels.com/onboarding>
- Click the "I want to download" button
- Enter your personal information, then click the "Create New Account" button
- Complete your account setup by opening the email sent to you by Pexels and clicking the "Confirm email" button
- Go to <https://www.pexels.com/api/> and click the "Your API Key" button
- Fill out the form, agree to the Terms of Service, and click the "Generate API Key" button
- Copy the API key and save it somewhere safe -- you will need it in the next section

The API key should be a 56 character string of numbers and lowercase letters.

example: `sample0api0key123456789abcdefghijklmnopqrstuvwxyz0000000`

If you ever lose or misplace your API key, you can retrieve it by logging in to your Pexels account. -->

<!-- ### 4. Add the API Key to the Project

In development mode, the Pexels API Key is stored in a `.env` file and saved as an environment variable. This `.env` file should NOT be committed to GitHub, and is not a secure way to store API keys in a production environment.

Create a new file named `.env` inside of the `react-frontend` sub-directory:

```sh
touch react-frontend/.env
```

Add your Pexels API Key to the `.env` file as an environmental variable named `PEXELS_API_KEY`:

```sh
echo "PEXELS_API_KEY=sample0api0key123456789abcdefghijklmnopqrstuvwxyz0000000" > react-frontend/.env
```

Once you are done, your `.env` file should look like this:

```js
// js-crush/react-frontend/.env

PEXELS_API_KEY = sample0api0key123456789abcdefghijklmnopqrstuvwxyz0000000;
```

The file `js-crush/react-frontend/example.env` is an example `.env` file with a fake API Key that you can use as a guide when creating your own `.env` file with your own API Key. -->

### 3. Run the Project

Start the project by opening `index.html` in your browser...

<!-- Start the project by running the `npm start` command from the root directory of the GitHub repository:

```sh
npm start
```

This command is a shortcut that uses Create React App's built-in scripts to start the development server and compile the project using webpack. At the same time, Netlify Dev starts another, separate server to load the Netlify Functions onto, and it makes the environment variables defined in the `.env` file available to the Netlify Functions server (but NOT to the Create React App server). Even in Development mode, this will hide the Pexels API key from users on the client side. -->

<p align="right">(<a href="#project_title">back to top</a>)</p>

<!-- USAGE EXAMPLES -->

<!-- ## Usage -->

<!-- Use this space to show useful examples of how a project can be used. Additional screenshots, code examples and demos work well in this space. You may also link to more resources.

_For more examples, please refer to the [Documentation](https://example.com)_ -->

## Features

### the site fetches photos using the Pexels API without exposing the API key to end users

Sending a request to the Pexels API requires a key, and if the request is created and sent from inside of the Create React App application, the API key will end up being exposed to any site users with access to Chrome DevTools. Netlify provides a solution to this problem. A netlify function is a function that can be used to execute server-side code without having to deploy your own server. Under the hood, Netlify functions indirectly use AWS's serverless Lambda functions to run on-demand server-side code.

<!-- ### the site displays images using a "masonry" layout

The `Gallery` component displays photos in a masonry layout, where photos are arranged to completely fill out rows without compromising the images' aspect ratios.

### the site initially displays photos from the Pexels "Curated Photos" endpoint

When the site loads for the first time, the photos it displays in the `Gallery` component are retrieved from Pexels' "Curated Photos" endpoint.

### the site accepts a query string from the user and returns relevent photos from the Pexels "Search for Photos" endpoint

The `SearchForm` component accepts a search query from the user in the form of text input, then sends the user's query to the Pexels "Search for Photos" endpoint. Pexels responds with photos relevent to the user's search query, and those photos get displayed in the `Gallery` component.

### on hovering over a photo, the photographer's name and website are displayed

Hovering over a `Photo` in the `Gallery` component brings up the name of the photographer who took the picture. Clicking on the photographer's name will open a link to the photographer's Pexels profile, where users can view more of the photographer's work.

### clicking a photo opens a full-size version in a new tab

Clicking on one of the `Photo` components in the `Gallery` will open a new window where the user can view a full-size version of the image on the Pexels website.

### pagination buttons allow users to navigate search results 10 images at a time without refreshing the site

The `Pagination` components contain "Previous Page" and "Next Page" buttons that allow users to paginate through the photos returned by the Pexels API 10 at a time, and without refreshing the page. If the user is on the first page and there is no previous page, the "Previous Page" button will be disabled. If the user is on the last page of their search results and there is not a next page, the "Next Page" button will be disabled.

### users' search query and current pagination are not lost if the site is refreshed

LocalStorage retains the user's search query and/or page number so that the `Gallery` photos are not reset if the page is refreshed. -->

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Project Style

### Pre-commit

[Pre-commit](https://pre-commit.com/) is a framework for managing and maintaining multi-language pre-commit hooks. It runs Git hook scripts (like linters) before each Git commit, and prompts the user to fix any issues that are found before the commit can be saved. Pre-commit manages Git hooks for the user and allows them to use linters written in any language, regardless of which language the actual project is written in.

Before using Pre-commit on your machine for the first time, the Pre-commit package manager must first be installed locally on your machine:

```bash
#!/bin/bash
$ pip install pre-commit
```

Pre-commit hooks are configured using a file named `.pre-commit-config.yaml`. The file containing the Pre-commit configuration for this project is reproduced below:

```yaml
# js-crush/.pre-commit-config.yaml

repos:
  - repo: https://github.com/pre-commit/pre-commit-hooks
    rev: v3.4.0
    hooks:
      - id: trailing-whitespace
      - id: end-of-file-fixer
      - id: check-yaml
      - id: check-added-large-files
  - repo: https://github.com/pre-commit/mirrors-prettier
    rev: "v2.7.1" # Note: Use the sha / tag you want to point at
    hooks:
      - id: prettier
  - repo: https://github.com/thibaudcolas/pre-commit-stylelint
    rev: "v14.10.0" # Note: Use the sha / tag you want to point at
    hooks:
      - id: stylelint
        args: [--fix]
        additional_dependencies:
          # Note: stylelint itself (and not a mirror) needs to be used here when using additional_dependencies.
          - stylelint@latest
          - stylelint-config-standard@latest
          - stylelint-config-idiomatic-order@latest
          - stylelint-config-prettier@latest
          # Note: Package names starting with `@` need to be quoted. For example:
          # - "@scope/my-awesome-plugin@0.12.0"
```

**Note:** The `prettier` and `stylelint` hooks configured in the `.pre-commit-config.yaml` file above are described in greater detail in the next section.

Once the configuration file is complete, run `pre-commit install` to set up the git hook scripts:

```sh
#!/bin/bash
$ pre-commit install
pre-commit installed at .git/hooks/pre-commit
```

Once installed, Pre-commit will run automatically on every `git commit`!

_Console output after installing and configuring pre-commit:_

```bash
#!/bin/bash
$ pip install pre-commit --upgrade
$ pre-commit --version
pre-commit 2.13.0
$ cd js-crush
$ pre-commit sample-config
$ pre-commit install
pre-commit installed at .git/hooks/pre-commit
$ pre-commit run --all-files
```

[pre-commit/pre-commit-hooks](https://github.com/pre-commit/pre-commit-hooks) Some out-of-the-box hooks for pre-commit

### Prettier

[Prettier](https://prettier.io/) is an opinionated code formatter that enforces conventions automatically.

[prettier/prettier](https://github.com/prettier/prettier)
Official Prettier repository

[pre-commit/mirrors-prettier](https://github.com/pre-commit/mirrors-prettier)
Mirrors all prettier/prettier releases, used by Pre-commit to run the prettier hook

### Stylelint

[Stylelint](https://stylelint.io/) is a linter that identifies errors and enforces conventions in a project's stylesheets.

_Use `npx` to run Stylelint at any time (not just when saving a commit):_

```bash
#!/bin/bash
$ cd js-crush
$ npx stylelint "react-frontend/src/**/*.css" --fix
```

[stylelint/stylelint](https://github.com/stylelint/stylelint)
Official Stylelint repository

[stylelint/stylelint-config-standard](https://github.com/stylelint/stylelint-config-standard)
The standard shareable config for Stylelint

[ream88/stylelint-config-idiomatic-order](https://github.com/ream88/stylelint-config-idiomatic-order)
Orders styles using consistent, idiomatic CSS

[prettier/stylelint-config-prettier](https://github.com/prettier/stylelint-config-prettier)
Turns off all rules that are unnecessary or might conflict with prettier

[thibaudcolas/pre-commit-stylelint](https://github.com/thibaudcolas/pre-commit-stylelint)
Mirrors all stylelint/stylelint releases, used by Pre-commit to run the stylelint hook

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- ## Testing

[Jest](https://jestjs.io/) is a JavaScript testing framework put out by Facebook and designed for unit testing React components.

This project has basic unit tests for each component -- [Add more Unit Testing with Jest](https://github.com/marshall-strong/js-crush/issues/67) for all React components is part of the [Project Roadmap](#project-roadmap) for future development.

[Playwright](https://playwright.dev/) is a framework by Microsoft that enables reliable end-to-end testing for modern web apps.

This project does not currently have any end-to-end tests -- [Add End-to-End Testing with Playwright](https://github.com/marshall-strong/js-crush/issues/68) is part of the [Project Roadmap](#project-roadmap) for future development. -->

<!-- ### Running Unit Tests with Jest

To run this project's unit tests using Jest, run the following command:

```node
npm test
```

This project was built using Create React App, so Jest is already built into the app.
When `npm test` is run from the root directory, Node navigates into the React project subdirectory and runs Jest using `react-scripts test`.

At this point in time, the only Unit Tests for this project are basic smoke tests for each component. Part of the [Project Roadmap](#project-roadmap) for future development is to [add more robust unit testing](https://github.com/marshall-strong/js-crush/issues/67) for all React components. -->

<!-- #### Jest Documentation

<https://jestjs.io/docs/tutorial-react>
<https://create-react-app.dev/docs/running-tests/#testing-components>
<https://reactjs.org/docs/testing-recipes.html> -->

<!-- <p align="right">(<a href="#readme-top">back to top</a>)</p> -->

## Production Deployment

**<https://marshall-strong.github.io/js-crush/>**

This project is deployed to Production directly from GitHub using GitHub Pages.
A live version of the site can be viewed [here](https://marshall-strong.github.io/js-crush/).

<!-- **Note:** In Production mode, Netlify expects to recieve the Pexels API key as an environment variable, just like in Development mode. The difference is where that environment variable is read from. In Development mode, Netlify Dev reads the key from the `.env` configuration file. In contrast, in Production, mode environment variables must be configured using the [Netlify dashboard](https://app.netlify.com/sites/js-crush/settings/deploys#environment). Go to "Site settings" > "Build & deploy" > "Environment". -->

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- ROADMAP -->

## Project Roadmap

Plans for future development, testing, and features:

<!-- - [ ] [Add Server-Side Rendering with Next.js](https://github.com/marshall-strong/js-crush/issues/65)
- [ ] [Add Mobile Responsiveness](https://github.com/marshall-strong/js-crush/issues/66)
- [ ] [Add more Unit Testing with Jest](https://github.com/marshall-strong/js-crush/issues/67)
- [ ] [Add End-to-End Testing with Playwright](https://github.com/marshall-strong/js-crush/issues/68) -->

See the [open issues](https://github.com/marshall-strong/js-crush/issues) for a full list of proposed features (and known issues).

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTRIBUTING -->

## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**!

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue.

If you found this project helpful, don't forget to give it a star!

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- LICENSE -->

## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTACT -->

## Contact

Want to get in touch? Email me at <marshallstrong123@gmail.com> or reach out on [LinkedIn][linkedin-url].

Interesting in checking out some of the other projects I've worked on?

Visit [marshallstrong.com](https://marshallstrong.com/) for a full list, as well as my resume and work experience.

Thanks for reading!!!

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- ACKNOWLEDGMENTS -->

## Acknowledgments

- [pre-commit](https://pre-commit.com/)
  - runs Git hook scripts before each commit and prompts the user to fix any issues before the commit can be saved
- [Prettier](https://prettier.io/)
  - Automatically formats code and enforces style conventions
- [Stylelint](https://stylelint.io/)
  - Identifies errors and enforces conventions in a project's stylesheets
- [Shields.io](https://shields.io/)
  - Concise, consistent, and legible badges in SVG and raster format

Resources and How-Tos

- [Boxy SVG: A free, browser-based tool for editing SVG elements](https://boxy-svg.com/)
- [The Difference Between ALT text and Title text](https://blog.spotibo.com/difference-between-alt-text-and-title-text/)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- END OF README -->

<!-- MARKDOWN REFERENCE STYLE IMAGE AND URL LINKS -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

<!-- PROJECT SHIELDS -->

[contributors-shield]: https://img.shields.io/github/contributors/marshall-strong/js-crush.svg?style=for-the-badge
[contributors-url]: https://github.com/marshall-strong/js-crush/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/marshall-strong/js-crush.svg?style=for-the-badge
[forks-url]: https://github.com/marshall-strong/js-crush/network/members
[stars-shield]: https://img.shields.io/github/stars/marshall-strong/js-crush.svg?style=for-the-badge
[stars-url]: https://github.com/marshall-strong/js-crush/stargazers
[issues-shield]: https://img.shields.io/github/issues/marshall-strong/js-crush.svg?style=for-the-badge
[issues-url]: https://github.com/marshall-strong/js-crush/issues
[license-shield]: https://img.shields.io/github/license/marshall-strong/js-crush.svg?style=for-the-badge
[license-url]: https://github.com/marshall-strong/js-crush/blob/master/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/marshall-strong

<!-- PROJECT TITLE & LOGO -->
<!-- TABLE OF CONTENTS -->
<!-- ABOUT THE PROJECT -->

[project-screenshot]: ./assets/readme/jsCrushScreenshot-1200-627.png
[project-production-url]: https://marshall-strong.github.io/js-crush/

<!-- Built With -->

[canvasapi-shield]: https://img.shields.io/badge/Canvas%20API-000000?style=for-the-badge&logoColor=white&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2NDAgNTEyIj48cGF0aCBkPSJNMzkyLjggMS4yYy0xNy00LjktMzQuNyA1LTM5LjYgMjJsLTEyOCA0NDhjLTQuOSAxNyA1IDM0LjcgMjIgMzkuNnMzNC43LTUgMzkuNi0yMmwxMjgtNDQ4YzQuOS0xNy01LTM0LjctMjItMzkuNnptODAuNiAxMjAuMWMtMTIuNSAxMi41LTEyLjUgMzIuOCAwIDQ1LjNMNTYyLjcgMjU2bC04OS40IDg5LjRjLTEyLjUgMTIuNS0xMi41IDMyLjggMCA0NS4zczMyLjggMTIuNSA0NS4zIDBsMTEyLTExMmMxMi41LTEyLjUgMTIuNS0zMi44IDAtNDUuM2wtMTEyLTExMmMtMTIuNS0xMi41LTMyLjgtMTIuNS00NS4zIDB6bS0zMDYuNyAwYy0xMi41LTEyLjUtMzIuOC0xMi41LTQ1LjMgMGwtMTEyIDExMmMtMTIuNSAxMi41LTEyLjUgMzIuOCAwIDQ1LjNsMTEyIDExMmMxMi41IDEyLjUgMzIuOCAxMi41IDQ1LjMgMHMxMi41LTMyLjggMC00NS4zTDc3LjMgMjU2bDg5LjQtODkuNGMxMi41LTEyLjUgMTIuNS0zMi44IDAtNDUuM3oiIGZpbGw9IndoaXRlIi8+PC9zdmc+
[canvasapi-url]: https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/
[css3-shield]: https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white
[css3-url]: https://developer.mozilla.org/en-US/docs/Web/CSS
[github-shield]: https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white
[github-url]: https://github.com/
[githubpages-shield]: https://img.shields.io/badge/GitHub%20Pages-222222?style=for-the-badge&logo=githubpages&logoColor=white
[githubpages-url]: https://pages.github.com/
[html5-shield]: https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white
[html5-url]: https://developer.mozilla.org/en-US/docs/Web/HTML
[javascript-shield]: https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black
[javascript-url]: https://developer.mozilla.org/en-US/docs/Web/JavaScript

<!-- GETTING STARTED -->
<!-- USAGE EXAMPLES -->
<!-- ROADMAP -->
<!-- CONTRIBUTING -->
<!-- LICENSE -->
<!-- CONTACT -->
<!-- ACKNOWLEDGMENTS -->
