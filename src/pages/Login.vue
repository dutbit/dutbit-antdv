<template>
  <div class="container">
    <div style="text-align: center; margin-top: 20px">
      <img src="https://static.dutbit.com/img/dutbit-png.png" />
      <p style="margin-top: 20px; font-size: 20px"><strong>登陆DUTBIT</strong></p>
    </div>
    <a-form ref="formRef" name="custom-validation" :model="form" style="width: 30%">
      <a-form-item has-feedback name="email">
        <a-input v-model:value="form.email" size="large" placeholder="邮箱地址" />
      </a-form-item>
      <a-form-item has-feedback name="password">
        <a-input v-model:value="form.password" size="large" placeholder="密码" type="password" />
      </a-form-item>
      <a-form-item>
        <a-button type="primary" size="large" block @click="onLogin">登录</a-button>
      </a-form-item>
      <a-form-item>
        <a-button type="primary" size="large" block @click="isSwReg = true">注册</a-button>
      </a-form-item>
    </a-form>
    <a-modal
      v-model:visible="isSwReg"
      title="Title"
      :confirm-loading="isReging"
      ok-text="提交注册"
      cancel-text="关闭"
      @ok="onReg"
    >
      <a-form ref="formRef2" name="custom-validation" :model="formReg">
        <a-form-item has-feedback name="email">
          <a-input v-model:value="formReg.email" size="large" placeholder="邮箱地址" />
        </a-form-item>
        <a-form-item has-feedback name="name">
          <a-input v-model:value="formReg.username" size="large" placeholder="用户名" />
        </a-form-item>
        <a-form-item has-feedback name="password">
          <a-input v-model:value="formReg.password" size="large" placeholder="密码" type="password" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
import { notification } from 'ant-design-vue'
import SHA512 from 'crypto-js/sha512'
export default {
  components: {},
  data() {
    return {
      isSwReg: false,
      isReging: false,
      form: { email: '', password: '' },
      formReg: { email: '', username: '', password: '' },
      layout: { labelCol: { span: 5 }, wrapperCol: { span: 14 } },
    }
  },
  inject: [],
  computed: {},
  methods: {
    onLogin() {
      let payload = Object.assign({}, this.form)
      console.log(payload)
      if (!this.validateEmail(payload.email)) {
        notification.error({ message: '错误:', description: '邮箱格式不正确' })
        return
      }
      payload.password = SHA512(payload.password).toString()
      console.log(payload.password)
      this.$http.post('/login', payload).then((res) => {
        console.log(res)
        if (res.data.success === true) {
          window.localStorage.setItem('Authorization', res.data.token)
          setTimeout(() => {
            this.$router.push('/func')
          }, 1000)
        } else notification.error({ message: '错误:', description: res.data.details })
      })
    },
    onReg() {
      // console.log(values, this.form)
      let payload = Object.assign({}, this.formReg)
      if (!this.validateEmail(payload.email)) {
        notification.error({ message: '错误:', description: '邮箱格式不正确' })
        return
      }
      payload.password = SHA512(payload.password).toString()
      console.log(payload.password)
      this.$http.post('register', payload).then((res) => {
        console.log(res)
        if (res.data.success === true) {
          this.form.email = this.formReg.email
          notification.success({ message: '注册成功:', description: res.data })
        } else notification.error({ message: '错误:', description: res.data.details })
      })
    },
    validateEmail(email) {
      let reg = /^\w+(?:\.\w+)*@\w+(?:\.\w+)+$/
      //if(reg.test(email)){return true}else{return false}
      return reg.test(email)
    },
  },
  provide() {
    return {}
  },
  mounted() {},
}
</script>

<style scoped>
</style>