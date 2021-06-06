<template>
  <div>
    <NavigationBar :active-idx="1" />
    <Breadcrumb :items="[{ title: '首页', url: '/' }, { title: '课程' }]" />

    <div class="container">
      <div class="row row-cols-md-4 justify-content-start">
        <div class="col my-2 course-card-container" v-for="(course, ci) in courses" :key="ci">
          <a class="text-decoration-none" :href="'/learn/' + course.id">
            <div class="card mb-2 h-100 border-light course-card">
              <img :src="course.previewImgUrl" class="card-img-top" :alt="course.title" />
              <div class="card-body card-body-adjust">
                <h5 class="card-title title-adjust course-title">{{ course.title }}</h5>
                <!--<h6 class="card-subtitle mb-1 subtitle-adjust text-truncate course-subtitle">
                  {{ course.totalLearning | formatTotalLearning }}
                </h6>-->
                <!-- <p class="card-text">{{learn.description}}</p> -->
                <!-- <a href="#" class="card-link">Card link</a>
                  <a href="#" class="card-link">Another link</a> -->
                <!-- <a href="#" class="btn btn-primary">Go somewhere</a> -->
              </div>
            </div>
          </a>
        </div>
      </div>

      <Pagination
        class="mt-4"
        :default-page-size="page.pageSize"
        :total="page.totalNum"
        @currentPageChanged="refetch"
      />
    </div>
  </div>
</template>

<script>
import $ from 'jquery/dist/jquery.js';
import NavigationBar from '@/components/common/NavigationBar';
import Breadcrumb from '@/components/common/Breadcrumb';
import Pagination from '@/components/common/pagination/Pagination';

export default {
  name: 'CourseView',
  data: () => ({
    courses: [],
    page: {
      pageSize: 8,
      totalNum: 0,
    },
  }),
  created() {
    this.fetchCourseList(0);
  },
  mounted: function () {
    applyStyle();
  },
  methods: {
    refetch(current) {
      this.fetchCourseList(current - 1);
    },
    fetchCourseList(pageIdx) {
      const self = this;
      self.$http
        .get('/course/preview/list', { params: { pageIdx, pageSize: self.page.pageSize } })
        .then((res) => {
          if (res.data.status === 'success') {
            let resData = res.data.data;
            self.courses = resData.data;
            self.page.totalNum = resData.totalNum;
          } else {
            this.$toast.show({
              title: '获取课程信息失败',
              msg: res.data.data.errorMsg,
              icon: 'danger',
            });
          }
        })
        .catch(() => {
          this.$toast.show({
            title: '获取课程信息失败',
            msg: '连接出现异常',
            icon: 'danger',
          });
        });
    },
  },
  filters: {
    formatTotalLearning(totalLearning) {
      return '编程 · ' + totalLearning + '人在学';
    },
  },
  components: { NavigationBar, Breadcrumb, Pagination },
};

function applyStyle() {
  $('body').addClass('smooth-scroll app-scrollbar');
}
</script>

<style lang="scss" scoped>
.course-card-container {
  min-width: 13rem;
  .course-card {
    border-radius: 8px;
    box-shadow: 0 4px 8px 0 rgb(95 101 105 / 5%);

    transition: all 0.2s ease-out 0s;
  }
  .course-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 20px 0 rgb(95 101 105 / 10%);
  }
  .course-title {
    color: #545c63;
    line-height: 20px;
    font: 1.1em/1.5 'PingFang SC', '微软雅黑', 'Microsoft YaHei', Helvetica, 'Helvetica Neue', Tahoma, Arial, sans-serif;
  }
  .course-subtitle {
    font-size: 1em;
    color: #9199a1;
    line-height: 1.1em;
  }
}
</style>
