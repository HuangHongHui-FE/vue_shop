<template>
	<div>
		<!-- 面包屑导航区域 -->
		<el-breadcrumb separator-class="el-icon-arrow-right">
		  <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
		  <el-breadcrumb-item>funguy管理</el-breadcrumb-item>
		  <el-breadcrumb-item>视频列表</el-breadcrumb-item>
		</el-breadcrumb>

		<!-- 卡片视图区域 -->
		<el-card>
		  <!-- 搜索与添加区域 -->
		  <el-row :gutter="30">
		  	<el-col :span="10">
			  <el-input placeholder="请输入视频名" v-model="queryInfo.query" clearable @clear="getVideoList">
			    <el-button slot="append" icon="el-icon-search" @click="getVideoList"></el-button>
			  </el-input>
		  	</el-col>
			<el-col :span="4">
		  		<el-button type="primary" v-on:click="addDialogVisible=true">添加视频</el-button>
		  	</el-col>
		  </el-row>

		  <!-- 视频列表区域 -->
		  <el-table :data="videolist" stripe>
		  	<el-table-column type="index"></el-table-column>
		  	<el-table-column label="标题" prop="title" width="200px"></el-table-column>
		  	<el-table-column label="喜爱" prop="love" width="200px"></el-table-column>
		  	<el-table-column label="路径" prop="path"></el-table-column>
		  	<el-table-column label="评论" prop="comments">
				<!-- 作用域插槽 -->
		  		<template slot-scope="scope">
					<el-collapse>
						<el-collapse-item title="评论" name="1">
							<div v-for="(item, index) in scope.row.comments" :key="index">{{index}} -- {{item}}</div>
						</el-collapse-item>
					</el-collapse>
		  		</template>
			</el-table-column>

		  	<el-table-column label="操作" width="120px">
		  		<template slot-scope="scope">
					  <el-tooltip effect="dark" content="编辑视频" placement="top" :enterable="false">
					    <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row._id)"></el-button>
					  </el-tooltip>
					  <el-tooltip effect="dark" content="删除视频" placement="top" :enterable="false">
					    <el-button type="danger" icon="el-icon-delete" size="mini" @click="removevideoById(scope.row._id)"></el-button>
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



		<!-- 修改视频的对话框 -->
		<el-dialog
		  title="修改视频"
		  :visible.sync="editDialogVisible"
		  width="50%">
		  <!-- 内容主题区域 -->
		    <el-form :model="editForm" ref="editFormRef" label-width="70px">
		      <el-form-item label="标题">
		        <el-input v-model="editForm.title"></el-input>
		      </el-form-item>
			  <el-form-item label="喜爱">
		        <el-input v-model="editForm.love" type="number"></el-input>
		      </el-form-item>
			  <el-form-item label="路径">
		        <el-input v-model="editForm.path"></el-input>
		      </el-form-item>
		    </el-form>
		  <template #footer>
		    <span class="dialog-footer">
		      <el-button @click="editDialogVisible = false">取 消</el-button>
		      <el-button type="primary" @click="editVideoInfo">确 定</el-button>
		    </span>
		  </template>
		</el-dialog>


		<!-- 添加视频的对话框 -->
		<el-dialog
		  title="添加视频"
		  :visible.sync="addDialogVisible"
		  width="50%"
		   @close="addDialogClosed">
		  <!-- 内容主题区域 -->
		    <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
		      <el-form-item label="标题" prop="title">
		        <el-input v-model="addForm.title"></el-input>
		      </el-form-item>
		      <el-form-item label="喜爱" prop="love">
		        <el-input v-model="addForm.love" type="number"></el-input>
		      </el-form-item>
		      <el-form-item label="路径" prop="path">
		        <el-input v-model="addForm.path"></el-input>
		      </el-form-item>
		    </el-form>

		  <template #footer>
		    <span class="dialog-footer">
		      <el-button @click="addDialogVisible = false">取 消</el-button>
		      <el-button type="primary" @click="addUser">确 定</el-button>
		    </span>
		  </template>
		</el-dialog>
	</div>	
</template>


<script>
export default{
	data(){
		return{
			// 获取视频列表的参数对象
			queryInfo: {
				query: '',
				pagenum: 1
			},
			videolist: [],
			// 控制修改视频对话框的显示与隐藏
			editDialogVisible: false,
			// 查询到的视频信息对象
			editForm: {},

			// 添加视频对话框的显示与隐藏
			addDialogVisible: false,
			// 添加视频的表单数据
			addForm: {
				title: '',
				comments: [],
				love: 0,
				path: ''
			},
			// 添加表单的验证规则对象
			addFormRules: {
				title:[
					{ required: true, message: '请输入视频名', trigger: 'blur' },
					{ min: 1, message: '标题不能为空', trigger: 'blur' }
				],
				path: [
					{ required: true, message: '请输入视频路径', trigger: 'blur' },
					{ min: 1,  message: '路径不能为空', trigger: 'blur' }
				]
			}
		}
	},


	created(){
		this.getVideoList()
	},


	methods: {
		async getVideoList(){
			const {data: res} = await this.$http.get('funguy/video', { params: this.queryInfo })
			console.log(res)
			if (res.meta.status !== 200){
				if(res.meta.status === 404){
					this.videolist = res.data
					return this.$message.warning('没有更多数据！')
				}
				return this.$message.error('获取视频列表失败！')
			}
			this.videolist = res.data
		},
		// 这是监听页码值改变的事件
		handleCurrentChange(newPage){
			console.log(newPage)
			this.queryInfo.pagenum = newPage
			this.getVideoList()
		},

		// 展示编辑视频的对话框, id通过scope参数拿来
		async showEditDialog(id){
			console.log(id)
			const {data: res} = await this.$http.get('funguy/video/getVideoById', {params: {id: id}})
			console.log(res)
			if(res.meta.status !== 200){
				return this.$message.error("查询视频信息失败！")
			}
			this.editForm = res.data[0]

			this.editDialogVisible = true
		},
		
		// 修改视频信息并提交
		async editVideoInfo(){
			// 发起修改视频信息的数据请求
			const {data: res} = await this.$http.post('funguy/video/editVideo', this.editForm)
			// console.log(res)
			if (res.meta.status !== 200){
				return this.$message.error("更新视频信息失败")
			}
			// 关闭对话框
			this.editDialogVisible = false
			// 刷新数据列表
			this.getVideoList()
			// 提示修改成功
			this.$message.success('更新视频信息成功！')
		},
		// 根据id删除对应的视频信息
		async removevideoById(id){
			// 弹框询问是否确认删除, 返回值为Promise对象，可以用async await优化
			const confirmResult = await this.$confirm('此操作将永久删除该视频, 是否继续?', '提示', {
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
	        const {data: res} = await this.$http.post('funguy/video/deleteVideo', {id})
	        if(res.meta.status !== 200){
	        	return this.$message.error("删除视频失败")
	        }
	        this.$message.success("删除视频成功！")
	        this.getVideoList()
		},


		// 监听添加视频对话框的关闭事件
		addDialogClosed(){
			this.$refs.addFormRef.resetFields()
		},

		// 点击按钮，添加新视频
		addUser() {
			this.$refs.addFormRef.validate(async valid => {
				// console.log(valid)
				if (!valid) return
				// 发起添加视频的网络请求
				const {data: res} = await this.$http.post('funguy/video/addVideo', this.addForm)
				console.log(res)
				if (res.meta.status !== 200){
					this.$message.error("添加视频失败")
				}
				this.$message.success('添加视频成功')
				// 隐藏添加视频的对话框
				this.addDialogVisible = false
				// 重新获取视频列表数据
				this.getVideoList()
			})
		}
	}
}
</script>



<style>
	
</style>