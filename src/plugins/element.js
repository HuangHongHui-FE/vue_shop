import Vue from 'vue'
import { 
	Button,
	Form, 
	FormItem, 
	Input, 
	Message, 
	Container, 
	Header, 
	Aside, 
	Main, 
	Menu, 
	Submenu, 
	MenuItem, 
	Breadcrumb, 
	BreadcrumbItem,
	Card,
	Row,
	Col,
	Table,
	TableColumn,
	Switch,
	Tooltip,
	Pagination,
	Dialog,
	MessageBox,
	Tag,
	Tree,
	Select,
	Option
} from 'element-ui'

// 注册为全局可用的组件
Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Submenu)
Vue.use(MenuItem)
Vue.use(Menu)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Row)
Vue.use(Col)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Switch)
Vue.use(Tooltip)
Vue.use(Pagination)
Vue.use(Dialog)
Vue.use(Tag)
Vue.use(Tree)
Vue.use(Select)
Vue.use(Option)


// message需要进行全局挂载才能this.使用
Vue.prototype.$message = Message  /*挂载到了vue的原型对象上*/
Vue.prototype.$confirm = MessageBox.confirm
