## Selenium setup
1. Install Selenium Web Driver: `npm install selenium-webdriver`

You will need to download additional components to work with each of the major browsers. The drivers for Chrome, Firefox, and Microsoft's IE and Edge web browsers are all standalone executables that should be placed on your system PATH. Apple's safaridriver is shipped with Safari 10 for OS X El Capitan and macOS Sierra. You will need to enable Remote Automation in the Develop menu of Safari 10 before testing.

| Browser	          |Component
|-------------------|---------------------------
|Chrome	            | [chromedriver(.exe)](http://chromedriver.storage.googleapis.com/index.html)
|Internet Explorer	| [IEDriverServer.exe](http://selenium-release.storage.googleapis.com/index.html)
|Edge	              | [MicrosoftWebDriver.msi](http://go.microsoft.com/fwlink/?LinkId=619687)
|Firefox            | [geckodriver(.exe)](https://github.com/mozilla/geckodriver/releases/)
|Safari	            | [safaridriver](https://developer.apple.com/library/prerelease/content/releasenotes/General/WhatsNewInSafari/Articles/Safari_10_0.html#//apple_ref/doc/uid/TP40014305-CH11-DontLinkElementID_28)

# Webpack 4 Boilerplate Typescript/Sass with build-in option to change preprocessor (less/stylus)
This Webpack 4 Boilerplate comes with 2 builds:

--> <code>npm run build:dev</code><br>
  starts dev server on <code>localhost:8080</code> with livereload, sourcemap

--> <code>npm run build:prod</code><br>
  creates prod files to <code>/dist</code> with:

  1. compiles sass/stylus/less to css <br>
  2. autoprefixer for vendor prefixes (browser compability)<br>
  3. compiles typescript to ES5 <br>
  4. minifying for css/js <br>
  5. uglyfing js code <br>
  6. hash css and js file (file versioning for browser caching -> cache busting)<br>

# Setup
1. <code>git clone https://github.com/mwieth/Webpack-4-boilerplate-Typescript.git</code>clone and run <code>npm install</code> in project folder
2. <code>npm run build:dev</code> or just <code>npm start</code> which also starts the dev mode

# Preprocessor support (default: Sass)

--> if u want to change to <strong>less</strong> run:

  1. <code>npm install less less-loader --save-dev</code>
  2. <code>npm uninstall node-sass sass-loader</code>

  3. set selectedPreprocessor in \webpack\loader.js to less

  4. change default files in styles from sass to less

--> if u want to change to <strong>stylus</strong> run:

  1. <code>npm install stylus stylus-loader --save-dev</code>
  2. <code>npm uninstall node-sass sass-loader</code>

  3. set selectedPreprocessor in \webpack\loader.js to stylus

  4. change default files in styles from sass to stylus (*.styl)

--> if u want to use the 'original' loose *.sass syntax just change the files from *.scss to *.sass and update import in index.js line 1