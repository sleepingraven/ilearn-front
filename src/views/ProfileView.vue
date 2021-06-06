<template>
  <div>
    <NavigationBar :active-idx="0" />
    <Breadcrumb :items="[{ title: '首页', url: '/' }, { title: '个人中心' }]">
      <template v-slot:endNavField>
        <DropdownContents v-if="true" :contents="contents" />
      </template>
    </Breadcrumb>

    <div class="container">
      <div class="row">
        <!-- 1. tab -->
        <!--
          nav 功能：
          data-toggle="pill"
          href="#v-pills-profile"
         -->
        <div class="col-3">
          <div class="nav flex-column nav-pills" id="v-pills-tab" role="tablist" aria-orientation="vertical">
            <router-link
              class="nav-link"
              id="v-pills-profile-tab"
              :to="{ name: 'ProfileContent' }"
              role="tab"
              active-class="active"
              aria-controls="v-pills-profile"
              aria-selected="true"
            >
              个人资料
            </router-link>
            <router-link
              class="nav-link"
              id="v-pills-courses-tab"
              :to="{ name: 'CourseContent' }"
              role="tab"
              active-class="active"
              aria-controls="v-pills-courses"
              aria-selected="true"
            >
              我的课程
            </router-link>
            <router-link
              class="nav-link"
              id="v-pills-account-tab"
              :to="{ name: 'AccountContent' }"
              role="tab"
              active-class="active"
              aria-controls="v-pills-account"
              aria-selected="true"
            >
              帐号
            </router-link>
          </div>
        </div>

        <!-- 2. tab content -->
        <div class="col-9">
          <div class="tab-content" id="v-pills-tab-content">
            <div
              class="tab-pane fade show active"
              id="v-pills-profile"
              role="tabpanel"
              aria-labelledby="v-pills-profile-tab"
            >
              <router-view @switchContents="switchContents" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import $ from 'jquery/dist/jquery.js';
import NavigationBar from '@/components/common/NavigationBar';
import Breadcrumb from '@/components/common/Breadcrumb';
import DropdownContents from '@/components/common/DropdownContents';

export default {
  name: 'ProfileView',
  data: () => ({
    contents: [],
  }),
  mounted: function () {
    initAutoSticky(this);
  },
  methods: {
    switchContents(contents) {
      this.contents = contents;
    },
  },
  components: { NavigationBar, Breadcrumb, DropdownContents },
};

function initAutoSticky(that) {
  let $body = $('body');
  $body.addClass('smooth-scroll app-scrollbar');
  $body.attr('data-spy', 'scroll').attr('data-target', '#content-data-spy').attr('data-offset', '40');
  that.$appUtil.enableAutoSticky($('#contents-btn-div'), window, { limitHeight: true });
  that.$appUtil.enableAutoSticky($('#v-pills-tab'), window);
}
</script>

<style lang="scss" scoped></style>
