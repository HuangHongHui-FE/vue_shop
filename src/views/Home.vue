<template>
	<el-container class="home-container">

	  <!-- 头部区域 -->
	  <el-header>
	  	<div>
	  		<img src="../assets/logo.png">
	  		<span>funguy后台管理系统</span>	  		
	  	</div>

	  	<el-button type="info" @click="logout">退出</el-button>
	  </el-header>

	  <!-- 页面主体区域 -->
	  <el-container>
	  	<!-- 侧边栏 -->
	    <el-aside :width="isCollpase ? '64px' : '200px'">

	    	<div class="toggle_button" @click="toggleCollapse">|||</div>

	    	<!-- 侧边栏菜单区     unique-opened:只保持一个子菜单的展开, collapse: 水平折叠收起菜单-->
			<el-menu background-color="#333744" text-color="#fff" active-text-color="#409EFF" unique-opened 
			:collapse="isCollpase" :collapse-transition="true" router :default-active='activePath'>
			  <!-- 一级菜单 :index: 表示展开时展开哪一个-->
		      <el-submenu :index="item.id + ''" v-for="item in menulist" :key="item.id">
		      	<!-- index代表一级菜单，须接收字符串 -->
		      	<!-- 一级菜单的模板区域 -->
		        <template #title>
		          <i :class="iconsObj[item.id]"></i>
		          <span>{{item.authName}}</span>
		        </template>

		          <!-- 二级菜单 saveNavState: 保存导航连接的状态-->
		          <el-menu-item :index="'/' + subItem.path" v-for="subItem in item.children" :key="subItem.id" @click="saveNavState('/' + subItem.path)">
		          	<template #title>
			          <i class="el-icon-menu"></i>
			          <span>{{subItem.authName}}</span>
			        </template>
		          </el-menu-item>
		      </el-submenu>
		    </el-menu>
	    </el-aside>

	     <!-- 右侧内容主体 -->
	     <el-main>
	     	<!-- 路由占位符 Welcome   进来的就是children路由-->
	     	<router-view></router-view>
	     </el-main>
	   </el-container>
	</el-container>
</template>



<script>
export default {
	data(){
		return {
			// 左侧菜单数据
			menulist: [],
			// 一级菜单图标
			iconsObj: {
				'10': 'iconfont icon-user',
				'20': 'iconfont icon-tijikongjian',
				'30': 'iconfont icon-shangpin',
				'40': 'iconfont icon-danju',
				'50': 'iconfont icon-baobiao'
			},
			// 是否折叠
			isCollpase: false,
			// 被激活的链接地址
			activePath: ''
		}
	},
	created() {
		this.getMenuList()
		this.activePath = window.sessionStorage.getItem('activePath')
	},
	methods: {
		logout() {
			window.sessionStorage.clear();
			this.$router.push('/login');
		},
		// 获取所有的菜单
		getMenuList(){
			const data = [
				{
					authName: 'funguy管理',
					children: [
						{
							authName: '音乐列表',
							children: [],
							id: 11,
							order: null,
							path: 'Music'
						},
						{
							authName: '视频列表',
							children: [],
							id: 12,
							order: null,
							path: 'Video'
						}
					],
					id: 10,
					order: 1,
					path: 'users'
					
				},
				{
					authName: 'resource管理',
					children: [
						{
							authName: '好玩的',
							children: [],
							id: 21,
							order: null,
							path: 'play'
						},
						{
							authName: '资源分享',
							children: [],
							id: 22,
							order: null,
							path: 'resourceShare'
						},
						{
							authName: '学习上传',
							children: [],
							id: 23,
							order: null,
							path: 'studyWhite'
						},
						{
							authName: '学习删除',
							children: [],
							id: 24,
							order: null,
							path: 'studyDelete'
						}
					],
					id: 20,
					order: 2,
					path: 'resource'
					
				},
				{
					authName: 'share管理',
					children: [
						{
							authName: '博客列表',
							children: [],
							id: 31,
							order: null,
							path: 'blogs'
						},
						{
							authName: '分类列表',
							children: [],
							id: 32,
							order: null,
							path: 'classify'
						},
						{
							authName: '图册列表',
							children: [],
							id: 33,
							order: null,
							path: 'shareImage'
						}
					],
					id: 30,
					order: 4,
					path: 'share'
				},
				{
					authName: 'users管理',
					children: [
						{
							authName: '用户列表',
							children: [],
							id: 41,
							order: null,
							path: 'users'
						}
					],
					id: 40,
					order: 4,
					path: 'users'
				},
				{
					authName: '数据统计',
					children: [
						{
							authName: '数据报表',
							children: [],
							id: 51,
							order: null,
							path: 'reports'
						}
					],
					id: 50,
					order: 5,
					path: 'reports'
				}
			]

			this.menulist = data
		},
		// 点击按钮，切换左边菜单的折叠与展开
		toggleCollapse(){
			this.isCollpase = !this.isCollpase
		},
		// 保存链接的激活（高亮）状态
		saveNavState(activePath) {
			window.sessionStorage.setItem('activePath', activePath)
			this.activePath = activePath
		}
	}
};
</script>



<style lang="less" scoped>
	.home-container{
		height: 100%;
	}
	.el-header {
		// background-color: #373d41;
		background-color: rgb(51, 55, 68);
		display: flex;
		justify-content: space-between;
		padding-left: 0;
		align-items: center;  /*按钮居中*/
		color: #fff;
		font-size: 20px;
		> div {
			display: flex;
			align-items: center;  // 中间字上下居中
			span {
				margin-left: 15px;
			}
		}
	}
	.el-aside {
		background-color: #333744;
		.el-menu{
			border-right: none;
		}
	}
	.el-main {
		background-color: #eaedf1;
	}
	.iconfont {
		margin-right: 10px;
	}
	.toggle_button{
		background-color: #4A5064;
		font-size: 10px;
		line-height: 24px;
		color: #fff;
		text-align: center;
		letter-spacing: 0.3em;  /*竖杠之间的距离*/
		cursor: pointer;  /*鼠标放上去变成一个小手*/
	}
</style>