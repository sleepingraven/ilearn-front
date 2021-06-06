<template>
  <video-player
    class="vjs-custom-skin vjs-big-play-centered"
    ref="videoPlayer"
    :playsinline="true"
    :options="playerOptions"
    @play="onPlayerPlay($event)"
    @pause="onPlayerPause($event)"
    @ended="onPlayerEnded($event)"
    @loadeddata="onPlayerLoadeddata($event)"
    @waiting="onPlayerWaiting($event)"
    @playing="onPlayerPlaying($event)"
    @timeupdate="onPlayerTimeupdate($event)"
    @canplay="onPlayerCanplay($event)"
    @canplaythrough="onPlayerCanplaythrough($event)"
    @statechanged="playerStateChanged($event)"
    @ready="playerReadied"
  ></video-player>
</template>

<script>
export default {
  name: 'LearnVideo',
  data() {
    return {
      playerOptions: {
        autoplay: false,
      },
      section: {},
      factor: 0.9,
      threshold: Infinity,
    };
  },
  mounted() {
    console.log('this is current player instance object', this.player);
  },
  computed: {
    player() {
      return this.$refs.videoPlayer.player;
    },
  },
  methods: {
    switchVideo(section) {
      this.section = section;

      this.player.src({ src: section.videoUrl, type: 'video/mp4' });
      if (section.posterUrl && section.posterUrl.length) {
        this.player.poster('/api' + new URL(section.posterUrl).pathname);
      }
      this.player.load(section.videoUrl);
    },
    fireHide() {
      this.player.pause();
      this.threshold = Infinity;
    },
    // listen event
    onPlayerPlay(player) {
      if (!this.section.mutexStarted && !this.section.mutexFinished) {
        this.section.mutexStarted = true;
        this.$emit('sectionLearnStarted', this.section);
      }
      console.log('player play!', player);
    },
    onPlayerPause(player) {
      console.log('player pause!', player);
      player.log('Awww...over so soon?!');
    },
    onPlayerEnded(player) {
      console.log('player ended!', player);
    },
    onPlayerLoadeddata(player) {
      console.log('player Loadeddata!', player);
    },
    onPlayerWaiting(player) {
      console.log('player Waiting!', player);
    },
    onPlayerPlaying(player) {
      console.log('player Playing!', player);
    },
    onPlayerTimeupdate(player) {
      let currentTime = player.currentTime();
      if (currentTime >= this.threshold && !this.section.mutexFinished) {
        this.section.mutexFinished = true;
        this.$emit('sectionLearnFinished', this.section);
      }
      console.log('player Timeupdate!', currentTime);
    },
    onPlayerCanplay(player) {
      this.threshold = this.factor * player.duration();
      console.log('player Canplay!', player);
    },
    onPlayerCanplaythrough(player) {
      console.log('player Canplaythrough!', player);
    },
    // or listen state event
    // eslint-disable-next-line no-unused-vars
    playerStateChanged(playerCurrentState) {
      // console.log('player current update state', playerCurrentState);
    },
    // player is ready
    playerReadied(player) {
      console.log('the player is readied', player);
      // seek to 10s
      // player.currentTime(10);
    },
  },
};
</script>

<style lang="scss"></style>
