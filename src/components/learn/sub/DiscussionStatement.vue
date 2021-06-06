<template>
  <div
    :id="uuid"
    class="media statement-div"
    :class="{ 'pt-3': type !== 0, 'border-bottom border-gray': statementBorder }"
  >
    <a href="#">
      <img :src="statement.avatarUrl" class="rounded-circle" alt="" style="width: 32px; height: 32px" />
    </a>
    <div class="media-body">
      <!-- 1. statement -->
      <div class="pb-1 statement-body" :class="{ 'border-bottom border-gray': statementBodyBorder }">
        <!-- a. p -->
        <p class="mb-1 position-relative">
          <!-- i. name -->
          <strong class="d-block" style="z-index: 1501">
            <a href="#" class="text-decoration-none text-muted">{{ statement.userName }}</a>
            <span v-if="type > 2">
              &nbsp;
              <span class="font-weight-normal">回复</span>
              &nbsp;
              <a href="#" class="text-decoration-none text-muted">{{ statement.referComment.statement.userName }}</a>
            </span>
          </strong>
          <!-- ii. content -->
          <span class="content-area">
            <!--
            todo xssOptions
            -->
            <mavon-editor
              style="min-height: auto; min-width: auto; border: none; z-index: 2"
              :subfield="false"
              :code-style="'xcode'"
              :value="statement.content"
              :box-shadow="false"
              :preview-background="'#fff'"
              :default-open="'preview'"
              :editable="false"
              :toolbars-flag="false"
              :toolbars="{ fullscreen: true, readmodel: true, navigation: true }"
            />
          </span>
        </p>
        <!-- b. toolbar -->
        <div class="d-flex statement-body-toolbar">
          <button
            type="button"
            class="btn btn-light btn-sm border-0 app-light-btn"
            :class="{ active: statement.liked }"
            @click="performLike"
          >
            <span data-feather="thumbs-up"></span>
            {{ statement.totalLikes }}
          </button>
          <slot name="toolbarRear"></slot>
          <div class="statement-body-toolbar-hideable">
            <button
              type="button"
              class="btn btn-light btn-sm border-0 app-light-btn"
              data-toggle="collapse"
              :data-target="'#' + uuid + ' > .media-body > .reply-div, .reply-div.show'"
              :disabled="!$appCommon.getUserCommonData().roles.has('SPEAKER')"
            >
              {{ replyBtnVal }}
            </button>
            <!--<button type="button" class="btn btn-outline-secondary btn-sm border-0 app-light-btn">编辑</button>-->
            <!--<button type="button" class="btn btn-outline-danger btn-sm border-0 app-light-btn">删除</button>-->
            <!--<button type="button" class="btn btn-outline-warning btn-sm border-0 app-light-btn">屏蔽</button>-->
          </div>
          <div ref="publishDiv" class="statement-body-toolbar-interactive ml-auto">
            <button
              type="button"
              class="btn btn-outline-success btn-sm border-0"
              :disabled="!commentVal.length || submittingMutex"
              @click="saveReply"
            >
              <span data-feather="send"></span>
              发布
            </button>
          </div>
        </div>
      </div>
      <!-- 2. reply -->
      <div class="mb-2 collapse reply-div">
        <md-editor
          style="min-width: auto; z-index: 2"
          :toolbars-background="'#f9f9f9'"
          :subfield="true"
          :placeholder="'回复' + statement.userName"
          server-api="/discussion/upload-discussion-img"
          v-model="commentVal"
        />
      </div>

      <slot></slot>
    </div>
  </div>
</template>

<script>
import $ from 'jquery/dist/jquery.js';
import feather from 'feather-icons';
import MdEditor from '@/components/common/MdEditor';

export default {
  name: 'DiscussionStatement',
  data: () => ({
    collapsed: true,
    commentVal: '',
    submittingMutex: false,
    likeMutex: false,
  }),
  mounted() {
    feather.replace({ width: 20, height: 20 });
    const self = this;
    let $replyDiv = $('#' + this.uuid + ' > .media-body > .reply-div');
    $replyDiv.on('shown.bs.collapse', () => {
      self.collapsed = false;
    });
    $replyDiv.on('hidden.bs.collapse', () => {
      self.collapsed = true;
    });
    let $toolbarRight = $(
      '#' + this.uuid + ' > .media-body > .statement-body > .statement-body-toolbar > .statement-body-toolbar-hideable'
    );
    $replyDiv.on('show.bs.collapse', () => {
      $toolbarRight.removeClass('statement-body-toolbar-hideable');
      $(self.$refs.publishDiv).addClass('statement-body-toolbar-interactive-enabled');
    });
    $replyDiv.on('hide.bs.collapse', () => {
      $toolbarRight.addClass('statement-body-toolbar-hideable');
      $(self.$refs.publishDiv).removeClass('statement-body-toolbar-interactive-enabled');
    });
  },
  methods: {
    saveReply() {
      const self = this;
      self.submittingMutex = true;
      self.$http
        .post('/discussion/reply', {
          level: self.type + 1,
          content: self.commentVal,
          replyTo: self.referId,
        })
        .then((res) => {
          if (res.data.status === 'success') {
            let newComment = {
              id: res.data.data,
              level: self.type + 1,
              replyToId: self.referId,
              statement: {
                createTime: new Date(),
                content: self.commentVal,
                userId: self.$appCommon.getUserCommonData().id,
                userName: self.$appCommon.getUserCommonData().name,
                avatarUrl: self.$appCommon.getUserCommonData().avatarUrl,
                totalLikes: 0,
              },
              comments: [],
              count: 0,
            };

            self.submittingMutex = false;
            self.commentVal = '';
            self.repliedCallback(newComment);
            $('#' + this.uuid + ' > .media-body > .reply-div').collapse('hide');
          } else {
            this.$toast.show({
              title: '出错了',
              msg: res.data.data.errorMsg,
              icon: 'danger',
            });
            self.submittingMutex = false;
          }
        })
        .catch(() => {
          this.$toast.show({
            title: '出错了',
            msg: '连接出现异常',
            icon: 'danger',
          });
          self.submittingMutex = false;
        });
    },
    performLike() {
      const self = this;
      if (self.likeMutex) {
        return;
      }
      self.likeMutex = true;
      self.$http
        .post('/discussion/like', {
          statementId: self.statement.id,
          like: !self.statement.liked,
        })
        .then((res) => {
          if (res.data.status === 'success') {
            self.statement.liked = !self.statement.liked;
            self.statement.totalLikes += self.statement.liked ? 1 : -1;
          } else {
            this.$toast.show({
              title: '出错了',
              msg: res.data.data.errorMsg,
              icon: 'danger',
            });
          }
          self.likeMutex = false;
        })
        .catch(() => {
          this.$toast.show({
            title: '出错了',
            msg: '连接出现异常',
            icon: 'danger',
          });
          self.likeMutex = false;
        });
    },
  },
  computed: {
    replyBtnVal: function () {
      return this.collapsed ? '回复' : '取消回复';
    },
  },
  props: {
    uuid: {
      type: String,
      required: true,
    },
    // 回复给谁
    referId: {
      type: Number,
      required: true,
    },
    type: {
      type: Number,
      default: 1, // 0：主题；1：一级评论；2 以上：二级评论
    },
    repliedCallback: {
      type: Function,
      required: true,
    },
    statement: {
      type: Object,
      required: true,
    },
    statementBorder: {
      type: Boolean,
      default: false,
    },
    statementBodyBorder: {
      type: Boolean,
      default: false,
    },
  },
  components: { MdEditor },
};
</script>

<style lang="scss" scoped>
.statement-body {
  font-size: smaller;
  font-weight: 400;
  //line-height: 1.25;
}
.statement-div {
  .statement-body-toolbar {
    button {
      border-radius: 10rem;
    }
    .statement-body-toolbar-hideable {
      transition: opacity 0.2s;
      opacity: 0;
    }
    .statement-body-toolbar-interactive {
      opacity: 0;
      visibility: hidden;
      transition: all 0.2s;
      .btn {
        transition: all 0.15s ease-in-out;
      }
    }
    .statement-body-toolbar-interactive.statement-body-toolbar-interactive-enabled {
      opacity: 1;
      visibility: visible;
    }
  }
  :hover {
    > .statement-body-toolbar .statement-body-toolbar-hideable {
      opacity: 1;
    }
  }
}
</style>
