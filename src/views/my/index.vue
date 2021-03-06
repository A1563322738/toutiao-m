<template>
  <div class="my_container">
    <!-- 已登录头部 -->
    <div v-if="user" class="user-info header">
      <div class="base-info">
        <div class="left">
          <van-image
            class="avatar"
            round
            :src="userInfo.photo"
          />
          <span class="name">{{userInfo.name}}</span>
        </div>
        <div class="right" >
          <van-button round size="small" to="/user/profile">编辑资料</van-button>
        </div>
      </div>
      <!--  -->
      <div class="data-status">
        <div class="data-item">
          <span class="count">{{userInfo.art_count}}</span>
          <span class="text">头条</span>
        </div>
        <div class="data-item">
          <span class="count">{{userInfo.follow_count}}</span>
          <span class="text">关注</span>
        </div>
        <div class="data-item">
          <span class="count">{{userInfo.fans_count}}</span>
          <span class="text">粉丝</span>
        </div>
        <div class="data-item">
          <span class="count">{{userInfo.like_count}}</span>
          <span class="text">获赞</span>
        </div>
      </div>
    </div>
    <!-- 未登录 -->
    <div v-else class="header not-login">
      <div class="login-btn" @click="$router.push('/login')">
        <img class="mobile-img" src="~@/assets/mobile.png" alt="" />
        <span class="text">登陆 / 注册</span>
      </div>
    </div>

    <!-- 导航 -->
    <van-grid :column-num="2" class="grid-nav mb-9" clickable>
      <van-grid-item class="grid-item">
        <i slot="icon" class="toutiao toutiao-shoucang"></i>
        <span slot="text" class="text">收藏</span>
      </van-grid-item>
      <van-grid-item class="grid-item">
        <i slot="icon" class="toutiao toutiao-lishi"></i>
        <span slot="text" class="text">历史</span>
      </van-grid-item>
    </van-grid>

    <van-cell title="消息通知" is-link></van-cell>
    <van-cell class="mb-9" title="小智同学" is-link></van-cell>
    <van-cell
      v-if="user"
      class="logout-cell"
      title="退出登录"
      clickable
      @click="onLogout"
    ></van-cell>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { getUserInfo } from '@/api/user'
export default {
  // 组件名称
  name: 'myIndex',
  // 组件参数 接收来自父组件的数据
  props: {},
  // 局部注册的组件
  components: {},
  // 组件状态值
  data () {
    return {
      userInfo: {}
    }
  },
  // 计算属性
  computed: {
    ...mapState(['user'])
  },
  // 侦听器
  watch: {},
  // 组件方法
  methods: {
    // 1.获取用户信息
    async loadUser () {
      try {
        const { data } = await getUserInfo()
        console.log(data)
        this.userInfo = data.data
      } catch (err) {
        this.$toast('获取数据失败')
      }
    },
    // 2.退出事件
    onLogout () {
      // 1.1弹出对话框
      this.$dialog
        .confirm({
          title: '确认退出吗'
        })
        .then(() => {
          // on confirm//确定退出的话，把user设为空 清除登录状态，本机存储和容器存储
          this.$store.commit('setUser', null)
        })
        .catch(() => {
          // 点击弹框取消执行catch
          // on cancel
          console.log('取消执行这里')
        })
    }
  },
  // 以下是生命周期钩子   注：没用到的钩子请自行删除
  /**
   * 组件实例创建完成，属性已绑定，但DOM还未生成，$ el属性还不存在
   */
  created () {
    // 1.如果user中token有值得话  代表用户登陆了
    if (this.$store.state.user) {
      this.loadUser()
    }
  },
  /**
   * el 被新创建的 vm.$ el 替换，并挂载到实例上去之后调用该钩子。
   * 如果 root 实例挂载了一个文档内元素，当 mounted 被调用时 vm.$ el 也在文档内。
   */
  mounted () {}
}
</script>

<style scoped lang="less">
.my_container {
  background-color: #eee;
  .header {
    height: 361px;
    background: url("~@/assets/banner.png");
    background-size: cover;
  }
  .not-login {
    display: flex;
    justify-content: center;
    align-items: center;
    .login-btn {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      .mobile-img {
        width: 132px;
        height: 132px;
        margin-bottom: 15px;
      }
      .text {
        font-size: 28px;
        color: #fff;
      }
    }
  }
  // 增加样式 已登录
  .user-info {
    .base-info {
      height: 231px;
      padding: 76px 23px 32px;
      box-sizing: border-box;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .left {
        display: flex;
        align-items: center;
        .avatar {
          width: 132px;
          height: 132px;
          border: 4px solid #fff;
          margin-right: 23px;
        }
        .name {
          font-size: 30px;
          color: #fff;
        }
      }
    }
  }
  // 导航
  .grid-nav {
    .grid-item {
      height: 141px;
      i.toutiao {
        font-size: 45px;
      }
      .toutiao-shoucang {
        color: #eb5253;
      }
      .toutiao-lishi {
        color: #ff9d1d;
      }
      span.text {
        font-size: 28px;
      }
    }
  }
  .mb-9 {
    margin-bottom: 8px;
  }
  .data-status {
    display: flex;
    .data-item {
      flex: 1;
      height: 130px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      color: #fff;
      .count {
        font-size: 36px;
      }
      .text {
        font-size: 23px;
      }
    }
  }
  .logout-cell {
    text-align: center;
    color: red;
  }
}
</style>
