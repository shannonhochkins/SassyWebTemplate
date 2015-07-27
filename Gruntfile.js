module.exports = function(grunt) {
	// Load NPM tasks
	require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

	// Enter the name of the file for the dashboard you want to generate

	// Project configuration.
	grunt.initConfig({
		pkg : grunt.file.readJSON('package.json'),
		compass: {
		    dist: {
		        options: {
			        sassDir: 'css/scss',
			        cssDir: 'css/main'
		        }
		    }
		},
		cssmin: {
		    main : {
		    	options: {
			    	restructuring: false
			    },
		    	files: [{
			    	expand: true,
			    	cwd: 'css/main',
			    	src: ['*main.css', '!*main.min.css'],
			    	dest: './css/min',
			    	ext: '.min.css'
			    }]
		    }
		},
		uglify: {
			options : {
				banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' + '<%= grunt.template.today("mm-dd-yyyy") %> */',
				mangle : true,
				compress: {
					drop_console: false,
				}
			},
			// This will compile all files in the following folders to one file called 'main.min.js'
		    scripts: {
		      files: {
		        'js/dest/main.min.js': ['js/lib/*.js', 'js/lib/routing/*.js', 'js/lib/factories/*.js','js/lib/services/*.js','js/lib/directives/*.js','js/lib/controllers/*.js', '!*.min.js', '!Gruntfile.js'],
		        'js/dest/plugins.min.js' : ['js/lib/plugins/merge_plugins/*.js', 'js/lib/plugins/merge_plugins/**/*.js']
		      },
		    }
		},
		watch : {
			scripts: {
			    files: ['js/lib/**/*.js', 'js/lib/*.js'],
			    tasks: ['uglify']
		  	},
		  	scss: {
			    files: ['css/scss/*.scss', 'css/scss/**/*.scss', 'css/shared/**/*.scss'],
			    tasks: ['compass'],
		  	},
		  	css: {
		    	files: ['css/main/*.css'],
		    	tasks: ['cssmin'],	
		  	},
		}
	});

	// Setup default task to initialize the watch function
	grunt.registerTask('default', ['watch']);


}