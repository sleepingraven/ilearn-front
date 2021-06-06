<template>
  <div class="row no-gutters border rounded-lg overflow-hidden flex-md-row h-md-250 position-relative exam-card">
    <div class="col p-4 d-flex flex-column position-static">
      <strong class="d-inline-block mb-2" :class="exam.status.class">{{ exam.status.text }}</strong>
      <h3 class="mb-0">{{ exam.title }}</h3>
      <div class="mb-1 text-muted d-flex justify-content-between">
        <div>{{ exam.startTime | formatStartTime }}</div>
        <div>{{ exam.totalTime | formatTotalTime }}</div>
      </div>
      <!--
      <p class="card-text mb-auto">
        This is a wider card with supporting text below as a natural lead-in to additional content.
      </p>
      -->
      <a :href="exam.href" target="_blank" class="stretched-link text-decoration-none">详细信息</a>
    </div>
    <div class="col-auto d-none d-lg-block" style="opacity: 0.8; filter: blur(0px)">
      <svg
        class="bd-placeholder-img"
        width="200"
        height="250"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="Placeholder: Thumbnail"
        preserveAspectRatio="xMidYMid slice"
        focusable="false"
      >
        <title>Placeholder</title>
        <rect width="100%" height="100%" fill="#55595c" />
        <!-- <text> 不支持换行 -->
        <switch>
          <foreignObject width="200" height="250">
            <p
              xmlns="http://www.w3.org/1999/xhtml"
              class="text-center d-table-cell align-middle"
              style="height: 250px; width: 200px; color: #eceeef"
            >
              {{ exam.alias }}
            </p>
          </foreignObject>
          <text x="50%" y="50%" fill="#eceeef" dy=".3em">Your SVG viewer cannot display html.</text>
        </switch>
      </svg>
    </div>
  </div>
</template>

<script>
import $AppUtil from '@/assets/js/common';

export default {
  name: 'ExamCard',
  filters: {
    formatStartTime: function (startTime) {
      let startDate = new Date(startTime);
      let year = startDate.getUTCFullYear(),
        month = startDate.getUTCMonth() + 1,
        date = startDate.getUTCDate(),
        hours = startDate.getUTCHours(),
        minutes = startDate.getUTCMinutes();
      month = $AppUtil.completeLeadingZero2TwoDigits(month);
      date = $AppUtil.completeLeadingZero2TwoDigits(date);
      hours = $AppUtil.completeLeadingZero2TwoDigits(hours);
      minutes = $AppUtil.completeLeadingZero2TwoDigits(minutes);
      return year + '-' + month + '-' + date + ' ' + hours + ':' + minutes + '';
    },
    formatTotalTime: function (totalTime) {
      return totalTime + ' 分钟';
    },
  },
  props: {
    exam: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style lang="scss" scoped>
h1,
h2,
h3,
h4,
h5,
h6 {
  font-family: 'Playfair Display', Georgia, 'Times New Roman', serif;
}

@media (min-width: 768px) {
  .h-md-250 {
    height: 250px;
  }
}
.exam-card {
  font: 1em/1.5 'PingFang SC', '微软雅黑', 'Microsoft YaHei', Helvetica, 'Helvetica Neue', Tahoma, Arial, sans-serif;
  background-color: #fafafa;
  transition: all 0.15s ease-out 0s;
}
.exam-card:hover {
  opacity: 0.97;
  transform: scale(1.01);
}
</style>
