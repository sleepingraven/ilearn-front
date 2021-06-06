<template>
  <div class="admin-root-div">
    <!-- top nav -->
    <nav class="navbar navbar-dark sticky-top bg-dark flex-md-nowrap p-0 shadow">
      <a class="navbar-brand col-md-3 col-lg-2 mr-0 px-3" href="/">ILearn</a>
      <button
        class="navbar-toggler position-absolute d-md-none collapsed"
        type="button"
        data-toggle="collapse"
        data-target="#sidebar-menu"
        aria-controls="sidebar-menu"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <!--<input class="form-control form-control-dark w-100" type="text" placeholder="Search" aria-label="Search" />-->
      <ul class="navbar-nav px-3">
        <li class="nav-item text-nowrap">
          <a class="nav-link" href="javascript:void(0)" @click="signOut">退出</a>
        </li>
      </ul>
    </nav>

    <!-- center area -->
    <div class="container-fluid">
      <div class="row">
        <!-- menu -->
        <AdminMenu :menu-groups="menuGroups" />

        <!-- main part -->
        <main role="main" class="col-md-9 ml-sm-auto col-lg-10 px-md-4">
          <router-view />
        </main>
      </div>
    </div>
  </div>
</template>

<script>
import AdminMenu from '@/components/admin/AdminMenu';
import $ from 'jquery';

export default {
  name: 'Admin',
  data() {
    return {
      menuGroups: [
        {
          items: [{ title: '后台管理', icon: 'home', name: 'AdminHome' }],
        },
        {
          title: '课程管理',
          expand: true,
          items: [
            {
              title: '我的课程',
              icon: 'archive',
              name: 'AdminCourseList',
              requiring: 'COURSE_SUPPLIER',
            },
          ],
        },
        {
          title: '考试管理',
          expand: true,
          items: [
            {
              title: '考试信息',
              icon: 'trello',
              name: 'AdminExam',
              requiring: 'EXAM_INITIATOR',
            },
          ],
        },
        {
          title: '权限管理',
          expand: true,
          items: [{ title: '用户权限', icon: 'grid', name: 'AdminAuthority', requiring: 'ADMIN' }],
        },
      ],
    };
  },
  created() {
    let roles = this.$appCommon.getUserCommonData().roles;
    this.menuGroups = this.menuGroups.filter((g) => {
      g.items = g.items.filter((item) => !item.requiring || roles.has(item.requiring));
      return g.items.length;
    });
  },
  mounted() {
    // $('body').addClass('smooth-scroll');
    $('body').addClass('keep-scroll');
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
  },
  components: { AdminMenu },
};
</script>

<style lang="scss">
.admin-root-div {
  font-size: 0.875rem;
  .table td {
    vertical-align: middle;
  }

  .feather {
    width: 20px;
    height: 20px;
  }
  .sidebar-sticky .feather {
    width: 16px;
    height: 16px;
  }

  /*
   * Sidebar
   */

  .sidebar {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    z-index: 100; /* Behind the navbar */
    padding: 48px 0 0; /* Height of navbar */
    box-shadow: inset -1px 0 0 rgba(0, 0, 0, 0.1);
  }

  @media (max-width: 767.98px) {
    .sidebar {
      top: 5rem;
    }
  }

  .sidebar-sticky {
    position: relative;
    top: 0;
    height: calc(100vh - 48px);
    padding-top: 0.5rem;
    overflow-x: hidden;
    overflow-y: auto; /* Scrollable contents if viewport is shorter than content. */
  }

  @supports ((position: -webkit-sticky) or (position: sticky)) {
    .sidebar-sticky {
      position: -webkit-sticky;
      position: sticky;
    }
  }

  .sidebar .nav-link {
    font-weight: 500;
    color: #333;
  }

  .sidebar .nav-link .feather {
    margin-right: 4px;
    color: #999;
  }

  .sidebar .nav-link.active {
    color: #007bff;
  }

  .sidebar .nav-link:hover .feather,
  .sidebar .nav-link.active .feather {
    color: inherit;
  }

  .sidebar-heading {
    font-size: 0.75rem;
    text-transform: uppercase;
    background-color: #f6f6f6;
  }

  /*
   * Navbar
   */

  .navbar-brand {
    padding-top: 0.75rem;
    padding-bottom: 0.75rem;
    font-size: 1rem;
    background-color: rgba(0, 0, 0, 0.25);
    box-shadow: inset -1px 0 0 rgba(0, 0, 0, 0.25);
  }

  .navbar .navbar-toggler {
    top: 0.25rem;
    right: 1rem;
  }

  .navbar .form-control {
    padding: 0.75rem 1rem;
    border-width: 0;
    border-radius: 0;
  }

  .form-control-dark {
    color: #fff;
    background-color: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.1);
  }

  .form-control-dark:focus {
    border-color: transparent;
    box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.25);
  }
}
</style>
