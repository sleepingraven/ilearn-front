<template>
  <LearnViewAside>
    <div>
      <table class="table table-hover table-striped">
        <caption>{{ coursewareGroups[0].description }}</caption>
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">课件名</th>
          </tr>
        </thead>
        <tbody>
          <tr :id="'courseware-' + (ci + 1)" v-for="(cw, ci) in coursewareGroups[0].coursewares" :key="ci">
            <th scope="row">
              {{ ci + 1 }}
            </th>
            <td class="d-flex justify-content-between align-items-center">
              {{ cw.title }}
              <a :href="cw.url + '?originalName=' + encodeURIComponent(cw.title)" class="badge badge-info badge-pill">
                下载
              </a>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </LearnViewAside>
</template>

<script>
import LearnViewAside from '@/components/learn/layout/LearnViewAside';
import feather from 'feather-icons';

export default {
  name: 'Courseware',
  data: () => ({
    coursewareGroups: [
      {
        id: -1,
        description: '',
        coursewares: [],
      },
    ],
  }),
  created() {
    const self = this;
    self.$http
      .get('/learn/courseware/' + self.$route.params.courseId)
      .then((res) => {
        if (res.data.status === 'success') {
          res.data.data.forEach((g) => {
            g.description = g.description || '';
            g.coursewares = g.coursewares || [];
          });
          self.coursewareGroups = res.data.data;
          this.$nextTick(() => {
            feather.replace();
          });
        } else {
          self.$toast.show({
            title: '获取课件失败',
            msg: res.data.data.errorMsg,
            icon: 'danger',
          });
        }
        this.pushContents();
      })
      .catch(() => {
        self.$toast.show({
          title: '获取课件失败',
          msg: '',
          icon: 'danger',
        });
        this.pushContents();
      });
  },
  methods: {
    pushContents() {
      let contents = this.coursewareGroups[0].coursewares.map((cw, ci) => {
        return {
          title: cw.title,
          anchor: '#courseware-' + (ci + 1),
        };
      });
      this.$emit('switchContents', contents);
    },
  },
  components: { LearnViewAside },
};
</script>

<style lang="scss" scoped></style>
