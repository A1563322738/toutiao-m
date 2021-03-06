<template>
  <div class="itemIndex">
    <!-- cell单元格to属性和 $route中得routerlink中得to属性是一样的 -->
    <!-- :to="`article/${articleId}`" -->
    <!-- 下面是es6得语法 -->
    <van-cell
      :to="{
        name: 'article',
        params: { articleId:article.art_id }
      }"
      class="article-item"
    >
      <div slot="title" class="title van-multi-ellipsis--l2">
        {{ article.title }}
      </div>
      <div slot="label">
        <div v-if="article.cover.type === 3" class="cover-wrap">
          <div
            class="cover-item"
            v-for="(img, index) in article.cover.images"
            :key="index"
          >
            <van-image class="cover-item-img" :src="img" fit="cover" />
          </div>
        </div>
        <div class="label-info-wrap">
          <span>{{ article.aut_name }}</span>
          <span>{{ article.comm_count }}评论</span>
          <span>{{ article.pubdate | relativeTime }}</span>
        </div>
      </div>
      <van-image
        v-if="article.cover.type === 1"
        slot="default"
        class="right-cover"
        :src="article.cover.images[0]"
      />
    </van-cell>
  </div>
</template>

<script>
export default {
  // 组件名称
  name: 'itemIndex',
  // 组件参数 接收来自父组件的数据
  props: {
    article: {
      type: Object,
      required: true
    }
  },
  // 局部注册的组件
  components: {},
  // 组件状态值
  data () {
    return {}
  },
  // 计算属性
  computed: {},
  // 侦听器
  watch: {},
  // 组件方法
  methods: {},
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
.title {
  font-size: 32px;
  color: #3a3a3a;
}
.van-cell__value {
  flex: uset;
  width: 232px;
  height: 146px;
  padding-left: 25px;
}
.right-cover {
  width: 232px;
  height: 146px;
}
.label-info-wrap span {
  font-size: 22px;
  color: #b4b4b4;
  margin-right: 25px;
}
.cover-wrap {
  display: flex;
  padding: 30px 0;
  .cover-item {
    flex: 1;
    height: 146px;
    &:not(:last-child) {
      padding-right: 4px;
    }
    .cover-item-img {
      width: 100%;
      height: 146px;
    }
  }
}
</style>
