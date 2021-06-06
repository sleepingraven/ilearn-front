import $AppUtil from '@/assets/js/common';

let userCommonData = null;

export default {
  setUserCommonData(userCommonData) {
    localStorage.setItem('ILearn.LoginUser', JSON.stringify(userCommonData));
  },
  getUserCommonData() {
    if (!userCommonData) {
      userCommonData = JSON.parse(localStorage.getItem('ILearn.LoginUser'));
      userCommonData.roles = new Set(userCommonData.roles);
    }
    return userCommonData;
  },
  fireUpdateUserCommonData() {
    this.setUserCommonData(userCommonData);
  },

  // client-side 的校验方式
  enableFormValidation() {
    // Example starter JavaScript for disabling form submissions if there are invalid fields
    (function () {
      'use strict';
      window.addEventListener(
        'load',
        () => {
          // Fetch all the forms we want to apply custom Bootstrap validation styles to
          const forms = document.getElementsByClassName('needs-validation');
          // Loop over them and prevent submission
          // eslint-disable-next-line no-unused-vars
          const validation = Array.prototype.filter.call(forms, (form) => {
            form.addEventListener(
              'submit',
              (event) => {
                if (form.checkValidity() === false) {
                  event.preventDefault();
                  event.stopPropagation();
                }
                form.classList.add('was-validated');
              },
              false
            );
          });
        },
        false
      );
    })();
  },

  formatAchieveTimeAgo(time) {
    let latestTime = new Date(time);
    let diff = $AppUtil.getUTCTime(new Date()) - latestTime.getTime();
    // 一分钟以内
    if (diff < 60_000) {
      return '刚刚';
    }
    // 分钟数
    diff /= 60_000;
    if (diff < 60) {
      return Math.floor(diff) + ' 分钟前';
    }
    // 小时数
    diff /= 60;
    if (diff < 24) {
      return Math.floor(diff) + ' 小时前';
    }
    // 天数
    diff /= 24;
    if (diff < 30) {
      return Math.floor(diff) + ' 天前';
    }
    return (
      latestTime.getFullYear() +
      '-' +
      $AppUtil.completeLeadingZero2TwoDigits(latestTime.getMonth() + 1) +
      '-' +
      $AppUtil.completeLeadingZero2TwoDigits(latestTime.getDate())
    );
  },
};
