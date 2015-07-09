SassyWebTemplate
===============
This is a full template setup using Node.js, Grunt, Angular.js, Compass & Sass! Created by [shannon hochkins].
[shannon hochkins]: http://www.shannonhochkins.com/

Simple to use, if you don't know anything about Grunt, Node, Sass or Angular than this probably isn't the template for you. 

All dependencies for this project should by inside this directory.

Running Grunt
--------------

```cd /project/path
grunt
```

That's it! Once grunt is running it will automatically perform the following:

- Start watching all javascript, css & scss files.
- When a scss file is changed, it will automatically create the css compressed version inside the css/main folder.
- When a css file is created/modified it will automatically create a minified version of that file inside the css/min/filename.min.css
- When a javascript file is changed it will automatically grab all files inside the lib directory, files inside the factories directory and concat them and minify them and save it inside the js/dest/ folder.
