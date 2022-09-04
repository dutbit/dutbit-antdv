<template>
  <div style="container">
    <h1 style="margin-bottom: 20px; padding: 10px; text-align: center">报名页面</h1>
    <a-form
      :model="signupForm"
      @finish="submit"
      ref="formRef"
      name="signup"
      :label-col="{ span: 8 }"
      :wrapper-col="{ span: 8 }"
      autocomplete="off"
    >
      <a-form-item label="学号" name="stuId" :rules="[{ required: true, validator: validateStuId }]">
        <a-input v-model:value="signupForm.stuId" />
      </a-form-item>
      <a-form-item label="姓名" name="name" :rules="[{ required: true, message: '请输入姓名' }]">
        <a-input v-model:value="signupForm.name" />
      </a-form-item>
      <a-form-item label="性别" name="sex" :rules="[{ required: true, message: '请选择性别' }]">
        <a-radio-group v-model:value="signupForm.sex">
          <a-radio value="male">男</a-radio>
          <a-radio value="female">女</a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item label="学院" name="faculty" :rules="[{ required: true, message: '请选择学部/学院' }]">
        <a-select v-model:value="signupForm.faculty">
          <a-select-option value="电子信息与电气工程学部">电子信息与电气工程学部</a-select-option>
          <a-select-option value="建设工程学部">建设工程学部</a-select-option>
          <a-select-option value="人文与社会科学学部">人文与社会科学学部</a-select-option>
          <a-select-option value="运载工程与力学学部">运载工程与力学学部</a-select-option>
          <a-select-option value="材料科学与工程学院">材料科学与工程学院</a-select-option>
          <a-select-option value="光电工程与仪器科学学院">光电工程与仪器科学学院</a-select-option>
          <a-select-option value="化工学院">化工学院</a-select-option>
          <a-select-option value="环境学院">环境学院</a-select-option>
          <a-select-option value="机械工程学院">机械工程学院</a-select-option>
          <a-select-option value="建筑与艺术学院">建筑与艺术学院</a-select-option>
          <a-select-option value="经济管理学院">经济管理学院</a-select-option>
          <a-select-option value="能源与动力学院">能源与动力学院</a-select-option>
          <a-select-option value="生物工程学院">生物工程学院</a-select-option>
          <a-select-option value="数学科学学院">数学科学学院</a-select-option>
          <a-select-option value="外国语学院">外国语学院</a-select-option>
          <a-select-option value="物理学院">物理学院</a-select-option>
          <a-select-option value="张大煜学院">张大煜学院</a-select-option>
          <a-select-option value="大连理工大学白俄罗斯国立大学联合学院">
            大连理工大学白俄罗斯国立大学联合学院
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="第一志愿" name="firstChoice">
        <a-select v-model:value="signupForm.firstChoice">
          <a-select-option v-for="(item, index) in enrollDepts" :key="index" :value="item">{{ item }}</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="第二志愿" name="secondChoice">
        <a-select v-model:value="signupForm.secondChoice" :disabled="!signupForm.firstChoice">
          <a-select-option value=""></a-select-option>
          <a-select-option v-for="(item, index) in enrollDepts" :key="index" :value="item">{{ item }}</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="服从调剂" name="allowAdjust">
        <a-checkbox v-model:checked="signupForm.allowAdjust">是</a-checkbox>
      </a-form-item>
      <a-form-item label="手机" name="tel" :rules="[{ required: true, validator: validateTel }]">
        <a-input v-model:value="signupForm.tel" />
      </a-form-item>
      <a-form-item label="邮箱" name="email" :rules="[{ required: true, validator: validateEmail }]">
        <a-input v-model:value="signupForm.email" />
      </a-form-item>
      <a-form-item label="特长" name="speciality">
        <a-input v-model:value="signupForm.speciality" />
      </a-form-item>
      <a-form-item label="学生工作经历" name="details">
        <a-textarea v-model:value="signupForm.details" />
      </a-form-item>
      <a-form-item :wrapperCol="{ offset: 8, span: 8 }">
        <a-button type="primary" htmlType="submit">提交</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
import { defineComponent, reactive, ref } from 'vue'
import { notification } from 'ant-design-vue'
import axios from 'axios'
export default defineComponent({
  components: {},
  setup() {
    let signupForm = reactive({
      stuId: '',
      name: '',
      sex: '',
      faculty: '',
      firstChoice: '',
      secondChoice: '',
      allowAdjust: true,
      tel: '',
      email: '',
      speciality: '',
      details: '',
    })
    // 添加检验规则
    let validateStuId = async (_rule, value) => {
      const reg = /^\d{8,}$/
      // 若使用 RegExp 应注意正则表达字符串的转义问题！
      if(reg.test(value)) {
        return Promise.resolve()
      } else {
        return Promise.reject('请输入正确的学号')
      }
    }
    let validateTel = async (_rule, value) => {
      const reg = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/
      if(reg.test(value)) {
        return Promise.resolve()
      } else {
        return Promise.reject('请输入正确的手机号')
      }
    }
    let validateEmail = async (_rule, value) => {
      const reg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
      if(reg.test(value)) {
        return Promise.resolve()
      } else {
        return Promise.reject('请输入正确的邮箱')
      }
    }
    // 获取EnrollDepts
    let enrollDepts = reactive([])
    axios
      .get('/enroll/')
      .then((response) => {
        enrollDepts = response.data.enrollDepts
        Object.assign(enrollDepts, response.data.enrollDepts)
        // 使用assign以确保数据的响应式
        // https://blog.csdn.net/weixin_43778556/article/details/124096939
      })
      .catch(() => {
        notification.error({ message: '出错啦', description: '请联系管理员' })
      })

    // Submit
    const submit = () => {
      if (!signupForm.firstChoice) {
        notification.error({ message: '表单错误', description: '至少选择一个志愿' })
        return
      }
      let signupFormData = {
        stu_id: signupForm.stuId,
        name: signupForm.name,
        sex: signupForm.sex,
        faculty: signupForm.faculty,
        first_choice: signupForm.firstChoice,
        second_choice: signupForm.secondChoice,
        allow_adjust: signupForm.allowAdjust,
        tel: signupForm.tel,
        email: signupForm.email,
        speciality: signupForm.speciality,
        details: signupForm.details,
      }
      axios
        .post('/enroll/', signupFormData)
        .then((response) => {
          if (response.data.success) {
            notification.success({ message: '提示', description: '已提交报名表' })
          }
        })
        .catch(() => {
          notification.error({ message: '出错啦', description: '无法提交表单，请联系管理员' })
        })
    }
    return { signupForm, validateStuId, validateTel, validateEmail, enrollDepts, submit }
  },
  mounted() {},
})
</script>

<style scoped></style>
