<template>
  <div class="row learn-view-article-container">
    <div class="col-lg-8 col-12">
      <slot></slot>
    </div>

    <div class="col-lg-4 col-12">
      <aside id="learn-aside">
        <div class="p-4 mb-3 bg-light rounded">
          <h4>公告</h4>
          <p class="mb-0" v-if="course.notice && course.notice.length">
            {{ course.notice }}
          </p>
          <p class="mb-0 text-muted" v-else>暂无</p>
        </div>

        <div class="p-4">
          <h4>链接</h4>
          <ol class="list-unstyled mb-0">
            <li v-for="(r, ri) in course.refers" :key="ri">
              <a :href="r.href" target="_blank">{{ r.title }}</a>
            </li>
          </ol>
        </div>
      </aside>
    </div>
  </div>
</template>

<script>
import $ from 'jquery/dist/jquery.js';

export default {
  name: 'LearnViewAside',
  data() {
    return {
      course: {
        notice: '',
        refers: [],
      },
    };
  },
  created() {
    const self = this;
    self.$http
      .get('/course/overview/' + self.$route.params.courseId)
      .then((res) => {
        if (res.data.status === 'success') {
          let message = res.data.data;
          self.course = message;
        } else {
          this.$toast.show({
            title: '获取课程公告失败',
            msg: res.data.data.errorMsg,
            icon: 'danger',
          });
        }
      })
      .catch(() => {
        this.$toast.show({
          title: '获取课程公告失败',
          msg: '连接出现异常',
          icon: 'danger',
        });
      });
  },
  mounted: function () {
    initAutoSticky(this);
  },
};

function initAutoSticky(that) {
  let $learnAside = $('#learn-aside');
  $learnAside.parent().css('min-height', $learnAside.css('height'));
  that.$appUtil.enableAutoSticky($learnAside, window);
}
</script>

<style lang="scss" scoped></style>
