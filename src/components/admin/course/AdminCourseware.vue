<template>
  <div>
    <ul class="list-group list-group-flush">
      <li class="list-group-item text-reset px-0">
        <div class="table-responsive">
          <table class="table table-striped table-hover table-bordered table-sm">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">标题</th>
                <th scope="col"></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(cw, idx) in coursewareGroups[0].coursewares" :key="idx">
                <th scope="row">{{ idx + 1 }}</th>
                <td>
                  <div>{{ cw.title }}</div>
                </td>
                <td>
                  <button
                    type="button"
                    class="btn btn-sm btn-outline-danger rounded-lg"
                    style="line-height: 0.875"
                    data-toggle="modal"
                    data-target="#modalBackdropDeleteCourseware"
                    :data-message="idx"
                    @click="coursewareDeleteTitle = '确定删除「' + cw.title + '」？'"
                  >
                    <span data-feather="trash-2"></span>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </li>
      <li class="list-group-item text-reset px-0 pt-0">
        <form id="courseware-group-form" class="needs-validation" novalidate>
          <div class="form-group">
            <div class="input-group">
              <div class="input-group-prepend">
                <span class="input-group-text">
                  <span data-feather="file-text"></span>
                </span>
              </div>
              <textarea
                class="form-control"
                placeholder="请输入描述内容"
                rows="3"
                v-model="coursewareGroups[0].description"
              ></textarea>
            </div>
            <div class="invalid-feedback">Please enter a message in the textarea.</div>
          </div>
          <button type="submit" class="btn btn-sm btn-primary mr-1">
            <span data-feather="save"></span>
            保存
          </button>
          <button
            type="button"
            class="btn btn-info"
            style="line-height: 0.875"
            data-toggle="modal"
            data-target="#uploadBackdrop"
          >
            <span data-feather="upload-cloud"></span>
          </button>
        </form>
      </li>
    </ul>

    <app-modal
      modal-id="modalBackdropDeleteCourseware"
      :ok-callback="removeCourseware"
      :modal-title="coursewareDeleteTitle"
      :modal-body="false"
    ></app-modal>
    <CoursewareUploadModal :courseware-group="coursewareGroups[0]" :courseware-uploaded-callback="coursewareUploaded" />
  </div>
</template>

<script>
import CoursewareUploadModal from '@/components/admin/sub/CoursewareUploadModal';
import AppModal from '@/components/common/AppModal';
import $ from 'jquery';
import feather from 'feather-icons';

export default {
  name: 'AdminCourseware',
  data() {
    return {
      coursewareGroups: [
        {
          id: -1,
          description: '',
          coursewares: [],
        },
      ],
      coursewareDeleteTitle: '',
    };
  },
  created() {
    const self = this;
    self.$http
      .get('/learn/courseware/' + self.$route.params.courseId)
      .then((res) => {
        if (res.data.status === 'success') {
          res.data.data.forEach((g) => {
            g.description = g.description || '';
            g.coursewares = g.coursewares || [];
          });
          self.coursewareGroups = res.data.data;
          this.$nextTick(() => {
            feather.replace();
          });
        } else {
          self.$toast.show({
            title: '获取课件失败',
            msg: res.data.data.errorMsg,
            icon: 'danger',
          });
        }
      })
      .catch(() => {
        self.$toast.show({
          title: '获取课件失败',
          msg: '',
          icon: 'danger',
        });
      });
  },
  mounted() {
    const self = this;
    let $coursewareGroupForm = $('#courseware-group-form');
    $coursewareGroupForm.submit((e) => {
      if (!$coursewareGroupForm[0].checkValidity()) {
        return;
      }
      e.preventDefault();
      const coursewareGroup = self.coursewareGroups[0];
      self.$http
        .patch('/learn/courseware-group', {
          id: coursewareGroup.id,
          courseId: self.$route.params.courseId,
          description: coursewareGroup.description,
        })
        .then((res) => {
          if (res.data.status === 'success') {
            window.location.reload();
          } else {
            this.$toast.show({
              title: '保存失败',
              msg: res.data.data.errorMsg,
              icon: 'danger',
            });
          }
        })
        .catch(() => {
          this.$toast.show({
            title: '保存失败',
            msg: '连接出现异常',
            icon: 'danger',
          });
        });
    });
  },
  methods: {
    removeCourseware(relatedTarget) {
      const self = this;
      let idx = $(relatedTarget).data('message');
      const courseware = self.coursewareGroups[0].coursewares[idx];
      self.$http
        .delete('/learn/courseware', {
          data: {
            id: courseware.id,
            courseId: self.$route.params.courseId,
          },
        })
        .then((res) => {
          if (res.data.status === 'success') {
            this.$toast.show({
              title: '已删除课件',
              icon: 'success',
            });
            window.location.reload();
          } else {
            this.$toast.show({
              title: '删除课件失败',
              msg: res.data.data.errorMsg,
              icon: 'danger',
            });
          }
        })
        .catch(() => {
          this.$toast.show({
            title: '删除课件失败',
            msg: '连接出现异常',
            icon: 'danger',
          });
        });
    },
    coursewareUploaded(courseware) {
      this.coursewareGroups[0].coursewares.push(courseware);
      this.$nextTick(() => {
        feather.replace();
      });
    },
  },
  components: { CoursewareUploadModal, AppModal },
};
</script>

<style lang="scss" scoped>
li {
  border: 0;
}
</style>
