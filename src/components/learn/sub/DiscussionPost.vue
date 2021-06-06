<template>
  <div class="mb-3 pt-3 px-3 bg-white rounded shadow-sm" :class="{ 'mt-3': pi > 0 }">
    <!-- a. subject -->
    <div>
      <h5>{{ post.title }}</h5>
      <DiscussionStatement
        :uuid="'statement-discussion-subject-' + pi"
        :statement="post.statement"
        :type="0"
        :refer-id="post.id"
        :statement-border="true"
        :replied-callback="(c) => pushPostComment(post, c)"
      >
        <template v-slot:toolbarRear>
          <button
            :id="'statement-discussion-subject-' + pi + '-comment-toggle-btn'"
            type="button"
            class="btn btn-sm btn-light border-0 app-light-btn"
            data-toggle="collapse"
            :data-target="'#statement-discussion-subject-' + pi + '-comment-div'"
          >
            <span data-feather="message-circle"></span>
            {{ post.totalReplies }} 条评论
          </button>
        </template>
      </DiscussionStatement>
    </div>
    <!-- b. comments -->
    <CommentsCollapseDiv
      ref="CommentsCollapseDiv"
      :id="'statement-discussion-subject-' + pi + '-comment-div'"
      :div-id="'statement-discussion-subject-' + pi + '-comment-div'"
      :btn-id="'statement-discussion-subject-' + pi + '-comment-toggle-btn'"
      :post="post"
      class="collapse"
    >
      <DiscussionStatement
        :uuid="'statement-discussion-subject-' + pi + '-comment-' + ci"
        v-for="(postComment, ci) in post.comments"
        :key="ci"
        :statement="postComment.statement"
        :type="1"
        :refer-id="postComment.id"
        :statement-border="post.comments | borderOfPostComments(ci)"
        :statement-body-border="post.comments | borderOfPostCommentsContent(ci)"
        :replied-callback="(cc) => pushPostCommentComment(postComment, cc, post, 1)"
      >
        <template v-slot:toolbarRear>
          <button
            v-if="postComment.count > postComment.secondPageSize"
            type="button"
            class="btn btn-sm btn-light border-0"
            disabled
          >
            <span>{{ postComment.currPageIdx + 1 }}</span>
            &nbsp;
            <span>/</span>
            &nbsp;
            <span>{{ Math.ceil(postComment.count / postComment.secondPageSize) }}</span>
          </button>
        </template>
        <div class="position-relative reply-area-root">
          <DiscussionStatement
            :uuid="'statement-discussion-subject-' + pi + '-comment-' + ci + '-comment-' + inci"
            v-for="(inc, inci) in postComment.comments"
            :key="inci"
            :statement="inc.statement"
            :type="inc.level"
            :refer-id="inc.id"
            :statement-border="post.comments | borderOfPostCommentComments(ci, postComment.comments, inci)"
            :statement-body-border="postComment.comments | borderOfPostCommentCommentsContent(inci)"
            :replied-callback="(cc) => pushPostCommentComment(postComment, cc, post, 0)"
          ></DiscussionStatement>
          <button
            v-show="postComment.currPageIdx > 0"
            class="btn btn-light rounded-lg second-level-comment-pager"
            style="bottom: 0; right: 100%; z-index: 4; left: -1.6em"
            :disabled="postComment.commentsMutex"
            @click="fetchSecondReplyList(postComment, -1)"
          >
            <span data-feather="chevron-left" width="24" height="24"></span>
          </button>
          <button
            v-show="postComment.currPageIdx < Math.ceil(postComment.count / postComment.secondPageSize) - 1"
            class="btn btn-light rounded-lg second-level-comment-pager"
            style="bottom: 0; right: 0; z-index: 4"
            :disabled="postComment.commentsMutex"
            @click="fetchSecondReplyList(postComment, 1)"
          >
            <span data-feather="chevron-right" width="24" height="24"></span>
          </button>
        </div>
      </DiscussionStatement>
    </CommentsCollapseDiv>
    <!-- c. footer -->
    <!--<div class="pb-3 bg-white border-top" style="position: sticky; bottom: 4px; z-index: 1000">
    <small class="d-block text-left mt-3">
      <button type="button" class="btn btn-sm border-0 btn-link text-decoration-none">展开</button>
    </small>
  </div>-->
  </div>
</template>

<script>
import DiscussionStatement from '@/components/learn/sub/DiscussionStatement';
import $ from 'jquery';
import feather from 'feather-icons';
import Pagination from '@/components/common/pagination/Pagination';

export default {
  name: 'DiscussionPost',
  data: () => ({}),
  methods: {
    fetchSecondReplyList(postComment, incr) {
      postComment.commentsMutex = true;
      const self = this;
      self.$http
        .get('/discussion/replies/sub/list', {
          params: {
            commentId: postComment.id,
            secondPageIdx: postComment.currPageIdx + incr,
            secondPageSize: postComment.secondPageSize,
          },
        })
        .then((res) => {
          if (res.data.status === 'success') {
            let batchComments = res.data.data.wrapperList;
            postComment.currPageIdx += incr;
            resolvePostCommentComments(batchComments, postComment, new Set(res.data.data.likedStatementIdList));
            postComment.comments.length = 0;
            postComment.comments.push.apply(postComment.comments, batchComments);
          } else {
            this.$toast.show({
              title: '获取评论失败',
              msg: res.data.data.errorMsg,
              icon: 'danger',
            });
          }
          postComment.commentsMutex = false;
        })
        .catch(() => {
          this.$toast.show({
            title: '获取评论失败',
            msg: '连接出现异常',
            icon: 'danger',
          });
          postComment.commentsMutex = false;
        });
    },
    pushPostComment(post, c) {
      resolvePostComment(c, 0);
      post.comments.push(c);
      post.totalReplies++;
      post.firstLevelComments++;
    },
    pushPostCommentComment(postComment, cc, post, firstLevel) {
      resolvePostCommentComments([cc], postComment);
      postComment.comments.push(cc);
      post.totalReplies++;
      post.firstLevelComments += firstLevel;
    },
  },
  filters: {
    borderOfPostComments: (postComments, ci) => {
      return ci === postComments.length - 1;
    },
    borderOfPostCommentsContent: (postComments, ci) => {
      return (
        ci < postComments.length - 1 ||
        (postComments[postComments.length - 1].comments && postComments[postComments.length - 1].comments.length > 0)
      );
    },
    borderOfPostCommentComments: (postComments, ci, incs, inci) => {
      return inci === incs.length - 1 && ci < postComments.length - 1;
    },
    borderOfPostCommentCommentsContent: (incs, inci) => {
      return inci < incs.length - 1;
    },
  },
  props: {
    post: {
      type: Object,
      required: true,
    },
    pi: {
      type: Number,
      required: true,
    },
  },
  components: {
    DiscussionStatement,
    CommentsCollapseDiv: {
      template: `<div>
        <slot></slot>
        <Pagination class="py-2" :default-page-size="pageSize" :total="post.firstLevelComments" @currentPageChanged="refetch" :reset-margin-bottom="true" />
      </div>`,
      data() {
        return {
          pageSize: 3,
          secondPageSize: 4,
        };
      },
      mounted() {
        let $div = $('#' + this.divId);
        $div.bind('show.bs.collapse', () => {
          $('#' + this.btnId).addClass('active');
        });
        $div.bind('hide.bs.collapse', () => {
          $('#' + this.btnId).removeClass('active');
        });
      },
      created() {
        this.fetchReplyList(0);
      },
      methods: {
        refetch(current) {
          this.fetchReplyList(current - 1);
        },
        fetchReplyList(pageIdx) {
          const self = this;
          self.$http
            .get('/discussion/replies/list', {
              params: {
                postId: self.post.id,
                pageIdx,
                pageSize: self.pageSize,
                secondPageSize: self.secondPageSize,
              },
            })
            .then((res) => {
              if (res.data.status === 'success') {
                let batchComments = res.data.data.wrapperList;
                let likeSet = new Set(res.data.data.likedStatementIdList);
                batchComments.forEach((c) => {
                  c.statement.liked = likeSet.has(c.statement.id);
                  resolvePostComment(c, self.secondPageSize);
                  resolvePostCommentComments(c.comments, c, likeSet);
                });
                self.post.comments = batchComments;
                this.$nextTick(() => {
                  feather.replace();
                });
              } else {
                this.$toast.show({
                  title: '获取评论失败',
                  msg: res.data.data.errorMsg,
                  icon: 'danger',
                });
              }
            })
            .catch(() => {
              this.$toast.show({
                title: '获取评论失败',
                msg: '连接出现异常',
                icon: 'danger',
              });
            });
        },
      },
      props: {
        divId: {
          type: String,
          required: true,
        },
        btnId: {
          type: String,
          required: true,
        },
        post: {
          type: Object,
          required: true,
        },
      },
      components: { Pagination },
    },
  },
};

function resolvePostComment(c, secondPageSize) {
  c.currPageIdx = 0;
  c.secondPageSize = secondPageSize;
  c.comments = c.comments || [];
  c.id2Cc = {};
  c.commentsMutex = false;
  return c;
}
function resolvePostCommentComments(comments, c, likeSet = new Set()) {
  comments.forEach((cc) => {
    c.id2Cc[cc.id] = cc;
    if (cc.level > 2) {
      cc.statement.referComment = c.id2Cc[cc.replyToId];
    }
    cc.statement.liked = likeSet.has(cc.statement.id);
  });
}
</script>

<style lang="scss" scoped></style>
