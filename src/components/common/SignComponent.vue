<template>
  <div>
    <ul class="nav nav-tabs nav-fill" id="myTab" role="tablist">
      <li class="nav-item" role="presentation">
        <a
          class="nav-link active"
          id="sign-in-tab"
          data-toggle="tab"
          href="#sign-in-div"
          role="tab"
          aria-controls="sign-in-div"
          aria-selected="true"
        >
          登录
        </a>
      </li>
      <li class="nav-item" role="presentation">
        <a
          class="nav-link"
          id="sign-up-tab"
          data-toggle="tab"
          href="#sign-up-div"
          role="tab"
          aria-controls="sign-up-div"
          aria-selected="false"
        >
          注册
        </a>
      </li>
    </ul>
    <div class="tab-content p-2" id="myTabContent">
      <div class="tab-pane fade show active" id="sign-in-div" role="tabpanel" aria-labelledby="sign-in-tab">
        <!-- 登录 -->
        <form id="sign-in-form" class="form-signin needs-validation" novalidate>
          <div class="text-center mb-4">
            <img class="mb-2 rounded-lg" :src="avatarLogo" alt="" width="72" height="72" />
          </div>
          <div class="form-label-group">
            <input
              type="email"
              id="inputEmail1"
              class="form-control on-change-verification dont-mark-valid"
              v-model="signInData.email"
              placeholder="Email address"
              @change="fetchAvatar"
              required
              autofocus
            />
            <label for="inputEmail1">邮箱</label>
          </div>
          <div class="form-label-group">
            <input
              type="password"
              id="inputPassword1"
              class="form-control on-change-verification dont-mark-valid"
              v-model="signInData.password"
              placeholder="Password"
              required
            />
            <label for="inputPassword1">密码</label>
          </div>
          <div class="checkbox mb-3">
            <div class="custom-control custom-checkbox d-flex justify-content-between">
              <input
                type="checkbox"
                id="customCheck1"
                class="custom-control-input dont-mark-valid-custom"
                v-model="signInData.rememberMe"
              />
              <label class="custom-control-label" for="customCheck1">自动登录</label>
              <!--<a class="text text-secondary" href="#">忘记密码</a>-->
            </div>
          </div>
          <button class="btn btn-lg btn-primary btn-block" type="submit" :disabled="status.signIn">
            {{ !status.signIn ? '登录' : '登录中' }}
            <span :class="{ invisible: !status.signIn }">
              <span data-feather="loader" style="margin-bottom: 0.1em"></span>
            </span>
          </button>
        </form>
      </div>

      <div class="tab-pane fade" id="sign-up-div" role="tabpanel" aria-labelledby="sign-up-tab">
        <!-- 注册 -->
        <form id="sign-up-form" class="form-signin needs-validation" novalidate>
          <div class="form-label-group">
            <input
              type="text"
              id="inputName2"
              class="form-control on-blur-verification"
              v-model="signUpData.name"
              placeholder="Name"
              required
            />
            <label for="inputName2">昵称</label>
            <div class="invalid-feedback">请输入昵称</div>
          </div>
          <div class="form-label-group">
            <input
              type="email"
              id="inputEmail2"
              class="form-control on-blur-verification"
              v-model="signUpData.email"
              placeholder="Email address"
              required
            />
            <label for="inputEmail2">邮箱</label>
            <div class="invalid-feedback">请输入正确的邮箱</div>
          </div>
          <!--<div class="form-label-group input-group has-validation">
            <input
              type="text"
              class="form-control dont-mark-valid"
              id="validationVerification2"
              placeholder="验证码"
              style="z-index: auto"
              required
            />
            <label for="validationVerification2">验证码</label>
            <div class="input-group-append">
              <button
                class="btn btn-outline-secondary"
                :class="{ disabled: !isVerificationReady }"
                type="button"
                id="button-addon2"
                tabindex="-1"
                @click="$store.commit('performVerify')"
              >
                {{ isVerificationReady ? '发送验证码' : verificationCountdown }}
              </button>
            </div>
            <div class="invalid-feedback">请输入正确的验证码</div>
          </div>-->
          <div class="form-label-group">
            <input
              type="password"
              id="inputPassword2"
              class="form-control on-blur-verification"
              v-model="signUpData.password"
              placeholder="Password"
              required
            />
            <label for="inputPassword2">密码</label>
            <div class="invalid-feedback">请输入密码</div>
          </div>
          <button class="btn btn-lg btn-primary btn-block" type="submit" :disabled="status.signUp">
            {{ !status.signUp ? '注册' : '注册中' }}
            <span :class="{ invisible: !status.signUp }">
              <span data-feather="loader" style="margin-bottom: 0.1em"></span>
            </span>
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import Logo from '@/assets/img/logo.svg';
import { mapState } from 'vuex';
import { mapGetters } from 'vuex';
import $ from 'jquery/dist/jquery.js';
import qs from 'qs';

export default {
  name: 'SignComponent',
  data() {
    return {
      avatarLogo: Logo,
      signInData: {
        email: '',
        password: '',
        rememberMe: true,
      },
      signUpData: {
        name: '',
        email: '',
        password: '',
      },
      status: {
        signIn: false,
        signUp: false,
      },
    };
  },
  mounted() {
    const self = this;
    let $signInForm = $('#sign-in-form');
    $signInForm.submit((e) => {
      if (!$signInForm[0].checkValidity()) {
        return;
      }
      e.preventDefault();
      self.status.signIn = true;
      self.$http
        .post('/user/sign-in', qs.stringify(self.signInData), {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        })
        .then((res) => {
          if (res.data.status === 'success') {
            // 设置Vuex登录标志为true，默认userLogin为false
            this.$store.dispatch('userLogin', true);
            //Vuex在用户刷新的时候userLogin会回到默认值false，所以我们需要用到HTML5储存
            //我们设置一个名为Flag，值为isLogin的字段，作用是如果Flag有值且为isLogin的时候，证明用户已经登录了。
            localStorage.setItem('ILearn.LoginFlag', 'isLogin');
            let user = res.data.data.user;
            user.roles = res.data.data.roles;
            self.$appCommon.setUserCommonData(user);
            if (self.goBackOnLoginSucceed) {
              self.$router.go(-1);
            } else {
              window.location.reload();
            }
          } else {
            this.$toast.show({
              title: '登录失败',
              msg: res.data.data,
              icon: 'danger',
            });
            self.status.signIn = false;
          }
        })
        .catch(() => {
          this.$toast.show({
            title: '登录失败',
            msg: '连接出现异常',
            icon: 'danger',
          });
          self.status.signIn = false;
        });
    });
    let $signUpForm = $('#sign-up-form');
    $signUpForm.submit((e) => {
      if (!$signUpForm[0].checkValidity()) {
        return;
      }
      e.preventDefault();
      self.status.signUp = true;
      self.$http
        .post('/user/sign-up', self.signUpData)
        .then((res) => {
          if (res.data.status === 'success') {
            self.signInData.email = self.signUpData.email;
            $('#sign-in-tab').tab('show');
          } else {
            this.$toast.show({
              title: '注册失败',
              msg: res.data.data.errorMsg,
              icon: 'danger',
            });
          }
          self.status.signUp = false;
        })
        .catch(() => {
          this.$toast.show({
            title: '注册失败',
            msg: '连接出现异常',
            icon: 'danger',
          });
          self.status.signUp = false;
        });
    });
  },
  methods: {
    fetchAvatar() {
      const self = this;
      self.$http
        .get('/user/avatar-url', {
          params: { email: self.signInData.email },
        })
        .then((res) => {
          if (res.data.status === 'success' && res.data.data.length) {
            self.avatarLogo = res.data.data;
          } else {
            self.avatarLogo = Logo;
          }
        });
    },
  },
  computed: {
    ...mapState({
      verificationCountdown: (state) => state.sign.verificationCountdown,
    }),
    ...mapGetters(['isVerificationReady']),
  },
  props: {
    goBackOnLoginSucceed: {
      type: Boolean,
      default: true,
    },
  },
};
</script>

<style lang="scss" scoped></style>
