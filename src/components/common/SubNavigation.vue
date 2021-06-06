<template>
  <div class="h-100">
    <nav id="sub-nav" class="h-100 d-flex justify-content-between text-center">
      <div v-for="(subItem, si) in subItems" :key="si" class="flex-grow-1 position-relative sub-nav-div">
        <router-link :to="{ name: subItem.name }" class="stretched-link d-block h-100" style="padding-top: 0.75rem">
          <span>{{ subItem.title }}</span>
        </router-link>
      </div>
    </nav>
  </div>
</template>

<script>
export default {
  name: 'SubNavigation',
  props: {
    subItems: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
};
</script>

<style lang="scss" scoped>
#sub-nav {
  a {
    font-weight: bold;
    color: #2c3e50;
    &.router-link-active {
      color: #42b983;
    }
  }
}
#sub-nav {
  transition: all 0.15s ease-in-out 0s;
  background-color: rgba(233, 236, 239, 0.7);
}
#sub-nav.app-fixed {
  opacity: 0;
}
#sub-nav.app-fixed:hover {
  opacity: 1;
}
#sub-nav.app-fixed {
  a:not(.router-link-active) {
    border-bottom: 4px solid #dee2e6;
  }
}
.router-link-active {
  border-bottom: 4px solid #42b983;
}
</style>
