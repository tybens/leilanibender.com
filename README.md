# Leilani's Personal Website - [leilanibender.com](https://)

 - Randomization on-visit for colour theme (with setup to dynamically generate css files) 
 - Randomization of quotes and images
 - CSS striped background
 - Trapezoidal top bar with typing-info 
 - Dynamic portfolio/resume section with content read from JSON file. 
    - Includes a slider to filter content, and animations to show content enter/exits


# Getting started 

Run the following to set up the project and install dependencies. (You can also use the "Use this template" button at the top instead of cloning)
```bash 
git clone https://github.com/tybens/leilanibender.com && cd leilanibender.com
yarn install

``` 

Then to start serving the website;
```
yarn start
``` 
This will auto-refresh and build CSS on all changes!


# Deployment
The general deployment process involves running `yarn build` and then `firebase deploy` for firebase hosting.

### Analytics
An analytics service such as Google Analytics will give you a script that should be added to `public/index.html` in the `footer` element. 

### Favicon
The favicon is the little icon that'll appear in the browser tab. It is defaulted to a sparkly heart, though can be changed by replacing `public/favicon.ico`. 
