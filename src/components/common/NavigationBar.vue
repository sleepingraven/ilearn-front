<template>
  <!-- 导航条 -->
  <div id="nav-root-div">
    <nav id="app-nav" class="navbar navbar-expand-lg navbar-light">
      <div class="container">
        <!-- a. Brand -->
        <a class="navbar-brand" href="/">
          <img src="@/assets/img/logo.svg" width="30" height="30" class="d-inline-block align-top" alt="" />
          ILearn
        </a>
        <!-- b. Toggler -->
        <button
          class="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <!-- c. Nav -->
          <ul class="navbar-nav">
            <li class="nav-item" :class="{ active: activeIdx === 1 }">
              <a class="nav-link" href="/course/list">课程</a>
            </li>
            <li class="nav-item" :class="{ active: activeIdx === 2 }">
              <a class="nav-link" href="/exam/list">测试</a>
            </li>
          </ul>
          <div class="mx-xl-5 mx-lg-4"></div>
          <!-- d. Forms -->
          <!--<form class="form-inline my-2 my-lg-0">
            <input class="form-control mr-sm-2 rounded-nav" type="search" placeholder="Search..." aria-label="Search" />
            <button class="btn btn-outline-success my-2 my-sm-0 rounded-nav" type="submit">
              <span data-feather="search"></span>
            </button>
          </form>-->
          <div class="mx-auto"></div>
          <div>
            <!-- e. notification/Dropdowns -->
            <div v-if="loggedIn">
              <ul class="navbar-nav">
                <!-- i. notification -->
                <li class="nav-item">
                  <div id="notification-dropdown" class="dropdown">
                    <a class="nav-link" style="cursor: pointer" data-toggle="dropdown">
                      <div class="position-relative d-inline">
                        <span data-feather="bell"></span>
                        <span class="app-tip" v-if="newRepliesArrived.beginIdReduceCopy > 0"></span>
                      </div>
                    </a>
                    <div
                      id="notification-dropdown-menu"
                      class="dropdown-menu dropdown-menu-right p-2 m-0 app-scrollbar"
                      style="min-width: 30vw; right: -11em; overflow-y: scroll; max-height: 90vh"
                    >
                      <div class="list-group list-group-flush small">
                        <a
                          v-for="(r, ri) in newRepliesArrived.newReplies"
                          :key="ri"
                          href="#"
                          class="list-group-item list-group-item-action disabled"
                          :class="{ 'list-group-item-primary': newRepliesArrived.beginId && r.unread }"
                        >
                          <div class="d-flex w-100 justify-content-between">
                            <p class="mb-0">
                              <a href="#" class="text-decoration-none">{{ r.userFromName }}</a>
                              在
                              <a href="#" class="text-decoration-none">{{ r.postTitle }}</a>
                              中回复了你
                            </p>
                            <small class="text-muted align-self-center text-nowrap">
                              {{ $appCommon.formatAchieveTimeAgo(r.createTime) }}
                            </small>
                          </div>
                        </a>
                        <div
                          class="list-group-item align-self-center notification-bottom"
                          v-if="newRepliesArrived.beginId"
                        >
                          <div class="spinner-grow text-primary" role="status">
                            <span class="sr-only">Loading...</span>
                          </div>
                        </div>
                        <div class="list-group-item disabled text-center text-muted notification-bottom" v-else>
                          没有啦
                        </div>
                      </div>
                    </div>
                  </div>
                </li>

                <!-- ii. Dropdowns -->
                <li class="nav-item dropdown auto-dropdown-focus">
                  <div
                    class="nav-link pt-1 auto-dropdown nav-avatar-div"
                    role="button"
                    data-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                    style="padding-bottom: 0.4rem"
                  >
                    <img
                      id="navbar-avatar-img"
                      alt=""
                      class="rounded-circle nav-avatar-img"
                      :src="$appCommon.getUserCommonData().avatarUrl"
                      style="width: 32px; height: 32px"
                    />
                  </div>
                  <div class="dropdown-menu dropdown-menu-right" aria-labelledby="navbarDropdown">
                    <h6 class="dropdown-header" style="font-size: 1.25rem">
                      <span data-feather="at-sign"></span>
                      {{ $appCommon.getUserCommonData().name }}
                    </h6>
                    <a class="dropdown-item" href="/profile/info">
                      <span data-feather="user"></span>
                      个人中心
                    </a>
                    <a class="dropdown-item" href="/profile/learn">
                      <span data-feather="flag"></span>
                      我的课程
                    </a>
                    <a class="dropdown-item" href="/admin/home" v-if="consoleLinkEnabled">
                      <span data-feather="inbox"></span>
                      控制台
                    </a>
                    <div class="dropdown-divider"></div>
                    <a class="dropdown-item" href="javascript:void(0)" @click="signOut">
                      <span data-feather="log-out"></span>
                      退出
                    </a>
                  </div>
                </li>
              </ul>
            </div>

            <!-- f. sign -->
            <div v-else>
              <!-- Button trigger modal -->
              <button
                type="button"
                class="btn btn-outline-secondary rounded-nav"
                data-toggle="modal"
                data-target="#modalBackdropSign"
              >
                <span data-feather="log-in"></span>
              </button>
              <!-- Vertically centered scrollable modal -->
              <app-modal
                modal-id="modalBackdropSign"
                :body-style="{ 'background-color': '#f5f5f5' }"
                :modal-footer="false"
              >
                <template v-slot:body>
                  <SignComponent :go-back-on-login-succeed="false" />
                </template>
              </app-modal>
            </div>
          </div>
        </div>
      </div>
    </nav>
  </div>
</template>

<script>
import $ from 'jquery/dist/jquery.js';
import SignComponent from '@/components/common/SignComponent';
import feather from 'feather-icons';
import AppModal from '@/components/common/AppModal';

export default {
  name: 'NavigationBar',
  data() {
    return {
      loggedIn: this.$store.state.sign.loggedIn,
      newRepliesArrived: {
        beginId: 0,
        newReplies: [],
        fetchMutex: true,
        reduceMutex: true,
        fetchAnchorId: 0,
        beginIdReduceCopy: 0,
        threshold: 0.5,
        dropdownShowing: false,
      },
    };
  },
  created() {
    if (this.loggedIn) {
      this.requestReplyBeginIndex();
    }
  },
  mounted: function () {
    feather.replace();
    dropdownActivate();
    enableAutoVerification();
    this.$appCommon.enableFormValidation();
    chooseNavVisibility();
    if (this.loggedIn) {
      this.enableNotificationDropdownListening();
      $('#notification-dropdown-menu').scroll(() => {
        this.checkGlanceOver();
      });
    }
  },
  methods: {
    signOut() {
      const self = this;
      self.$http
        .post('/user/sign-out')
        .then((res) => {
          if (res.data.status === 'success') {
            this.$store.dispatch('userLogin', false);
            localStorage.removeItem('ILearn.LoginFlag');
            localStorage.removeItem('ILearn.token');
            // 不能用 reload()，否则会跳转到 sign 页面
            window.location.href = '/';
          } else {
            this.$toast.show({
              title: '退出失败',
              msg: res.data.data.errorMsg,
              icon: 'danger',
            });
          }
        })
        .catch(() => {
          this.$toast.show({
            title: '退出失败',
            msg: '连接出现异常',
            icon: 'danger',
          });
        });
    },
    requestReplyBeginIndex() {
      const self = this;
      self.$http
        .get('/notification/reply-received-begin-id')
        .then((res) => {
          if (res.data.status === 'success') {
            let beginId = res.data.data;
            self.newRepliesArrived.beginId = beginId;
            self.newRepliesArrived.fetchAnchorId = Math.abs(beginId);
            self.newRepliesArrived.beginIdReduceCopy = beginId;
            self.newRepliesArrived.fetchMutex = beginId === 0;
            self.newRepliesArrived.reduceMutex = beginId <= 0;
            self.doFetch();
          } else {
            this.$toast.show({
              title: '获取回复消息失败',
              msg: res.data.data.errorMsg,
              icon: 'danger',
            });
          }
        })
        .catch(() => {
          this.$toast.show({
            title: '获取回复消息失败',
            msg: '连接出现异常',
            icon: 'danger',
          });
        });
    },
    checkGlanceOver() {
      if (!this.newRepliesArrived.dropdownShowing) {
        return;
      }
      let $notificationBottom = $('.notification-bottom');
      let diff =
        $notificationBottom[0].getBoundingClientRect().y -
        $('#notification-dropdown-menu')[0].getBoundingClientRect().bottom;
      let windowHeight = $(window).height();
      if (diff < windowHeight * this.newRepliesArrived.threshold) {
        this.doFetch();
      }
    },
    doFetch() {
      const self = this;
      if (!self.newRepliesArrived.beginId || self.newRepliesArrived.fetchMutex) {
        return;
      }
      console.log('开始获取 replies');
      self.newRepliesArrived.fetchMutex = true;
      self.$http
        .get('/notification/reply-received', {
          params: {
            beginId: self.newRepliesArrived.fetchAnchorId,
            offset: 0,
          },
        })
        .then((res) => {
          if (res.data.status === 'success') {
            let replies = res.data.data;
            if (!replies.length) {
              self.newRepliesArrived.beginId = 0;
              return;
            }
            self.newRepliesArrived.newReplies.push.apply(self.newRepliesArrived.newReplies, replies);
            let lastFetched = replies[replies.length - 1];
            self.newRepliesArrived.fetchAnchorId = Math.abs(lastFetched.id) - 1;
            self.$nextTick(() => {
              self.checkGlanceOver();
            });
          } else {
            this.$toast.show({
              title: '获取回复消息失败',
              msg: res.data.data.errorMsg,
              icon: 'danger',
            });
          }
          self.newRepliesArrived.fetchMutex = false;
        })
        .catch(() => {
          this.$toast.show({
            title: '获取回复消息失败',
            msg: '连接出现异常',
            icon: 'danger',
          });
          self.newRepliesArrived.fetchMutex = false;
        });
    },
    doReduce() {
      const self = this;
      if (self.newRepliesArrived.beginIdReduceCopy <= 0 || self.newRepliesArrived.reduceMutex) {
        return;
      }
      self.newRepliesArrived.reduceMutex = true;
      self.$http
        .post('/notification/reduce-unread-received', self.newRepliesArrived.beginIdReduceCopy)
        .then((res) => {
          if (res.data.status === 'success') {
            self.newRepliesArrived.beginIdReduceCopy = 0;
          } else {
            this.$toast.show({
              title: '获取回复消息失败',
              msg: res.data.data.errorMsg,
              icon: 'danger',
            });
          }
          self.newRepliesArrived.reduceMutex = false;
        })
        .catch(() => {
          this.$toast.show({
            title: '获取回复消息失败',
            msg: '连接出现异常',
            icon: 'danger',
          });
          self.newRepliesArrived.reduceMutex = false;
        });
    },
    enableNotificationDropdownListening() {
      const self = this;
      const $notificationDropdown = $('#notification-dropdown');

      $notificationDropdown.bind('show.bs.dropdown', () => {
        self.newRepliesArrived.dropdownShowing = true;
        self.checkGlanceOver();
      });
      $notificationDropdown.bind('hidden.bs.dropdown', () => {
        self.newRepliesArrived.dropdownShowing = false;
        self.doReduce();
      });
    },
  },
  computed: {
    consoleLinkEnabled() {
      let userCommonData = this.$appCommon.getUserCommonData();
      return (
        userCommonData.roles &&
        (userCommonData.roles.size > 1 || (userCommonData.roles.size === 1 && !userCommonData.roles.has('SPEAKER')))
      );
    },
  },
  props: {
    activeIdx: {
      type: Number,
      default: 0,
    },
  },
  components: { AppModal, SignComponent },
};
function chooseNavVisibility() {
  if (window.location.pathname !== '/' && window.location.pathname !== '' && window.location.pathname != null) {
    $('#nav-root-div').addClass('high-visibility');
    /*$('#nav-root-div.high-visibility').hover(
      (e) => {
        $(e.currentTarget).addClass('shadow-sm');
      },
      (e) => {
        $(e.currentTarget).removeClass('shadow-sm');
      }
    );*/
  }
}
function dropdownActivate() {
  let hoverTimer;
  $('.auto-dropdown-focus').hover(
    (e) => {
      clearTimeout(hoverTimer);
      $(e.currentTarget).find('.auto-dropdown').dropdown('show');
    },
    (e) => {
      hoverTimer = window.setTimeout(() => {
        $(e.currentTarget).find('.auto-dropdown').dropdown('hide');
      }, 300);
    }
  );
}

// 输入组件自动校验
function enableAutoVerification() {
  // change：失去焦点且值改变了触发
  // input propertychange：值改变时触发
  $('input.on-blur-verification').bind('blur', (e) => {
    let $this = $(e.currentTarget);
    $this.parent().addClass('was-validated');
  });
  $('input.on-change-verification').bind('change', (e) => {
    let $this = $(e.currentTarget);
    $this.parent().addClass('was-validated');
  });

  let style = document.createElement('style');
  const cssInput = '{border-color: rgb(206, 212, 218)!important; background-image: none!important;}';
  style.innerHTML +=
    '.dont-mark-valid.form-control.is-valid, .was-validated .dont-mark-valid.form-control:valid' + cssInput;
  style.innerHTML +=
    '.dont-mark-invalid.form-control.is-invalid, .was-validated .dont-mark-invalid.form-control:invalid' + cssInput;

  style.innerHTML +=
    '.dont-mark-valid-custom.custom-control-input.is-valid~.custom-control-label, .was-validated .dont-mark-valid-custom.custom-control-input:valid~.custom-control-label' +
    '{color: rgb(33, 37, 41)!important;}';
  style.innerHTML +=
    '.dont-mark-valid-custom.custom-control-input.is-valid~.custom-control-label::before, .was-validated .dont-mark-valid-custom.custom-control-input:valid~.custom-control-label::before' +
    '{border-color: rgb(206, 212, 218)!important;}';
  style.innerHTML +=
    '.dont-mark-valid-custom.custom-control-input.is-valid:checked~.custom-control-label::before, .was-validated .dont-mark-valid-custom.custom-control-input:valid:checked~.custom-control-label::before' +
    '{background-color:#007bff!important;}';
  style.innerHTML +=
    '.dont-mark-valid-custom.custom-control-input:focus~.custom-control-label::before' +
    '{box-shadow:0 0 0 0.2rem rgb(0 123 255 / 25%)!important;}';
  document.getElementsByTagName('head')[0].appendChild(style);
}
</script>

<style lang="scss" scoped>
#nav-root-div.high-visibility {
  background-color: rgba(255, 255, 255, 0.95);
  box-shadow: 0 0.5rem 1rem rgb(0 0 0 / 5%), inset 0 -1px 0 rgb(0 0 0 / 15%);
  transition: all 0.2s ease-in 0s;
}
#nav-root-div.high-visibility:hover {
  //background-color: #fbfbfb;
}

.rounded-nav {
  border-radius: 0.5rem;
}
.nav-avatar-div:hover {
  .nav-avatar-img {
    opacity: 0.9;
  }
}
.app-tip {
  background: rgba(250, 60, 0, 1);
  position: absolute; /*根据父元素绝对定位*/
  width: 8px;
  height: 8px;
  top: 0.2px; /*在父元素的内部的顶部*/
  right: 2.95px; /*在父元素的内部的右边*/
  -webkit-border-radius: 50%;
  -moz-border-radius: 50%;
  border-radius: 50%;
}
.dropdown-menu {
  box-shadow: 0 12px 42px rgba(0, 0, 0, 0.24);
  border: none;
}
</style>
