<template>
  <div class="position-fixed bottom-0 right-0 p-3" style="z-index: 1052; right: 0; bottom: 0">
    <div
      id="live-toast"
      class="toast hide"
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
      :data-delay="options.duration"
    >
      <div class="toast-header">
        <svg
          class="bd-placeholder-img rounded mr-2"
          width="20"
          height="20"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-label=" :  "
          preserveAspectRatio="xMidYMid slice"
          focusable="false"
        >
          <title></title>
          <rect width="100%" height="100%" :fill="options.icon | iconBg"></rect>
          <text x="50%" y="50%" fill="#dee2e6" dy=".3em"></text>
        </svg>
        <strong class="mr-auto">{{ options.title }}</strong>
        <small>{{ options.timeAgo }}</small>
        <button type="button" class="ml-2 mb-1 close" data-dismiss="toast" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="toast-body" v-if="options.msg && options.msg.length">{{ options.msg }}</div>
    </div>
  </div>
</template>

<script>
import $ from 'jquery/dist/jquery.js';

export default {
  name: 'CommonToast',
  data() {
    return {
      options: {
        icon: '',
        title: '',
        timeAgo: 'just now',
        msg: '',
        duration: 5000,
      },
    };
  },
  methods: {
    show(options = {}) {
      this.options = options;
      $('#live-toast').toast('show');
    },
  },
  filters: {
    iconBg(icon) {
      switch (icon) {
        case 'success':
          return '#28a745';
        case 'danger':
          return '#dc3545';
        default:
          return '#007aff';
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
