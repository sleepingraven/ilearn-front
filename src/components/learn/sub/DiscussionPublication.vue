<template>
  <div>
    <!-- 1. Button trigger modal -->
    <button
      type="button"
      class="btn btn-outline-primary"
      style="border-radius: 10rem"
      data-toggle="modal"
      data-target="#staticBackdropPublish"
    >
      发布
    </button>
    <!-- 2. Modal -->
    <app-modal
      modal-id="staticBackdropPublish"
      dialog-class="modal-xl"
      body-class="pb-0"
      modal-title="发布讨论"
      :static-modal="true"
      footer-form="post-publish-form"
      :ok-btn-disabled="submitMutex"
    >
      <template v-slot:body>
        <form id="post-publish-form">
          <div class="form-group">
            <div class="input-group mb-3">
              <div class="input-group-prepend">
                <span class="input-group-text">
                  <span data-feather="twitch"></span>
                </span>
              </div>
              <input type="text" class="form-control" placeholder="标题" v-model="subjectTitle" required />
            </div>
          </div>
          <div class="form-group">
            <md-editor
              style="min-width: auto; z-index: 999"
              :toolbars-background="'#f9f9f9'"
              :box-shadow="false"
              :subfield="true"
              :placeholder="'内容'"
              server-api="/discussion/upload-discussion-img"
              v-model="subjectVal"
            />
          </div>
        </form>
      </template>
    </app-modal>
  </div>
</template>

<script>
import AppModal from '@/components/common/AppModal';
import $ from 'jquery';
import MdEditor from '@/components/common/MdEditor';

export default {
  name: 'DiscussionPublication',
  data: () => ({
    subjectTitle: '',
    subjectVal: '',
    submitMutex: false,
  }),
  mounted() {
    const self = this;
    let publishForm = $('#post-publish-form');
    publishForm.submit((e) => {
      if (!publishForm[0].checkValidity()) {
        return;
      }
      self.submitMutex = true;
      e.preventDefault();
      self.$http
        .post('/discussion/publish', {
          title: self.subjectTitle,
          content: self.subjectVal,
          courseId: self.$route.params.courseId,
        })
        .then((res) => {
          if (res.data.status === 'success') {
            window.location.reload();
          } else {
            this.$toast.show({
              title: '发布失败',
              msg: res.data.data.errorMsg,
              icon: 'danger',
            });
            self.submitMutex = false;
          }
        })
        .catch(() => {
          this.$toast.show({
            title: '发布失败',
            msg: '连接出现异常',
            icon: 'danger',
          });
          self.submitMutex = false;
        });
    });
  },
  components: { AppModal, MdEditor },
};
</script>

<style lang="scss" scoped></style>
