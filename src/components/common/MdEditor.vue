<template>
  <mavon-editor
    ref="md"
    :code-style="'xcode'"
    v-model="mdValue"
    @imgAdd="imgAdd"
    :toolbars-background="'toolbarsBackground'"
    :subfield="subfield"
    :placeholder="placeholder"
    :box-shadow="boxShadow"
    :preview-background="previewBackground"
    :default-open="defaultOpen"
  />
</template>

<script>
export default {
  name: 'MdEditor',
  data() {
    return {
      mdValue: this.value,
    };
  },
  methods: {
    imgAdd(pos, $file) {
      const self = this;
      // 第一步.将图片上传到服务器.
      let formdata = new FormData();
      formdata.append('image', $file);
      self.$http
        .post(self.serverApi, formdata, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
        .then((res) => {
          // 第二步.将返回的url替换到文本原位置![...](0) -> ![...](url)
          if (res.data.status === 'success') {
            self.$refs.md.$img2Url(pos, res.data.data);
          } else {
            this.$toast.show({
              title: '图片上传失败',
              msg: res.data.data.errorMsg,
              icon: 'danger',
            });
          }
        })
        .catch(() => {
          self.$toast.show({
            title: '图片上传失败',
            msg: '连接出现异常',
            icon: 'danger',
          });
        });
    },
  },
  watch: {
    value(val) {
      this.mdValue = val;
    },
    mdValue(val) {
      this.$emit('input', val);
    },
  },
  props: {
    value: {
      type: String,
      default: '',
    },
    serverApi: {
      type: String,
      required: true,
    },
    toolbarsBackground: {
      // 工具栏背景色
      type: String,
      default: '#ffffff',
    },
    subfield: {
      type: Boolean,
      default: true,
    },
    placeholder: {
      // 编辑器默认内容
      type: String,
      default: null,
    },
    boxShadow: {
      // 是否添加阴影
      type: Boolean,
      default: true,
    },
    previewBackground: {
      // 预览栏背景色
      type: String,
      default: '#fbfbfb',
    },
    defaultOpen: {
      type: String,
      default: null,
    },
  },
};
</script>

<style lang="scss" scoped></style>
