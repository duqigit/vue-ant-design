<template>
  <div id="app">
    <a-table :columns="columns" :data-source="data">
      <span slot="type" slot-scope="type">
        {{ type | type_required }}
      </span>
      <span slot="required" slot-scope="required">
        {{ required | filters_required }}
      </span>
      <span slot="remark" slot-scope="remark">
        {{ remark }}
      </span>
      <span
        slot="action"
        slot-scope="action"
        @click="open(action.key, action.type)"
      >
        <a>操作</a>
      </span>
    </a-table>
    <!-- 弹框 -->
    <a-modal
      title="Title"
      :visible="visible"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <a-form :form="form">
        <a-form-item
          :label-col="formItemLayout.labelCol"
          :wrapper-col="formItemLayout.wrapperCol"
          label="字段名称"
        >
          <a-input
            v-decorator="[
              'title',
              {
                // initialValue: formData.title,
                rules: [{ required: true, message: '请输入名称' }],
              },
            ]"
            placeholder="请输入字段名称"
          />
        </a-form-item>
        <a-form-item
          :label-col="formItemLayout.labelCol"
          :wrapper-col="formItemLayout.wrapperCol"
          label="请选择字段类型"
        >
          <a-select
            v-decorator="[
              'type',
              {
                // initialValue: formData.type,
                rules: [{ required: true, message: '请选择类型' }],
              },
            ]"
            @change="selectOption"
            style="width: 120px"
          >
            <a-select-option
              v-for="item in items"
              :key="item.value"
              :value="item.value"
            >
              {{ item.title }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <!-- 选择日期类型 -->
        <a-form-item
          v-show="formData.type === 2"
          :label-col="formItemLayout.labelCol"
          :wrapper-col="formItemLayout.wrapperCol"
          label="请选择日期类型"
        >
          <a-radio-group
            v-decorator="[
              'remark',
              {
                // initialValue: formData.remark,
                rules: [{ required: true, message: '请选择类型' }],
              },
            ]"
          >
            <a-radio :style="radioStyle" value="年">年</a-radio>
            <a-radio :style="radioStyle" value="年-月"> 年-月 </a-radio>
            <a-radio :style="radioStyle" value="年-月-日"> 年-月-日 </a-radio>
            <a-radio :style="radioStyle" value="年-月-日-时-分">
              年-月-日 时：分
            </a-radio>
          </a-radio-group>
        </a-form-item>
        <!-- 下拉框类型 -->
        <a-form-item
          v-show="formData.type === 3"
          :label-col="formItemLayout.labelCol"
          :wrapper-col="formItemLayout.wrapperCol"
          label="请操作下拉框"
        >
          <a-select
            class="select-dropdown"
            v-decorator="[
              'remark',
              {
                // initialValue: formData.remark,
                rules: [{ required: true, message: '请选择类型' }],
              },
            ]"
            style="width: 120px"
          >
            <div slot="dropdownRender" slot-scope="menu">
              <v-nodes :vnodes="menu" />
              <a-divider style="margin: 4px 0" />
              <div
                style="padding: 4px 8px; cursor: pointer"
                @mousedown="(e) => e.preventDefault()"
                @click="addItem"
              >
                <a-icon type="plus" /> Add item
              </div>
            </div>
            <a-select-option
              v-for="(item, index) in itemsOption"
              :key="item"
              :value="item"
            >
              {{ item }}
              <a-icon
                class="icon-delete"
                @click.stop="deleet($event, index)"
                type="delete"
              />
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item
          :label-col="formItemLayout.labelCol"
          :wrapper-col="formItemLayout.wrapperCol"
          label="请选择字段是否必填"
        >
          <a-radio-group
            v-decorator="[
              'required',
              {
                // initialValue: formData.required,
                rules: [{ required: true, message: '请选择是否必选' }],
              },
            ]"
          >
            <a-radio :style="radioStyle" :value="1"> 是 </a-radio>
            <a-radio :style="radioStyle" :value="0"> 否 </a-radio>
          </a-radio-group>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>
<script>
const columns = [
  {
    title: "字段名称",
    dataIndex: "data_name",
    key: "data_name",
    slots: { title: "customTitle" },
    scopedSlots: { customRender: "name" },
  },
  {
    title: "字段类型",
    dataIndex: "data_type",
    key: "data_type",
    scopedSlots: { customRender: "type" },
  },
  {
    title: "是否必填",
    dataIndex: "data_required",
    key: "data_required",
    scopedSlots: { customRender: "required" },
  },
  {
    title: "字段选项",
    key: "data_remark",
    dataIndex: "data_remark",
    scopedSlots: { customRender: "remark" },
  },
  {
    title: "操作",
    key: "action",
    scopedSlots: { customRender: "action" },
  },
];

const data = [
  {
    key: 0,
    data_name: "字段一",
    data_type: 1,
    data_required: 1,
    data_remark: "无",
  },
  {
    key: 1,
    data_name: "字段二",
    data_type: 2,
    data_required: 0,
    data_remark: "年",
  },
  {
    key: 2,
    data_name: "字段三",
    data_type: 3,
    data_required: 0,
    data_remark: "选项1",
  },
];
const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 6 },
};
const formTailLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 8 },
};
export default {
  data() {
    return {
      data,
      columns,
      visible: false,
      checkNick: false,
      formItemLayout,
      formTailLayout,
      form: this.$form.createForm(this, { name: "dynamic_rule" }),
      formData: {
        title: "",
        type: 0,
        required: 0,
        remark: "无",
      },
      items: [
        {
          value: 1,
          title: "单行文本",
        },
        {
          value: 2,
          title: "日期",
        },
        {
          value: 3,
          title: "单选下拉",
        },
      ],
      itemsOption: ["示例1", "示例2"],
      currIndex: 0,
      radioStyle: {
        display: "block",
        height: "30px",
        lineHeight: "30px",
      },
    };
  },
  components: {
    VNodes: {
      functional: true,
      render: (h, ctx) => ctx.props.vnodes,
    },
  },
  // 定义组件过滤器
  filters: {
    // 字段类型过滤器
    type_required(val) {
      switch (val) {
        case 1:
          return "单行文本";
        case 2:
          return "日期";
        case 3:
          return "单选下拉";
      }
    },
    // 是否必填字段过滤器
    filters_required(val) {
      switch (val) {
        case 1:
          return "是";
        case 0:
          return "否";
      }
    },
  },
  methods: {
    // 打开弹框
    open(index, type) {
      this.visible = true;
      this.currIndex = index;
      // 判断是日期类型还是单选类型，还是文本
      let remark;
      if (type === 1) {
        remark = "无";
      } else if (type === 2) {
        remark = this.data[index].data_remark;
      } else {
        let arr = this.data[index].data_remark.split(",");
        remark = arr[0];
      }
      this.$nextTick(() => {
        this.form.setFieldsValue({
          title: this.data[index].data_name,
          type: this.data[index].data_type,
          required: this.data[index].data_required,
          remark: remark,
        });
        this.formData.type = this.data[index].data_type;
      });
    },
    // 确认弹框
    handleOk() {
      this.form.validateFields((err, value) => {
        if (!err) {
          this.visible = false;
          this.data[this.currIndex].data_name = value.title;
          this.data[this.currIndex].data_type = value.type;
          this.data[this.currIndex].data_required = value.required;
          this.data[this.currIndex].data_remark = value.remark;
        }
      });
    },
    // 取消弹框
    handleCancel() {
      this.visible = false;
    },
    // 增加一个单选框
    addItem() {
      // 生成10~100的随机数
      let index = this.Torandom(10, 100);
      this.itemsOption.push(`示例 ${index++}`);
    },
    // 字段类型切换
    selectOption(value) {
      let remark;
      if (value === 1) {
        remark = "无";
      } else if (value === 2) {
        remark = "年";
      } else if (value === 3) {
        remark = this.itemsOption[0];
      }
      this.form.setFieldsValue({
        remark: remark,
      });
      this.formData.type = value;
    },
    // 生成随机数方法
    Torandom(min, max) {
      return Math.floor(Math.random() * (max - min)) + min;
    },
    // 删除下拉单选条目
    deleet(e, index) {
      this.itemsOption.splice(index, 1);
    },
  },
};
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
.icon-delete {
  float: right;
}
.select-dropdown .icon-delete {
  display: none;
}
</style>
