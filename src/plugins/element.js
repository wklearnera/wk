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
    MenuItemGroup,
    MenuItem,
    Tooltip,
    MessageBox,
    Breadcrumb,
    BreadcrumbItem,
    Card,
    Pagination,
    Tag,
    Tree,
    Row,
    Col,
    Table,
    TableColumn,
    Switch,
    Dialog,
    Popover,
    Select,
    Step,
    Option,
    Alert,
    Steps,
    Tabs,
    TabPane,
    Cascader,
    Checkbox,
    CheckboxGroup,
    Upload
} from 'element-ui'

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItemGroup)
Vue.use(MenuItem)
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
Vue.use(Popover)
Vue.use(Tag)
Vue.use(Tree)
Vue.use(Select)
Vue.use(Option)
Vue.use(Alert)
Vue.use(Steps)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Cascader)
Vue.use(Checkbox)
Vue.use(CheckboxGroup)
Vue.use(Upload)
Vue.use(Step)



// 把弹框组件挂载到vue的原型对象上 只要访问到$message就可以访问到message组件
Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm