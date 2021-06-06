<template>
  <AdminMainViewport title="考试信息">
    <template v-slot:header>
      <div class="btn-toolbar mb-2 mb-md-0">
        <button type="button" class="btn btn-sm btn-outline-secondary" data-toggle="modal" data-target="#modalBackdrop">
          <span data-feather="plus"></span>
          添加
        </button>
        <app-modal
          modal-id="modalBackdrop"
          modal-title="添加考试"
          footer-form="addi-exam-form"
          :static-modal="true"
          :ok-btn-disabled="addiMutex"
        >
          <template v-slot:body>
            <form id="addi-exam-form">
              <div class="form-group">
                <label for="inputExamName">考试名称</label>
                <input
                  type="text"
                  id="inputExamName"
                  class="form-control on-change-verification dont-mark-valid"
                  v-model="addiExam.title"
                  required
                  autofocus
                />
              </div>
              <div class="form-group">
                <label for="inputStartTime">开始时间</label>
                <input
                  type="datetime-local"
                  id="inputStartTime"
                  class="form-control on-change-verification dont-mark-valid"
                  v-model="addiExam.startTime"
                  required
                />
              </div>
              <div class="form-group">
                <label for="inputTotalTimeRange">时长（{{ addiExam.totalTime }} 分钟）</label>
                <input
                  type="range"
                  class="custom-range"
                  min="1"
                  max="300"
                  id="inputTotalTimeRange"
                  v-model="addiExam.totalTime"
                />
              </div>
              <div class="form-group">
                <label for="inputExamHref">链接</label>
                <input
                  type="text"
                  id="inputExamHref"
                  class="form-control on-change-verification dont-mark-valid"
                  v-model="addiExam.href"
                  required
                />
              </div>
            </form>
          </template>
        </app-modal>
      </div>
    </template>
    <template v-slot:body>
      <div class="table-responsive">
        <table class="table table-striped table-hover table-bordered table-sm">
          <thead>
            <tr>
              <th>#</th>
              <th>名称</th>
              <th>开始时间</th>
              <th>时长（分钟）</th>
              <th>链接</th>
              <th>考试码</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(e, ei) in exams" :key="ei">
              <th scope="row">
                {{ ei + 1 }}
              </th>
              <td>
                {{ e.title }}
              </td>
              <td>
                {{ e.startTime | formatStartTime }}
              </td>
              <td>
                {{ e.totalTime }}
              </td>
              <td>
                <a :href="e.href || '#'" target="_blank">
                  <span data-feather="external-link"></span>
                </a>
              </td>
              <td>
                {{ e.code }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>
  </AdminMainViewport>
</template>

<script>
import AdminMainViewport from '@/components/admin/AdminMainViewport';
import AppModal from '@/components/common/AppModal';
import $ from 'jquery';
import $AppUtil from '@/assets/js/common';
import feather from 'feather-icons';

export default {
  name: 'AdminExam',
  data() {
    return {
      exams: [],
      page: {
        size: 3,
      },
      addiExam: {
        title: '',
        startTime: '',
        totalTime: 90,
        href: '',
      },
      addiMutex: false,
    };
  },
  created() {
    const self = this;
    self.$http
      .get('/exam/list')
      .then((res) => {
        if (res.data.status === 'success') {
          self.exams = res.data.data;
          self.$nextTick(() => {
            feather.replace();
          });
        } else {
          this.$toast.show({
            title: '出错了',
            msg: res.data.data.errorMsg,
            icon: 'danger',
          });
          self.addiMutex = false;
        }
      })
      .catch(() => {
        this.$toast.show({
          title: '出错了',
          msg: '连接出现异常',
          icon: 'danger',
        });
        self.addiMutex = false;
      });
  },
  mounted() {
    const self = this;
    let addExamForm = $('#addi-exam-form');
    addExamForm.submit((e) => {
      if (!addExamForm[0].checkValidity()) {
        return;
      }
      self.addiMutex = true;
      e.preventDefault();
      self.$http
        .post('/exam/add', self.addiExam)
        .then((res) => {
          if (res.data.status === 'success') {
            window.location.reload();
          } else {
            this.$toast.show({
              title: '添加失败',
              msg: res.data.data.errorMsg,
              icon: 'danger',
            });
            self.addiMutex = false;
          }
        })
        .catch(() => {
          this.$toast.show({
            title: '添加失败',
            msg: '连接出现异常',
            icon: 'danger',
          });
          self.addiMutex = false;
        });
    });
  },
  filters: {
    formatStartTime(time) {
      let date = new Date(time);
      return (
        date.getFullYear() +
        '-' +
        $AppUtil.completeLeadingZero2TwoDigits(date.getUTCMonth()) +
        '-' +
        $AppUtil.completeLeadingZero2TwoDigits(date.getUTCDate()) +
        ' ' +
        $AppUtil.completeLeadingZero2TwoDigits(date.getUTCHours()) +
        ':' +
        $AppUtil.completeLeadingZero2TwoDigits(date.getUTCMinutes()) +
        ':' +
        $AppUtil.completeLeadingZero2TwoDigits(date.getUTCSeconds())
      );
    },
  },
  components: { AdminMainViewport, AppModal },
};
</script>

<style lang="scss" scoped></style>
