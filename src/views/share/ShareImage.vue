<template>
	<div>
		<!-- 面包屑导航区域 -->
		<el-breadcrumb separator-class="el-icon-arrow-right">
		  <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
		  <el-breadcrumb-item>share管理</el-breadcrumb-item>
		  <el-breadcrumb-item>图册列表</el-breadcrumb-item>
		</el-breadcrumb>

		<!-- 卡片视图区域 -->
		<el-card>
		  <!-- 搜索与添加区域 -->
		  <el-row :gutter="30">
		  	<el-col :span="10">
			  <el-input placeholder="请输入图册标题" v-model="queryInfo.query" clearable @clear="getShareImageList">
			    <el-button slot="append" icon="el-icon-search" @click="getShareImageList"></el-button>
			  </el-input>
		  	</el-col>
		  </el-row>

		  <!-- 图册列表区域 -->
		  <el-table :data="shareImagelist" stripe>
		  	<el-table-column type="index"></el-table-column>
		  	<el-table-column label="标题" prop="inputTitle"></el-table-column>
		  	<el-table-column label="用户名" prop="username"></el-table-column>
		  	<el-table-column label="图片路径">
				<!-- 作用域插槽 -->
		  		<template slot-scope="scope">
					<el-collapse>
						<el-collapse-item title="图片路径">
							<div v-for="(item, index) in scope.row.files" :key="index">{{index}} -- {{item}}</div>
						</el-collapse-item>
					</el-collapse>
		  		</template>
			</el-table-column>

		  	<el-table-column label="操作" width="60px">
		  		<template slot-scope="scope">
					  <el-tooltip effect="dark" content="删除图册" placement="top" :enterable="false">
					    <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeShareImageById(scope.row._id)"></el-button>
					  </el-tooltip>
		  		</template>
		  	</el-table-column>
		  </el-table>

		  <!-- 分页区域 -->
	  	  <el-pagination
	        @current-change="handleCurrentChange"
	        :current-page="queryInfo.pagenum"
	        layout=" prev, pager, next, jumper">
	      </el-pagination>
		</el-card>

	</div>	
</template>


<script>
export default{
	data(){
		return{
			// 获取图册列表的参数对象
			queryInfo: {
				query: '',
				pagenum: 1
			},
			shareImagelist: []
		}
	},


	created(){
		this.getShareImageList()
	},


	methods: {
		async getShareImageList(){
			const {data: res} = await this.$http.get('share/shareImage', { params: this.queryInfo })
			console.log(res)
			if (res.meta.status !== 200){
				if(res.meta.status === 404){
					this.shareImagelist = res.data
					return this.$message.warning('没有更多数据！')
				}
				return this.$message.error('获取图册列表失败！')
			}
			
			this.shareImagelist = res.data
		},
		// 这是监听页码值改变的事件
		handleCurrentChange(newPage){
			console.log(newPage)
			this.queryInfo.pagenum = newPage
			this.getShareImageList()
		},

		// 根据id删除对应的图册信息
		async removeShareImageById(id){
			// 弹框询问是否确认删除, 返回值为Promise对象，可以用async await优化
			const confirmResult = await this.$confirm('此操作将永久删除该图册, 是否继续?', '提示', {
	          confirmButtonText: '确定',
	          cancelButtonText: '取消',
	          type: 'warning'
	        }).catch(err => {
	        	return err
	        })
			// 确认删除返回值为字符串confirm, 取消删除返回值为字符串cancel
	        if (confirmResult !== "confirm"){
	        	return this.$message.error('已取消删除')
	        }
	        const {data: res} = await this.$http.post('share/shareImage/deleteShareImage', {id})
			console.log(res)
	        if(res.meta.status !== 200){
	        	return this.$message.error("删除图册失败")
	        }
	        this.$message.success("删除图册成功！")
	        this.getShareImageList()
		}
	}
}
</script>



<style>
	
</style>