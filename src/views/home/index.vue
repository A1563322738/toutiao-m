<template>
  <div class="home-container">
    <van-nav-bar class="page-nav-bar" fixed>
      <van-button
        type="info"
        class="search-btn"
        slot="title"
        round
        icon="search"
        size="small"
        to="/search"
        >搜索</van-button
      >
    </van-nav-bar>
    <!-- tab栏 -->
    <!-- 在标签指定 name 属性的情况下，v-model 的值为当前标签的 name（此时无法通过索引值来匹配标签） -->
    <van-tabs v-model="active" class="channel-tabs" animated swipeable>
      <van-tab
        :title="channel.name"
        v-for="channel in channels"
        :key="channel.id"
        >
        <article-list :channel="channel" >

        </article-list>
      </van-tab>
      <div slot="nav-right" class="placeholder"></div>
      <div slot="nav-right" class="hamburger-btn" @click="isChannelEditShow=true">
        <i class="toutiao toutiao-gengduo"></i>
      </div>
    </van-tabs>
    <!-- 编辑频道弹出层 -->

    <van-popup
  v-model="isChannelEditShow"
  closeable
  position="bottom"
  close-icon-position="top-left"
  :style="{ height: '98%' }"
>
<channel-edit :active="active" @update-active="updateActive" :my-channels="channels"></channel-edit>
    </van-popup>
  </div>
</template>

<script>
import { getUserChannels } from '@/api/user'
import ArticleList from './components/article-list'
import ChannelEdit from './components/channel-edit'
export default {
  // 组件名称
  name: 'homeIndex',
  // 组件参数 接收来自父组件的数据
  props: {
  },
  // 局部注册的组件
  components: {
    ArticleList,
    ChannelEdit
  },
  // 组件状态值
  data () {
    return {
      active: 0,
      channels: [], // 频道列表
      isChannelEditShow: false
    }
  },
  // 计算属性
  computed: {},
  // 侦听器
  watch: {},
  // 组件方法
  methods: {
    // 1.展示频道列表
    async loadChannels () {
      try {
        const { data } = await getUserChannels()
        // console.log(data);
        this.channels = data.data.channels
      } catch (err) {
        this.$toast('获取用户频道失败')
      }
    },
    // 2. 展示弹层

    // 3.子向父传值,切换频道
    updateActive (index, isChannelEditShow = true) {
      // 更新激活的频道项
      this.active = index
      this.isChannelEditShow = isChannelEditShow
    }
  },
  // 以下是生命周期钩子   注：没用到的钩子请自行删除
  /**
   * 组件实例创建完成，属性已绑定，但DOM还未生成，$ el属性还不存在
   */
  created () {
    this.loadChannels()
  },
  /**
   * el 被新创建的 vm.$ el 替换，并挂载到实例上去之后调用该钩子。
   * 如果 root 实例挂载了一个文档内元素，当 mounted 被调用时 vm.$ el 也在文档内。
   */
  mounted () {}
}
</script>

<style scoped lang="less">
.home-container {
  padding-top: 174px;
  padding-bottom: 100px;
  /deep/ .van-nav-bar__title {
    max-width: unset !important;
  }

  .search-btn {
    width: 555px;
    height: 64px;
    background-color: #5babfb;
    border: none;
    font-size: 28px;
    .van-icon {
      font-size: 32px;
    }
  }
  /deep/ .channel-tabs {
    .van-tabs__wrap {
      position: fixed;
      z-index: 1;
      top: 92px;
      left: 0;
      right: 0;
      height: 82px;
    }
    .van-tab {
      border-right: 1px solid #edeff3;
      min-width: 200px;
      // height: 82px;
      font-size: 30px;
      color: #777;
    }
    .van-tab--active {
      color: #333;
    }
    .van-tabs__nav {
      padding-bottom: 0;
    }
    .van-tabs__line {
      bottom: 8px;
      width: 31px !important;
      height: 6px;
      background-color: #3296fa;
    }

  .placeholder {//占位元素为了解决最后一个tab标签被汉堡盖住问题（
    flex-shrink: 0; //此元素参与flex的
    width: 66px;
    height: 82px;
  }
    .hamburger-btn {
      position: fixed;
      right: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 66px;
      height: 82px;
      background-color: #fff;
      opacity: 0.902;
      i.toutiao {
        font-size: 33px;
      }
      &:before{//找到父节点，添加伪元素(这个是汉堡按钮与tab之间的一个竖线
        content:'';
        position: absolute;
        left: 0;
        width: 2px;
        height: 100%;
        background-image: url(~@/assets/gradient-gray-line.png);
        background-size: contain;
      }
    }
  }

}
</style>
