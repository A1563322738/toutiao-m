<template>
  <!-- 文章详情页 -->
  <div class="article-container">
    <van-nav-bar title="移动头条" class="page-nav-bar">
      <van-icon
        slot="left"
        name="arrow-left"
        @click="$router.back()"
      ></van-icon>
    </van-nav-bar>
    <div class="main-wrap">
      <!-- 加载中 -->
      <div class="loading-wrap" v-if="isLoading">
        <van-loading color="#3296fa" vertical>加载中</van-loading>
      </div>
      <!-- 加载中 -->
      <!-- 加载完成 文章详情-->
      <div v-else-if="article.title" class="article-detail">
        <!-- 文章标题 -->
        <h1 class="article-title">{{ article.title }}</h1>
        <!-- 文章标题 -->

        <!-- 用户信息 -->
        <van-cell class="user-info" center :border="false">
          <van-image
            slot="icon"
            round
            fit="cover"
            class="avatar"
            :src="article.aut_photo"
          ></van-image>
          <div slot="title" class="user-name">{{ article.aut_name }}</div>
          <div slot="label" class="publish-date">
            {{ article.pubdate | relativeTime }}
          </div>
          <!-- 已关注 -->
          <!-- 模板中的$event是事件参数 -->
          <!-- <follow-user :is-followed="article.is_followed"
          @update-follow="article.is_followed=$event"
          :user-id="article.aut_id" class="follow-btn"></follow-user> -->
          <follow-user
            v-model="article.is_followed"
            :user-id="article.aut_id"
            class="follow-btn"
          ></follow-user>
          <!-- 已关注 -->
        </van-cell>
        <!-- 用户信息 -->
        <!-- 文章内容 -->
        <div
          class="article-content markdown-body"
          v-html="article.content"
          ref="article-content"
        ></div>
        <van-divider>正文结束</van-divider>
        <!--评论列表  -->
        <comment-list
          :list="commentList"
          @onload-success="totalCommentCount = $event.total_count"
          :source="article.art_id"
          @reply-click="onReplyClick"
        ></comment-list>
        <!-- 底部区域 -->
        <div class="article-bottom">
          <van-button
            class="comment-btn"
            type="default"
            round
            size="small"
            @click="isPostShow = true"
            >写评论</van-button
          >
          <van-icon
            name="comment-o"
            :badge="totalCommentCount"
            color="#777"
          ></van-icon>
          <collect-article
            :article-id="article.art_id"
            v-model="article.is_collected"
          ></collect-article>
          <!-- <van-icon name="star-o" color="#777"></van-icon> -->
          <!-- <van-icon name="good-job-o" color="#777"></van-icon> -->
          <like-article
            v-model="article.attitude"
            :article-id="article.art_id"
          ></like-article>
          <van-icon name="share" color="#777"></van-icon>
        </div>

        <!-- 弹出层 -->
        <van-popup v-model="isPostShow" position="bottom">
          <comment-post
            :target="article.art_id"
            @post-success="onPostSuccess"
          ></comment-post>
        </van-popup>
      </div>
      <!-- 加载完成 文章详情-->

      <!-- 加载失败404 -->
      <div v-else-if="errStatus === 404" class="error-wrap">
        <van-icon name="failure"></van-icon>
        <p class="text">该资源不存在或已删除！</p>
      </div>
      <!-- 加载失败404 其他未知错误 -->
      <div v-else class="error-wrap">
        <van-icon name="failure"></van-icon>
        <p class="text">内容加载失败！</p>
        <van-button @click="loadArticleInfo" class="retry-btn"
          >点击重试</van-button
        >
      </div>
    </div>
    <!-- 评论回复的弹出层  弹出层是懒渲染的-->
    <van-popup v-model="isReplyShow" position="bottom" get-container="body"
   round style="height:90%">
      <comment-reply v-if="isReplyShow"
      :comment="currentComment" @close="isReplyShow=false"></comment-reply>
    </van-popup>
  </div>
</template>

<script>
import { getArticleById } from '@/api/article.js'
// 导入imagePreview(是个函数，并不是以组件方式使用)
import { ImagePreview } from 'vant'
// import { addFollow, deleteFollow } from "@/api/user.js";
// 引入 关注组件
import FollowUser from '@/components/follow-user'
import CollectArticle from '@/components/collect-article'
import LikeArticle from '@/components/like-article'
import CommentList from './components/comment-list'
import CommentPost from './components/comment-post'
import CommentReply from './components/comment-reply'
// ImagePreview({
//   images: [
//     'https://img01.yzcdn.cn/vant/apple-1.jpg',
//     'https://img01.yzcdn.cn/vant/apple-2.jpg',
//   ],
//   onClose() {
//     this.$toast('关闭');
//   },
// startPosition: 1
// });
export default {
  // 组件名称
  name: 'AritcleIndex',
  // 组件参数 接收来自父组件的数据
  props: {
    articleId: {
      type: [Number, String, Object],
      required: true
    }
  },
  provide: function () {
    return {
      articleId: this.articleId
    }
  },
  // 局部注册的组件
  components: {
    FollowUser,
    CollectArticle,
    LikeArticle,
    CommentList,
    CommentPost,
    CommentReply
  },
  // 组件状态值
  data () {
    return {
      article: {},
      isLoading: true, // 文章加载状态
      errStatus: '', // 请求异常状态
      // is_followed:false
      totalCommentCount: 0,
      isPostShow: false,
      commentList: [],
      isReplyShow: false,
      currentComment: {} // 当前点击回复的评论项
    }
  },
  // 计算属性
  computed: {},
  // 侦听器
  watch: {},
  // 组件方法
  methods: {
    //   1.获取文章列表
    async loadArticleInfo () {
      try {
        // // 随机错误
        // if (Math.random() > 0.5) {
        //   return JSON.parse('error')
        // }
        // // 没有错误得话
        // this.isLoading = true;
        const { data } = await getArticleById(this.articleId)
        // console.log(data);
        // 数据驱动视图这件事不是立即得
        this.article = data.data
        // console.log(this.article.attitude);
        // console.log(this.article.is_collected);
        // 注意：数据更新后并不会同步更新页面，所以想要获取数据更新后得页面元素，需要延时处理
        // 初始化图片预览
        setTimeout(() => {
          // console.log(this.$refs['article-content']);
          this.previewImage()
        }, 0)
      } catch (err) {
        console.log(err)
        // 加载失败404
        if (err.response && err.response.status === 404) {
          this.errStatus = 404
        }
        this.$toast('获取失败')
      }
      // 不管请求成功还是失败 loading都需要关闭
      this.isLoading = false
    },
    // 2.图片预览
    previewImage () {
      // 得到所有得img节点
      const articleContent = this.$refs['article-content']
      const imgs = articleContent.querySelectorAll('img')
      // console.log(imgs);
      const images = []
      imgs.forEach((el, index) => {
        images.push(el.src)
        el.onclick = () => {
          ImagePreview({
            images,
            startPosition: index
          })
        }
      })
      // console.log(images);
    },
    // 3. 关注用户
    // 4.发布成功
    onPostSuccess (data) {
      this.isPostShow = false
      this.commentList.unshift(data.new_obj)
    },
    //  回复
    onReplyClick (comment) {
      //  将子组件中传给评论对象存储到当前组件
      this.currentComment = comment
      this.isReplyShow = true
      // this.isPostShow=true;
    }
  },
  // 以下是生命周期钩子   注：没用到的钩子请自行删除
  /**
   * 组件实例创建完成，属性已绑定，但DOM还未生成，$ el属性还不存在
   */
  created () {
    this.loadArticleInfo()
  },
  /**
   * el 被新创建的 vm.$ el 替换，并挂载到实例上去之后调用该钩子。
   * 如果 root 实例挂载了一个文档内元素，当 mounted 被调用时 vm.$ el 也在文档内。
   */
  mounted () {}
}
</script>

<style scoped lang="less">
@import "./github-markdown.css";
.article-container {
  .main-wrap {
    position: fixed;
    left: 0;
    right: 0;
    top: 92px;
    bottom: 88px;
    overflow-y: scroll;
    background-color: #fff;
  }
  .article-detail {
    .article-title {
      font-size: 40px;
      padding: 50px 32px;
      margin: 0;
      color: #3a3a3a;
    }
    .user-info {
      padding: 0 32px;
      .avatar {
        width: 70px;
        height: 70px;
        margin-right: 17px;
      }
      .van-cell__label {
        margin-top: 0;
      }
      .user-name {
        font-size: 24px;
        color: #3a3a3a;
      }
      .publish-date {
        font-size: 23px;
        color: #b7b7b7;
      }
      .follow-btn {
        width: 170px;
        height: 58px;
      }
    }
    .article-content {
      padding: 50px 32px;
      /deep/ p {
        text-align: justify;
      }
    }
  }
  .loading-wrap {
    padding: 200px 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #fff;
  }
  .error-wrap {
    padding: 200px 32px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #fff;
    .van-icon {
      font-size: 122px;
      color: #b4b4b4;
    }
    .text {
      font-size: 30px;
      color: #666;
      margin: 33px 0 46px;
    }
    .retry-btn {
      width: 280px;
      height: 70px;
      line-height: 70px;
      border: 1px solid #c3c3c3;
      font-size: 30px;
      color: #666;
    }
  }
  .article-bottom {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: space-around;
    align-items: center;
    box-sizing: border-box;
    height: 88px;
    border-top: 1px solid #d8d8d8;
    background-color: #fff;
    .comment-btn {
      width: 282px;
      height: 46px;
      border: 2px solid #eee;
      font-size: 30px;
      line-height: 46px;
      color: #a7a7a7;
    }
    /deep/ .van-icon {
      font-size: 40px;
      .van-info {
        font-size: 16px;
        background-color: #e22829;
      }
    }
  }
}
</style>
