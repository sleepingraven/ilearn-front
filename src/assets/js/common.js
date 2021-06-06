import $ from 'jquery/dist/jquery.js';

export default {
  /*
    吸附顶部功能
    getBoundingClientRect() 是 DOM 对象的方法，因此 $sticky 只能包含单个对象
   */
  enableAutoSticky(
    $sticky,
    scrollParentElem,
    { keepWidth = true, limitHeight = false, zIndex = 3, fixedTop = 4 } = {}
  ) {
    // 初始位置。因为开始时浏览器可能已经滚动了，所以 top 用文档偏移
    // sticky.getBoundingClientRect()：相对浏览器的位置
    // $sticky.offset()：相对文档的位置
    const top = $sticky.offset().top;
    // 滚动辅助变量
    let p = 0,
      t = 0;
    $(scrollParentElem).scroll((e) => {
      p = $(e.currentTarget).scrollTop();
      if (t <= p) {
        // 向下滚
        let clientRect = $sticky[0].getBoundingClientRect();
        if (clientRect.top <= fixedTop) {
          $sticky.css('top', fixedTop + 'px');
          $sticky.css('left', clientRect.left + 'px');
          if (keepWidth) {
            $sticky.css('width', $sticky.css('width'));
          }
          if (limitHeight) {
            $sticky.css('max-height', $sticky.css('height'));
          }
          $sticky.css('position', 'fixed');
          $sticky.css('z-index', zIndex);
          $sticky.addClass('app-fixed');
        }
      } else {
        // 向上滚
        if ($sticky.offset().top <= top) {
          $sticky.css('position', 'static');
          $sticky.removeClass('app-fixed');
        }
      }
      setTimeout(() => {
        t = p;
      }, 0);
    });
  },

  /*
	工具
 */

  getUrlQueryVariable(variable) {
    const query = window.location.search;
    if (query == null || query === '') {
      return null;
    }
    const vars = query.substring(1).split('&');
    for (let i = 0; i < vars.length; i++) {
      let pair = vars[i].split('=');
      if (pair[0] === variable) {
        return pair[1];
      }
    }
    return null;
  },

  buildIntFromLimit: (length) => [...Array.from({ length: length }).keys()],
  buildIntFromLimit2: (length) => Array.from({ length: length }, (v, i) => i),

  buildIntFromRangeClosed: (start, stop, step = 1) =>
    Array.from({ length: (stop - start) / step + 1 }, (_, i) => start + i * step),
  buildIntFromRangeClosedReversed: (start, stop, step = 1) =>
    Array.from({ length: (start - stop) / step + 1 }, (_, i) => start - i * step),

  lastElem: (a) => (a == null || a.length === 0 ? null : a[a.length - 1]),

  binarySearchInMapping: (a, target, mapping = (e) => e) => {
    let l = 0,
      r = a.length;
    while (l < r) {
      let m = (l + r) >>> 1;
      if (mapping(a[m]) <= target) {
        l = m + 1;
      } else {
        r = m;
      }
    }
    return l;
  },
  completeLeadingZero2TwoDigits: (num) => (num < 10 ? '0' + num : num),
  calculateDateOffset(currentTime, targetTime) {
    if (currentTime > targetTime) {
      return this.calculateDateOffset(targetTime, currentTime);
    }
    const leftTime = targetTime - currentTime; //距离结束时间的毫秒数
    let days = Math.floor(leftTime / (1000 * 60 * 60 * 24)), //计算天数
      hours = Math.floor((leftTime / (1000 * 60 * 60)) % 24), //计算小时数
      minutes = Math.floor((leftTime / (1000 * 60)) % 60), //计算分钟数
      seconds = Math.floor((leftTime / 1000) % 60); //计算秒数
    return { days, hours, minutes, seconds };
  },
  getUTCTime(date) {
    return date.getTime() - date.getTimezoneOffset() * 60_000;
  },

  split(item, num) {
    if (item.length <= 0) {
      return item;
    }

    let groupSize = Math.ceil(item.length / num);
    return this.chunk(item, groupSize);
  },
  // 将数组按指定大小分块
  chunk(arr = [], size = 1) {
    if (arr.length === 0) {
      return [];
    }
    return arr.reduce(
      (total, currentValue) => {
        if (total[total.length - 1].length === size) {
          total.push([currentValue]);
        } else {
          total[total.length - 1].push(currentValue);
        }
        return total;
      },
      [[]]
    );
  },
};
