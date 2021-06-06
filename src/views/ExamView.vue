<template>
  <div>
    <NavigationBar :active-idx="2" />
    <Breadcrumb :items="[{ title: '首页', url: '/' }, { title: '测试' }]" />

    <div class="container">
      <!-- 1. 添加考试 -->
      <div class="mb-3">
        <button
          type="button"
          class="btn btn-sm btn-outline-secondary"
          data-toggle="modal"
          data-target="#modalBackdrop"
          style="border-radius: 8em"
        >
          <span data-feather="edit-3"></span>
          添加
        </button>
      </div>
      <app-modal modal-id="modalBackdrop" modal-title="添加考试" :modal-footer="false" :static-modal="true">
        <template v-slot:body>
          <form id="join-exam-form">
            <div class="form-row">
              <div class="form-group col-auto flex-fill">
                <div class="input-group">
                  <div class="input-group-prepend">
                    <span class="input-group-text">
                      <span data-feather="terminal"></span>
                    </span>
                  </div>
                  <input type="text" class="form-control" placeholder="请输入考试码" v-model="join.code" required />
                </div>
              </div>
              <div class="form-group">
                <button type="submit" class="btn btn-primary" :disabled="join.code.length !== 6 || join.fetchMutex">
                  <span data-feather="arrow-right"></span>
                </button>
              </div>
            </div>
          </form>

          <div id="join-area" class="collapse">
            <ul class="list-group list-group-flush list-group-horizontal">
              <li
                class="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
                :class="getJoinAreaExamBgClass(join.exam)"
                v-if="join.status === 2"
              >
                <span class="mr-1">
                  {{ join.exam.title }}
                </span>
                <div class="text-center">
                  <span class="text-nowrap d-inline-block mx-1">{{ join.exam | formatJoinExamStartDate }}</span>
                  <span class="text-nowrap d-inline-block">{{ join.exam | formatJoinExamStartTime }}</span>
                </div>
                <button
                  class="btn btn-light text-nowrap ml-1"
                  :disabled="join.joinMutex || isJoinExamEnded(join.exam)"
                  @click="doJoinExam"
                >
                  加入
                </button>
              </li>
              <li
                class="list-group-item list-group-item-action text-center text-muted exam-join-area"
                v-if="join.status === 1"
              >
                未找到考试信息
              </li>
              <li
                class="list-group-item list-group-item-action text-center text-muted exam-join-area"
                v-if="join.status === 0"
              >
                <div class="spinner-border text-primary" role="status">
                  <span class="sr-only">Loading...</span>
                </div>
              </li>
            </ul>
          </div>
        </template>
      </app-modal>

      <!-- 2. 主区域 -->
      <div class="accordion" id="accordionExample">
        <CollapsibleGroupItem
          heading-id="headingOne"
          collapse-id="collapseOne"
          title="未完成"
          :exams="unfinishedExams"
        />
        <CollapsibleGroupItem heading-id="headingTwo" collapse-id="collapseTwo" title="已完成" :exams="finishedExams" />
      </div>
    </div>
  </div>
</template>

<script>
import $ from 'jquery/dist/jquery.js';
import NavigationBar from '@/components/common/NavigationBar';
import Breadcrumb from '@/components/common/Breadcrumb';
import CollapsibleGroupItem from '@/components/exam/CollapsibleGroupItem';
import AppModal from '@/components/common/AppModal';
import $AppUtil from '@/assets/js/common';

export default {
  name: 'ExamView',
  data: () => ({
    unfinishedExams: [],
    finishedExams: [],
    currTime: 0,
    join: {
      code: '',
      status: 0,
      exam: {},
      fetchMutex: false,
      joinMutex: false,
    },
  }),
  created() {
    const that = this;
    let earliest = Infinity;
    // 记录未开始和进行中的考试
    const preparingExams = [],
      inProgressExams = [];

    // 1. 倒计时
    that.currTime = that.$appUtil.getUTCTime(new Date());
    let countdown = window.setInterval(() => {
      that.currTime += 1000;
      if (that.currTime >= earliest) {
        clearInterval(countdown);
        location.reload();
      }
      preparingExams.forEach((exam) => {
        exam.alias = that.formatRemainTime(that.currTime, exam.startTime);
      });
      inProgressExams.forEach((exam) => {
        exam.alias = that.formatRemainTime(that.currTime, exam.endTime);
      });
    }, 1000);

    // 2. 初始化数据
    that.fetchAll((exams) => {
      exams.forEach((exam) => {
        const startTime = new Date(exam.startTime).getTime(),
          endTime = startTime + 1000 * 60 * exam.totalTime;
        exam.startTime = startTime;
        exam.endTime = endTime;
        if (startTime > that.currTime) {
          // 还未开始
          exam.status = { text: '未开始', class: 'text-info' };
          earliest = Math.min(earliest, startTime);
          exam.alias = that.formatRemainTime(that.currTime, startTime);
          preparingExams.push(exam);
          that.unfinishedExams.push(exam);
        } else if (endTime > that.currTime) {
          // 正在进行
          exam.status = { text: '进行中', class: 'text-warning' };
          earliest = Math.min(earliest, endTime);
          exam.alias = that.formatRemainTime(that.currTime, endTime);
          inProgressExams.push(exam);
          that.unfinishedExams.push(exam);
        } else {
          // 已经结束
          exam.status = { text: '已结束', class: 'text-success' };
          exam.alias = exam.title;
          that.finishedExams.push(exam);
        }
      });
    });
  },
  mounted() {
    const $joinArea = $('#join-area');
    const self = this;
    let joinExamForm = $('#join-exam-form');
    joinExamForm.submit((e) => {
      if (!joinExamForm[0].checkValidity()) {
        return;
      }
      if (self.join.fetchMutex) {
        return;
      }
      e.preventDefault();
      $joinArea.collapse('show');
      self.join.fetchMutex = true;
      self.join.status = 0;
      self.$http
        .get('/exam/from-code/' + self.join.code)
        .then((res) => {
          if (res.data.status === 'success') {
            if (!res.data.data) {
              self.join.status = 1;
            } else {
              let exam = res.data.data;
              self.join.exam = exam;
              self.join.status = 2;
            }
          } else {
            this.$toast.show({
              title: '出错了',
              msg: res.data.data.errorMsg,
              icon: 'danger',
            });
          }
          self.join.fetchMutex = false;
        })
        .catch(() => {
          this.$toast.show({
            title: '出错了',
            msg: '连接出现异常',
            icon: 'danger',
          });
          self.join.fetchMutex = false;
        });
    });
  },
  methods: {
    fetchAll(callback) {
      const self = this;
      self.$http
        .get('/exam/list/joint')
        .then((res) => {
          if (res.data.status === 'success') {
            let exams = res.data.data;
            callback(exams);
            self.$nextTick(() => {
              applyStyle();
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
    doJoinExam() {
      const self = this;
      self.join.joinMutex = true;
      self.$http
        .post('/exam/join', { examId: self.join.exam.id })
        .then((res) => {
          if (res.data.status === 'success') {
            window.location.reload();
          } else {
            this.$toast.show({
              title: '出错了',
              msg: res.data.data.errorMsg,
              icon: 'danger',
            });
          }
          self.join.joinMutex = false;
        })
        .catch(() => {
          this.$toast.show({
            title: '出错了',
            msg: '连接出现异常',
            icon: 'danger',
          });
          self.join.joinMutex = false;
        });
    },
    formatRemainTime: function (nowTime, tarTime) {
      let { days, hours, minutes, seconds } = this.$appUtil.calculateDateOffset(nowTime, tarTime);
      days = days > 0 ? days + '天 ' : '';
      hours = this.$appUtil.completeLeadingZero2TwoDigits(hours);
      minutes = this.$appUtil.completeLeadingZero2TwoDigits(minutes);
      seconds = this.$appUtil.completeLeadingZero2TwoDigits(seconds);
      return days + hours + ':' + minutes + ':' + seconds;
    },
    getJoinAreaExamBgClass(exam) {
      const startTime = new Date(exam.startTime).getTime();
      if (this.currTime < startTime) {
        return 'list-group-item-info';
      }
      let endTime = startTime + exam.totalTime * 60 * 1000;
      if (this.currTime < endTime) {
        return 'list-group-item-warning';
      }
      return 'list-group-item-secondary';
    },
    isJoinExamEnded(exam) {
      const startTime = new Date(exam.startTime).getTime();
      let endTime = startTime + exam.totalTime * 60 * 1000;
      return endTime <= this.currTime;
    },
  },
  filters: {
    formatJoinExamStartDate(exam) {
      let date = new Date(exam.startTime);
      return (
        date.getUTCFullYear() +
        '-' +
        $AppUtil.completeLeadingZero2TwoDigits(date.getUTCMonth()) +
        '-' +
        $AppUtil.completeLeadingZero2TwoDigits(date.getUTCDate())
      );
    },
    formatJoinExamStartTime(exam) {
      let date = new Date(exam.startTime);
      return (
        $AppUtil.completeLeadingZero2TwoDigits(date.getUTCHours()) +
        ':' +
        $AppUtil.completeLeadingZero2TwoDigits(date.getUTCMinutes())
      );
    },
  },
  components: { NavigationBar, Breadcrumb, CollapsibleGroupItem, AppModal },
};

function applyStyle() {
  $('body').addClass('smooth-scroll app-scrollbar');
  let $examCard = $('.exam-card');
  $examCard.addClass('text-center');
  $examCard.hover(
    (e) => {
      let $this = $(e.currentTarget);
      $this.addClass('shadow-sm');
    },
    (e) => {
      let $this = $(e.currentTarget);
      $this.removeClass('shadow-sm');
    }
  );

  // let $lastCard = $('.accordion > .card:last-of-type');
  // let $lastCollapse = $('.accordion > .card:last-of-type .collapse');
  // $lastCollapse.bind('hidden.bs.collapse', () => {
  //   $lastCard.addClass('border-bottom');
  // });
  // $lastCollapse.bind('show.bs.collapse', () => {
  //   $lastCard.removeClass('border-bottom');
  // });
  $('.accordion > .card .card-header').addClass('mb-0');
}
</script>

<style lang="scss" scoped>
.exam-join-area:not(:hover) {
  background-color: #fdfdfe;
}
</style>
