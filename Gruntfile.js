module.exports = function(grunt) {
	grunt.initConfig({
		pkg : grunt.file.readJSON('package.json'),
		sass: {
		    dist: {
		    	options: {
		        	style: 'compressed' // [nested, compact, expanded, compressed]
		        },
		      	files: [{
			      	expand : true,
			      	cwd: 'css/scss',
			      	src: ['*.scss'],
			      	dest: 'css/main',
			      	ext : '.css'
		      	}]
		    }
		},
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
		    	files: [{
			    	expand: true,
			    	cwd: 'css/main',
			    	src: ['*.css', '!*.min.css'],
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
		    scripts: {
		      files: {
		        'js/dest/main.min.js': ['js/lib/*.js', 'js/lib/factories/*.js']
		      }
		    }
		},
		jshint: {
			all: ['js/*.js', 'js/**/*.js']
		},
		watch : {
			scripts: {
			    files: ['**/*.js'],
			    tasks: ['uglify']
		  	},
		  	scss: {
			    files: ['**/*.scss'],
			    tasks: ['compass'],
		  	},
		  	css: {
			    files: ['**/*.css'],
			    tasks: ['cssmin'],
		  	},
		}
	});

	// Currently, sass and jshint aren't running as they're not really that useful.
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-compass');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-watch');
	// Setup default task to initialize the watch param
	grunt.registerTask('default', ['watch']);
}