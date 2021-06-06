<template>
  <LearnViewAside>
    <div>
      <div
        v-for="(c, ci) in chapters"
        :key="ci"
        class="pb-3 mb-4"
        :class="{ 'border-bottom': ci < chapters.length - 1 }"
      >
        <div class="learn-chapter-div">
          <h4 class="anchor-container">
            <span v-if="chapters.length > 1">第{{ ci + 1 }}章</span>
            &nbsp;
            <span>{{ c.title }}&nbsp;</span>
            <a :id="'chapter-' + (ci + 1)" :href="'#chapter-' + (ci + 1)">
              <span data-feather="link" class="align-baseline"></span>
            </a>
          </h4>
          <p>
            {{ c.description }}
            <a
              :id="'btn-' + 'chapterCollapse' + ci"
              class="btn btn-outline-info float-right learn-collapse-btn border-0"
              data-toggle="collapse"
              :href="'#chapterCollapse' + ci"
              role="button"
              aria-expanded="true"
              :aria-controls="'chapterCollapse' + ci"
            >
              收起
            </a>
          </p>
          <p class="text-muted">共 {{ c.sections.length }} 节（{{ c.sections | getSectionsMinutes }} 分钟）</p>
        </div>

        <div :id="'chapterCollapse' + ci" class="collapse show">
          <div class="list-group list-group-flush">
            <!-- Button trigger modal -->
            <button
              v-for="(s, si) in c.sections"
              :key="si"
              type="button"
              class="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
              :class="s.status | getSectionStatusBackground"
              data-toggle="modal"
              data-target="#staticBackdropVideo"
              :data-whatever="JSON.stringify({ ci, si })"
              :disabled="s.seconds === 0"
            >
              {{ ci + 1 }}-{{ si + 1 }} {{ s.title }}
              <span class="badge badge-pill text-muted">{{ s.seconds | getSectionTimeStr }}</span>
            </button>
          </div>
        </div>
      </div>
      <!-- Modal -->
      <app-modal
        modal-id="staticBackdropVideo"
        dialog-class="modal-xl"
        style="width: 100vw; overflow-y: hidden"
        :modal-footer="false"
      >
        <template v-slot:body>
          <div class="embed-responsive embed-responsive-16by9">
            <LearnVideo
              ref="video"
              class="embed-responsive-item"
              @sectionLearnStarted="sectionLearnStarted"
              @sectionLearnFinished="sectionLearnFinished"
            ></LearnVideo>
          </div>
        </template>
      </app-modal>
    </div>
  </LearnViewAside>
</template>

<script>
import $ from 'jquery/dist/jquery.js';
import $AppUtil from '@/assets/js/common';
import LearnViewAside from '@/components/learn/layout/LearnViewAside';
import AppModal from '@/components/common/AppModal';
import feather from 'feather-icons';
// import LearnVideo from '@/components/learn/sub/LearnVideoFlv';
import LearnVideo from '@/components/learn/sub/LearnVideo';
// video.js 不支持 flv 格式，而 flv.js 支持

export default {
  name: 'ChapterContents',
  data: () => ({
    chapters: [],
  }),
  created() {
    const self = this;
    self.$http
      .get('/learn/chapter/' + self.$route.params.courseId)
      .then((res) => {
        if (res.data.status === 'success') {
          let message = res.data.data;
          // 必须先设置，否则页面无法更新
          message.chapters.forEach((c) => {
            c.sections.forEach((s) => {
              s.status = s.status | 0;
              s.mutexStarted = !message.sign || s.status !== 0;
              s.mutexFinished = !message.sign || s.status === 2;
            });
          });
          self.chapters = message.chapters;
          self.$nextTick(() => {
            feather.replace();
            initCollapseBtnAction();
          });
        } else {
          this.$toast.show({
            title: '获取课程章节失败',
            msg: res.data.data.errorMsg,
            icon: 'danger',
          });
        }
        this.pushContents();
      })
      .catch(() => {
        this.$toast.show({
          title: '获取课程章节失败',
          msg: '连接出现异常',
          icon: 'danger',
        });
        this.pushContents();
      });
  },
  mounted() {
    const self = this;
    let videoModal = $('#staticBackdropVideo');
    videoModal.bind('show.bs.modal', (e) => {
      let idx = $(e.relatedTarget).data('whatever');
      let playingSection = self.chapters[idx.ci].sections[idx.si];
      self.$refs.video.switchVideo(playingSection);
    });
    videoModal.bind('hide.bs.modal', () => {
      self.$refs.video.fireHide();
    });
  },
  methods: {
    sectionLearnStarted(section) {
      const self = this;
      self.$http
        .post('/learn/achieve', {
          sectionId: section.id,
          status: 1,
        })
        .then((res) => {
          if (res.data.status === 'success') {
            section.status = 1;
          } else {
            section.mutexStarted = false;
          }
        })
        .catch(() => {
          section.mutexStarted = false;
        });
    },
    sectionLearnFinished(section) {
      const self = this;
      self.$http
        .post('/learn/achieve', {
          sectionId: section.id,
          status: 2,
        })
        .then((res) => {
          if (res.data.status === 'success') {
            section.status = 2;
          } else {
            section.mutexFinished = false;
          }
        })
        .catch(() => {
          section.mutexFinished = false;
        });
    },
    pushContents() {
      let contents = this.chapters.map((c, ci) => {
        return {
          title: c.title,
          anchor: '#chapter-' + (ci + 1),
        };
      });
      this.$emit('switchContents', contents);
    },
  },
  filters: {
    getSectionTimeStr: function (seconds) {
      if (seconds === 0) {
        return '';
      }
      let minutes = Math.floor(seconds / 60);
      seconds %= 60;
      minutes = $AppUtil.completeLeadingZero2TwoDigits(minutes);
      seconds = $AppUtil.completeLeadingZero2TwoDigits(seconds);
      return minutes + ':' + seconds;
    },
    getSectionStatusBackground: function (status) {
      switch (status) {
        case 1:
          return 'list-group-item-warning';
        case 2:
          return 'list-group-item-success';
        default:
          return 'list-group-item-light-custom';
      }
    },
    getSectionsMinutes(sections) {
      let totalSeconds = sections
        .map((s) => s.seconds)
        .reduce((prev, curr) => {
          return prev + curr;
        }, 0);
      return Math.ceil(totalSeconds / 60);
    },
  },
  components: { AppModal, LearnViewAside, LearnVideo },
};

function initCollapseBtnAction() {
  let $collapses = $('.collapse');
  $collapses.on('shown.bs.collapse', (e) => {
    let $collapse = $(e.currentTarget);
    $('#btn-' + $collapse.attr('id')).html('收起');
  });
  $collapses.on('hidden.bs.collapse', (e) => {
    let $collapse = $(e.currentTarget);
    $('#btn-' + $collapse.attr('id')).html('展开');
  });
}
</script>

<style lang="scss" scoped>
p {
  margin-bottom: 0.25em;
}
.learn-chapter-div {
  margin-bottom: 0.5rem;
}
.learn-collapse-btn {
  border-radius: 2rem;
}
.badge {
  font-weight: 400;
}
</style>
