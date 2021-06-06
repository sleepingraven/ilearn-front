<template>
  <div
    class="w-100 h-100"
    :style="{
      backgroundImage: 'url(' + require('@/assets/img/lg2.jpg') + ')',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: '50% 60%',
      backgroundSize: 'cover',
    }"
  >
    <!-- 不能用 opacity，否则会覆盖登录 Modal-->
    <div id="home-root-div" class="d-flex w-100 h-100 flex-column" style="background-color: rgba(255, 255, 255, 0.88)">
      <NavigationBar />

      <div id="cover" class="text-center w-100 h-100">
        <div class="cover-container d-flex w-100 h-100 p-3 mx-auto flex-column">
          <header class="masthead mb-auto"></header>

          <main role="main" class="inner cover mb-4">
            <!--<h1 class="cover-heading">{{ main.title }}</h1>
            <p class="lead">{{ main.text }}</p>
            <p class="lead">
              <a href="/course/list" class="btn btn-lg btn-outline-success">{{ main.btnText }}</a>
            </p>-->
          </main>

          <footer class="mastfoot mt-auto"></footer>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import $ from 'jquery/dist/jquery.js';
import NavigationBar from '@/components/common/NavigationBar.vue';

const mainTmp = {
  title: 'Cover your page.',
  text:
    'Cover is a one-page template for building simple and beautiful home pages. Download, edit the text, and add your own fullscreen background photo to make it your own.',
  btnText: 'Learn more',
};
export default {
  name: 'Home',
  data() {
    return {
      main: mainTmp,
    };
  },
  mounted() {
    $('html, body').css('height', '100%');
    $('#home-root-div').css('box-shadow', 'inset 0 0 5rem rgba(180, 180, 180, 0.5)');
    $('#app-nav').addClass('bg-transparent');
  },
  components: { NavigationBar },
};
</script>

<style lang="scss" scoped>
#cover {
  color: #444;
  text-shadow: 0 0.05rem 0.1rem rgba(230, 230, 230, 0.5);
}
.cover-container {
  max-width: 42em;
}
.cover {
  padding: 0 1.5rem;
}
.cover .btn-lg {
  padding: 0.75rem 1.25rem;
  font-weight: 700;
}
</style>
