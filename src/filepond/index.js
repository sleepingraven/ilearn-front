// Import Vue FilePond
import vueFilePond, { setOptions } from 'vue-filepond';

// Import FilePond styles
import 'filepond/dist/filepond.min.css';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css';
import 'filepond-plugin-image-edit/dist/filepond-plugin-image-edit.css';

// Import FilePond plugins
// Please note that you need to install these plugins separately
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import FilepondPluginFileValidateSize from 'filepond-plugin-file-validate-size';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation';
import FilePondPluginImageCrop from 'filepond-plugin-image-crop';
import FilePondPluginImageResize from 'filepond-plugin-image-resize';
import FilePondPluginImageTransform from 'filepond-plugin-image-transform';
import FilePondPluginImageEdit from 'filepond-plugin-image-edit';

const FilePond = vueFilePond(
  FilePondPluginFileValidateType,
  FilepondPluginFileValidateSize,
  FilePondPluginImagePreview,
  FilePondPluginImageExifOrientation,
  FilePondPluginImageCrop,
  FilePondPluginImageResize,
  FilePondPluginImageTransform,
  FilePondPluginImageEdit
);

setOptions({
  allowMultiple: false,
  allowReplace: true,

  required: true,
  instantUpload: false,

  allowFileTypeValidation: true,
  checkValidity: true,
  maxFiles: 2,

  allowFileSizeValidation: true,
  maxFileSize: '1MB',
});

export default FilePond;
