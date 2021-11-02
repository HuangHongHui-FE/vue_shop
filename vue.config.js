module.exports = {
	// 包含自定义配置选项的对象（参考官方文档）
	chainWebpack: config => {
		// 发布模式
		config.when(process.env.NODE_ENV === 'production', config => {
			config.entry('app').clear().add('./src/main-prod.js')

			//使用externals设置排除项，只要把包名声明到了这里，
			// 在webpack打包的时候就不会将对应的包输出到文件中，而是去window全局直接查找并使用
            config.set('externals',{
                vue:'Vue',
                'vue-router':'VueRouter',
                axios:'axios',
                lodash:'_',
                echarts:'echarts',
                nprogress:'NProgress',
                'vue-quill-editor':'VueQuillEditor'
            })

            // 不同模式定制标题
            config.plugin('html').tap(args => {
            	args[0].isProd = true
            	return args
            })
		})

		// 开发模式
		config.when(process.env.NODE_ENV === 'development', config => {
			config.entry('app').clear().add('./src/main-dev.js')

			config.plugin('html').tap(args => {
            	args[0].isProd = false
            	return args
            })
		})
	}
}