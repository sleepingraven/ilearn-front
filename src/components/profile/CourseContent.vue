<template>
  <div>
    <div id="item-2-1" class="list-group list-group-flush m-2">
      <div
        class="list-group-item list-group-item-action progress-bar-animated-on-focus"
        v-for="(learnAchieve, idx) in course.history"
        :key="idx"
      >
        <div class="d-flex flex-row">
          <!-- 1. img -->
          <div class="h-100">
            <a :href="'/learn/' + learnAchieve.courseId">
              <img :src="learnAchieve.previewImgUrl" style="height: 100px" />
            </a>
          </div>
          <div class="mx-3"></div>

          <div class="w-100 d-flex flex-column">
            <!-- 2. title、lastTime -->
            <div class="d-flex w-100 justify-content-between">
              <h5 class="mb-1">
                <a :href="'/learn/' + learnAchieve.courseId" class="form-control-plaintext py-0 text-decoration-none">
                  {{ learnAchieve.courseTitle }}
                </a>
              </h5>
              <small class="text-muted align-self-center text-nowrap">
                {{ $appCommon.formatAchieveTimeAgo(learnAchieve.achieveTime) }}
              </small>
            </div>

            <!-- 3. 学习至 -->
            <p class="mb-1">{{ learnAchieve | formatLatestAchieveTitle }}</p>
            <!-- <small class="text-muted">And some small print.</small> -->

            <!-- 4. progress bar -->
            <div class="progress mt-auto">
              <div
                class="progress-bar"
                :class="learnAchieve | preformProgressBackground"
                role="progressbar"
                :style="{ width: learnAchieve.percent + '%' }"
                aria-valuenow="25"
                aria-valuemin="0"
                aria-valuemax="100"
              >
                <span class="user-select-none">{{ learnAchieve.percent }}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Pagination class="mt-4" :default-page-size="3" :total="course.totalNum" @currentPageChanged="refetch" />
    </div>
  </div>
</template>

<script>
import $ from 'jquery/dist/jquery.js';
import $AppUtil from '@/assets/js/common';
import Pagination from '@/components/common/pagination/Pagination';

const progressMap = [
  { limit: 25, rtn: 'bg-secondary' },
  { limit: 50, rtn: 'bg-warning' },
  { limit: 75, rtn: '' },
  { limit: 100, rtn: 'bg-info' },
  { limit: Infinity, rtn: 'bg-success' },
];
export default {
  name: 'CourseContent',
  data: () => ({
    course: {
      totalNum: 0,
      history: [],
    },
    page: {
      size: 3,
    },
  }),
  created() {
    this.fetchHistory(0);
    this.pushContents();
  },
  methods: {
    refetch(current) {
      this.fetchHistory(current - 1);
    },
    fetchHistory(pageIdx) {
      const self = this;
      self.$http
        .get('/learn/achieve/list', {
          params: {
            pageIdx,
            pageSize: self.page.size,
          },
        })
        .then((res) => {
          if (res.data.status === 'success') {
            let totalNum = res.data.data.totalNum;
            let history = res.data.data.data;
            self.fireInitializing(history);
            self.course.totalNum = totalNum;
            self.course.history = history;
            this.$nextTick(() => {
              animateProgressBarOnFocus();
              self.fireShowing(history);
            });
          } else {
            this.$toast.show({
              title: '出错了',
              msg: res.data.data.errorMsg,
              icon: 'danger',
            });
          }
        })
        .catch(() => {
          this.$toast.show({
            title: '出错了',
            msg: '连接出现异常',
            icon: 'danger',
          });
        });
    },
    pushContents() {
      this.$emit('switchContents', [{ title: '我的课程', anchor: '#item-2-1' }]);
    },
    fireInitializing(history) {
      history.forEach((item) => {
        item.percent = 0;
      });
    },
    fireShowing(history) {
      history.forEach((item) => {
        item.percent = Math.round((item.finishedTasks / item.totalTasks) * 100);
      });
    },
    fireHiding(history) {
      history.forEach((item) => {
        item.percent = 0;
      });
    },
  },
  filters: {
    preformProgressBackground(c) {
      let idx = $AppUtil.binarySearchInMapping(progressMap, c.percent, (e) => e.limit);
      return progressMap[idx].rtn;
    },
    formatLatestAchieveTitle(learnAchieve) {
      return learnAchieve.sectionTitle;
    },
  },
  components: { Pagination },
};

function animateProgressBarOnFocus() {
  $('.progress-bar-animated-on-focus').hover(
    (e) => {
      $(e.currentTarget).find('.progress-bar').addClass('progress-bar-striped').addClass('progress-bar-animated');
    },
    (e) => {
      $(e.currentTarget).find('.progress-bar').removeClass('progress-bar-striped').removeClass('progress-bar-animated');
    }
  );
}
</script>

<style lang="scss" scoped></style>
