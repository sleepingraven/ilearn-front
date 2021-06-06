<template>
  <svg
    class="bd-placeholder-img mr-2 rounded-circle"
    width="32"
    height="32"
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    aria-label="Placeholder: 32x32"
    preserveAspectRatio="xMidYMid slice"
    focusable="false"
  >
    <title>Placeholder</title>
    <rect width="100%" height="100%" :fill="color16" />
    <text x="50%" y="50%" :fill="color16" dy=".3em">32x32</text>
  </svg>
</template>

<script>
export default {
  name: 'AvatarImage',
  computed: {
    color16: () => {
      //十六进制颜色随机
      let r = Math.floor(Math.random() * 256);
      let g = Math.floor(Math.random() * 256);
      let b = Math.floor(Math.random() * 256);
      return '#' + r.toString(16) + g.toString(16) + b.toString(16);
    },
  },
};
</script>

<style lang="scss" scoped></style>
