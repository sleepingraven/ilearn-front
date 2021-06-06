<template>
  <div>
    <!-- 1. 头像 -->
    <div id="item-1-1" class="m-2">
      <div class="form-group row align-items-end mx-0">
        <div class="col-sm-2 p-0">
          <img class="img-thumbnail w-100" alt="头像" :src="avatarUrl" />
        </div>
        <div class="col-sm-10">
          <button
            type="button"
            class="btn btn-outline-primary btn-sm"
            data-toggle="modal"
            data-target="#uploadBackdrop"
          >
            上传
          </button>
        </div>
        <!-- upload Modal -->
        <app-modal modal-id="uploadBackdrop" modal-title="更换头像" :modal-footer="false">
          <template v-slot:body>
            <AvatarUploader v-model="avatarUrl" />
          </template>
        </app-modal>
      </div>
    </div>

    <!-- 2. 基本信息 -->
    <div class="m-2">
      <h4 class="anchor-container">
        基本信息
        <a id="item-1-2" href="#item-1-2">
          <span data-feather="link" class="align-baseline"></span>
        </a>
      </h4>
      <form id="profile-form">
        <div class="form-group row">
          <label for="inputName" class="col-sm-2 col-form-label">昵称</label>
          <div class="col-sm-10">
            <input type="text" class="form-control" id="inputName" v-model="profile.name" />
            <!-- todo 校验 -->
            <small class="form-text text-muted">昵称不能为空，且最多 16 个字符</small>
          </div>
        </div>
        <fieldset class="form-group row">
          <legend class="col-form-label col-sm-2 float-sm-left pt-0">性别</legend>
          <div class="col-sm-10">
            <div class="custom-control custom-radio custom-control-inline">
              <input
                type="radio"
                id="customRadioInline1"
                name="customRadioInline"
                class="custom-control-input"
                v-model="profile.gender"
                value="1"
              />
              <label class="custom-control-label" for="customRadioInline1">男</label>
            </div>
            <div class="custom-control custom-radio custom-control-inline">
              <input
                type="radio"
                id="customRadioInline2"
                name="customRadioInline"
                class="custom-control-input"
                v-model="profile.gender"
                value="0"
              />
              <label class="custom-control-label" for="customRadioInline2">女</label>
            </div>
            <div class="custom-control custom-radio custom-control-inline">
              <input
                type="radio"
                id="customRadioInline3"
                name="customRadioInline"
                class="custom-control-input"
                v-model="profile.gender"
                value="-1"
              />
              <label class="custom-control-label" for="customRadioInline3">保密</label>
            </div>
          </div>
        </fieldset>
        <fieldset class="form-group row">
          <legend class="col-form-label col-sm-2 float-sm-left">生日</legend>
          <div class="col-sm-10">
            <div class="input-group">
              <select
                id="input-group-select-year"
                class="custom-select"
                v-model="profile.birthday.year"
                @change="fixBirthdayDay"
              >
                <option v-for="(y, yi) in birthdayOptions.year" :key="yi">{{ y }}</option>
              </select>
              <div class="input-group-append">
                <label class="input-group-text" for="input-group-select-year">年</label>
              </div>
              <select
                id="input-group-select-month"
                class="custom-select"
                v-model="profile.birthday.month"
                @change="fixBirthdayDay"
              >
                <option v-for="(m, mi) in birthdayOptions.month" :key="mi">{{ m }}</option>
              </select>
              <div class="input-group-append">
                <label class="input-group-text" for="input-group-select-month">月</label>
              </div>
              <select id="input-group-select-day" class="custom-select" v-model="profile.birthday.day">
                <option v-for="(d, di) in birthdayOptions.day" :key="di">{{ d }}</option>
              </select>
              <div class="input-group-append">
                <label class="input-group-text" for="input-group-select-day">日</label>
              </div>
            </div>
            <!-- prettier-ignore -->
            <small class="form-text text-muted" v-if="!birthdayIsPresent">
              还未设置生日，<a href="javascript: void(0)" class="text-decoration-none" @click="initBirthday">我要设置</a>
            </small>
          </div>
        </fieldset>
        <div class="form-group row">
          <label for="exampleFormControlTextarea1" class="col-sm-2 col-form-label">个人简介</label>
          <div class="col-sm-10">
            <!-- todo 校验 -->
            <textarea
              class="form-control"
              id="exampleFormControlTextarea1"
              placeholder="最多输入 128 字"
              v-model="profile.description"
            ></textarea>
          </div>
        </div>
        <div class="form-group row">
          <div class="col-sm-10">
            <button type="submit" class="btn btn-primary">保存</button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import AvatarUploader from '@/components/profile/sub/AvatarUploader';
import $ from 'jquery';
import AppModal from '@/components/common/AppModal';
import feather from 'feather-icons';

export default {
  name: 'ProfileContent',
  data() {
    const self = this;
    return {
      avatarUrl: this.$appCommon.getUserCommonData().avatarUrl,
      profile: {
        name: self.$appCommon.getUserCommonData().name,
        gender: -2,
        birthday: {
          year: new Date().getFullYear(),
          month: new Date().getMonth() + 1,
          day: new Date().getDate(),
        },
        description: '',
      },
      birthdayIsPresent: true,
      birthdayOptions: {
        year: [],
        month: [],
        day: [],
      },
    };
  },
  created() {
    const self = this;
    self.$http.get('/user/profile').then((res) => {
      let profile = res.data.data;
      self.profile.gender = profile.gender;
      if (profile.birthday === null) {
        self.birthdayIsPresent = false;
      } else {
        let date = new Date(profile.birthday);
        self.profile.birthday.year = date.getFullYear();
        self.profile.birthday.month = date.getMonth() + 1;
        self.profile.birthday.day = date.getDate();
      }
      self.profile.description = profile.description;
    });
    this.pushContents();
  },
  mounted() {
    let date = new Date();
    this.birthdayOptions.year = this.$appUtil.buildIntFromRangeClosedReversed(date.getFullYear(), 1900);
    this.birthdayOptions.month = this.$appUtil.buildIntFromRangeClosed(1, 12);
    this.fixBirthdayDay();

    const self = this;
    let $signUpForm = $('#profile-form');
    $signUpForm.submit((e) => {
      if (!$signUpForm[0].checkValidity()) {
        return;
      }
      e.preventDefault();
      let json = JSON.parse(JSON.stringify(self.profile));
      if (!self.birthdayIsPresent) {
        json.birthday = null;
      } else {
        json.birthday = new Date(
          self.profile.birthday.year,
          self.profile.birthday.month - 1,
          self.profile.birthday.day
        );
      }
      self.$http
        .patch('/user/profile', json)
        .then((res) => {
          if (res.data.status === 'success') {
            self.$appCommon.getUserCommonData().name = self.profile.name;
            self.$appCommon.fireUpdateUserCommonData();
            window.location.reload();
          } else {
            this.$toast.show({
              title: '保存失败',
              msg: res.data.data.errorMsg,
              icon: 'danger',
            });
          }
        })
        .catch(() => {
          this.$toast.show({
            title: '保存失败',
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
        { title: '头像设置', anchor: '#item-1-1' },
        { title: '基本信息', anchor: '#item-1-2' },
      ]);
    },
    initBirthday() {
      const self = this;
      this.$toast.show({
        title:
          '已设为 ' +
          self.profile.birthday.year +
          '/' +
          self.$appUtil.completeLeadingZero2TwoDigits(self.profile.birthday.month) +
          '/' +
          self.$appUtil.completeLeadingZero2TwoDigits(self.profile.birthday.day),
        msg: '记得保存哦',
        icon: 'success',
      });
      this.birthdayIsPresent = true;
    },
    fixBirthdayDay() {
      const year = this.profile.birthday.year,
        month = this.profile.birthday.month,
        day = this.profile.birthday.day;
      const lastDayExpected = new Date(year, month, 0).getDate(), // 当前月最后一天的值
        lastDay = this.$appUtil.lastElem(this.birthdayOptions.day); // 列表中最后一天的值
      let fixOptions = false;
      if (lastDay == null) {
        // 列表为空
        fixOptions = true;
      } else if (lastDay !== lastDayExpected) {
        // 列表需要变化，判断是否需要变更 day
        if (day > lastDayExpected) {
          this.profile.birthday.day = lastDayExpected;
        }
        fixOptions = true;
      }
      if (fixOptions) {
        this.birthdayOptions.day = this.$appUtil.buildIntFromRangeClosed(1, lastDayExpected);
      }
    },
  },
  components: { AppModal, AvatarUploader },
};
</script>

<style lang="scss" scoped></style>
