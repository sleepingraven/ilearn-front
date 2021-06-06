<template>
  <AdminMainViewport title="用户权限">
    <template v-slot:header>
      <div class="btn-toolbar mb-2 mb-md-0">
        <button
          type="button"
          class="btn btn-sm btn-outline-secondary"
          data-toggle="collapse"
          data-target=".multi-collapse"
        >
          <span data-feather="repeat"></span>
        </button>
      </div>
    </template>
    <template v-slot:body>
      <div class="table-responsive">
        <table class="table table-striped table-hover table-bordered table-sm">
          <thead>
            <tr>
              <th>#</th>
              <th>名称</th>
            </tr>
          </thead>
          <tbody v-for="(u, ui) in users" :key="ui">
            <tr data-toggle="collapse" :data-target="'#' + 'no-' + ui + '-panel'" style="cursor: pointer">
              <th scope="row">
                {{ ui + 1 }}
              </th>
              <td>
                {{ u.name }}
              </td>
            </tr>
            <tr>
              <td colspan="2" class="p-0">
                <div :id="'no-' + ui + '-panel'" class="collapse multi-collapse">
                  <form style="padding: 0.3rem" @submit="handleUpdate($event, ui)">
                    <div class="custom-control custom-switch d-inline-block mr-4" v-for="(r, ri) in u.roles" :key="ri">
                      <input
                        type="checkbox"
                        class="custom-control-input"
                        :id="'customSwitch' + ri + '-of-user-' + ui"
                        v-model="r.checked"
                      />
                      <label class="custom-control-label" :for="'customSwitch' + ri + '-of-user-' + ui">
                        {{ r.name }}
                      </label>
                    </div>
                    <button type="submit" class="btn btn-sm rounded-lg btn-primary" style="line-height: 0.875">
                      <span data-feather="check"></span>
                    </button>
                  </form>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>
  </AdminMainViewport>
</template>

<script>
import AdminMainViewport from '@/components/admin/AdminMainViewport';
import feather from 'feather-icons';
import qs from 'qs';

export default {
  name: 'AdminAuthority',
  data() {
    return {
      users: [],
    };
  },
  created() {
    const self = this;
    self.$http
      .get('/admin/users')
      .then((res) => {
        if (res.data.status === 'success') {
          let users = res.data.data.users;
          let allRoles = res.data.data.allRoles;
          users.forEach((u) => {
            let rolesSet = new Set((u.roles || []).map((r) => r.id));
            u.roles = allRoles.map((r) => {
              return {
                id: r.id,
                name: r.alias,
                checked: rolesSet.has(r.id),
              };
            });
          });
          self.users = users;
          this.$nextTick(() => {
            feather.replace();
          });
        } else {
          this.$toast.show({
            title: '获取用户失败',
            msg: res.data.data.errorMsg,
            icon: 'danger',
          });
        }
      })
      .catch(() => {
        this.$toast.show({
          title: '获取用户失败',
          msg: '连接出现异常',
          icon: 'danger',
        });
      });
  },
  methods: {
    handleUpdate(e, ui) {
      const self = this;
      if (!e.target.checkValidity()) {
        return;
      }
      e.preventDefault();
      let roleIds = self.users[ui].roles.filter((r) => r.checked).map((r) => r.id);
      self.$http
        .put('/admin/role', qs.stringify({ userId: self.users[ui].id, ids: roleIds }, { arrayFormat: 'repeat' }), {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        })
        .then((res) => {
          if (res.data.status === 'success') {
            window.location.reload();
          } else {
            this.$toast.show({
              title: '出错了',
              msg: res.data.data.errorMsg,
              icon: 'danger',
            });
          }
        })
        .catch(() => {
          this.$toast.show({
            title: '出错了',
            msg: '连接出现异常',
            icon: 'danger',
          });
        });
    },
  },
  components: { AdminMainViewport },
};
</script>

<style lang="scss" scoped></style>
