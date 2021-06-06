<template>
  <nav id="sidebar-menu" class="col-md-3 col-lg-2 d-md-block bg-light sidebar collapse">
    <div class="sidebar-sticky pt-3">
      <!-- groups -->
      <div v-for="(group, gi) in menuGroups" :key="gi">
        <!-- title -->
        <button
          class="text-decoration-none btn btn-link w-100 p-0 shadow-none"
          v-if="hasGroupTitle(group)"
          data-toggle="collapse"
          :href="'#menu-group-' + gi + '-items'"
        >
          <h6 class="sidebar-heading d-flex justify-content-between align-items-center px-3 py-2 mb-1 text-muted">
            <span>{{ group.title }}</span>
            <a :id="'menu-group-' + gi + '-collapse-icon'" class="d-flex align-items-center text-muted">
              <span v-if="group.expand" data-feather="minus-circle"></span>
              <span v-else data-feather="plus-circle"></span>
            </a>
          </h6>
        </button>

        <!-- items -->
        <div
          :id="'menu-group-' + gi + '-items'"
          class="collapse menu-items-collapse"
          :class="[{ show: !hasGroupTitle(group) || group.expand }]"
          :data-message="gi"
        >
          <ul class="nav flex-column mb-3">
            <li class="nav-item" v-for="(item, idx) in group.items" :key="idx">
              <router-link
                :to="{ name: item.name }"
                class="nav-link"
                :class="{ 'pt-1': idx === 0 && hasGroupTitle(group) }"
                active-class="active"
              >
                <span :data-feather="item.icon"></span>
                {{ item.title }}
              </router-link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import $ from 'jquery/dist/jquery.js';
import feather from 'feather-icons';

export default {
  name: 'AdminMenu',
  created() {
    // addDemoItems(this.menuGroups, true);
  },
  mounted() {
    feather.replace();
    let $menuItemsCollapse = $('.menu-items-collapse');
    $menuItemsCollapse.bind('show.bs.collapse', (e) => {
      let gi = $(e.currentTarget).data('message');
      $('#menu-group-' + gi + '-collapse-icon').html(feather.icons['minus-circle'].toSvg());
    });
    $menuItemsCollapse.bind('hide.bs.collapse', (e) => {
      let gi = $(e.currentTarget).data('message');
      $('#menu-group-' + gi + '-collapse-icon').html(feather.icons['plus-circle'].toSvg());
    });
  },
  methods: {
    hasGroupTitle(group) {
      return group.title && group.title !== '';
    },
  },
  props: {
    menuGroups: {
      type: Array,
      required: true,
    },
  },
};

// eslint-disable-next-line no-unused-vars
function addDemoItems(menuGroups, expand) {
  menuGroups.push({
    title: 'icon demo',
    expand: expand,
    items: [
      { title: 'database', icon: 'database', name: '###' },
      { title: 'server', icon: 'server', name: '###' },
      { title: 'hard-drive', icon: 'hard-drive', name: '###' },
      { title: 'airplay', icon: 'airplay', name: '###' },
      { title: 'monitor', icon: 'monitor', name: '###' },
      { title: 'edit-2', icon: 'edit-2', name: '###' },
      { title: 'pen-tool', icon: 'pen-tool', name: '###' },
      { title: 'clipboard', icon: 'clipboard', name: '###' },
      { title: 'check-square', icon: 'check-square', name: '###' },
      { title: 'check-circle', icon: 'check-circle', name: '###' },
      { title: 'book-open', icon: 'book-open', name: '###' },
      { title: 'book', icon: 'book', name: '###' },
      { title: 'bar-chart-2', icon: 'bar-chart-2', name: '###' },
      { title: 'pocket', icon: 'pocket', name: '###' },
      { title: 'layers', icon: 'layers', name: '###' },
      { title: 'command', icon: 'command', name: '###' },
      { title: 'award', icon: 'award', name: '###' },
      { title: 'bookmark', icon: 'bookmark', name: '###' },
      { title: 'flag', icon: 'flag', name: '###' },
      { title: 'tag', icon: 'tag', name: '###' },
      { title: 'star', icon: 'star', name: '###' },
      { title: 'calendar', icon: 'calendar', name: '###' },
      { title: 'clock', icon: 'clock', name: '###' },
      { title: 'chevron-left', icon: 'chevron-left', name: '###' },
      { title: 'more-horizontal', icon: 'more-horizontal', name: '###' },
      { title: 'corner-up-left', icon: 'corner-up-left', name: '###' },
      { title: 'sliders', icon: 'sliders', name: '###' },
      { title: 'send', icon: 'send', name: '###' },
      { title: 'map', icon: 'map', name: '###' },
    ],
  });
}
</script>

<style lang="scss" scoped></style>
