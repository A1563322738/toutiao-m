<template>
  <div class="update-photo">
    <img class="img" :src="img" ref="img" />
    <div class="toolbar">
      <div class="cancel" @click="$emit('close')">取消</div>
      <div class="confirm" @click="onConfirm">完成</div>
    </div>
  </div>
</template>

<script>
import 'cropperjs/dist/cropper.css'
import Cropper from 'cropperjs'
import { updateUserPhoto } from '@/api/user'
export default {
  // 组件名称
  name: 'UpdatePhoto',
  // 组件参数 接收来自父组件的数据
  props: {
    img: {
      type: [String, Object],
      required: true
    }
  },
  // 局部注册的组件
  components: {},
  // 组件状态值
  data () {
    return {
      cropper: null
    }
  },
  // 计算属性
  computed: {},
  // 侦听器
  watch: {},
  // 组件方法
  methods: {
    onConfirm () {
      //   console.log(this.cropper.getData());
      //   height: 633.9042234503918
      // rotate: 0
      // scaleX: 1
      // scaleY: 1
      // width: 633.9042234503918
      // x: 284.3375112231531
      // y: 276.8182640371967
      this.cropper.getCroppedCanvas().toBlob(blob => {
        this.updateUserPhoto(blob)
      })
    },
    async updateUserPhoto (blob) {
      this.$toast.loading({
        duration: 0, // 持续展示 toast
        forbidClick: true,
        message: '保存中'
      })
      // 如果接口要求 conten-type 是 application/json
      // 则传递普通javaScript对象
      // updateUserPhoto{
      //  photo:blob
      // }
      // 如果接口是multipart/form-data   必须传递formData对象
      try {
        const formData = new FormData()
        formData.append('photo', blob)
        const { data } = await updateUserPhoto(formData)
        //   关闭弹出层
        this.$emit('close')
        // 更新视图
        this.$emit('update-photo', data.data.photo)
        // 提示成功
        this.$toast.success('更新成功')
      } catch (err) {
        this.$toast('更新失败')
        //   console.log(err);
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
  mounted () {
    const image = this.$refs.img
    this.cropper = new Cropper(image, {
      viewMode: 1, // 只能在裁剪的图片范围内移动
      dragMode: 'move', // 画布可以移动
      aspectRatio: 1, // 裁剪区为正方形
      autoCropArea: 1, // 自动调整裁剪图片
      cropBoxMovable: false, // 禁止裁剪区移动
      cropBoxResizable: false, // 禁止裁剪区缩放
      background: false // 关闭默认背景
    })
  }
}
</script>

<style scoped lang="less">
.update-photo {
  background-color: #000;
  height: 100%;
  .toolbar {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: space-between;
    .cancel,
    .confirm {
      width: 90px;
      height: 90px;
      font-size: 30px;
      color: #fff;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
  .img {
    display: block;
    max-width: 100%;
  }
}
</style>
