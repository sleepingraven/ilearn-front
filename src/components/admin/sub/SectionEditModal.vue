<template>
  <app-modal
    modal-id="uploadBackdrop"
    :static-modal="true"
    style="overflow-y: scroll"
    :modal-title="formatSectionTitleStr(section) + (sectionTitleEdited || section.temp ? ' *' : '')"
    footer-form="section-form"
    cancel-str="关闭"
    ok-str="保存"
    :ok-btn-disabled="sectionSubmitMutex || !sectionTitleEdited"
  >
    <template v-slot:body>
      <form id="section-form">
        <div class="form-group">
          <div class="input-group mb-3">
            <div class="input-group-prepend">
              <span class="input-group-text">
                <span data-feather="twitch"></span>
              </span>
            </div>
            <input
              type="text"
              class="form-control"
              placeholder="标题"
              v-model="sectionTitleViewInput"
              required
              @input="sectionTitleEdited = true"
            />
          </div>
        </div>
      </form>

      <file-pond
        name="filepond"
        ref="pondPoster"
        class-name="section-poster-file-field"
        label-idle='Drag & Drop your picture or <span class="filepond--label-action">Browse</span>'
        credits="false"
        allow-file-type-validation="false"
        :accepted-file-types="['image/*']"
        max-file-size="10MB"
        style-panel-layout="compact"
        :server="serverPoster"
        @init="handleFilePondInit"
      />

      <file-pond
        name="filepond"
        ref="pondVideo"
        class-name="section-video-file-field"
        label-idle='Drag & Drop your video or <span class="filepond--label-action">Browse</span>'
        allow-file-type-validation="false"
        :accepted-file-types="['video/*']"
        max-file-size="250MB"
        style-panel-layout="compact"
        :server="serverVideo"
        @init="handleFilePondInit"
      />
    </template>
  </app-modal>
</template>

<script>
import $ from 'jquery/dist/jquery.js';
import FilePond from '@/filepond';
import AppModal from '@/components/common/AppModal';
import axios from 'axios';

export default {
  name: 'SectionEditModal',
  data: function () {
    return {
      sectionTitleViewInput: '',
      sectionTitleEdited: false,
      sectionSubmitMutex: false,

      sourcePoster: null,
      serverPoster: {
        process: null,
        revert: null,
      },

      sourceVideo: null,
      serverVideo: {
        process: null,
        revert: null,
      },
    };
  },
  created() {
    const self = this;
    this.serverPoster.process = (fieldName, file, metadata, load, error, progress, abort) => {
      self.sourcePoster = axios.CancelToken.source();
      const section = self.section;
      if (section.temp) {
        error('上传失败');
        self.$toast.show({
          title: '请先保存「' + self.formatSectionTitleStr(section) + '」',
          msg: '',
          icon: 'danger',
        });
        return;
      }

      const data = new FormData();
      data.append('file', file, file.name);
      data.append('id', section.id);
      data.append('chapterId', section.chapterId);
      self.$http
        .post('/learn/section/upload-poster', data, {
          headers: { 'Content-Type': 'multipart/form-data' },
          onUploadProgress: (e) => {
            progress(e.lengthComputable, e.loaded, e.total);
          },
          cancelToken: self.sourcePoster.token,
        })
        .then((res) => {
          if (res.data.status === 'success') {
            load(res.data);
            section.posterFileName = file.name;
            section.posterUrl = res.data.data;
            self.$nextTick(() => {
              self.applyTooltip();
            });
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
          self.sourcePoster.cancel('这里你可以输出一些信息，可以在catch中拿到');
          abort();
        },
      };
    };

    this.serverVideo.process = (fieldName, file, metadata, load, error, progress, abort) => {
      self.sourceVideo = axios.CancelToken.source();
      const section = self.section;
      if (section.temp) {
        error('上传失败');
        self.$toast.show({
          title: '请先保存「' + self.formatSectionTitleStr(section) + '」',
          msg: '',
          icon: 'danger',
        });
        return;
      }

      const data = new FormData();
      data.append('file', file, file.name);
      data.append('id', section.id);
      data.append('chapterId', section.chapterId);
      self.$http
        .post('/learn/section/upload-video', data, {
          headers: { 'Content-Type': 'multipart/form-data' },
          onUploadProgress: (e) => {
            progress(e.lengthComputable, e.loaded, e.total);
          },
          cancelToken: self.sourceVideo.token,
        })
        .then((res) => {
          if (res.data.status === 'success') {
            load(res.data);
            section.videoUrl = res.data.data.videoUrl;
            section.seconds = res.data.data.seconds;
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
          self.sourceVideo.cancel('这里你可以输出一些信息，可以在catch中拿到');
          abort();
        },
      };
    };
  },
  mounted() {
    const self = this;
    const $modal = $('#uploadBackdrop');
    $modal.bind('show.bs.modal', () => {
      if (this.section.posterUrl && this.section.posterUrl.length) {
        this.$refs.pondPoster.addFile('/api' + new URL(this.section.posterUrl).pathname);
      }
      if (this.section.videoUrl && this.section.videoUrl.length) {
        this.$refs.pondVideo.addFile('/api' + new URL(this.section.videoUrl).pathname);
      }
      self.sectionTitleViewInput = self.section.title;
    });
    $modal.bind('hidden.bs.modal', () => {
      self.$refs.pondPoster.removeFiles();
      self.$refs.pondVideo.removeFiles();
      self.sectionTitleEdited = false;
    });

    let $sectionForm = $('#section-form');
    $sectionForm.submit((e) => {
      if (!$sectionForm[0].checkValidity()) {
        return;
      }
      e.preventDefault();
      self.sectionSubmitMutex = true;
      const section = self.section;
      let sectionCopy = JSON.parse(JSON.stringify(section));
      sectionCopy.title = self.sectionTitleViewInput;
      if (sectionCopy.temp) {
        // 添加操作
        self.$http
          .post('/learn/section', sectionCopy)
          .then((res) => {
            if (res.data.status === 'success') {
              self.sectionTitleEdited = false;
              self.sectionSubmitMutex = false;
              section.title = sectionCopy.title;
              section.temp = false;
              section.id = res.data.data;
              this.$toast.show({
                title: '保存成功',
                msg: '已保存「' + self.formatSectionTitleStr(self.section) + '」',
                icon: 'success',
              });
            } else {
              self.sectionSubmitMutex = false;
              this.$toast.show({
                title: '保存失败',
                msg: res.data.data.errorMsg,
                icon: 'danger',
              });
            }
          })
          .catch(() => {
            self.sectionSubmitMutex = false;
            this.$toast.show({
              title: '保存失败',
              msg: '连接出现异常',
              icon: 'danger',
            });
          });
      } else {
        // 更新操作
        self.$http
          .patch('/learn/section', sectionCopy)
          .then((res) => {
            if (res.data.status === 'success') {
              self.sectionTitleEdited = false;
              self.sectionSubmitMutex = false;
              section.title = sectionCopy.title;
              this.$toast.show({
                title: '保存成功',
                msg: '已修改为「' + self.formatSectionTitleStr(self.section) + '」',
                icon: 'success',
              });
            } else {
              self.sectionSubmitMutex = false;
              this.$toast.show({
                title: '保存失败',
                msg: res.data.data.errorMsg,
                icon: 'danger',
              });
            }
          })
          .catch(() => {
            self.sectionSubmitMutex = false;
            this.$toast.show({
              title: '保存失败',
              msg: '连接出现异常',
              icon: 'danger',
            });
          });
      }
    });
  },
  methods: {
    handleFilePondInit: function () {
      console.log('FilePond has initialized');

      // FilePond instance methods are available on `this.$refs.pond`
    },
    handleOk() {
      console.log(this.$refs.pondVideo.getFile().fileSize);
      console.log(this.$refs.pondVideo.getFile().getMetadata());
    },
  },
  computed: {
    posterUrl() {
      return this.section.poster;
    },
    videoUrl() {
      return this.section.url;
    },
  },
  props: {
    section: {
      type: Object,
      required: true,
    },
    formatSectionTitleStr: {
      type: Function,
      required: true,
    },
    applyTooltip: {
      type: Function,
      required: true,
    },
  },
  components: { AppModal, FilePond },
};
</script>

<style lang="scss"></style>
