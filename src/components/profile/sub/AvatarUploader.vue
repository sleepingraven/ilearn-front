<template>
  <file-pond
    name="filepond"
    ref="pond"
    class-name="avatar-file-field"
    label-idle='Drag & Drop your picture or <span class="filepond--label-action">Browse</span>'
    allow-file-type-validation="false"
    :accepted-file-types="['image/*']"
    max-file-size="10MB"
    image-crop-aspect-ratio="1:1"
    style-panel-layout="compact circle"
    style-panel-aspect-ratio="1:1"
    style-button-remove-item-position="left bottom"
    style-button-process-item-position="right bottom"
    style-load-indicator-position="center bottom"
    style-progress-indicator-position="right bottom"
    style-image-edit-button-edit-item-position="bottom center"
    :server="server"
    :files="myFiles"
    @init="handleFilePondInit"
  />
</template>

<script>
import FilePond from '@/filepond';
import axios from 'axios';

export default {
  name: 'AvatarUploader',
  data: function () {
    return {
      myFiles: [
        {
          source: '/api' + new URL(this.value).pathname,
        },
      ],
      source: null,
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
      self.$http
        .post('/user/upload-avatar', data, {
          headers: { 'Content-Type': 'multipart/form-data' },
          onUploadProgress: (e) => {
            progress(e.lengthComputable, e.loaded, e.total);
          },
          cancelToken: self.source.token,
        })
        .then((res) => {
          if (res.data.status === 'success') {
            load(res.data);
            self.$appCommon.getUserCommonData().avatarUrl = res.data.data;
            self.$appCommon.fireUpdateUserCommonData();
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
  methods: {
    handleFilePondInit: function () {
      console.log('FilePond has initialized');

      // FilePond instance methods are available on `this.$refs.pond`
    },
  },
  props: {
    value: {
      type: String,
      required: true,
    },
  },
  components: { FilePond },
};
</script>

<style lang="scss">
.avatar-file-field {
  .filepond--drop-label {
    color: #4c4e53;
  }
  .filepond--label-action {
    text-decoration-color: #babdc0;
  }
  .filepond--panel-root {
    background-color: #edf0f4;
  }
}
</style>
