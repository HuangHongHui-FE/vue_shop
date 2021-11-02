<template>
	<div>
		<!-- 面包屑导航区域 -->
		<el-breadcrumb separator-class="el-icon-arrow-right">
		  <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
		  <el-breadcrumb-item>users管理</el-breadcrumb-item>
		  <el-breadcrumb-item>用户列表</el-breadcrumb-item>
		</el-breadcrumb>

		<!-- 卡片视图区域 -->
		<el-card>
		  <!-- 搜索与添加区域 -->
		  <el-row :gutter="30">
		  	<el-col :span="10">
			  <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserList">
			    <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
			  </el-input>
		  	</el-col>
		  </el-row>

		  <!-- 用户列表区域 -->
		  <el-table :data="userlist" stripe>
		  	<el-table-column type="index"></el-table-column>
		  	<el-table-column label="用户名" prop="username" width="120px"></el-table-column>
		  	<el-table-column label="密码" prop="pwd" width="150px"></el-table-column>
		  	<el-table-column label="性别" prop="sex" width="50px"></el-table-column>
		  	<el-table-column label="昵称" prop="nicheng"></el-table-column>
		  	<el-table-column label="简介" prop="grjj"></el-table-column>
		  	<el-table-column label="地址" prop="address.city22" width="100px"></el-table-column>

		  	<el-table-column label="操作" width="120px">
		  		<template slot-scope="scope">
					  <el-tooltip effect="dark" content="编辑用户" placement="top" :enterable="false">
					    <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row._id)"></el-button>
					  </el-tooltip>
					  <el-tooltip effect="dark" content="删除用户" placement="top" :enterable="false">
					    <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeUserById(scope.row._id)"></el-button>
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



		<!-- 修改用户的对话框 -->
		<el-dialog
		  title="修改用户"
		  :visible.sync="editDialogVisible"
		  width="50%">
		  <!-- 内容主题区域 -->
		    <el-form :model="editForm" ref="editFormRef" label-width="70px">
		      <el-form-item label="用户名">
		        <el-input v-model="editForm.username" disabled></el-input>
		      </el-form-item>
			  <el-form-item label="密码">
		        <el-input v-model="editForm.pwd" disabled></el-input>
		      </el-form-item>
			  <el-form-item label="性别">
				  <template>
					<div>
						<el-radio v-model="editForm.sex" label="男" border>男</el-radio>
						<el-radio v-model="editForm.sex" label="女" border>女</el-radio>
					</div>
				  </template>
		      </el-form-item>
			  
			  <el-form-item label="昵称">
		        <el-input v-model="editForm.nicheng"></el-input>
		      </el-form-item>
			  <el-form-item label="简介">
		        <el-input v-model="editForm.grjj"></el-input>
		      </el-form-item>
		    </el-form>

		  <template #footer>
		    <span class="dialog-footer">
		      <el-button @click="editDialogVisible = false">取 消</el-button>
		      <el-button type="primary" @click="editUserInfo">确 定</el-button>
		    </span>
		  </template>
		</el-dialog>
	</div>	
</template>


<script>
export default{
	data(){
		return{
			// 获取用户列表的参数对象
			queryInfo: {
				query: '',
				pagenum: 1
			},
			userlist: [],
			// 控制修改用户对话框的显示与隐藏
			editDialogVisible: false,
			// 查询到的用户信息对象
			editForm: {}
		}
	},


	created(){
		this.getUserList()
	},


	methods: {
		async getUserList(){
			const {data: res} = await this.$http.get('users', { params: this.queryInfo })
			// console.log(res)
			if (res.meta.status !== 200){
				if(res.meta.status === 404){
					this.userlist = res.data
					return this.$message.warning('没有更多数据！')
				}
				return this.$message.error('获取用户列表失败！')
			}
			
			this.userlist = res.data
		},
		// 这是监听页码值改变的事件
		handleCurrentChange(newPage){
			console.log(newPage)
			this.queryInfo.pagenum = newPage
			this.getUserList()
		},

		// 展示编辑用户的对话框, id通过scope参数拿来
		async showEditDialog(id){
			console.log(id)
			const {data: res} = await this.$http.get('users/getMsgById', {params: {id: id}})
			// console.log(res)
			if(res.meta.status !== 200){
				return this.$message.error("查询用户信息失败！")
			}
			this.editForm = res.data[0]

			this.editDialogVisible = true
		},
		
		// 修改用户信息并提交
		async editUserInfo(){
				// 发起修改用户信息的数据请求
			// console.log(this.editForm)
			const {data: res} = await this.$http.post('users/editMsg', this.editForm)
			// console.log(res)
			if (res.meta.status !== 200){
				return this.$message.error("更新用户信息失败")
			}
			// 关闭对话框
			this.editDialogVisible = false
			// 刷新数据列表
			this.getUserList()
			// 提示修改成功
			this.$message.success('更新用户信息成功！')
		},


		// 根据id删除对应的用户信息
		async removeUserById(id){
			// 弹框询问是否确认删除, 返回值为Promise对象，可以用async await优化
			const confirmResult = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
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
	        const {data: res} = await this.$http.post('users/deleteUser', {id})
			console.log(res)
	        if(res.meta.status !== 200){
	        	return this.$message.error("删除用户失败")
	        }
	        this.$message.success("删除用户成功！")
	        this.getUserList()
		}
	}
}
</script>



<style>
	
</style>