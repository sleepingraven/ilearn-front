<template>
  <div>
    <ModificationListTemplate
      ref="modificationList"
      :list-data="chapters"
      :header-text-operator="(item, idx) => '第' + (idx + 1) + '章'"
      :title-function="(chapter) => chapter.title"
      :item-delete-modal-body-operator="
        (item) =>
          item && item.sections && item.sections.length ? '本章共有' + item.sections.length + '节' : '本章还没有课'
      "
      @tempItemAdding="tempItemAdding"
      @itemAdd="handleItemAdd"
      @itemUpdate="handleItemUpdate"
      @itemDelete="handleItemDelete"
    >
      <template v-slot:list-form-toolbar="slotProps">
        <button
          type="button"
          class="btn btn-sm btn-outline-secondary"
          @click="handleAddSection(slotProps.item, slotProps.idx)"
          :disabled="slotProps.item.temp"
        >
          <span data-feather="file-plus"></span>
          新增
        </button>
      </template>
      <template v-slot:list-form-body="slotProps">
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
              placeholder="请输入章节标题"
              v-model="slotProps.item.title"
              required
            />
          </div>
        </div>
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
              rows="2"
              v-model="slotProps.item.description"
            ></textarea>
          </div>
          <div class="invalid-feedback">Please enter a message in the textarea.</div>
        </div>

        <div class="table-responsive">
          <table class="table table-striped table-hover table-bordered table-sm">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">标题</th>
                <th scope="col">时长</th>
                <th scope="col">封面</th>
                <th scope="col"></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(s, si) in slotProps.item.sections" :key="si">
                <th scope="row">{{ si + 1 }}</th>
                <td>
                  <div>{{ s.title }}</div>
                </td>
                <td>
                  <span v-if="s.seconds">{{ s.seconds | getSectionTimeStr }}</span>
                </td>
                <td>
                  <div class="d-flex justify-content-between" v-if="s.posterUrl && s.posterUrl.length">
                    <span>
                      {{ s.posterFileName }}
                    </span>
                    <div
                      class="d-inline-block"
                      tabindex="0"
                      data-toggle="tooltip"
                      data-html="true"
                      data-boundary="scrollParent"
                      :data-message="s.posterUrl"
                    >
                      <span data-feather="eye"></span>
                    </div>
                  </div>
                </td>
                <td>
                  <button
                    type="button"
                    class="btn btn-sm btn-primary rounded-lg mr-1"
                    style="line-height: 0.875"
                    data-toggle="modal"
                    data-target="#uploadBackdrop"
                    @click="
                      sectionCurrentEdit.ci = slotProps.idx;
                      sectionCurrentEdit.si = si;
                      sectionCurrentEdit.section = s;
                    "
                    :disabled="s.temp && si > 0 && slotProps.item.sections[si - 1].temp"
                  >
                    <span data-feather="edit"></span>
                  </button>
                  <button
                    type="button"
                    class="btn btn-sm btn-outline-danger rounded-lg"
                    style="line-height: 0.875"
                    data-toggle="modal"
                    data-target="#modalBackdropDeleteSection"
                    :data-message="JSON.stringify({ ci: slotProps.idx, si })"
                    @click="sectionDeleteTitle = '确定删除「' + formatSectionTitleStr(slotProps.idx, si, s) + '」？'"
                  >
                    <span data-feather="trash-2"></span>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </template>
    </ModificationListTemplate>

    <app-modal
      modal-id="modalBackdropDeleteSection"
      :ok-callback="removeSection"
      :modal-title="sectionDeleteTitle"
      :modal-body="false"
    ></app-modal>
    <SectionEditModal
      :section="sectionCurrentEdit.section"
      :format-section-title-str="(s) => formatSectionTitleStr(sectionCurrentEdit.ci, sectionCurrentEdit.si, s)"
      :apply-tooltip="applyTooltip"
    />
  </div>
</template>

<script>
import $ from 'jquery/dist/jquery.js';
import $AppUtil from '@/assets/js/common';
import feather from 'feather-icons';
import ModificationListTemplate from '@/components/admin/sub/ModificationListTemplate';
import SectionEditModal from '@/components/admin/sub/SectionEditModal';
import AppModal from '@/components/common/AppModal';

export default {
  name: 'AdminCourseChapter',
  data() {
    return {
      chapters: [],
      sectionDeleteTitle: '',
      sectionCurrentEdit: {
        ci: 0,
        si: 0,
        section: {},
      },
    };
  },
  created() {
    const self = this;
    self.$http
      .get('/learn/chapter/' + self.$route.params.courseId)
      .then((res) => {
        if (res.data.status === 'success') {
          let message = res.data.data.chapters;
          message.forEach((chapter) => {
            if (!chapter.sections) {
              chapter.sections = [];
            }
            chapter.totalSections = chapter.sections.length;
          });
          self.chapters = message;
          self.$nextTick(() => {
            self.applyTooltip();
          });
          self.chapters.forEach((c) => {
            if (c.sections) {
              c.sections.forEach((s) => {
                s.chapterId = c.id;
              });
            }
          });
        } else {
          this.$toast.show({
            title: '获取课程章节失败',
            msg: res.data.data.errorMsg,
            icon: 'danger',
          });
        }
      })
      .catch(() => {
        this.$toast.show({
          title: '获取课程章节失败',
          msg: '连接出现异常',
          icon: 'danger',
        });
      });
  },
  methods: {
    handleItemAdd(item, idx, submitCallback) {
      const self = this;
      let chapterItem = JSON.parse(JSON.stringify(item));
      chapterItem.courseId = self.$route.params.courseId;
      self.$http
        .post('/learn/chapter/', chapterItem)
        .then((res) => {
          if (res.data.status === 'success') {
            let chapterId = res.data.data;
            self.chapters[idx].id = chapterId;
            this.$toast.show({
              title: '已保存',
              icon: 'success',
            });
            submitCallback(true);
          } else {
            this.$toast.show({
              title: '保存课程章节失败',
              msg: res.data.data.errorMsg,
              icon: 'danger',
            });
            submitCallback(false);
          }
        })
        .catch(() => {
          this.$toast.show({
            title: '保存课程章节失败',
            msg: '连接出现异常',
            icon: 'danger',
          });
          submitCallback(false);
        });
    },
    handleItemUpdate(item, idx, submitCallback) {
      const self = this;
      let chapterItem = JSON.parse(JSON.stringify(item));
      chapterItem.courseId = self.$route.params.courseId;
      self.$http
        .put('/learn/chapter/', chapterItem)
        .then((res) => {
          if (res.data.status === 'success') {
            this.$toast.show({
              title: '已保存',
              icon: 'success',
            });
            submitCallback(true);
          } else {
            this.$toast.show({
              title: '保存课程章节失败',
              msg: res.data.data.errorMsg,
              icon: 'danger',
            });
            submitCallback(false);
          }
        })
        .catch(() => {
          this.$toast.show({
            title: '保存课程章节失败',
            msg: '连接出现异常',
            icon: 'danger',
          });
          submitCallback(false);
        });
    },
    handleItemDelete(item, idx, deleteCallback) {
      const self = this;
      self.$http
        .delete('/learn/chapter/', {
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
              title: '删除课程章节失败',
              msg: res.data.data.errorMsg,
              icon: 'danger',
            });
            deleteCallback(false);
          }
        })
        .catch(() => {
          this.$toast.show({
            title: '删除课程章节失败',
            msg: '连接出现异常',
            icon: 'danger',
          });
          deleteCallback(false);
        });
    },
    removeSection(relatedTarget) {
      const self = this;
      let msg = $(relatedTarget).data('message');
      const section = self.chapters[msg.ci].sections[msg.si];
      self.$http
        .delete('/learn/section/', {
          data: {
            id: section.id,
            chapterId: section.chapterId,
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
    // 必须在 push 之前赋值，否则新增是不会刷新
    tempItemAdding(chapter) {
      chapter.sections = [];
    },
    handleAddSection(chapter) {
      chapter.sections.push({
        title: '',
        seconds: 0,
        posterFileName: '',
        posterUrl: '',
        videoUrl: '',
        chapterId: chapter.id,
        temp: true,
      });
      this.$nextTick(() => {
        feather.replace();
      });
    },
    formatSectionTitleStr(ci, si, section) {
      return ci + 1 + '-' + (si + 1) + (section.title && section.title.length ? ' ' + section.title : '');
    },
    applyTooltip() {
      feather.replace();
      $('[data-toggle="tooltip"]:not(.tooltip-init)')
        .tooltip({
          title: function () {
            let posterUrl = $(this).data('message');
            return '<img src="' + posterUrl + '" width="100%" alt="预览图" />';
          },
        })
        .addClass('tooltip-init');
    },
  },
  filters: {
    getSectionTimeStr: function (seconds) {
      let minutes = Math.floor(seconds / 60);
      seconds %= 60;
      minutes = $AppUtil.completeLeadingZero2TwoDigits(minutes);
      seconds = $AppUtil.completeLeadingZero2TwoDigits(seconds);
      return minutes + ':' + seconds;
    },
  },
  components: { ModificationListTemplate, SectionEditModal, AppModal },
};
</script>

<style lang="scss" scoped>
.tooltip {
  width: 500px;
}
</style>
