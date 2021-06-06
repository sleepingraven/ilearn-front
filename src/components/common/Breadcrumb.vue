<template>
  <div id="breadcrumb-root-div" class="container mt-0">
    <nav id="breadcrumb-root-nav" aria-label="breadcrumb">
      <ol id="content-items-mount-field" class="breadcrumb pr-0 position-relative">
        <!-- 1. 网站导航 -->
        <li v-for="(item, idx) in items" :key="idx" class="breadcrumb-item active">
          <a v-if="idx !== inactiveItemIdxGetter(items)" class="text-decoration-none" :href="item.url">
            {{ item.title }}
          </a>
          <span v-else>{{ item.title }}</span>
        </li>

        <!-- 2. 课程导航 -->
        <li v-if="subItems.length > 0" class="active h-100" style="position: absolute; top: 0; left: 50%; right: 10%">
          <div class="h-100" style="position: relative; left: -50%">
            <SubNavigation :sub-items="subItems" />
          </div>
        </li>

        <!-- 3. 其他导航 -->
        <li id="breadcrumb-end-mount-field" class="h-100" style="position: absolute; top: 0; right: 0">
          <!-- 如果 v-if 直接使用 length > 0，会导致 document.getElementById('contents-btn-div') 无效 -->
          <transition name="fade">
            <slot name="endNavField"></slot>
          </transition>
        </li>
      </ol>
    </nav>
  </div>
</template>

<script>
import SubNavigation from '@/components/common/SubNavigation';

export default {
  name: 'Breadcrumb',
  props: {
    items: {
      type: Array,
      default: () => {
        return [];
      },
    },
    inactiveItemIdxGetter: {
      type: Function,
      default: (items) => {
        return items.length - 1;
      },
    },
    subItems: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  components: { SubNavigation },
};
</script>

<style lang="scss" scoped>
.breadcrumb-item + .breadcrumb-item::before {
  content: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPjxwYXRoIGQ9Ik0yLjUgMEwxIDEuNSAzLjUgNCAxIDYuNSAyLjUgOGw0LTQtNC00eiIgZmlsbD0iY3VycmVudENvbG9yIi8+PC9zdmc+);
}
*:not(.breadcrumb-sub-item) + .breadcrumb-sub-item::before {
  content: none;
}
.breadcrumb-item.breadcrumb-sub-item + .breadcrumb-item::before {
  content: '|';
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
