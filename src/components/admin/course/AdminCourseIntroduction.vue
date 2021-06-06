<template>
  <ModificationListTemplate
    ref="modificationList"
    :list-data="introductions"
    :header-text-operator="(item, idx) => '第' + (idx + 1) + '段'"
    :title-function="(intro) => intro.title"
    @itemAdd="handleItemAdd"
    @itemUpdate="handleItemUpdate"
    @itemDelete="handleItemDelete"
  >
    <template v-slot:list-form-body="slotProps">
      <div class="form-group">
        <div class="input-group mb-3">
          <div class="input-group-prepend">
            <span class="input-group-text">
              <span data-feather="twitch"></span>
            </span>
          </div>
          <input type="text" class="form-control" placeholder="请输入标题" v-model="slotProps.item.title" required />
        </div>
      </div>
      <div class="form-group">
        <label class="h3" :for="'content-field-' + slotProps.idx">内容</label>
        <md-editor
          :id="'content-field-' + slotProps.idx"
          class="form-control p-0"
          style="min-width: auto; z-index: 2; font-size: 1rem"
          :toolbars-background="'#f9f9f9'"
          :subfield="false"
          placeholder="请输入介绍内容"
          :preview-background="'#fff'"
          :default-open="'preview'"
          server-api="/learn/upload-learn-img"
          v-model="slotProps.item.content"
        />
      </div>
    </template>
  </ModificationListTemplate>
</template>

<script>
import feather from 'feather-icons';
import ModificationListTemplate from '@/components/admin/sub/ModificationListTemplate';
import MdEditor from '@/components/common/MdEditor';

export default {
  name: 'AdminCourseIntroduction',
  data() {
    return {
      introductions: [],
    };
  },
  created() {
    const self = this;
    self.$http
      .get('/learn/introduction/' + self.$route.params.courseId)
      .then((res) => {
        if (res.data.status === 'success') {
          let message = res.data.data;
          self.introductions = message.introductions;
          this.$nextTick(() => {
            feather.replace();
          });
        } else {
          this.$toast.show({
            title: '获取课程介绍失败',
            msg: res.data.data.errorMsg,
            icon: 'danger',
          });
        }
      })
      .catch(() => {
        this.$toast.show({
          title: '获取课程介绍失败',
          msg: '连接出现异常',
          icon: 'danger',
        });
      });
  },
  mounted() {
    feather.replace();
  },
  methods: {
    handleItemAdd(item, idx, submitCallback) {
      const self = this;
      let introductionItem = JSON.parse(JSON.stringify(item));
      introductionItem.courseId = self.$route.params.courseId;
      self.$http
        .post('/learn/introduction/', introductionItem)
        .then((res) => {
          if (res.data.status === 'success') {
            let introductionId = res.data.data;
            self.introductions[idx].id = introductionId;
            this.$toast.show({
              title: '已保存',
              icon: 'success',
            });
            submitCallback(true);
          } else {
            this.$toast.show({
              title: '保存课程介绍失败',
              msg: res.data.data.errorMsg,
              icon: 'danger',
            });
            submitCallback(false);
          }
        })
        .catch(() => {
          this.$toast.show({
            title: '保存课程介绍失败',
            msg: '连接出现异常',
            icon: 'danger',
          });
          submitCallback(false);
        });
    },
    handleItemUpdate(item, idx, submitCallback) {
      const self = this;
      let introductionItem = JSON.parse(JSON.stringify(item));
      introductionItem.courseId = self.$route.params.courseId;
      self.$http
        .put('/learn/introduction/', introductionItem)
        .then((res) => {
          if (res.data.status === 'success') {
            this.$toast.show({
              title: '已保存',
              icon: 'success',
            });
            submitCallback(true);
          } else {
            this.$toast.show({
              title: '保存课程介绍失败',
              msg: res.data.data.errorMsg,
              icon: 'danger',
            });
            submitCallback(false);
          }
        })
        .catch(() => {
          this.$toast.show({
            title: '保存课程介绍失败',
            msg: '连接出现异常',
            icon: 'danger',
          });
          submitCallback(false);
        });
    },
    handleItemDelete(item, idx, deleteCallback) {
      const self = this;
      self.$http
        .delete('/learn/introduction/', {
          data: {
            id: item.id,
            courseId: self.$route.params.courseId,
          },
        })
        .then((res) => {
          if (res.data.status === 'success') {
            this.$toast.show({
              title: '已删除「' + self.$refs.modificationList.fullTitle(item, idx) + '」',
              icon: 'success',
            });
            deleteCallback(true);
          } else {
            this.$toast.show({
              title: '删除课程介绍失败',
              msg: res.data.data.errorMsg,
              icon: 'danger',
            });
            deleteCallback(false);
          }
        })
        .catch(() => {
          this.$toast.show({
            title: '删除课程介绍失败',
            msg: '连接出现异常',
            icon: 'danger',
          });
          deleteCallback(false);
        });
    },
  },
  components: { MdEditor, ModificationListTemplate },
};
</script>

<style lang="scss" scoped></style>
