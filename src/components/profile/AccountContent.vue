<template>
  <div>
    <!-- 账号信息 -->
    <div class="m-2">
      <h4 class="anchor-container">
        账号信息
        <a id="item-3-1" href="#item-3-1">
          <span data-feather="link" class="align-baseline"></span>
        </a>
      </h4>
      <form>
        <div class="form-group row">
          <label for="staticEmail" class="col-sm-2 col-form-label">主邮箱</label>
          <div class="col-sm-10">
            <div class="list-group">
              <input
                type="email"
                class="form-control-plaintext list-group-item list-group-item-light"
                id="staticEmail"
                readonly
                v-if="loginUser.email.list.length"
                :value="loginUser.email.list[0].url"
              />
              <small class="form-text text-muted">主邮箱可用于登录，绑定并验证后才能设置为主邮箱</small>
            </div>
            <div v-if="mainEmailChanged">
              <div
                id="changed-alert"
                class="alert alert-success alert-dismissible fade mt-2"
                :class="{ show: mainEmailChangedAlert }"
                role="alert"
              >
                <strong>已更改主邮箱。</strong>
                从下一次登录开始，您需要使用新的邮箱。
                <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        <div class="form-group row">
          <label for="inputEmail3" class="col-sm-2 col-form-label">邮箱</label>
          <div class="col-sm-10">
            <ul id="inputEmail3" class="list-group">
              <li
                class="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
                v-for="(e, ei) in loginUser.email.list"
                :key="ei"
              >
                {{ e.url }}
                <div v-if="ei > 0">
                  <button
                    type="button"
                    class="btn btn-sm btn-light"
                    v-if="loginUser.email.list[ei].verified"
                    @click="setMainEmail(e.url)"
                  >
                    设为主邮箱
                  </button>
                  <button type="button" class="btn btn-sm btn-info" v-else>验证</button>
                  <button
                    type="button"
                    class="btn btn-sm btn-outline-secondary ml-1"
                    data-toggle="modal"
                    data-target="#modalBackdropUnbind"
                    :data-message="e.url"
                  >
                    解除绑定
                  </button>
                </div>
                <div v-else class="mr-1">
                  <svg
                    viewBox="0 0 24 24"
                    width="24"
                    height="24"
                    stroke="currentColor"
                    stroke-width="2"
                    fill="none"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="css-i6dzq1"
                  >
                    <path
                      d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"
                    ></path>
                  </svg>
                </div>
              </li>
            </ul>
          </div>
        </div>
        <div class="form-group row">
          <div class="col">
            <button type="button" class="btn btn-sm btn-info" data-toggle="modal" data-target="#exampleModal">
              添加邮箱
            </button>
            <app-modal modal-id="exampleModal" modal-title="添加邮箱" footer-form="addi-email-form">
              <template v-slot:body>
                <form id="addi-email-form">
                  <div class="form-group">
                    <label for="inputEmail1">邮箱</label>
                    <input
                      type="email"
                      id="inputEmail1"
                      class="form-control on-change-verification dont-mark-valid"
                      placeholder="Email address"
                      v-model="addiEmail"
                      required
                      autofocus
                    />
                  </div>
                </form>
              </template>
            </app-modal>
          </div>
        </div>
      </form>
    </div>

    <div class="m-2">
      <h4 class="anchor-container">
        密码
        <a id="item-3-2" href="#item-3-2">
          <span data-feather="link" class="align-baseline"></span>
        </a>
      </h4>
      <div class="form-group row">
        <div class="col">
          <button
            type="button"
            class="btn btn-sm btn-outline-info"
            data-toggle="modal"
            data-target="#exampleModalPassword"
          >
            修改密码
          </button>
          <!--<button type="button" class="btn btn-sm btn-outline-secondary ml-1">重置密码</button>-->
        </div>
      </div>
    </div>

    <app-modal
      modal-id="modalBackdropUnbind"
      :ok-callback="removeEmail"
      modal-title="确定解除绑定？"
      :modal-body="false"
    ></app-modal>
    <app-modal modal-id="exampleModalPassword" modal-title="修改密码" footer-form="change-password-form">
      <template v-slot:body>
        <form id="change-password-form">
          <div class="form-group">
            <label for="inputEmail2">原密码</label>
            <input
              type="password"
              id="inputEmail2"
              class="form-control on-change-verification dont-mark-valid"
              placeholder="请输入原密码"
              v-model="password.origin"
              required
              autofocus
            />
          </div>
          <div class="form-group">
            <label for="inputEmail5">新密码</label>
            <input
              type="password"
              id="inputEmail5"
              class="form-control on-change-verification dont-mark-valid"
              placeholder="请输入新密码"
              v-model="password.target"
              required
            />
          </div>
          <div class="form-group">
            <label for="inputEmail4">确认密码</label>
            <input
              type="password"
              id="inputEmail4"
              class="form-control on-change-verification dont-mark-valid"
              placeholder="请输入确认密码"
              v-model="password.confirm"
              required
            />
          </div>
        </form>
      </template>
    </app-modal>
  </div>
</template>

<script>
import $ from 'jquery';
import AppModal from '@/components/common/AppModal';
import feather from 'feather-icons';

export default {
  name: 'AccountContent',
  components: { AppModal },
  data() {
    return {
      addiEmail: '',
      loginUser: {
        email: {
          list: [],
        },
      },
      mainEmailChanged: false,
      mainEmailChangedAlert: false,
      password: {
        origin: '',
        target: '',
        confirm: '',
      },
    };
  },
  created() {
    const self = this;
    if (sessionStorage.getItem('ILearn.account.email.changed') === 'true') {
      self.mainEmailChanged = true;
    }
    self.$http.get('/user/emails').then((res) => {
      let resEmails = res.data.data;
      console.log(resEmails);
      resEmails
        .map((item) => {
          return { url: item, verified: true };
        })
        .forEach((item) => self.loginUser.email.list.push(item));

      if (self.mainEmailChanged) {
        self.mainEmailChangedAlert = true;
        sessionStorage.removeItem('ILearn.account.email.changed');
      }
    });
    this.pushContents();
  },
  mounted() {
    const self = this;
    let $addEmailForm = $('#addi-email-form');
    $addEmailForm.submit((e) => {
      if (!$addEmailForm[0].checkValidity()) {
        return;
      }
      e.preventDefault();
      self.$http
        .post('/user/email', self.addiEmail)
        .then((res) => {
          if (res.data.status === 'success') {
            window.location.reload();
          } else {
            this.$toast.show({
              title: '添加失败',
              msg: res.data.data.errorMsg,
              icon: 'danger',
            });
          }
        })
        .catch(() => {
          this.$toast.show({
            title: '添加失败',
            msg: '连接出现异常',
            icon: 'danger',
          });
        });
    });

    let $changePasswordForm = $('#change-password-form');
    $changePasswordForm.submit((e) => {
      if (!$changePasswordForm[0].checkValidity()) {
        return;
      }
      e.preventDefault();
      if (self.password.target !== self.password.confirm) {
        self.$toast.show({
          title: '新密码和确认密码不相同',
          icon: 'danger',
        });
        return;
      }
      self.$http
        .put('/user/password', self.password)
        .then((res) => {
          if (res.data.status === 'success') {
            window.location.reload();
          } else {
            this.$toast.show({
              title: '修改失败',
              msg: res.data.data.errorMsg,
              icon: 'danger',
            });
          }
        })
        .catch(() => {
          this.$toast.show({
            title: '修改失败',
            msg: '连接出现异常',
            icon: 'danger',
          });
        });
    });

    feather.replace();
  },
  methods: {
    pushContents() {
      this.$emit('switchContents', [
        { title: '账号信息', anchor: '#item-3-1' },
        { title: '密码', anchor: '#item-3-2' },
      ]);
    },
    setMainEmail(url) {
      const self = this;
      self.$http
        .post('/user/main-email', url)
        .then((res) => {
          if (res.data.status === 'success') {
            sessionStorage.setItem('ILearn.account.email.changed', 'true');
            window.location.reload();
          } else {
            this.$toast.show({
              title: '设置失败',
              msg: res.data.data.errorMsg,
              icon: 'danger',
            });
          }
        })
        .catch(() => {
          this.$toast.show({
            title: '设置失败',
            msg: '连接出现异常',
            icon: 'danger',
          });
        });
    },
    removeEmail(relatedTarget) {
      let email = $(relatedTarget).data('message');
      const self = this;
      self.$http
        .delete('/user/email', {
          data: email,
        })
        .then((res) => {
          if (res.data.status === 'success') {
            window.location.reload();
          } else {
            this.$toast.show({
              title: '解绑失败',
              msg: res.data.data.errorMsg,
              icon: 'danger',
            });
          }
        })
        .catch(() => {
          this.$toast.show({
            title: '解绑失败',
            msg: '连接出现异常',
            icon: 'danger',
          });
        });
    },
  },
};
</script>

<style lang="scss" scoped></style>
