<template>
  <div class="d-flex w-100 vh-100 py-5 bg-light" style="">
    <SignComponent class="w-100 p-3 m-auto rounded-lg bg-white" style="max-width: 420px" />
  </div>
</template>

<script>
import SignComponent from '@/components/common/SignComponent';

export default {
  name: 'Sign',
  components: { SignComponent },
};
</script>

<style lang="scss" scoped></style>
