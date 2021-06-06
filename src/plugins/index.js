import Vue from 'vue';

/* 1. mavon-editor */

import MavonEditor from 'mavon-editor';
import 'mavon-editor/dist/css/index.css';

Vue.use(MavonEditor);

/* 2. vue-video-player */

import VueVideoPlayer from 'vue-video-player';
// require videojs style
import 'video.js/dist/video-js.css';
// import 'vue-video-player/src/custom-theme.css';
import '@/assets/css/custom-theme.css';

Vue.use(VueVideoPlayer, {
  options: {
    playbackRates: [0.7, 1.0, 1.5, 2.0], // 播放速度
    autoplay: true, // 如果true,浏览器准备好时开始回放。
    muted: false, // 默认情况下将会消除任何音频。
    loop: false, // 导致视频一结束就重新开始。
    preload: 'none', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
    language: 'zh-CN', // zh-CN中文  zh-EN英语
    aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
    techOrder: ['html5'], // 兼容顺序
    fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
    // width: document.documentElement.clientWidth, // 适应网页宽度
    notSupportedMessage: '暂无视频信息', // 允许覆盖Video.js无法播放媒体源时显示的默认信息。
    controls: true,
    controlBar: {
      timeDivider: true,
      durationDisplay: true,
      remainingTimeDisplay: false,
      currentTimeDisplay: true, // 当前时间
      volumeControl: false, // 声音控制键
      playToggle: false, // 暂停和播放键
      progressControl: true, // 进度条
      fullscreenToggle: true, // 全屏按钮
    },
  },
  // events: global videojs events
});
