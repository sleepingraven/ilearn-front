<template>
  <div class="" style="background-color: black">
    <video
      ref="videoElement"
      :poster="section.posterUrl"
      controls
      @play="onPlayerPlay"
      @timeupdate="onPlayerTimeupdate"
      @canplay="onPlayerCanplay"
    ></video>
  </div>
</template>

<script>
import flvjs from 'flv.js';

export default {
  name: 'LearnVideoFlv',
  data() {
    return {
      section: {},
      flvPlayer: {},
      factor: 0.9,
      threshold: Infinity,
    };
  },
  methods: {
    switchVideo(section) {
      this.section = section;

      if (flvjs.isSupported()) {
        let videoElement = this.$refs.videoElement;
        this.flvPlayer = flvjs.createPlayer({
          type: this.getVideoType(section.videoUrl),
          url: section.videoUrl,
        });
        this.flvPlayer.attachMediaElement(videoElement);
        this.flvPlayer.load();
      }
    },
    fireHide() {
      this.flvPlayer.unload();
      this.flvPlayer.detachMediaElement();
      this.threshold = Infinity;
    },
    onPlayerPlay() {
      if (!this.section.mutexStarted && !this.section.mutexFinished) {
        this.section.mutexStarted = true;
        this.$emit('sectionLearnStarted', this.section);
      }
    },
    onPlayerTimeupdate() {
      let currentTime = this.$refs.videoElement.currentTime;
      if (currentTime >= this.threshold && !this.section.mutexFinished) {
        this.section.mutexFinished = true;
        this.$emit('sectionLearnFinished', this.section);
      }
    },
    onPlayerCanplay() {
      this.threshold = this.factor * this.$refs.videoElement.duration;
    },
    getVideoType(url) {
      if (url.endsWith('flv')) {
        return 'flv';
      } else {
        return 'mp4';
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
