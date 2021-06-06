<template>
  <app-modal
    modal-id="uploadBackdrop"
    :static-modal="true"
    style="overflow-y: scroll"
    modal-title="更换预览图"
    :modal-footer="false"
  >
    <template v-slot:body>
      <file-pond
        name="filepond"
        ref="pondPreview"
        class-name="section-poster-file-field"
        label-idle='Drag & Drop your picture or <span class="filepond--label-action">Browse</span>'
        credits="false"
        allow-file-type-validation="false"
        :accepted-file-types="['image/*']"
        max-file-size="10MB"
        style-panel-layout="compact"
        :server="server"
        @init="handleFilePondInit"
        image-crop-aspect-ratio="16:10"
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
  name: 'PreviewImageModal',
  data() {
    return {
      server: {
        process: null,
        revert: null,
      },
    };
  },
  created() {
    const self = this;
    this.server.process = (fieldName, file, metadata, load, error, progress, abort) => {
      self.source = axios.CancelToken.source();
      const data = new FormData();
      data.append('file', file, file.name);
      data.append('courseId', self.courseId);
      self.$http
        .post('/course/upload-preview-img', data, {
          headers: { 'Content-Type': 'multipart/form-data' },
          onUploadProgress: (e) => {
            progress(e.lengthComputable, e.loaded, e.total);
          },
          cancelToken: self.source.token,
        })
        .then((res) => {
          if (res.data.status === 'success') {
            load(res.data);
            self.value = res.data.data;
            self.$emit('input', self.value);
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
          self.source.cancel('这里你可以输出一些信息，可以在catch中拿到');
          abort();
        },
      };
    };
  },
  mounted() {
    $('#uploadBackdrop').bind('show.bs.modal', () => {
      if (this.value && this.value.length) {
        this.$refs.pondPreview.addFile('/api' + new URL(this.value).pathname);
      }
    });
  },
  methods: {
    // eslint-disable-next-line no-unused-vars
    loadFile(imageUrl) {
      // this.$refs.pondPreview.addFile(imageUrl);
    },
    handleFilePondInit: function () {
      console.log('FilePond has initialized');

      // FilePond instance methods are available on `this.$refs.pond`
    },
  },
  props: {
    courseId: {
      type: [Number, String],
      required: true,
    },
    value: {
      type: String,
      required: true,
    },
  },
  components: { AppModal, FilePond },
};
</script>

<style lang="scss" scoped></style>
