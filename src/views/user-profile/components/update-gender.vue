<template>
  <div class="update-gender">
    <van-picker
      title="性别"
      show-toolbar
      :columns="columns"
      :default-index="localGender"
      @confirm="onConfirm"
      @change="onChange"
      @cancel="$emit('close')"
    />
  </div>
</template>

<script>
import { updateUserProfile } from '@/api/user'
export default {
  // 组件名称
  name: '',
  // 组件参数 接收来自父组件的数据
  props: {
    value: {
      type: Number,
      required: true
    }
  },
  // 局部注册的组件
  components: {},
  // 组件状态值
  data () {
    return {
      columns: ['男', '女'],
      localGender: this.value
    }
  },
  // 计算属性
  computed: {},
  // 侦听器
  watch: {},
  // 组件方法
  methods: {
    async onConfirm () {
      this.$toast.loading({
        duration: 0, // 持续展示 toast
        forbidClick: true,
        message: '保存中'
      })
      //  this.$toast(`当前值：${value}, 当前索引：${index}`);
      try {
        await updateUserProfile({
          gender: this.localGender
        })
        //   更新试图
        this.$emit('input', this.localGender)
        // 关闭弹层
        this.$emit('close')
        // 提示更新成功
        this.$toast.success('更新成功')
      } catch (err) {
        this.$toast('更新失败')
      }
    },
    onChange (picker, value, index) {
    //   this.$toast(`当前值：${value}, 当前索引：${index}`);
      this.localGender = index
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

<style scoped lang="less"></style>
