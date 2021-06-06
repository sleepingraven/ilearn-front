<template>
  <div>
    <ul class="list-group list-group-flush">
      <li
        class="list-group-item text-reset px-0"
        :class="{ 'pt-0': idx === 0 }"
        v-for="(item, idx) in listData"
        :key="idx"
      >
        <form class="needs-validation" novalidate @submit="handleSubmit($event, item, idx)">
          <!-- toolbar -->
          <div class="float-right">
            <slot name="list-form-toolbar" :item="item" :idx="idx"></slot>
            <button type="submit" class="btn btn-sm btn-primary ml-1" :disabled="item.temp && idx > persistentEndIdx">
              <span data-feather="save"></span>
              保存
            </button>
            <div class="btn-group d-inline-block ml-1" v-if="!item.temp">
              <button class="btn btn-light btn-sm" type="reset">清空</button>
              <button
                type="button"
                class="btn btn-sm btn-light dropdown-toggle dropdown-toggle-split"
                data-toggle="dropdown"
                aria-expanded="false"
              >
                <span class="sr-only">Toggle Dropdown</span>
              </button>
              <div class="dropdown-menu dropdown-menu-right">
                <button
                  type="button"
                  class="dropdown-item"
                  :class="{ disabled: false }"
                  data-toggle="modal"
                  data-target="#modalBackdropDeleteItemAtModificationList"
                  @click="
                    deleting.item = item;
                    deleting.idx = idx;
                  "
                >
                  <span data-feather="trash-2"></span>
                  删除
                </button>
              </div>
            </div>
            <button type="button" class="btn btn-sm btn-light ml-1" v-else @click="handleCancel($event, item, idx)">
              <span data-feather="x"></span>
              取消
            </button>
          </div>
          <!-- list header -->
          <h2>
            <span data-feather="hash" class="h2"></span>
            {{ headerTextOperator(item, idx) }}
          </h2>
          <!-- list body -->
          <slot name="list-form-body" :item="item" :idx="idx"></slot>
        </form>
      </li>
    </ul>
    <!-- AdminCourseIntroduction 中：如果没有 mt-1，则上阴影显示错误 -->
    <button type="submit" class="btn btn-sm btn-secondary mt-1" @click="handleAdd">
      <span data-feather="plus"></span>
      添加
    </button>

    <app-modal
      modal-id="modalBackdropDeleteItemAtModificationList"
      :ok-callback="(relatedTarget) => handleDelete(relatedTarget, deleting.item, deleting.idx)"
      :modal-title="'确定删除「' + fullTitle(deleting.item, deleting.idx) + '」？'"
      :modal-body="deleteBodyMsg() && deleteBodyMsg().length > 0"
      :ok-btn-disabled="deleting.mutex"
    >
      <template v-slot:body>
        <span style="font-size: medium">
          {{ deleteBodyMsg() }}
        </span>
      </template>
    </app-modal>
  </div>
</template>

<script>
import $ from 'jquery/dist/jquery.js';
import feather from 'feather-icons';
import AppModal from '@/components/common/AppModal';

export default {
  name: 'ModificationListTemplate',
  data() {
    return {
      persistentEndIdx: -1,
      deleting: {
        item: {},
        idx: -1,
        mutex: false,
      },
    };
  },
  methods: {
    handleAdd() {
      if (this.persistentEndIdx < 0) {
        this.persistentEndIdx = this.listData.length;
      }

      let item = {
        temp: true,
      };
      this.$emit('tempItemAdding', item);
      this.listData.push(item);
      this.$nextTick(() => {
        feather.replace();
      });
      this.$emit('tempItemAdded', item);
    },
    handleSubmit(e, item, idx) {
      const self = this;
      let form = e.currentTarget;
      event.preventDefault();
      event.stopPropagation();
      form.classList.add('was-validated');
      if (!form.checkValidity()) {
        return;
      }

      let $submitter = $(e.submitter);
      $submitter.attr('disabled', true);
      let ev = item.temp ? 'itemAdd' : 'itemUpdate';
      this.$emit(ev, item, idx, (status) => {
        if (status) {
          if (self.persistentEndIdx === idx) {
            self.persistentEndIdx++;
          }
          item.temp = false;
        }
        $submitter.attr('disabled', false);
      });
    },
    handleDelete(relatedTarget, item, idx) {
      const self = this;
      self.deleting.mutex = true;
      let ev = 'itemDelete';
      this.$emit(ev, item, idx, (status) => {
        if (status) {
          self.persistentEndIdx--;
          this.listData.splice(idx, 1);
        }
        $('#modalBackdropDeleteItemAtModificationList').modal('hide');
        self.deleting.mutex = false;
      });
    },
    handleCancel(e, item, idx) {
      this.listData.splice(idx, 1);
    },
    fullTitle(item, idx) {
      let title = this.titleFunction(item, idx);
      return this.headerTextOperator(item, idx) + (title && title.length ? ' ' + title : '');
    },
    deleteBodyMsg() {
      return this.itemDeleteModalBodyOperator(this.deleting.item, this.deleting.idx);
    },
  },
  props: {
    listData: {
      type: Array,
      required: true,
    },
    headerTextOperator: {
      type: Function,
      default: function (item, idx) {
        return idx;
      },
    },
    titleFunction: {
      type: Function,
      default: function () {
        return '';
      },
    },
    itemDeleteModalBodyOperator: {
      type: Function,
      default: () => '',
    },
  },
  components: { AppModal },
};
</script>

<style lang="scss" scoped></style>
