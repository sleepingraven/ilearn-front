<template>
  <LearnViewport>
    <!-- 1. 工具栏 -->
    <div class="mb-3 d-flex">
      <DiscussionPublication />
    </div>

    <!-- 2. 内容 -->
    <DiscussionPost v-for="(p, pi) in posts" :key="pi" :post="p" :pi="pi" />

    <!-- 3. 底部内容 -->
    <div id="fetch-footer" class="mb-3 p-3 bg-white rounded shadow-sm mt-3">
      <div class="d-flex justify-content-center">
        <div v-if="!entire" class="spinner-border text-primary" role="status">
          <span class="sr-only">Loading...</span>
        </div>
        <span v-else class="text-muted">到底了</span>
      </div>
    </div>
  </LearnViewport>
</template>

<script>
import $ from 'jquery/dist/jquery.js';
import LearnViewport from '@/components/learn/layout/LearnViewport';
import DiscussionPublication from '@/components/learn/sub/DiscussionPublication';
import feather from 'feather-icons';
import DiscussionPost from '@/components/learn/sub/DiscussionPost';

export default {
  name: 'Discussion',
  data: () => ({
    posts: [],
    entire: false, // 是否读取完所有讨论
    fetchMutex: false,
    page: {
      pageIdx: 0,
      pageSize: 3,
    },
    // 距离底部 threshold 的屏幕的距离内触发检查
    threshold: 0.5,
  }),
  created() {
    this.doFetch();
    this.pushContents();
  },
  mounted() {
    $('body').addClass('bg-light');

    let $window = $(window);
    $window.scroll(this.checkGlanceOver);
    feather.replace({ width: 20, height: 20 });
  },
  beforeDestroy() {
    $('body').removeClass('bg-light');
    let $window = $(window);
    $window.off('scroll', this.checkGlanceOver);
  },
  methods: {
    checkGlanceOver() {
      let $window = $(window);
      let $fetchFooter = $('#fetch-footer');
      let distance = $fetchFooter[0].getBoundingClientRect().y;
      let windowHeight = $window.height();
      let diff = distance - windowHeight;
      if (diff <= windowHeight * this.threshold) {
        this.doFetch();
      }
    },
    doFetch() {
      const self = this;
      if (self.fetchMutex) {
        return;
      }
      self.fetchMutex = true;
      self.$http
        .get('/discussion/list', {
          params: {
            courseId: self.$route.params.courseId,
            pageIdx: self.page.pageIdx,
            pageSize: self.page.pageSize,
          },
        })
        .then((res) => {
          if (res.data.status === 'success') {
            let batchPosts = res.data.data.wrapperList;
            if (batchPosts.length === 0) {
              self.entire = true;
              return;
            }
            const likeSet = new Set(res.data.data.likedStatementIdList);
            batchPosts.forEach((p) => {
              p.comments = p.comments || [];
              p.statement.liked = likeSet.has(p.statement.id);
            });
            self.posts.push.apply(self.posts, batchPosts);
            self.page.pageIdx++;

            self.$nextTick(() => {
              feather.replace();
              if (batchPosts.length < self.page.pageSize) {
                self.entire = true;
                return;
              }
              self.fetchMutex = false;
              self.checkGlanceOver();
            });
          } else {
            this.$toast.show({
              title: '获取评论失败',
              msg: res.data.data.errorMsg,
              icon: 'danger',
            });
            self.fetchMutex = false;
            self.checkGlanceOver();
          }
        })
        .catch(() => {
          this.$toast.show({
            title: '获取评论失败',
            msg: '连接出现异常',
            icon: 'danger',
          });
          self.fetchMutex = false;
          self.checkGlanceOver();
        });
    },
    pushContents() {
      this.$emit('switchContents', []);
    },
  },
  components: {
    LearnViewport,
    DiscussionPublication,
    DiscussionPost,
  },
};
</script>

<style lang="scss">
.reply-area-root {
  .second-level-comment-pager {
    border: none;
    position: absolute;
  }
}
.reply-area-root:not(:hover) {
  .second-level-comment-pager {
    background-color: transparent;
    color: transparent;
    box-shadow: none;
  }
}
</style>
