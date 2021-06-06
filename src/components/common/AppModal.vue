<template>
  <div
    :id="modalId"
    class="modal fade"
    :data-backdrop="staticModal ? 'static' : 'true'"
    data-keyboard="false"
    tabindex="-1"
    :aria-labelledby="modalId + 'Label'"
    aria-hidden="true"
  >
    <!-- modal-dialog -->
    <div class="modal-dialog modal-dialog-centered" :class="dialogClass">
      <div class="modal-content">
        <!-- 1. modal-header -->
        <div class="modal-header" v-if="modalTitle.length > 0">
          <h5 class="modal-title" :id="modalId + 'Label'">{{ modalTitle }}</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <!-- 2. modal-body -->
        <div class="modal-body" :class="bodyClass" :style="bodyStyle" v-if="modalBody">
          <slot name="body"></slot>
        </div>
        <!-- 3. modal-footer -->
        <div class="modal-footer" v-if="modalFooter">
          <button type="button" class="btn btn-secondary" data-dismiss="modal">{{ cancelStr }}</button>
          <button type="submit" class="btn btn-primary" :disabled="okBtnDisabled" :form="footerForm" @click="handleOk">
            {{ okStr }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import $ from 'jquery/dist/jquery.js';

export default {
  name: 'AppModal',
  data() {
    return {
      relatedTarget: null,
    };
  },
  mounted() {
    const self = this;
    $('#' + self.modalId).bind('show.bs.modal', (e) => {
      self.relatedTarget = e.relatedTarget;
    });
  },
  methods: {
    handleOk() {
      this.okCallback(this.relatedTarget);
    },
  },
  props: {
    modalId: {
      type: String,
      required: true,
    },
    modalTitle: {
      type: String,
      default: '',
    },
    modalBody: {
      type: Boolean,
      default: true,
    },
    modalFooter: {
      type: Boolean,
      default: true,
    },
    cancelStr: {
      type: String,
      default: '取消',
    },
    okStr: {
      type: String,
      default: '确认',
    },
    footerForm: {
      type: String,
      default: '',
    },
    okCallback: {
      type: Function,
      default: function () {},
    },
    okBtnDisabled: {
      type: Boolean,
      default: false,
    },
    staticModal: {
      type: Boolean,
      default: false,
    },
    dialogClass: {
      type: String,
      default: '',
    },
    bodyClass: {
      type: String,
      default: '',
    },
    bodyStyle: {
      type: Object,
      default: function () {
        return {};
      },
    },
  },
};
</script>

<style lang="scss" scoped></style>
