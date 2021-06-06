<template>
  <div>
    <!-- header -->
    <div
      class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom"
    >
      <h1 class="h2 text-nowrap text-truncate">{{ title }}</h1>
      <slot name="header"></slot>
    </div>

    <!-- body -->
    <div class="my-4">
      <slot name="body"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AdminMainViewport',
  props: {
    title: {
      type: String,
      default: '',
    },
  },
};
</script>

<style lang="scss" scoped></style>
