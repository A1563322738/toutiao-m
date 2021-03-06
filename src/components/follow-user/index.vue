<template>
  <!-- 已关注 -->
  <van-button
    v-if="isFollowed"
    @click="onFollow"
    :loading="loading"
    class="follow-btn"
    round
    size="small"
    >已关注</van-button
  >
  <!-- 未关注 -->
  <van-button
    v-else
    class="follow-btn"
    size="small"
    color="#3296fa"
    icon="plus"
    round
    type="info"
    :loading="loading"
    @click="onFollow"
    >关注</van-button
  >
  <!-- 已关注 -->
</template>

<script>
import { addFollow, deleteFollow } from '@/api/user.js'
export default {
  // 组件名称
  name: '',
  //   自定义v-model的名称
  model: {
    prop: 'isFollowed',
    event: 'update-follow'
  },
  // 组件参数 接收来自父组件的数据
  props: {
    isFollowed: {
      type: Boolean,
      required: true
    },
    userId: {
      type: [String, Number],
      required: true
    }
  },
  // 局部注册的组件
  components: {},
  // 组件状态值
  data () {
    return {
      loading: false
    }
  },
  // 计算属性
  computed: {},
  // 侦听器
  watch: {},
  // 组件方法
  methods: {
    // 1.关注用户
    async onFollow () {
      this.loading = true // 只有发起关注相关请求的时候，该数据才重置为true，为了避免网速差的时候用户多次点击
      try {
        // console.log(this.article.aut_id);
        if (this.isFollowed) {
          // 已关注，取消关注
          const { data } = await deleteFollow(this.userId)
          console.log(data)
        } else {
          // 未关注，添加关注
          await addFollow(this.userId)
        }
        this.$emit('update-follow', !this.isFollowed)
        // 关注已关注变化
        // this.article.is_followed=!this.article.is_followed
      } catch (err) {
        if (err.response && err.response.status === 400) {
          this.$toast('你不能关注自己')
        } else {
          this.$toast('操作失败，请重试')
        }

        console.log(err)
      }
      // 不管成功还是失败，请求结束后，loading应该是false
      this.loading = false
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
