module.exports = function(grunt) {
    // 项目配置
    var min_file = 'dest/<%= pkg.file %>.min.js';
    
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            options: {
                beautify: {
                    ascii_only: true
                },
                banner: '/*! <%= pkg.name %> v<%= pkg.version %> Date: <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            build: {
                src: 'src/<%=pkg.file %>.js',
                dest: min_file
            }
        },
        replace: {
            build: {
                src: min_file,
                overwrite: true, // 覆盖源文件
                replacements: [{
                    from: '-[1]', // 替换被优化的语句
                    to: '-[1,]' // 检测 ie6-8 的语句
                }]
            }
        }
    });
    
    // 加载提供"uglify"任务的插件
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-text-replace');
    
    // 默认任务
    grunt.registerTask('default', ['uglify', 'replace']);
}