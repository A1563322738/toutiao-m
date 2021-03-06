<template>
  <div class="user-profile">
    <!-- 导航栏 -->
    <van-nav-bar
      class="page-nav-bar"
      title="个人信息"
      left-arrow
      @click-left="$router.back()"
    />
    <!-- /导航栏 -->
    <input type="file" hidden ref="file" @change="onFileChange" />
    <van-cell
      title="头像"
      is-link
      @click="$refs.file.click()"
      class="photo-cell"
    >
      <van-image class="avatar" fit="cover" round :src="user.photo" />
    </van-cell>
    <van-cell
      title="昵称"
      @click="isUpdateNameShow = true"
      :value="user.name"
      is-link
    />
    <van-cell
      title="性别"
      @click="isUpdateGenderShow = true"
      :value="user.gender === 0 ? '男' : '女'"
      is-link
    />
    <van-cell
      title="生日"
      :value="user.birthday"
      @click="isUpdateBirShow = true"
      is-link
    />
    <!-- 编辑昵称弹层 -->
    <!-- 利用v-if进行销毁创建，从而清空输入框 -->
    <van-popup v-model="isUpdateNameShow" style="height:80%" position="bottom">
      <update-name
        @close="isUpdateNameShow = false"
        v-if="isUpdateNameShow"
        v-model="user.name"
      ></update-name>
    </van-popup>
    <!-- 编辑性别弹层 -->
    <van-popup
      v-model="isUpdateGenderShow"
      style="height:80%"
      position="bottom"
    >
      <update-gender
        @close="isUpdateGenderShow = false"
        v-if="isUpdateGenderShow"
        v-model="user.gender"
      ></update-gender>
    </van-popup>
    <!-- 编辑生日弹出层 -->
    <van-popup
      v-model="isUpdateBirShow"
      style="height:80%"
      position="bottom"
    >
      <update-birth
        @close="isUpdateBirShow = false"
        v-if="isUpdateBirShow"
        v-model="user.birthday"
      ></update-birth>
    </van-popup>
    <!-- 编辑头像弹出层 -->
    <van-popup
      v-model="isUpdatePhotoShow"
      style="height:100%"
      position="bottom"
    >
      <update-photo
        v-if="isUpdatePhotoShow"
        :img="img"
        @close="isUpdatePhotoShow = false"
        @update-photo="user.photo = $event"
      ></update-photo>
    </van-popup>
  </div>
</template>

<script>
import { getUserProfile } from '@/api/user'
import UpdateName from './components/update-name'
import UpdateGender from './components/update-gender'
import UpdatePhoto from './components/update-photo'
import UpdateBirth from './components/update-birth'
export default {
  // 组件名称
  name: 'userProfile',
  // 组件参数 接收来自父组件的数据
  props: {},
  // 局部注册的组件
  components: {
    UpdateName,
    UpdateGender,
    UpdatePhoto,
    UpdateBirth
  },
  // 组件状态值
  data () {
    return {
      user: {},
      isUpdateNameShow: false, // 编辑昵称的弹层
      isUpdateGenderShow: false,
      isUpdatePhotoShow: false,
      isUpdateBirShow: false,
      img: ''
    }
  },
  // 计算属性
  computed: {},
  // 侦听器
  watch: {},
  // 组件方法
  methods: {
    // 1.初始化用户信息
    async loadUserProfile () {
      try {
        const { data } = await getUserProfile()
        console.log(data)
        this.user = data.data
        this.$toast('获取成功')
      } catch (err) {
        console.log(err)
      }
    },
    // 2.文件选择
    onFileChange () {
      console.log(111)
      const file = this.$refs.file.files[0]
      //  基于文件url创建出来的blob数据
      this.img = window.URL.createObjectURL(file)
      this.isUpdatePhotoShow = true
      this.$refs.file.value = ''
    }
  },
  // 以下是生命周期钩子   注：没用到的钩子请自行删除
  /**
   * 组件实例创建完成，属性已绑定，但DOM还未生成，$ el属性还不存在
   */
  created () {
    this.loadUserProfile()
  },
  /**
   * el 被新创建的 vm.$ el 替换，并挂载到实例上去之后调用该钩子。
   * 如果 root 实例挂载了一个文档内元素，当 mounted 被调用时 vm.$ el 也在文档内。
   */
  mounted () {}
}
</script>

<style scoped lang="less">
.avatar {
  width: 60px;
  height: 60px;
}
.van-popup {
  background-color: #f5f7f9;
}
</style>
