<template>
  <div class="update-name">
    <van-nav-bar
      title="设置昵称"
      left-text="取消"
      right-text="确定"
      @click-left="$emit('close')"
      @click-right="onConfirm"
    />
    <van-field
      class="filed-wrap"
      v-model.trim="localName"
      rows="2"
      autosize
      type="textarea"
      maxlength="7"
      placeholder="请输入昵称"
      show-word-limit
    />
  </div>
</template>

<script>
import { updateUserProfile } from '@/api/user'
export default {
  // 组件名称
  name: 'UpdateName',
  // 组件参数 接收来自父组件的数据
  // value和v-model中的value进行双向数据绑定
  props: {
    value: {
      type: String,
      required: true
    }
  },
  // 局部注册的组件
  components: {},
  // 组件状态值
  data () {
    return {
      localName: this.value
    }
  },
  // 计算属性
  computed: {},
  // 侦听器
  watch: {},
  // 组件方法
  methods: {
    //   1.更新之后的上传
    async onConfirm () {
      this.$toast.loading({
        duration: 0, // 持续展示 toast
        forbidClick: true,
        message: '保存中'
      })
      try {
        if (!this.localName.length) {
          return this.$toast('内容不能为空')
        }
        await updateUserProfile({
          name: this.localName
        })
        // 1.1 改变视图
        this.$emit('input', this.localName)
        // 1.2.关闭弹层
        this.$emit('close')
      } catch (err) {
        if (err.response && err.response.status === 409) {
          this.$toast('用户名已存在')
        } else {
          this.$toast('更新失败，请重试')
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
.filed-wrap {
  padding: 20px;
}
</style>
