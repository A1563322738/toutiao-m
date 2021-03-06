<template>
  <div class="comment-reply">
    <!-- 导航栏 -->
    <van-nav-bar
      :title="
        comment.reply_count > 0 ? `${comment.reply_count}条回复` : '暂无回复'
      "
    >
      <van-icon slot="left" name="cross" @click="$emit('close')"> </van-icon>
    </van-nav-bar>

    <!-- 当前评论项-->
    <comment-item :comment="comment"></comment-item>
    <!-- /当前评论项-->

    <!-- 所有回复-->
    <van-cell title="所有回复"></van-cell>
    <!--/ 所有评论项-->

    <!-- 所有回复列表 -->
    <comment-list :list="commentList" :source="comment.com_id" type="c"></comment-list>
    <!-- /所有回复列表 -->

    <!-- 发布评论 -->
    <div class="post-wrap">
      <van-button class="post-btn" size="small" round @click="isPostShow = true"
        >写评论</van-button
      >
    </div>

    <!-- 回复评论 -->
    <van-popup
      v-model="isPostShow"
      position="bottom"
      get-container="body"
      round
    >
      <comment-post
        :target="comment.com_id"
        @post-success="onPostSuccess"
      ></comment-post>
    </van-popup>
  </div>
</template>

<script>
import CommentItem from './comment-item'
import CommentList from './comment-list'
import CommentPost from './comment-post'
export default {
  // 组件名称
  name: 'CommentReply',
  // 组件参数 接收来自父组件的数据
  props: {
    comment: {
      type: Object,
      required: true
    }
  },
  // 局部注册的组件
  components: {
    CommentItem,
    CommentList,
    CommentPost
  },
  // 组件状态值
  data () {
    return {
      isPostShow: false,
      commentList: []
    }
  },
  // 计算属性
  computed: {},
  // 侦听器
  watch: {},
  // 组件方法
  methods: {
    // 1.发布成功时候的函数
    onPostSuccess (data) {
    //   console.log(data);
      this.comment.reply_count++ // 更新数量

      // 关闭弹出层
      this.isPostShow = false
      // 将最新的数据展示在列表头部
      this.commentList.unshift(data.new_obj)
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
.post-wrap {
  position: fixed;
  left: 0%;
  right: 0;
  bottom: 0;
  height: 88px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fff;
  border-top: 1px solid #d8d8d8;
  .post-btn {
    width: 60%;
  }
}
.scroll-wrap {
  position: fixed;
  top: 92px;
  left: 0;
  right: 0;
  bottom: 88px;
  overflow-y: auto; //可以滚动
}
</style>
