<template>
    <div class="search-history">
        <van-cell title="历史记录" >
            <!-- props引入得数据只能修改，不能重新赋值(否则会造成父组件关联数据无法同步) 通过子父传值-->
            <template v-if="isDeleteShow">
                <span @click="$emit('clear-search-histories')" style="margin-right:10px">全部删除</span>
                &nbsp; &nbsp;
                <span @click="isDeleteShow=false">完成</span>
            </template>
            <van-icon name="delete" v-else @click="isDeleteShow=true">

            </van-icon>
        </van-cell>
        <!-- 单项删除 -->
         <van-cell :title="item" @click="onSearchItemClick(item,index)" :key="index" v-for="(item,index) in searchHistories">
            <van-icon name="close"></van-icon>
        </van-cell>

    </div>
</template>

<script>
export default {
  // 组件名称
  name: 'searchHistory',
  // 组件参数 接收来自父组件的数据
  props: {
    searchHistories: {
      type: Array,
      required: true
    }
  },
  // 局部注册的组件
  components: {},
  // 组件状态值
  data () {
    return {

      isDeleteShow: false
    }
  },
  // 计算属性
  computed: {},
  // 侦听器
  watch: {},
  // 组件方法
  methods: {
    onSearchItemClick (item, index) {
      // 如果是删除状态，则执行删除操作
      if (this.isDeleteShow) {
        this.searchHistories.splice(index, 1)
      } else {
        this.$emit('search', item)
      }
    }
  },
  // 以下是生命周期钩子   注：没用到的钩子请自行删除
  /**
  * 组件实例创建完成，属性已绑定，但DOM还未生成，$ el属性还不存在
  */
  created () {
  },
  /**
  * el 被新创建的 vm.$ el 替换，并挂载到实例上去之后调用该钩子。
  * 如果 root 实例挂载了一个文档内元素，当 mounted 被调用时 vm.$ el 也在文档内。
  */
  mounted () {
  }
}
</script>

<style scoped lang="less">

</style>
