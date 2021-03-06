<template>
  <div class="channel-edit">
    <van-cell title="我的频道" class="title-text" :border="false">
      <van-button
        class="edit-btn"
        type="danger"
        size="mini"
        round
        plain
        @click="isEdit = !isEdit"
        >{{ isEdit ? "完成" : "编辑" }}</van-button
      >
    </van-cell>
    <van-grid :gutter="10" class="my-grid">
      <van-grid-item
        class="grid-item"
        v-for="(channel, index) in myChannels"
        :key="index"
        @click="onMyChannelClick(channel, index)"
      >
        <van-icon
          v-show="isEdit && !fixChannels.includes(channel.id)"
          slot="icon"
          name="clear"
        ></van-icon>
        <span slot="text" :class="{ active: active === index }" class="text">{{
          channel.name
        }}</span>
      </van-grid-item>
    </van-grid>

    <van-cell title="频道推荐" class="title-text" :border="false"> </van-cell>
    <van-grid class="recommed-grid" :gutter="10">
      <van-grid-item
        class="grid-item"
        v-for="(channel, index) in recommedChannels"
        :key="index"
        icon="plus"
        :text="channel.name"
        @click="addChannel(channel)"
      >
      </van-grid-item>
    </van-grid>
  </div>
</template>

<script>
import {
  getAllChannels,
  addUserChannels,
  deleteUserChannels
} from '@/api/channel'
import { mapState } from 'vuex'
import { setItem } from '@/utils/storage.js'
export default {
  // 组件名称
  name: 'channel-edit',
  // 组件参数 接收来自父组件的数据,接受父组件的channel值
  props: {
    myChannels: {
      type: Array,
      required: true
    },
    active: {
      type: Number,
      required: true
    }
  },
  // 局部注册的组件
  components: {},
  // 组件状态值
  data () {
    return {
      allChannels: [],
      isEdit: false,
      fixChannels: [0] // 固定频道
    }
  },
  // 计算属性
  computed: {
    //  1.计算属性 所有的频道列表-我的频道=推荐的,遍历渲染
    recommedChannels () {
      return this.allChannels.filter(channel => {
        const mychannel = this.myChannels.find(myChannel => {
          return myChannel.id === channel.id
        })
        return !mychannel
      })
    },
    // 获取user
    ...mapState(['user'])
  },
  // 侦听器
  watch: {},
  // 组件方法
  methods: {
    //   1.获取全部频道列表
    async loadAllChannels () {
      try {
        const { data } = await getAllChannels()
        // console.log(data);
        this.allChannels = data.data.channels
      } catch (err) {
        console.log(err)
      }
    },
    // 2.添加频道
    async addChannel (channel) {
      this.myChannels.push(channel)
      if (this.user) {
        // 已登录
        try {
          await addUserChannels({
            id: channel.id,
            seq: this.myChannels.length // 序号，第几个
          })
          this.$toast('添加成功')
        } catch (err) {
          this.$toast('添加频道失败')
        }
      } else {
        // 未登录，存到本地
        setItem('TOUTIAO_CHANNERS', this.myChannels)
      }
    },
    // 3.点击我的频道看是切换频道还是删除频道
    onMyChannelClick (channel, index) {
      if (this.isEdit) {
        // 3.0如果是固定频道，就不删除
        if (this.fixChannels.includes(channel.id)) {
          return
        }
        // 3.1编辑状态下是删除频道
        this.myChannels.splice(index, 1)
        // 2.如果删除的激活频道之前的频道，则更新激活的频道项
        // 2.1参数1:要删除的元素的开始索引(包括)
        // 2.2参数2:删除的个数:如果不指定，则从参数1开始一直删除到最后
        if (index <= this.active) {
          // 让激活频道的索引-1
          this.$emit('update-active', this.active - 1, true)
        }
        // 3.2处理 线上删除持久化
        this.deleteChannel(channel)
      } else {
        // 3.2非编辑下是切换频道 通过子向父传值，关闭弹出层自动切换到别的频道
        this.$emit('update-active', index, false)
      }
    },
    // 4.删除频道的方法
    async deleteChannel (channel) {
      try {
        if (this.user) {
          // 已登录，就将数据更新到线上
          await deleteUserChannels(channel.id)
          //
          this.$toast('删除成功')
        } else {
          // 未登陆。将数据存储到本地
          setItem('TOUTIAO_CHANNERS', this.myChannels)
        }
      } catch (err) {
        this.$toast('删除失败')
      }
    }
  },
  // 以下是生命周期钩子   注：没用到的钩子请自行删除
  /**
   * 组件实例创建完成，属性已绑定，但DOM还未生成，$ el属性还不存在
   */
  created () {
    this.loadAllChannels()
  },
  /**
   * el 被新创建的 vm.$ el 替换，并挂载到实例上去之后调用该钩子。
   * 如果 root 实例挂载了一个文档内元素，当 mounted 被调用时 vm.$ el 也在文档内。
   */
  mounted () {}
}
</script>

<style scoped lang="less">
.channel-edit {
  padding: 85px 0;
  .title-text {
    font-size: 32px;
    color: #333;
  }
  .edit-btn {
    width: 104px;
    height: 48px;
    font-size: 26px;
    color: #f85959;
    border: 1px solid #f85959;
  }
  /deep/ .grid-item {
    width: 160px;
    height: 86px;
    .van-grid-item__content {
      white-space: nowrap;
      background-color: #f4f5f6;
      .van-grid-item__text,
      .text {
        font-size: 28px;
        color: #222;
        margin-top: 0;
      }
      .active {
        color: red;
      }
      .van-grid-item__icon-wrapper {
        position: unset;
      }
    }
  }
  /deep/ .my-grid {
    .grid-item {
      .van-icon-clear {
        position: absolute;
        top: -10px;
        right: -10px;
        font-size: 30px;
        color: #cacaca;
        z-index: 2;
      }
    }
  }
  /deep/ .recommed-grid {
    .grid-item {
      .van-grid-item__content {
        flex-direction: row;
        .van-icon-plus {
          font-size: 28px;
          margin-right: 6px;
        }
      }
    }
  }
}
</style>
