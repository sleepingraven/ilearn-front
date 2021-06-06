<template>
  <div>
    <NavigationBar :active-idx="0" />
    <Breadcrumb
      :items="[
        { title: '首页', url: '/' },
        { title: '课程', url: '/course/list' },
      ]"
      :inactive-item-idx-getter="(items) => -1"
      :sub-items="[
        { title: '介绍', name: 'CourseIntroduction' },
        { title: '章节', name: 'ChapterContents' },
        { title: '课件', name: 'Courseware' },
        { title: '讨论', name: 'Discussion' },
      ]"
    >
      <template v-slot:endNavField>
        <DropdownContents v-if="enableContents" :contents="contents" />
      </template>
    </Breadcrumb>

    <div class="container pt-2 text-justify" style="padding-bottom: 4rem">
      <router-view @switchContents="switchContents" />
    </div>
  </div>
</template>

<script>
import $ from 'jquery/dist/jquery.js';
import NavigationBar from '@/components/common/NavigationBar';
import Breadcrumb from '@/components/common/Breadcrumb';
import DropdownContents from '@/components/common/DropdownContents';

export default {
  name: 'LearnView',
  data: () => ({
    enableContents: false,
    contents: [],
  }),
  mounted: function () {
    initAutoSticky(this);
  },
  methods: {
    switchContents(contents, enableContents = contents.length > 0) {
      if (enableContents !== this.enableContents) {
        this.enableContents = enableContents;
        if (enableContents) {
          const self = this;
          self.$nextTick(() => {
            self.$appUtil.enableAutoSticky($('#contents-btn-div'), window, { limitHeight: true, zIndex: 4 });
          });
        }
      }
      this.contents = contents;
    },
  },
  components: { NavigationBar, Breadcrumb, DropdownContents },
};

function initAutoSticky(that) {
  let $body = $('body');
  $body.addClass('smooth-scroll app-scrollbar');
  $body.attr('data-spy', 'scroll').attr('data-target', '#content-data-spy').attr('data-offset', '40');
  that.$appUtil.enableAutoSticky($('#sub-nav'), window, { limitHeight: true, zIndex: 4 });
}
</script>

<style lang="scss">
.learn-view-article-container {
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    font-family: 'Playfair Display', Georgia, 'Times New Roman', serif;
  }
  h1 {
    margin-bottom: 0.25rem;
  }
}
</style>
