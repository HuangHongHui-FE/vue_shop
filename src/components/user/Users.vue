<template>
	<div>
		<!-- 面包屑导航区域 -->
		<el-breadcrumb separator-class="el-icon-arrow-right">
		  <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
		  <el-breadcrumb-item>用户管理</el-breadcrumb-item>
		  <el-breadcrumb-item>用户列表</el-breadcrumb-item>
		</el-breadcrumb>

		<!-- 卡片视图区域 -->
		<el-card>
		  <!-- 搜索与添加区域 -->
		  <el-row :gutter="20">
		  	<el-col :span="10">
			  <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserList">
			    <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
			  </el-input>
		  	</el-col>
		  	<el-col :span="4">
		  		<el-button type="primary" v-on:click="addDialogVisible=true">添加用户</el-button>
		  	</el-col>
		  </el-row>

		  <!-- 用户列表区域 -->
		  <el-table :data="userlist" stripe>
		  	<el-table-column type="index"></el-table-column>
		  	<el-table-column label="姓名" prop="username"></el-table-column>
		  	<el-table-column label="邮箱" prop="email"></el-table-column>
		  	<el-table-column label="电话" prop="mobile"></el-table-column>
		  	<el-table-column label="角色" prop="role_name"></el-table-column>
		  	<el-table-column label="状态">
		  		<!-- 作用域插槽 -->
		  		<template slot-scope="scope">
		  			<!-- {{scope.row}} -->
		  			<!-- 开关 -->
		  			<el-switch v-model="scope.row.mg_state" @change="userStateChanged(scope.row)">
					</el-switch>
		  		</template>
		  	</el-table-column>

		  	<el-table-column label="操作" width="180px">
		  		<template slot-scope="scope">
					  <el-tooltip effect="dark" content="编辑用户" placement="top" :enterable="false">
					    <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)"></el-button>
					  </el-tooltip>
					  <el-tooltip effect="dark" content="删除用户" placement="top" :enterable="false">
					    <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeUserById(scope.row.id)"></el-button>
					  </el-tooltip>					  
					  <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
					    <el-button type="warning" icon="el-icon-setting" size="mini" @click="setRole(scope.row)"></el-button>
					  </el-tooltip>
		  		</template>
		  	</el-table-column>
		  </el-table>

		  <!-- 分页区域 -->
	  	  <el-pagination
	        @size-change="handleSizeChange"
	        @current-change="handleCurrentChange"
	        :current-page="queryInfo.pagenum"
	        :page-sizes="[1, 2, 5, 10]"
	        :page-size="queryInfo.pagesize"
	        layout="total, sizes, prev, pager, next, jumper"
	        :total="total">
	      </el-pagination>
		</el-card>

		<!-- 添加用户的对话框 -->
		<el-dialog
		  title="添加用户"
		  :visible.sync="addDialogVisible"
		  width="50%"
		   @close="addDialogClosed">
		  <!-- 内容主题区域 -->
		    <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
		      <el-form-item label="用户名" prop="username">
		        <el-input v-model="addForm.username"></el-input>
		      </el-form-item>
		      <el-form-item label="密码" prop="password">
		        <el-input v-model="addForm.password"></el-input>
		      </el-form-item>
		      <el-form-item label="邮箱" prop="email">
		        <el-input v-model="addForm.email"></el-input>
		      </el-form-item>
		      <el-form-item label="手机" prop="mobile">
		        <el-input v-model="addForm.mobile"></el-input>
		      </el-form-item>
		     </el-form>

		  <template #footer>
		    <span class="dialog-footer">
		      <el-button @click="addDialogVisible = false">取 消</el-button>
		      <el-button type="primary" @click="addUser" >确 定</el-button>
		    </span>
		  </template>
		</el-dialog>


		<!-- 修改用户的对话框 -->
		<el-dialog
		  title="修改用户"
		  :visible.sync="editDialogVisible"
		  width="50%"
		  @close="editDialogClosed">
		  <!-- 内容主题区域 -->
		    <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px">
		      <el-form-item label="用户名" prop="username">
		        <el-input v-model="editForm.username" disabled></el-input>
		      </el-form-item>
		      <el-form-item label="邮箱" prop="email">
		        <el-input v-model="editForm.email"></el-input>
		      </el-form-item>
		      <el-form-item label="手机" prop="mobile">
		        <el-input v-model="editForm.mobile"></el-input>
		      </el-form-item>
		     </el-form>

		  <template #footer>
		    <span class="dialog-footer">
		      <el-button @click="editDialogVisible = false">取 消</el-button>
		      <el-button type="primary" @click="editUserInfo">确 定</el-button>
		    </span>
		  </template>
		</el-dialog>

		<!-- 分配角色的对话框 -->
		<el-dialog
		  title="分配角色"
		  :visible.sync="setRoleDialogVisible"
		  width="50%"
		  @close="setRoleDialogClosed">
		  <div>
		  	<p>当前的用户: {{userInfo.usernam}}</p>
		  	<p>当前的角色: {{userInfo.role_name}}</p>
		  	<p>分配新角色:
	  		  <el-select v-model="selectedRoleId" placeholder="请选择">
			    <el-option
			      v-for="item in rolesList"
			      :key="item.id"
			      :label="item.roleName"
			      :value="item.id">
			    </el-option>
			  </el-select>
		  	</p>
		  </div>
		  <template #footer>
		    <span class="dialog-footer">
		      <el-button @click="setRoleDialogVisible = false">取 消</el-button>
		      <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
		    </span>
		  </template>
		</el-dialog>
	</div>	
</template>


<script>
export default{
	data(){
		// 自定义验证输入邮箱的规则
		var checkEmail = (rule, value, cb) => {
			// 验证邮箱的正则表达式
			const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
			if (regEmail.test(value)) {
				// 合法的邮箱
				return cb()
			}
			cb(new Error('请输入合法的邮箱'))
		}
		// 自定义验证输入手机号的规则
		var checkMobile = (rule, value, cb) => {
			// 验证邮箱的正则表达式
			const regmobile = /^(0|86|17951)?(13[0-9]|15[0123456789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
			if (regmobile.test(value)) {
				// 合法的邮箱
				return cb()
			}
			cb(new Error('请输入合法的手机号'))
		}
		return{
			// 获取用户列表的参数对象
			queryInfo: {
				query: '',
				pagenum: 1,
				pagesize: 2
			},
			userlist: [],
			total: 0,
			// 添加用户对话框的显示与隐藏
			addDialogVisible: false,
			// 添加用户的表单数据
			addForm: {
				username: '',
				password: '',
				email: '',
				mobile: ''
			},
			// 添加表单的验证规则对象
			addFormRules: {
				username:[
					{ required: true, message: '请输入用户名', trigger: 'blur' },
					{ min: 3, max: 10, message: '用户名长度在3~10个字符之间', trigger: 'blur' }
				],
				password: [
					{ required: true, message: '请输入密码', trigger: 'blur' },
					{ min: 6, max: 15, message: '用户名长度在6~15个字符之间', trigger: 'blur' }
				],
				email:[
					{ required: true, message: '请输入邮箱', trigger: 'blur' },
					// 自定义的规则
					{ validator: checkEmail, trigger: 'blur' }
				],
				mobile: [
					{ required: true, message: '请输入手机号', trigger: 'blur' },
					{ validator: checkMobile, trigger: 'blur' }
				]
			},
			// 控制修改用户对话框的显示与隐藏
			editDialogVisible: false,
			// 查询到的用户信息对象
			editForm: {},
			// 修改表单的验证规则
			editFormRules:{
				email:[
					{ required: true, message: '请输入邮箱', trigger: 'blur' },
					// 自定义的规则
					{ validator: checkEmail, trigger: 'blur' }
				],
				mobile: [
					{ required: true, message: '请输入手机号', trigger: 'blur' },
					{ validator: checkMobile, trigger: 'blur' }
				]
			},
			// 控制分配角色对话框的显示与隐藏
			setRoleDialogVisible: false,
			// 需要被分配角色的用户信息
			userInfo: {},
			// 所有角色的数据列表
			rolesList: [],
			// 已经选中的角色id值
			selectedRoleId: ''
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
				return this.$message.error('获取用户列表失败！')
			}
			
			this.userlist = res.data.users
			this.total = res.data.total
		},
		// 监听pagesize改变的事件
		handleSizeChange(newSize){
			// console.log(newSize)
			this.queryInfo.pagesize = newSize
			this.getUserList()
		},
		// 这是监听页码值改变的事件
		handleCurrentChange(newPage){
			// console.log(newPage)
			this.queryInfo.pagenum = newPage
			this.getUserList()
		},

		// 监听switch开关状态的改变
		async userStateChanged(userinfo){
			console.log(userinfo)
			const {data: res} = await this.$http.put(`users/${userinfo.id}/state/${userinfo.mg_state}`)
			if (res.meta.status !== 200){
				userinfo.mg_state = !userinfo.mg_state
				return this.$message.error('更新用户状态失败！')
			}
			this.$message.success('更新用户状态成功！')
		},

		// 监听添加用户对话框的关闭事件
		addDialogClosed(){
			this.$refs.addFormRef.resetFields()
		},

		// 点击按钮，添加新用户
		addUser() {
			this.$refs.addFormRef.validate(async valid => {
				// console.log(valid)
				if (!valid) return
				// 发起添加用户的网络请求
				const {data: res} = await this.$http.post('user', this.addFrom)

				if (res.meta.status !== 201){
					this.$message.error("添加用户失败")
				}
				this.$message.success('添加用户成功')
				// 隐藏添加用户的对话框
				this.addDialogVisible = false
				// 重新获取用户列表数据
				this.getUserList()
			})
		},

		// 展示编辑用户的对话框, id通过scope参数拿来
		async showEditDialog(id){
			// console.log(id)
			const {data: res} = await this.$http.get('users/' + id)
			if(res.meta.status !== 200){
				return this.$message.error("查询用户信息失败！")
			}
			this.editForm = res.data

			this.editDialogVisible = true
		},

		// 监听修改用户对话框的关闭事件,重置验证
		editDialogClosed(){
			this.$refs.editFormRef.resetFields()
		},
		// 修改用户信息并提交
		editUserInfo(){
			// 先进行表单预验证
			this.$refs.editFormRef.validate(async valid => {
				// console.log(valid)
				if(!valid) return 
				// 发起修改用户信息的数据请求
			const {data: res} = await this.$http.put('users/' + this.editForm.id, 
				{
					email: this.editForm.email, 
					mobile: this.editForm.mobile
				})
			if (res.meta.status !== 200){
				return this.$message.error("更新用户信息失败")
			}
			// 关闭对话框
			this.editDialogVisible = false
			// 刷新数据列表
			this.getUserList()
			// 提示修改成功
			this.$message.success('更新用户信息成功！')
			})
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
	        const {data: res} = await this.$http.info('users/' + id)

	        if(res.meta.status !== 200){
	        	return this.$message.error("删除用户失败")
	        }
	        this.$message.success("删除用户成功！")
	        this.getUserList()
		},

		// 展示分配角色的对话框
		async setRole(userInfo){
			this.userInfo = userInfo
			// 展示对话框之前，获取所有角色列表供选择
			const {data: res} = await this.$http.get('roles')
			if (res.meta.status !== 200){
				return this.$message.error('获取角色列表失败')
			}
			this.rolesList = res.data

			this.setRoleDialogVisible = true
		},

		// 点击确定按钮分配角色
		async saveRoleInfo(){
			if(!this.selectedRoleId){
				return this.$message('请选择要分配的角色')
			}
			const {data: res} = await this.$http.put(`users/${this.userInfo.id}/role`, {rid: this.selectedRoleId})
			console.log(res)
			if (res.meta.status !== 200){
				return this.$message.error('更新角色失败！')
			}
			this.$message.success("更新角色成功")
			this.getUserList()
			this.setRoleDialogVisible = false
		},
		// 监听分配角色对话框的关闭事件
		setRoleDialogClosed(){
			this.selectedRoleId = ''
			this.userInfo = {}
		}
	}
}
</script>



<style>
	
</style>