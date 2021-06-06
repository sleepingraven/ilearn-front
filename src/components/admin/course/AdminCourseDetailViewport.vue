<template>
  <AdminMainViewport :title="courseTitle">
    <template v-slot:header>
      <div class="btn-toolbar mb-2 mb-md-0" style="width: 48%">
        <!--
          使用 a 标签，代替了 label，可以显示路径
          如果不去掉 data-toggle="buttons"，刷新时会清除选择，就必须指定 checked
        -->
        <div class="btn-group btn-group-toggle w-100" data-toggle="buttons">
          <router-link
            v-for="(nav, ni) in navs"
            :key="ni"
            :to="{ name: nav.name }"
            v-slot="{ href, navigate, isActive }"
          >
            <a :href="href" @click="navigate" class="btn btn-sm btn-outline-secondary" :class="{ active: isActive }">
              <input type="radio" name="options" :checked="isActive" />
              <span :data-feather="nav.icon"></span>
              {{ nav.title }}
            </a>
          </router-link>
        </div>
      </div>
    </template>

    <template v-slot:body>
      <router-view />
    </template>
  </AdminMainViewport>
</template>

<script>
import feather from 'feather-icons';
import AdminMainViewport from '@/components/admin/AdminMainViewport';

export default {
  name: 'AdminCourseDetailViewport',
  data() {
    return {
      courseId: this.$route.params.courseId,
      courseTitle: '',
    };
  },
  created() {
    const self = this;
    self.$http
      .get('/course/preview/' + self.courseId)
      .then((res) => {
        if (res.data.status === 'success') {
          self.courseTitle = res.data.data.title;
        } else {
          this.$toast.show({
            title: '获取课程信息失败',
            msg: res.data.data.errorMsg,
            icon: 'danger',
          });
        }
      })
      .catch(() => {
        this.$toast.show({
          title: '获取课程信息失败',
          msg: '连接出现异常',
          icon: 'danger',
        });
      });
  },
  mounted() {
    feather.replace();
  },
  computed: {
    navs() {
      return [
        { title: '概览', name: 'AdminCourseOverview', icon: 'align-justify' },
        { title: '介绍', name: 'AdminCourseIntroduction', icon: 'message-square' },
        { title: '章节', name: 'AdminCourseChapter', icon: 'list' },
        { title: '课件', name: 'AdminCourseware', icon: 'paperclip' },
      ];
    },
  },
  components: { AdminMainViewport },
};
</script>

<style lang="scss" scoped></style>
