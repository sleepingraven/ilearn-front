<template>
  <div id="contents-btn-div" class="h-100">
    <button class="btn btn-lg btn-outline-secondary h-100 border border-secondary border-0" data-toggle="dropdown">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        fill="currentColor"
        class="bi bi-tags"
        viewBox="0 0 16 16"
      >
        <path
          d="M3 2v4.586l7 7L14.586 9l-7-7H3zM2 2a1 1 0 0 1 1-1h4.586a1 1 0 0 1 .707.293l7 7a1 1 0 0 1 0 1.414l-4.586 4.586a1 1 0 0 1-1.414 0l-7-7A1 1 0 0 1 2 6.586V2z"
        ></path>
        <path
          d="M5.5 5a.5.5 0 1 1 0-1 .5.5 0 0 1 0 1zm0 1a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM1 7.086a1 1 0 0 0 .293.707L8.75 15.25l-.043.043a1 1 0 0 1-1.414 0l-7-7A1 1 0 0 1 0 7.586V3a1 1 0 0 1 1-1v5.086z"
        ></path>
      </svg>
    </button>
    <div class="dropdown-menu dropdown-menu-right shadow" style="background-color: #fdfdfd">
      <nav id="content-data-spy" class="navbar navbar-light pt-0">
        <div class="w-100 border-bottom" style="background-color: #fcfcfc">
          <a class="navbar-brand mx-0 d-block text-center mb-1">目录</a>
        </div>
        <nav class="nav nav-pills flex-column pt-1">
          <a class="nav-link" v-for="(c, ci) in contents" :key="ci" :href="c.anchor">
            <span class="title-adjust">{{ c.title }}</span>
          </a>
        </nav>
      </nav>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DropdownContents',
  props: {
    contents: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
};
</script>

<style lang="scss" scoped>
.bi {
  width: 1em;
  height: 1em;
  display: inline-block;
  vertical-align: -0.125em;
}

.btn-outline-secondary {
  transition-property: all;
  background-color: #e9ecef;
}
.app-fixed .btn-outline-secondary {
  opacity: 0.5;
}
.app-fixed .btn-outline-secondary:hover {
  opacity: 1;
}
</style>
