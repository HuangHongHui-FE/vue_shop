<template>
	<div>
		<!-- 面包屑导航区域 -->
		<el-breadcrumb separator-class="el-icon-arrow-right">
		  <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
		  <el-breadcrumb-item>share管理</el-breadcrumb-item>
		  <el-breadcrumb-item>博客列表</el-breadcrumb-item>
		</el-breadcrumb>

		<!-- 卡片视图区域 -->
		<el-card>
		  <!-- 搜索与添加区域 -->
		  <el-row :gutter="30">
		  	<el-col :span="10">
			  <el-input placeholder="请输入博客标题" v-model="queryInfo.query" clearable @clear="getBlogList">
			    <el-button slot="append" icon="el-icon-search" @click="getBlogList"></el-button>
			  </el-input>
		  	</el-col>
		  </el-row>

		  <!-- 博客列表区域 -->
		  <el-table :data="bloglist" stripe>
		  	<el-table-column type="index"></el-table-column>
		  	<el-table-column label="标题" prop="inputTitle"></el-table-column>
		  	<el-table-column label="浏览数" prop="views"></el-table-column>
			<el-table-column label="分类" prop="value"></el-table-column>
		  	<el-table-column label="评论">
				<!-- 作用域插槽 -->
		  		<template slot-scope="scope">
					<el-collapse>
						<el-collapse-item title="评论">
							<div v-for="(item, index) in scope.row.comments" :key="index">{{index}} -- {{item}}</div>
						</el-collapse-item>
					</el-collapse>
		  		</template>
			</el-table-column>

		  	<el-table-column label="操作" width="120px">
		  		<template slot-scope="scope">
					  <el-tooltip effect="dark" content="编辑博客" placement="top" :enterable="false">
					    <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row._id)"></el-button>
					  </el-tooltip>
					  <el-tooltip effect="dark" content="删除博客" placement="top" :enterable="false">
					    <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeBlogById(scope.row._id)"></el-button>
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



		<!-- 修改博客的对话框 -->
		<el-dialog
		  title="修改博客"
		  :visible.sync="editDialogVisible"
		  width="50%">
		  <!-- 内容主题区域 -->
		    <el-form :model="editForm" ref="editFormRef" label-width="70px">
		      <el-form-item label="博客标题">
		        <el-input v-model="editForm.inputTitle"></el-input>
		      </el-form-item>
			  <el-form-item label="浏览数">
		        <el-input v-model="editForm.views" type="number"></el-input>
		      </el-form-item>
			  <el-form-item label="分类">
				  <template>
					<el-select v-model="editForm.value" clearable placeholder="请选择" @visible-change="getClassify">
						<el-option
						v-for="item in options"
						:key="item.name"
						:value="item.name">
						</el-option>
					</el-select>
				  </template>
		      </el-form-item>
		    </el-form>

		  <template #footer>
		    <span class="dialog-footer">
		      <el-button @click="editDialogVisible = false">取 消</el-button>
		      <el-button type="primary" @click="editBlogInfo">确 定</el-button>
		    </span>
		  </template>
		</el-dialog>
	</div>	
</template>


<script>
export default{
	data(){
		return{
			// 获取博客列表的参数对象
			queryInfo: {
				query: '',
				pagenum: 1
			},
			bloglist: [],
			// 控制修改博客对话框的显示与隐藏
			editDialogVisible: false,
			// 查询到的博客信息对象
			editForm: {},
			// 供选择的分类
			options: []
		}
	},


	created(){
		this.getBlogList()
	},


	methods: {
		async getBlogList(){
			const {data: res} = await this.$http.get('share/blog', { params: this.queryInfo })
			console.log(res)
			if (res.meta.status !== 200){
				if(res.meta.status === 404){
					this.bloglist = res.data
					return this.$message.warning('没有更多数据！')
				}
				return this.$message.error('获取博客列表失败！')
			}
			
			this.bloglist = res.data
		},
		// 这是监听页码值改变的事件
		handleCurrentChange(newPage){
			console.log(newPage)
			this.queryInfo.pagenum = newPage
			this.getBlogList()
		},

		// 展示编辑博客的对话框, id通过scope参数拿来
		async showEditDialog(id){
			console.log(id)
			const {data: res} = await this.$http.get('share/blog/getBlogById', {params: {id: id}})
			console.log(res)
			if(res.meta.status !== 200){
				return this.$message.error("查询博客信息失败！")
			}
			this.editForm = res.data[0]

			this.editDialogVisible = true
		},
		
		// 修改博客信息并提交
		async editBlogInfo(){
			// 发起修改博客信息的数据请求
			const {data: res} = await this.$http.post('share/blog/editBlog', this.editForm)
			// console.log(res)
			if (res.meta.status !== 200){
				return this.$message.error("更新博客信息失败")
			}
			// 关闭对话框
			this.editDialogVisible = false
			// 刷新数据列表
			this.getBlogList()
			// 提示修改成功
			this.$message.success('更新博客信息成功！')
		},


		// 根据id删除对应的博客信息
		async removeBlogById(id){
			// 弹框询问是否确认删除, 返回值为Promise对象，可以用async await优化
			const confirmResult = await this.$confirm('此操作将永久删除该博客, 是否继续?', '提示', {
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
	        const {data: res} = await this.$http.post('share/blog/deleteBlog', {id})
			console.log(res)
	        if(res.meta.status !== 200){
	        	return this.$message.error("删除博客失败")
	        }
	        this.$message.success("删除博客成功！")
	        this.getBlogList()
		},
		// 获取所有分类的数据
		async getClassify(){
			const {data: res} = await this.$http.get('share/blog/getClassify')
			console.log(res)
			if(res.meta.status !== 200){
	        	return this.$message.error("获取分类列表失败")
	        }
			this.options = res.data
		}
	}
}
</script>



<style>
	
</style>