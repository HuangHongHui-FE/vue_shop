<template>
	<div>
		<!-- 面包屑导航区域 -->
		<el-breadcrumb separator-class="el-icon-arrow-right">
		  <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
		  <el-breadcrumb-item>share管理</el-breadcrumb-item>
		  <el-breadcrumb-item>分类列表</el-breadcrumb-item>
		</el-breadcrumb>

		<!-- 卡片视图区域 -->
		<el-card>
		  <!-- 搜索与添加区域 -->
		  <el-row :gutter="30">
		  	<el-col :span="10">
			  <el-input placeholder="请输入分类名" v-model="queryInfo.query" clearable @clear="getClassifyList">
			    <el-button slot="append" icon="el-icon-search" @click="getClassifyList"></el-button>
			  </el-input>
		  	</el-col>
			<el-col :span="4">
		  		<el-button type="primary" v-on:click="addDialogVisible=true">添加分类</el-button>
		  	</el-col>
		  </el-row>

		  <!-- 分类列表区域 -->
		  <el-table :data="classifylist" stripe>
		  	<el-table-column type="index"></el-table-column>
		  	<el-table-column label="类名" prop="name"></el-table-column>
		  	<el-table-column label="包含的博客" prop="name">
				<!-- 作用域插槽 -->
		  		<template slot-scope="scope">
					<el-collapse @change="handleChange">
						<el-collapse-item title="博客标题" :name="scope.row.name">
							<div v-for="(item, index) in titlelist" :key="index">{{index}} -- {{item.inputTitle}}</div>
						</el-collapse-item>
					</el-collapse>
		  		</template>
			</el-table-column>
			

		  	<el-table-column label="操作" width="60px">
		  		<template slot-scope="scope">
					  <!-- <el-tooltip effect="dark" content="编辑分类" placement="top" :enterable="false">
					    <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row._id)"></el-button>
					  </el-tooltip> -->
					  <el-tooltip effect="dark" content="删除分类" placement="top" :enterable="false">
					    <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeclassifyById(scope.row)"></el-button>
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



		<!-- 修改分类的对话框
		<el-dialog
		  title="修改分类"
		  :visible.sync="editDialogVisible"
		  width="50%">
		  内容主题区域
		    <el-form :model="editForm" ref="editFormRef" label-width="70px">
		      <el-form-item label="类名" prop="name">
		        <el-input v-model="editForm.name"></el-input>
		      </el-form-item>
		    </el-form>
		  <template #footer>
		    <span class="dialog-footer">
		      <el-button @click="editDialogVisible = false">取 消</el-button>
		      <el-button type="primary" @click="editClassifyInfo">确 定</el-button>
		    </span>
		  </template>
		</el-dialog> -->


		<!-- 添加分类的对话框 -->
		<el-dialog
		  title="添加分类"
		  :visible.sync="addDialogVisible"
		  width="50%"
		  @close="addDialogClosed">
		  <!-- 内容主题区域 -->
		    <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
		      <el-form-item label="分类名" prop="name">
		        <el-input v-model="addForm.name"></el-input>
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
			// 获取分类列表的参数对象
			queryInfo: {
				query: '',
				pagenum: 1
			},
			classifylist: [],
			// 控制修改分类对话框的显示与隐藏
			editDialogVisible: false,
			// 查询到的分类信息对象
			editForm: {},

			// 添加分类对话框的显示与隐藏
			addDialogVisible: false,
			// 添加分类的表单数据
			addForm: {
				name: ''
			},
			// 添加表单的验证规则对象
			addFormRules: {
				name:[
					{ required: true, message: '请输入分类名', trigger: 'blur' },
					{ min: 1, message: '分类名不能为空', trigger: 'blur' }
				]
			},
			// 分类下的博客标题
			titlelist: []
		}
	},


	created(){
		this.getClassifyList()
	},


	methods: {
		async getClassifyList(){
			const {data: res} = await this.$http.get('share/classify', { params: this.queryInfo })
			console.log(res)
			if (res.meta.status !== 200){
				if(res.meta.status === 404){
					this.classifylist = res.data
					return this.$message.warning('没有更多数据！')
				}
				return this.$message.error('获取分类列表失败！')
			}
			this.classifylist = res.data
		},
		// 这是监听页码值改变的事件
		handleCurrentChange(newPage){
			console.log(newPage)
			this.queryInfo.pagenum = newPage
			this.getClassifyList()
		},

		// 展示编辑分类的对话框, id通过scope参数拿来
		async showEditDialog(id){
			console.log(id)
			const {data: res} = await this.$http.get('share/classify/getClassifyById', {params: {id: id}})
			console.log(res)
			if(res.meta.status !== 200){
				return this.$message.error("查询分类信息失败！")
			}
			this.editForm = res.data[0]

			this.editDialogVisible = true
		},
		
		// // 修改分类信息并提交
		// async editClassifyInfo(){
		// 	// 发起修改分类信息的数据请求
		// 	const {data: res} = await this.$http.post('share/classify/editClassify', this.editForm)
		// 	// console.log(res)
		// 	if (res.meta.status !== 200){
		// 		return this.$message.error("更新分类信息失败")
		// 	}
		// 	// 关闭对话框
		// 	this.editDialogVisible = false
		// 	// 刷新数据列表
		// 	this.getClassifyList()
		// 	// 提示修改成功
		// 	this.$message.success('更新分类信息成功！')
		// },
		// 根据id删除对应的分类信息
		async removeclassifyById(row){
			console.log(row)
			// 弹框询问是否确认删除, 返回值为Promise对象，可以用async await优化
			const confirmResult = await this.$confirm('此操作将永久删除该分类（以及该分类下的所有博客）, 是否继续?', '提示', {
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
	        const {data: res} = await this.$http.post('share/classify/deleteClassify', {row})
	        if(res.meta.status !== 200){
	        	return this.$message.error("删除分类失败")
	        }
	        this.$message.success("删除分类成功！")
	        this.getClassifyList()
		},


		// 监听添加分类对话框的关闭事件
		addDialogClosed(){
			this.$refs.addFormRef.resetFields()
		},

		// 点击按钮，添加新分类
		addUser() {
			this.$refs.addFormRef.validate(async valid => {
				// console.log(valid)
				if (!valid) return
				// 发起添加分类的网络请求
				const {data: res} = await this.$http.post('share/classify/addClassify', this.addForm)
				console.log(res)
				if (res.meta.status !== 200){
					this.$message.error("添加分类失败")
				}
				this.$message.success('添加分类成功')
				// 隐藏添加分类的对话框
				this.addDialogVisible = false
				// 重新获取分类列表数据
				this.getClassifyList()
			})
		},
		handleChange(val) {
			console.log(val);
			const value = val[0]
			this.getTitleList(value)
		},
		async getTitleList(val){
			const {data: res} = await this.$http.get('share/classify/getTitleList', {params: {val}})
			console.log(res)
			this.titlelist = res.data
		}
	}
}
</script>



<style>
	
</style>