<template>
  <div class="update-birth">
    <van-datetime-picker
      v-model="currentDate"
      type="date"
      title="选择年月日"
      :min-date="minDate"
      :max-date="maxDate"
      @cancel="$emit('close')"
      @confirm="onConfirm"
    />
  </div>
</template>

<script>
import { updateUserProfile } from '@/api/user'
import dayjs from 'dayjs'
export default {
  // 组件名称
  name: 'updateBirth',
  // 组件参数 接收来自父组件的数据
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
      minDate: new Date(1970, 0, 1),
      maxDate: new Date(2025, 10, 1),
      currentDate: new Date(this.value)
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
      try {
        const currentDates = dayjs(this.currentDate).format('YYYY-MM-DD')
        await updateUserProfile({
          birthday: currentDates
        })
        //  更新视图
        this.$emit('input', currentDates)
        //  关闭弹层
        this.$emit('close')
        // 提示成功
        this.$toast('更新成功')
      } catch (err) {
        this.$toast('更新失败')
        console.log(err)
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

<style scoped lang="less"></style>
