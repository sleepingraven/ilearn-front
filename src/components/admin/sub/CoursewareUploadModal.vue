<template>
  <app-modal
    modal-id="uploadBackdrop"
    :static-modal="true"
    style="overflow-y: scroll"
    :modal-title="'上传课件'"
    :modal-footer="false"
  >
    <template v-slot:body>
      <file-pond
        name="filepond"
        ref="pond"
        class-name="courseware-file-field"
        label-idle='Drag & Drop your file or <span class="filepond--label-action">Browse</span>'
        allow-file-type-validation="false"
        :accepted-file-types="['*']"
        max-file-size="100MB"
        style-panel-layout="compact"
        :server="serverCourseware"
      />
    </template>
  </app-modal>
</template>

<script>
import FilePond from '@/filepond';
import AppModal from '@/components/common/AppModal';
import axios from 'axios';
import $ from 'jquery';

export default {
  name: 'CoursewareUploadModal',
  data() {
    return {
      sourceCourseware: null,
      serverCourseware: {
        process: null,
        revert: null,
      },
    };
  },
  created() {
    const self = this;
    this.serverCourseware.process = (fieldName, file, metadata, load, error, progress, abort) => {
      self.sourceCourseware = axios.CancelToken.source();

      const data = new FormData();
      data.append('file', file, file.name);
      data.append('groupId', self.coursewareGroup.id);
      data.append('courseId', self.$route.params.courseId);
      self.$http
        .post('/learn/courseware/upload', data, {
          headers: { 'Content-Type': 'multipart/form-data' },
          onUploadProgress: (e) => {
            progress(e.lengthComputable, e.loaded, e.total);
          },
          cancelToken: self.sourceCourseware.token,
        })
        .then((res) => {
          if (res.data.status === 'success') {
            load(res.data);
            let id = res.data.data;
            let courseware = {
              id,
              title: file.name,
            };
            self.coursewareUploadedCallback(courseware);
          } else {
            error(res.data.data.errorMsg);
            console.log(res.data.data.errorMsg);
          }
        })
        .catch((err) => {
          error('上传失败');
          console.log(err);
        });

      return {
        abort: () => {
          self.sourceCourseware.cancel('这里你可以输出一些信息，可以在catch中拿到');
          abort();
        },
      };
    };
  },
  mounted() {
    $('#uploadBackdrop').bind('hide.bs.modal', () => {
      this.$refs.pond.removeFiles();
    });
  },
  props: {
    coursewareGroup: {
      type: Object,
      required: true,
    },
    coursewareUploadedCallback: {
      type: Function,
      required: true,
    },
  },
  components: { FilePond, AppModal },
};
</script>

<style lang="scss" scoped></style>
