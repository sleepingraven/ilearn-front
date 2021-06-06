<template>
  <div>
    <ul class="list-group list-group-flush">
      <li class="list-group-item text-reset px-0 pt-0">
        <form id="overview-form" class="needs-validation" novalidate>
          <div class="form-group">
            <label class="h3" for="notice-field">公告</label>
            <textarea
              class="form-control"
              id="notice-field"
              v-model="course.notice"
              placeholder="请输入公告内容"
              rows="4"
              required
            ></textarea>
            <div class="invalid-feedback">Please enter a message in the textarea.</div>
          </div>
          <button type="submit" class="btn btn-sm btn-primary">
            <span data-feather="save"></span>
            保存
          </button>
        </form>
      </li>
      <li class="list-group-item text-reset px-0">
        <div class="row row-cols-2">
          <div class="col">
            <div class="float-right">
              <button
                type="button"
                class="btn btn-info rounded-lg mr-1"
                style="line-height: 0.875"
                data-toggle="modal"
                data-target="#uploadBackdrop"
              >
                <span data-feather="upload-cloud"></span>
              </button>
            </div>
            <div>
              <div class="form-group">
                <h3>预览图</h3>
                <img
                  v-if="course.previewImgUrl"
                  :src="course.previewImgUrl"
                  class="img-fluid img-thumbnail w-100"
                  alt="预览图"
                />
              </div>
            </div>
          </div>

          <div class="col">
            <div class="float-right">
              <button
                type="button"
                class="btn btn-info rounded-lg mr-1"
                style="line-height: 0.875"
                data-toggle="modal"
                data-target="#modalBackdropAddRefer"
              >
                <span data-feather="plus"></span>
              </button>
            </div>
            <div>
              <div class="form-group">
                <h3>链接</h3>
                <div class="table-responsive">
                  <table class="table table-striped table-hover table-bordered table-sm">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>链接</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(r, ri) in course.refers" :key="ri">
                        <th scope="row">1</th>
                        <td>
                          <a :href="r.href" target="_blank">{{ r.title }}</a>
                        </td>
                        <td>
                          <button
                            type="button"
                            class="btn btn-sm btn-outline-danger rounded-lg"
                            style="line-height: 0.875"
                            data-toggle="modal"
                            :data-message="r.id"
                            data-target="#modalBackdropDeleteRefer"
                          >
                            <span data-feather="trash-2"></span>
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </li>
    </ul>

    <PreviewImageModal v-if="dataLoaded" :course-id="course.id" v-model="course.previewImgUrl" />
    <app-modal
      modal-id="modalBackdropAddRefer"
      modal-title="添加链接"
      footer-form="addi-refer-form"
      :static-modal="true"
      :ok-btn-disabled="addiReferMutex"
    >
      <template v-slot:body>
        <form id="addi-refer-form">
          <div class="form-group">
            <label for="inputReferTitle">链接名称</label>
            <input
              type="text"
              id="inputReferTitle"
              class="form-control on-change-verification dont-mark-valid"
              v-model="addiRefer.title"
              required
              autofocus
            />
          </div>
          <div class="form-group">
            <label for="inputReferHref">链接地址</label>
            <input
              type="text"
              id="inputReferHref"
              class="form-control on-change-verification dont-mark-valid"
              v-model="addiRefer.href"
              required
            />
          </div>
        </form>
      </template>
    </app-modal>
    <app-modal
      modal-id="modalBackdropDeleteRefer"
      :ok-callback="removeRefer"
      :modal-title="'删除链接'"
      :modal-body="false"
    ></app-modal>
  </div>
</template>

<script>
import feather from 'feather-icons';
import $ from 'jquery';
import PreviewImageModal from '@/components/admin/sub/PreviewImageModal';
import AppModal from '@/components/common/AppModal';

export default {
  name: 'AdminCourseOverview',
  data() {
    return {
      course: {
        id: '',
        notice: '',
        previewImgUrl: '',
        refers: [],
      },
      dataLoaded: false,
      addiRefer: {
        title: '',
        href: '',
        courseId: this.$route.params.courseId,
      },
      addiReferMutex: false,
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
          self.dataLoaded = true;
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
    let $courseOverviewForm = $('#overview-form');
    $courseOverviewForm.submit((e) => {
      if (!$courseOverviewForm[0].checkValidity()) {
        return;
      }
      e.preventDefault();
      self.$http
        .patch('/course/overview', self.course)
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

    let addReferForm = $('#addi-refer-form');
    addReferForm.submit((e) => {
      if (!addReferForm[0].checkValidity()) {
        return;
      }
      self.addiReferMutex = true;
      e.preventDefault();
      self.$http
        .post('/course/refer', self.addiRefer)
        .then((res) => {
          if (res.data.status === 'success') {
            window.location.reload();
          } else {
            this.$toast.show({
              title: '添加失败',
              msg: res.data.data.errorMsg,
              icon: 'danger',
            });
            self.addiReferMutex = false;
          }
        })
        .catch(() => {
          this.$toast.show({
            title: '添加失败',
            msg: '连接出现异常',
            icon: 'danger',
          });
          self.addiReferMutex = false;
        });
    });

    feather.replace();
    this.$appCommon.enableFormValidation();
  },
  methods: {
    removeRefer(relatedTarget) {
      const self = this;
      let referId = $(relatedTarget).data('message');
      self.$http
        .delete('/course/refer/', {
          data: {
            referId,
          },
        })
        .then((res) => {
          if (res.data.status === 'success') {
            this.$toast.show({
              title: '已删除',
              icon: 'success',
            });
            window.location.reload();
          } else {
            this.$toast.show({
              title: '删除课程章节失败',
              msg: res.data.data.errorMsg,
              icon: 'danger',
            });
          }
        })
        .catch(() => {
          this.$toast.show({
            title: '删除课程章节失败',
            msg: '连接出现异常',
            icon: 'danger',
          });
        });
    },
  },
  components: { PreviewImageModal, AppModal },
};
</script>

<style lang="scss" scoped></style>
