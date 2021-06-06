<template>
  <div class="card">
    <div class="card-header" :id="headingId">
      <h2 class="mb-0">
        <button
          class="btn btn-link btn-block text-left"
          type="button"
          data-toggle="collapse"
          :data-target="['#' + collapseId]"
          aria-expanded="true"
          :aria-controls="collapseId"
        >
          {{ title }}
        </button>
      </h2>
    </div>
    <!-- 移除了 data-parent 属性-->
    <div :id="collapseId" class="collapse show" :aria-labelledby="headingId">
      <div class="card-body px-2 py-4 mb-3">
        <div class="row my-2" v-if="exams.length > 0">
          <div class="col-md-6" v-for="(exam, ei) in exams" :key="ei">
            <ExamCard :exam="exam" />
          </div>
        </div>
        <p class="text-muted" v-else>还没有{{ title }}的测试</p>
      </div>
    </div>
  </div>
</template>

<script>
import ExamCard from '@/components/exam/ExamCard';

export default {
  name: 'CollapsibleGroupItem',
  props: {
    headingId: {
      type: String,
      required: true,
    },
    collapseId: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      default() {
        return this.headingId;
      },
    },
    exams: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  components: { ExamCard },
};
</script>

<style scoped>
.card {
  border: 0;
}
.accordion > .card:not(:last-of-type) .card-header {
  border-radius: 0.25rem 0.25rem 0 0 !important;
}
.accordion > .card:not(:first-of-type) .card-header {
  border-radius: 0 0 0.25rem 0.25rem !important;
}
.card-header {
  border: 1px solid rgba(0, 0, 0, 0.125);
}
</style>
