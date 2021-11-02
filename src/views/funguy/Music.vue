<template>
	<div>
		<!-- 面包屑导航区域 -->
		<el-breadcrumb separator-class="el-icon-arrow-right">
		  <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
		  <el-breadcrumb-item>funguy管理</el-breadcrumb-item>
		  <el-breadcrumb-item>音乐列表</el-breadcrumb-item>
		</el-breadcrumb>

		<!-- 卡片视图区域 -->
		<el-card>
		  <!-- 搜索与添加区域 -->
		  <el-row :gutter="30">
		  	<el-col :span="10">
			  <el-input placeholder="请输入音乐名" v-model="queryInfo.query" clearable @clear="getMusicList">
			    <el-button slot="append" icon="el-icon-search" @click="getMusicList"></el-button>
			  </el-input>
		  	</el-col>
			<el-col :span="4">
		  		<el-button type="primary" v-on:click="addDialogVisible=true">添加音乐</el-button>
		  	</el-col>
		  </el-row>

		  <!-- 歌曲列表区域 -->
		  <el-table :data="musiclist" stripe>
		  	<el-table-column type="index"></el-table-column>
		  	<el-table-column label="歌名" prop="music_name" width="200px"></el-table-column>
		  	<el-table-column label="作者" prop="author_name" width="200px"></el-table-column>
		  	<el-table-column label="路径" prop="path"></el-table-column>

		  	<el-table-column label="操作" width="120px">
		  		<template slot-scope="scope">
					  <el-tooltip effect="dark" content="编辑歌曲" placement="top" :enterable="false">
					    <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row._id)"></el-button>
					  </el-tooltip>
					  <el-tooltip effect="dark" content="删除歌曲" placement="top" :enterable="false">
					    <el-button type="danger" icon="el-icon-delete" size="mini" @click="removemusicById(scope.row._id)"></el-button>
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



		<!-- 修改歌曲的对话框 -->
		<el-dialog
		  title="修改歌曲"
		  :visible.sync="editDialogVisible"
		  width="50%">
		  <!-- 内容主题区域 -->
		    <el-form :model="editForm" ref="editFormRef" label-width="70px">
		      <el-form-item label="歌名" prop="music_name">
		        <el-input v-model="editForm.music_name"></el-input>
		      </el-form-item>
			  <el-form-item label="作者" prop="author_name">
		        <el-input v-model="editForm.author_name"></el-input>
		      </el-form-item>
			  <el-form-item label="路径">
		        <el-input v-model="editForm.path"></el-input>
		      </el-form-item>
		    </el-form>
		  <template #footer>
		    <span class="dialog-footer">
		      <el-button @click="editDialogVisible = false">取 消</el-button>
		      <el-button type="primary" @click="editMusicInfo">确 定</el-button>
		    </span>
		  </template>
		</el-dialog>


		<!-- 添加音乐的对话框 -->
		<el-dialog
		  title="添加音乐"
		  :visible.sync="addDialogVisible"
		  width="50%"
		   @close="addDialogClosed">
		  <!-- 内容主题区域 -->
		    <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
		      <el-form-item label="音乐名" prop="music_name">
		        <el-input v-model="addForm.music_name"></el-input>
		      </el-form-item>
		      <el-form-item label="歌手名" prop="author_name">
		        <el-input v-model="addForm.author_name"></el-input>
		      </el-form-item>
		      <el-form-item label="路径" prop="path">
		        <el-input v-model="addForm.path"></el-input>
		      </el-form-item>
		     </el-form>


		  <template #footer>
		    <span class="dialog-footer">
		      <el-button @click="addDialogVisible = false">取 消</el-button>
		      <el-button type="primary" @click="addUser" >确 定</el-button>
		    </span>
		  </template>
		</el-dialog>
	</div>	
</template>


<script>
export default{
	data(){
		return{
			// 获取歌曲列表的参数对象
			queryInfo: {
				query: '',
				pagenum: 1
			},
			musiclist: [],
			// 控制修改歌曲对话框的显示与隐藏
			editDialogVisible: false,
			// 查询到的歌曲信息对象
			editForm: {},

			// 添加音乐对话框的显示与隐藏
			addDialogVisible: false,
			// 添加歌曲的表单数据
			addForm: {
				author_name: '',
				music_name: '',
				path: ''
			},
			// 添加表单的验证规则对象
			addFormRules: {
				music_name:[
					{ required: true, message: '请输入音乐名', trigger: 'blur' },
					{ min: 1, message: '音乐名不能为空', trigger: 'blur' }
				],
				author_name: [
					{ required: true, message: '请输入歌手名', trigger: 'blur' },
					{ min: 1,  message: '歌手不能为空', trigger: 'blur' }
				],
				path: [
					{ required: true, message: '请输入歌曲路径', trigger: 'blur' },
					{ min: 1,  message: '', trigger: 'blur' }
				]
			}
		}
	},


	created(){
		this.getMusicList()
	},


	methods: {
		async getMusicList(){
			const {data: res} = await this.$http.get('funguy/music', { params: this.queryInfo })
			console.log(res)
			if (res.meta.status !== 200){
				if(res.meta.status === 404){
					this.musiclist = res.data
					return this.$message.warning('没有更多数据！')
				}
				return this.$message.error('获取歌曲列表失败！')
			}
			this.musiclist = res.data
		},
		// 这是监听页码值改变的事件
		handleCurrentChange(newPage){
			console.log(newPage)
			this.queryInfo.pagenum = newPage
			this.getMusicList()
		},

		// 展示编辑歌曲的对话框, id通过scope参数拿来
		async showEditDialog(id){
			console.log(id)
			const {data: res} = await this.$http.get('funguy/music/getMusicById', {params: {id: id}})
			console.log(res)
			if(res.meta.status !== 200){
				return this.$message.error("查询歌曲信息失败！")
			}
			this.editForm = res.data[0]

			this.editDialogVisible = true
		},
		
		// 修改歌曲信息并提交
		async editMusicInfo(){
			// 发起修改歌曲信息的数据请求
			const {data: res} = await this.$http.post('funguy/music/editMusic', this.editForm)
			// console.log(res)
			if (res.meta.status !== 200){
				return this.$message.error("更新歌曲信息失败")
			}
			// 关闭对话框
			this.editDialogVisible = false
			// 刷新数据列表
			this.getMusicList()
			// 提示修改成功
			this.$message.success('更新歌曲信息成功！')
		},
		// 根据id删除对应的歌曲信息
		async removemusicById(id){
			// 弹框询问是否确认删除, 返回值为Promise对象，可以用async await优化
			const confirmResult = await this.$confirm('此操作将永久删除该歌曲, 是否继续?', '提示', {
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
	        const {data: res} = await this.$http.post('funguy/music/deleteMusic', {id})
	        if(res.meta.status !== 200){
	        	return this.$message.error("删除歌曲失败")
	        }
	        this.$message.success("删除歌曲成功！")
	        this.getMusicList()
		},


		// 监听添加音乐对话框的关闭事件
		addDialogClosed(){
			this.$refs.addFormRef.resetFields()
		},

		// 点击按钮，添加新音乐
		addUser() {
			this.$refs.addFormRef.validate(async valid => {
				// console.log(valid)
				if (!valid) return
				// 发起添加音乐的网络请求
				const {data: res} = await this.$http.post('funguy/music/addMusic', this.addForm)
				console.log(res)
				if (res.meta.status !== 200){
					this.$message.error("添加音乐失败")
				}
				this.$message.success('添加音乐成功')
				// 隐藏添加音乐的对话框
				this.addDialogVisible = false
				// 重新获取音乐列表数据
				this.getMusicList()
			})
		}
	}
}
</script>



<style>
	
</style>