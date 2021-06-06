<template>
  <nav>
    <ul
      class="pagination justify-content-center"
      :class="{ 'pagination-user-select-none': userSelectNone, 'mb-0': resetMarginBottom }"
    >
      <!-- 1. item left side -->
      <li class="page-item" :class="{ disabled: current === 1 }">
        <a class="page-link" tabindex="1" @click="setPageBySide(current - 1)"><span>上一页</span></a>
      </li>

      <!-- 2. pager window -->
      <!-- first page -->
      <li class="page-item" :class="{ active: current === 1 }">
        <a class="page-link" @click="setPageByPager(1)">1</a>
      </li>
      <!-- left jumper -->
      <li class="page-item" v-if="needLeftJumper">
        <a class="page-link" @click="setPageByPager(current - jumpSize)">…</a>
      </li>
      <!-- pages in window -->
      <li class="page-item" :class="{ active: current === page }" v-for="(page, index) in windowPages" :key="index">
        <a class="page-link" @click="setPageByPager(page)">{{ page }}</a>
      </li>
      <!-- right jumper -->
      <li class="page-item" v-if="needRightJumper">
        <a class="page-link" @click="setPageByPager(current + jumpSize)">…</a>
      </li>
      <!-- last page -->
      <li class="page-item" :class="{ active: current === totalPages }" v-if="totalPages > 1">
        <a class="page-link" @click="setPageByPager(totalPages)">{{ totalPages }}</a>
      </li>

      <!-- 3. item right side -->
      <li class="page-item" :class="{ disabled: current === totalPages }">
        <a class="page-link" tabindex="2" @click="setPageBySide(current + 1)"><span>下一页</span></a>
      </li>
    </ul>
  </nav>
</template>

<script>
export default {
  name: 'Pagination',
  data() {
    return {
      // current定义在对象里，这样可以确保每个实例可以维护一份被返回对象的独立的拷贝
      current: this.defaultCurrent,
    };
  },
  methods: {
    setPageBySide(page) {
      let corrected = this.correctPage(page);
      if (corrected.incorrect) {
        return;
      }
      this.onChange(page);
    },
    setPageByPager(page) {
      let corrected = this.correctPage(page);
      this.onChange(corrected.page);
    },
    onChange(current) {
      this.current = current;
      this.$emit('currentPageChanged', this.current);
    },
    correctPage(page) {
      let incorrect = false;
      // 对页码进行限制，不能超出[1, totalPages]的范围
      if (page < 1) {
        incorrect = true;
        page = 1;
      } else if (page > this.totalPages) {
        incorrect = true;
        page = this.totalPages;
      }
      return { incorrect, page };
    },
  },
  computed: {
    // 中间页码计算
    windowPages: function () {
      if (this.totalPages <= this.windowSize) {
        // 页数小于 windowSize，全部显示
        return this.$appUtil.buildIntFromRangeClosed(2, this.totalPages - 1);
      } else {
        // 总页码较大时，只显示中间的页
        const halfPartSize = this.halfPartSize;
        // 计算区域中心
        let centerPage = this.current;
        if (centerPage <= halfPartSize) {
          centerPage = halfPartSize + 1;
        } else if (centerPage > this.totalPages - halfPartSize) {
          centerPage = this.totalPages - halfPartSize;
        }
        let leftBound = halfPartSize - 1,
          rightBound = halfPartSize - 1;
        if (this.needLeftJumper) {
          leftBound--;
        }
        if (this.needRightJumper) {
          rightBound--;
        }
        return this.$appUtil.buildIntFromRangeClosed(centerPage - leftBound, centerPage + rightBound);
      }
    },
    needLeftJumper: function () {
      return this.current > this.halfPartSize + 1;
    },
    needRightJumper: function () {
      return this.current < this.totalPages - this.halfPartSize;
    },
    halfPartSize: function () {
      return Math.floor(this.windowSize / 2);
    },
    // totalPages >= 0
    totalPages: function () {
      return Math.ceil(this.total / this.defaultPageSize) || 1;
    },
  },
  props: {
    defaultCurrent: {
      type: Number,
      default: 1,
    },
    // total和defaultPageSize两个参数可以合并为一个参数 totalPages（总页码），不过考虑到后续的可扩展性（比如需要改变pageSize），将其拆分开来。
    defaultPageSize: {
      type: Number,
      required: true,
      validator: function (value) {
        return value > 0;
      },
    },
    total: {
      type: Number,
      required: true,
      validator: function (value) {
        return value >= 0;
      },
    },
    // 显示的窗口大小。窗口按中心移动，所以推荐为奇数
    windowSize: {
      type: Number,
      default: 9,
      validator: function (value) {
        return value > 0;
      },
    },
    // 跳转时的滑动距离
    jumpSize: {
      type: Number,
      default: 9,
      validator: function (value) {
        return value > 0;
      },
    },
    userSelectNone: {
      type: Boolean,
      default: true,
    },
    resetMarginBottom: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style lang="scss" scoped>
.pagination {
  .page-item {
    padding: 0 5px;
    // 取消了 href，否则按钮位置变化时，边框显示错误
    // tabindex 具有边框
    a {
      cursor: pointer;
    }
  }
}
.pagination-user-select-none {
  * {
    -webkit-user-select: none !important;
    -moz-user-select: none !important;
    -ms-user-select: none !important;
    user-select: none !important;
  }
}
</style>
