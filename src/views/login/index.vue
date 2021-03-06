<template>
  <div class="login-container">
    <van-nav-bar class="page-nav-bar" title="登录" >
      <van-icon slot="left" name="arrow-left" @click="$router.back()"/>
    </van-nav-bar>
    <!-- 表单验证
    用vant组件配置校验规则
    表单提交的时候会触发onsubmit事件
    验证通过的时候，会触发onsubmit
    验证失败的时候，就不会触发onsubmit事件
     -->
    <!-- 表单提交 -->
    <van-form @submit="onSubmit" ref="loginForm">
      <van-field
        name="mobile"
        v-model="user.mobile"
        placeholder="请输入手机号"
        :rules="userFormRules.mobile"
        type="number"
        maxlength="11"
      >
        <i slot="left-icon" class="toutiao toutiao-shouji"></i>
      </van-field>
      <van-field
        v-model="user.code"
        name="code"
        placeholder="请输入验证码"
        :rules="userFormRules.code"
        type="number"
        maxlength="6"
      >
        <i slot="left-icon" class="toutiao toutiao-yanzhengma"></i>
        <template #button>
          <van-count-down
            :time="1000 * 60"
            format="ss s"
            v-if="isCountShow"
            @finish="isCountShow = false"
          />
          <van-button
            v-else
            class="send-sms-btn"
            round
            size="small"
            type="default"
            @click="onSendSms"
            >发送验证码</van-button
          >
        </template>
      </van-field>
      <div class="login-btn-wrap">
        <van-button class="login-btn" block type="info" native-type="submit"
          >登录</van-button
        >
      </div>
    </van-form>
  </div>
</template>

<script>
import { login, sendSms } from '@/api/user'
export default {
  // 组件名称
  name: '',
  // 组件参数 接收来自父组件的数据
  props: {},
  // 局部注册的组件
  components: {},
  // 组件状态值
  data () {
    return {
      user: {
        mobile: '13911111111',
        code: '246810'
      },
      userFormRules: {
        mobile: [
          { required: true, message: '手机号不能为空' },
          { pattern: /^1[3|5|7|8]\d{9}$/, message: '手机号格式错误' }
        ],
        code: [
          { required: true, message: '验证码不能为空' },
          { pattern: /^\d{6}$/, message: '验证码格式错误' }
        ]
      },
      isCountShow: false
    }
  },
  // 计算属性
  computed: {},
  // 侦听器
  watch: {},
  // 组件方法
  methods: {
    //   1.表单提交
    async onSubmit () {
      this.$toast.loading({
        duration: 0, // 如果为0持续展示 toast
        forbidClick: true,
        message: '登陆中'
      })
      //   console.log("submit", values);
      try {
        const { data } = await login(this.user)
        // console.log("登陆成功", res);

        // 1.1登陆成功后把token存储到state容器中
        this.$store.commit('setUser', data.data)
        this.$toast.success('登陆成功')
        //  1.2登陆成功。跳转回原来的页面
        this.$router.back()
      } catch (err) {
        if (err.response.status === 400) {
          this.$toast.fail('手机号或者验证码错误')
        } else {
          this.$toast.fail('登陆失败，请稍后重试')
        }
      }
    },
    // 2.校验手机号之后发送验证码
    async onSendSms () {
      try {
        //  成功的代码
        await this.$refs.loginForm.validate('mobile')
      } catch (err) {
        return console.log('验证失败', err)
      }
      // 2.1 验证之后显示验证码
      this.isCountShow = true
      // 2.2验证成功发送验证码的请求
      try {
        await sendSms(this.user.mobile)
        this.$toast('发送成功')
      } catch (err) {
        // 发送失败，关闭倒计时
        this.isCountShow = false
        if (err.response.status === 429) {
          this.$toast('操作频繁，稍后重试')
        } else {
          this.$toast('发送失败，请重试')
        }
      }
    }
  },
  // 以下是生命周期钩子   注：没用到的钩子请自行删除
  /**
   * 组件实例创建完成，属性已绑定，但DOM还未生成，$ el属性还不存在
   */
  created () {},
  /**
   * el 被新创建的 vm.$ el 替换，并挂载到实例上去之后调用该钩子。
   * 如果 root 实例挂载了一个文档内元素，当 mounted 被调用时 vm.$ el 也在文档内。
   */
  mounted () {}
}
</script>

<style scoped lang="less">
.login-container {
  .toutiao {
    font-size: 37px;
  }
  .send-sms-btn {
    background-color: #ededed;
    // width: 152px;
    height: 46px;
    line-height: 46px;
    font-size: 22px;
    color: #666;
  }
  .login-btn-wrap {
    padding: 53px 33px;
    .login-btn {
      background-color: #6db4fb;
      border: none;
    }
  }
}
</style>
