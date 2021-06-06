<template>
  <LearnViewAside>
    <div>
      <h1>{{ courseIntroduction.title }}</h1>
      <p v-if="courseIntroduction.createTime" class="blog-post-meta">
        {{ courseIntroduction.createTime | formatTimestamp }}
        by
        <a href="#">{{ courseIntroduction.userName }}</a>
      </p>
      <hr />

      <div v-for="(intro, idx) in courseIntroduction.introductions" :key="idx">
        <h2 class="anchor-container">
          {{ intro.title }}
          <a :id="'intro-' + (idx + 1)" :href="'#intro-' + (idx + 1)">
            <span data-feather="link" class="align-baseline"></span>
          </a>
        </h2>
        <!--<p>{{ intro.content }}</p>-->
        <mavon-editor
          class="readonly-md-editor"
          style="min-height: auto; min-width: auto; border: none; z-index: 4; font-size: medium"
          :subfield="false"
          :code-style="'xcode'"
          :value="intro.content"
          :box-shadow="false"
          :preview-background="'#fff'"
          :default-open="'preview'"
          :editable="false"
          :toolbars-flag="false"
          :toolbars="{ fullscreen: true, readmodel: true, navigation: true }"
        />
      </div>
    </div>
  </LearnViewAside>
</template>

<script>
import LearnViewAside from '@/components/learn/layout/LearnViewAside';
import $AppUtil from '@/assets/js/common';
import feather from 'feather-icons';

export default {
  name: 'CourseIntroduction',
  data() {
    return {
      courseIntroduction: {
        title: '',
        createTime: null,
        userId: '',
        userName: '',
        introductions: [],
      },
    };
  },
  created() {
    const self = this;
    self.$http
      .get('/learn/introduction/' + self.$route.params.courseId)
      .then((res) => {
        if (res.data.status === 'success') {
          self.courseIntroduction = res.data.data;
          this.$nextTick(() => {
            feather.replace();
          });
        } else {
          this.$toast.show({
            title: '获取课程介绍失败',
            msg: res.data.data.errorMsg,
            icon: 'danger',
          });
        }
        this.pushContents();
      })
      .catch(() => {
        this.$toast.show({
          title: '获取课程介绍失败',
          msg: '连接出现异常',
          icon: 'danger',
        });
        this.pushContents();
      });
  },
  mounted() {},
  methods: {
    pushContents() {
      let contents = this.courseIntroduction.introductions.map((intro, idx) => {
        return {
          title: intro.title,
          anchor: '#intro-' + (idx + 1),
        };
      });
      this.$emit('switchContents', contents);
    },
  },
  filters: {
    formatTimestamp(timestamp) {
      let date = new Date(timestamp);
      let year = date.getUTCFullYear(),
        month = date.getUTCMonth() + 1,
        day = date.getUTCDate();
      month = $AppUtil.completeLeadingZero2TwoDigits(month);
      day = $AppUtil.completeLeadingZero2TwoDigits(day);
      return year + '-' + month + '-' + day;
    },
  },
  components: { LearnViewAside },
};
</script>

<style lang="scss">
.blog-post-meta {
  margin-bottom: 1.25rem;
  color: #999;
}
.readonly-md-editor {
  color: inherit !important;
  .v-show-content {
    padding: 0 !important;
  }
}
</style>
