<template>
  <div
    style="position: absolute; left: 0; right: 0; height: calc(100vh - 3rem)"
    :style="{
      backgroundImage: 'url(' + require('@/assets/img/lg1.jpg') + ')',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: '50% 55%',
      backgroundSize: 'cover',
    }"
  >
    <AdminMainViewport title="后台管理" class="h-100 px-4" style="background-color: rgba(255, 255, 255, 0.88)">
      <template v-slot:body>
        <h1 class="display-1 text-center row row-cols-2 admin-home-grid mx-0" style="height: 4.1em">
          <router-link
            v-for="(l, li) in links"
            :key="li"
            class="col d-flex justify-content-center admin-home-ceil"
            :to="{ name: l.name }"
          >
            <span :data-feather="l.icon" class="align-self-center admin-home-content"></span>
          </router-link>
        </h1>
      </template>
    </AdminMainViewport>
  </div>
</template>

<script>
import AdminMainViewport from '@/components/admin/AdminMainViewport';
import feather from 'feather-icons';

export default {
  name: 'AdminHome',
  data() {
    return {
      links: [
        {
          icon: 'archive',
          name: 'AdminCourseList',
          requiring: 'COURSE_SUPPLIER',
        },
        {
          icon: 'trello',
          name: 'AdminExam',
          requiring: 'EXAM_INITIATOR',
        },
        { icon: 'grid', name: 'AdminAuthority', requiring: 'ADMIN' },
      ],
    };
  },
  created() {
    let roles = this.$appCommon.getUserCommonData().roles;
    this.links = this.links.filter((l) => {
      return roles.has(l.requiring);
    });
  },
  mounted() {
    feather.replace();
  },
  components: { AdminMainViewport },
};
</script>

<style lang="scss" scoped>
.admin-home-grid {
  .admin-home-content {
    width: 1.5em;
    height: 1.5em;
  }
  .admin-home-ceil {
    color: #666;
  }
  .admin-home-ceil:hover {
    color: #999;
    background-color: rgba(255, 255, 255, 0.15);
  }
}
</style>
