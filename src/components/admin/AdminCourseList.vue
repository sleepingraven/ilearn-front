<template>
  <div>
    <AdminMainViewport title="我的课程">
      <template v-slot:header>
        <div class="btn-toolbar mb-2 mb-md-0">
          <button
            type="button"
            class="btn btn-sm btn-outline-secondary"
            data-toggle="modal"
            data-target="#modalBackdrop"
          >
            <span data-feather="plus"></span>
            添加
          </button>
          <app-modal modal-id="modalBackdrop" modal-title="添加课程" footer-form="addi-course-form">
            <template v-slot:body>
              <form id="addi-course-form">
                <div class="form-group">
                  <label for="inputCourseName">课程名称</label>
                  <input
                    type="text"
                    id="inputCourseName"
                    class="form-control on-change-verification dont-mark-valid"
                    v-model="addiCourseName"
                    required
                    autofocus
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
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(c, ci) in courses" :key="ci">
                <th scope="row">
                  {{ ci + 1 }}
                </th>
                <td class="position-relative">
                  <router-link :to="'course/' + c.id" class="stretched-link course-list-item">
                    {{ c.title }}
                  </router-link>
                </td>
                <td>
                  <button
                    type="button"
                    class="btn btn-sm rounded-lg"
                    :class="c.banned ? 'btn-outline-success' : 'btn-outline-danger'"
                    style="line-height: 0.875"
                    data-toggle="modal"
                    data-target="#modalBackdropDelete"
                    :data-message="JSON.stringify(c)"
                    @click="banTitle = c.banned ? '即将启用课程「' + c.title + '」' : '即将禁用课程「' + c.title + '」'"
                  >
                    <span data-feather="power" v-if="c.banned"></span>
                    <span data-feather="slash" v-else></span>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </template>
    </AdminMainViewport>
    <app-modal
      modal-id="modalBackdropDelete"
      :ok-callback="banCourse"
      :modal-title="banTitle"
      :modal-body="false"
    ></app-modal>
  </div>
</template>

<script>
import AdminMainViewport from '@/components/admin/AdminMainViewport';
import feather from 'feather-icons';
import AppModal from '@/components/common/AppModal';
import $ from 'jquery';

export default {
  name: 'AdminCourseList',
  data: () => ({
    addiCourseName: '',
    courses: [],
    banTitle: '',
  }),
  created() {
    const self = this;
    self.$http
      .get('/course/preview-mine')
      .then((res) => {
        if (res.data.status === 'success') {
          self.courses = res.data.data;
          this.$nextTick(() => {
            feather.replace();
          });
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
  mounted() {
    const self = this;
    let $addCourseForm = $('#addi-course-form');
    $addCourseForm.submit((e) => {
      if (!$addCourseForm[0].checkValidity()) {
        return;
      }
      e.preventDefault();
      self.$http
        .post('/course/add', self.addiCourseName)
        .then((res) => {
          if (res.data.status === 'success') {
            window.location.reload();
          } else {
            this.$toast.show({
              title: '添加失败',
              msg: res.data.data.errorMsg,
              icon: 'danger',
            });
          }
        })
        .catch(() => {
          this.$toast.show({
            title: '添加失败',
            msg: '连接出现异常',
            icon: 'danger',
          });
        });
    });

    feather.replace();
  },
  methods: {
    banCourse(relatedTarget) {
      let course = $(relatedTarget).data('message');
      const self = this;
      self.$http
        .patch('/course/ban', {
          courseId: course.id,
          banned: !course.banned,
        })
        .then((res) => {
          if (res.data.status === 'success') {
            window.location.reload();
          } else {
            this.$toast.show({
              title: '删除失败',
              msg: res.data.data.errorMsg,
              icon: 'danger',
            });
          }
        })
        .catch(() => {
          this.$toast.show({
            title: '删除失败',
            msg: '连接出现异常',
            icon: 'danger',
          });
        });
    },
  },
  components: { AppModal, AdminMainViewport },
};
</script>

<style lang="scss" scoped>
.course-list-item {
  color: inherit;
}
.course-list-item:hover {
  color: #555;
}
</style>
