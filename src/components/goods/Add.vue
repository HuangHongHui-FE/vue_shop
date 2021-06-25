<template>
	<div>
		<!-- 面包屑导航区域 -->
		<el-breadcrumb separator-class="el-icon-arrow-right">
		  <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
		  <el-breadcrumb-item>商品管理</el-breadcrumb-item>
		  <el-breadcrumb-item>添加商品</el-breadcrumb-item>
		</el-breadcrumb>

		<!-- 卡片视图区域 -->
		<el-card>

			<!-- 提示区域 -->
			<el-alert title="添加商品信息" type="info" center show-icon :closable="false"></el-alert>

			<!-- 步骤条区域 --><!-- 字符串减0，可将字符串变数字 -->
			<el-steps :space="200" :active="activeIndex - 0" finish-status="success" align-center>
			  <el-step title="基本信息"></el-step>
			  <el-step title="商品参数"></el-step>
			  <el-step title="商品属性"></el-step>
			  <el-step title="商品图片"></el-step>
			  <el-step title="商品内容"></el-step>
			  <el-step title="完成"></el-step>
			</el-steps>

			<!-- form表单 -->
			<el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px" label-position="top">
				<!-- tabs区域 left  before-leave-->
				<el-tabs :tab-position="'left'" v-model="activeIndex" :before-leave="beforeTabLeave" @tab-click="tabClicked">

			      <el-tab-pane label="基本信息" name="0">
			      	<el-form-item label="商品名称" prop="goods_name">
			      		<el-input v-model="addForm.goods_name"></el-input>
			      	</el-form-item>
			      	<el-form-item label="商品价格" prop="goods_price">
			      		<el-input v-model="addForm.goods_price" type="number"></el-input>
			      	</el-form-item>
			      	<el-form-item label="商品重量" prop="goods_weight">
			      		<el-input v-model="addForm.goods_weight" type="number"></el-input>
			      	</el-form-item>
			      	<el-form-item label="商品数量" prop="goods_number">
			      		<el-input v-model="addForm.goods_number" type="number"></el-input>
			      	</el-form-item>
			      	<el-form-item label="商品分类" prop="goods_cat">
			      		<el-cascader v-model="addForm.goods_cat" :options="catelist" :props="cateProps" @change="handleChange">
						    	
						</el-cascader>
			      	</el-form-item>
			      </el-tab-pane>

			      <el-tab-pane label="商品参数" name="1">
			      	<!-- 渲染表单的item项 -->
			      	<el-form-item :label="item.attr_name" v-for="item in manyTableDate" :key="item.attr_id">
			      		<!-- 复选框组 -->
			      		<el-checkbox-group v-model="item.attr_vals">
						    <el-checkbox :label="cb" v-for="(cb, i) in item.attr_vals" :key="i" border></el-checkbox>
						</el-checkbox-group>
			      	</el-form-item>
			      </el-tab-pane>
			      
			      <el-tab-pane label="商品属性" name="2">
			      	<el-form-item :label="item.attr_name" v-for="item in onlyTableData" :key="item.attr_id">
			      		<el-input v-model="item.attr_vals"></el-input>
			      	</el-form-item>
			      </el-tab-pane>
			      
			      <el-tab-pane label="商品图片" name="3">
			      	<!-- action: 后台api地址 -->
			      	<el-upload
					  :action="uploadURL"
					  :on-preview="handlePreview"
					  :on-remove="handleRemove"
					  list-type="picture"
					  :headers="headersObj"
					  :on-success="handleSuccess">
					  <el-button size="small" type="primary">点击上传</el-button>
					</el-upload>
			      </el-tab-pane>
			      
			      <el-tab-pane label="商品内容" name="4">
			      	<!-- 富文本编辑器组件 -->
			      	<quill-editor v-model="addForm.goods_introduce"></quill-editor>
			      	<!-- 添加商品的按钮 -->
			      	<el-button type="primary" class="btnAdd" @click="add">添加商品</el-button>
			  	  </el-tab-pane>
			    </el-tabs>
			</el-form>
		</el-card>

		<!-- 图片预览的dialog对话框 -->
		<el-dialog
		  title="图片预览"
		  :visible.sync="previewVisible"
		  width="30%">
		  <img :src="previewPath" class="previewImg">

		</el-dialog>
	</div>
</template>



<script>
	// 用来进行深拷贝
	import _ from 'lodash'

	export default {
		data(){
			return {
				// 默认步骤条的步数
				activeIndex: '0',
				// 添加商品的表单数据对象
				addForm: {
					goods_name: '',
					goods_price: 0,
					goods_weight: 0,
					goods_number: 0,
					// 商品所属的分类数组
					goods_cat: [],
					// 图片的数组
					pics: [],
					// 商品的介绍
					goods_introduce: '',
					// 用来存参数
					attrs: []
				},
				// 表单校验规则
				addFormRules: {
					goods_name: [{required: true, message: '请输入商品名称', trigger: 'blur'}],
					goods_price: [{required: true, message: '请输入商品价格', trigger: 'blur'}],
					goods_weight: [{required: true, message: '请输入商品重量', trigger: 'blur'}],
					goods_number: [{required: true, message: '请输入商品数量', trigger: 'blur'}],
					goods_cat: [{required: true, message: '请选择商品分类', trigger: 'blur'}]
				},
				// 商品分类列表
				catelist: [],
				// 级联选择器的配置项
				cateProps: {
					label: 'cat_name',
					value: 'cat_id',
					children: 'children',
					expandTrigger: 'hover'
				},
				// 动态参数列表
				manyTableDate: [],
				// 静态属性列表数据
				onlyTableData: [],

				// 上传图片的url地址
				uploadURL: "http://127.0.0.1:8888/api/private/v1/upload",
				// 图片上传组件的headers请求头对象
				headersObj: {
					Authorization: window.sessionStorage.getItem('token')
				},
				// 预览图片的路径
				previewPath: '',
				previewVisible: false

			}
		},


		created(){
			this.getCateList()
		},


		methods: {
			// 获取商品分类列表
			async getCateList(){
				const {data: res}  = await this.$http.get(`categories`)

				if(res.meta.status !== 200) {
					return this.$message.error('获取商品分类数据失败！')
				}
				
				this.catelist = res.data
				console.log(this.catelist)
				
			},
			// 级联选择器分类改变时
			handleChange(){
				console.log(this.addForm.goods_cat)
			},
			// tab切换之前的校验
			beforeTabLeave(activeName, oldActiveName){
				// console.log(activeName)
				// return false
				if (oldActiveName === '0' && this.addForm.goods_cat.length !== 3){
					this.$message.error('请先选择商品分类！')
					return false
				}

			},
			// tabClicked:点tab切换触发
			async tabClicked(){
				// console.log(this.activeIndex)
				if (this.activeIndex === '1') {
					// this.$http.get(`categories/${this.addForm.goods_cat[2]}/attributes`)
					const {data: res} = await this.$http.get(`categories/${this.cateId}/attributes`, 
					{
						params: { sel: 'many' }
					})

					if (res.meta.status !== 200) {
						return this.$message.error('获取动态参数列表失败！')
					}
					console.log(res.data)
					// 将attr_vals变成对象
					res.data.forEach(item => {
						item.attr_vals = item.attr_vals.length === 0 ? [] : item.attr_vals.split(' ')
					})
					console.log(res.data)
					this.manyTableDate = res.data
				}else if(this.activeIndex === "2"){
					const {data: res} = await this.$http.get(`categories/${this.cateId}/attributes`, 
					{
						params: { sel: 'only' }
					})

					if (res.meta.status !== 200) {
						return this.$message.error('获取静态参数列表失败！')
					}
					// console.log(res.data)
					this.onlyTableData = res.data
				}
			},

			// 处理图片预览效果
			handlePreview(file){
				console.log(file)
				this.previewPath = file.response.data.url

				this.previewVisible = true
			},
			// 处理移除图片的操作
			handleRemove(file){
				const filePath = file.response.data.tmp_path
				const i = this.addForm.pics.findIndex(x => x.pic === filePath)
				this.addForm.pics.splice(i, 1)
			},
			// 监听图片上传成功的事件
			handleSuccess(response, file, fileList){
				console.log(response)
				// console.log(file)
				// console.log(fileList)
				const picInfo = { pic: response.data.tmp_path }
				this.addForm.pics.push(picInfo)
				console.log(this.addForm)
			},

			// 添加商品
			add(){
				this.$refs.addFormRef.validate(async valid => {
					if(!valid) {
						return this.$message.error('请填写必要的表单项！')
					}
					// 执行添加商品的业务逻辑
					// 使用 lodash   的cloneDeep(obj)函数  进行深拷贝 从而不影响原先的数据
					// 对goods_cat进行提交前的数据处理
					const form = _.cloneDeep(this.addForm)
					form.goods_cat = form.goods_cat.join(',')

					// 对attrs提交前数据处理
						//动态参数
					this.manyTableDate.forEach(item => {
						const newInfo = {
							attr_id: item.attr_id,
							attr_value: item.attr_vals.join(" ")  // 将数组转化为字符串
						}
						this.addForm.attrs.push(newInfo)
					})
						// 静态属性
					this.onlyTableData.forEach(item => {
						const newInfo = {
							attr_id: item.attr_id, 
							attr_value: item.attr_vals
						}
						this.addForm.attrs.push(newInfo)
					})

					form.attrs = this.addForm.attrs
					console.log(form)

					// 发起请求添加商品
					const {data: res} = await this.$http.post('goods', form)
					if (res.meta.status !== 201){
						return this.$message.error('添加商品失败！')
					}
					this.$message.success('添加商品成功！')
					this.$router.push('/goods')
				})
			}
		},


		computed: {
			cateId(){
				if (this.addForm.goods_cat.length === 3){
					return this.addForm.goods_cat[2]
				}
				return null
			}
		}
	}
</script>


<style lang="less" scoped>
	.previewImg{
		width: 100%;
	}
</style>