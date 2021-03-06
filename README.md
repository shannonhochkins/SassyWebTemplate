SassyWebTemplate
===============
This is a full template setup using Node.js, Grunt.JS, Angular.js, BootstrapIU, Compass & Sass! Created by [shannon hochkins].
[shannon hochkins]: http://www.shannonhochkins.com/

Simple to use, if you don't know anything about Grunt, Node, Sass or Angular than this probably isn't the template for you. 

All dependencies for this project should by inside this directory.

Running Grunt
--------------

```
cd /project/path
// npm install may take some time, once completed just run grunt and the service will be up and running.
npm install
grunt
```

That's it! Once grunt is running it will automatically perform the following:

- Start watching all javascript, css & scss files.
- When a scss file is changed, it will automatically create the css compressed version inside the css/main folder.
- When a css file is created/modified it will automatically create a minified version of that file inside the css/min/filename.min.css
- When a javascript file is changed it will automatically grab all files inside the lib directory, files inside the angularjs modules directories and concat them and minify them and save it inside the js/dest/ folder.
- Any plugins in the merged_plugins folder will all concat into a single file in the js/dest/plugins.min.js folder.


Dependancies:
--------------
- NodeJS
- GruntJS
- Matchdep - ```npm install matchdep --save```

