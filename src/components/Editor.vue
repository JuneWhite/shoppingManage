<template>
  <div id="Test">
    <quill-editor
      ref="myTextEditor"
      v-model="content"
      :options="quillOption"
      @ready="onEditorReady($event)"
      @change="onEditorChange($event)"
      @blur="onEditorBlur($event)">
      </quill-editor>
  </div>
</template>
<script>
import { quillEditor } from "vue-quill-editor";
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import { error } from 'util';
import axios from '@/http'
/*富文本编辑图片上传配置*/
const uploadConfig = {
  action: "/api/common/editorUploadimage", // 必填参数 图片上传地址
  methods: "POST", // 必填参数 图片上传方式
  token: "", // 可选参数 如果需要token验证，假设你的token有存放在sessionStorage
  name: "file", // 必填参数 文件的参数名
  size: 500, // 可选参数   图片大小，单位为Kb, 1M = 1024Kb
  accept: "image/png, image/gif, image/jpeg, image/bmp, image/x-icon" // 可选 可上传的图片格式
};
// toolbar工具栏的工具选项（默认展示全部）
const toolOptions = [
  ["bold", "italic", "underline", "strike"],
  [{ header: 1 }, { header: 2 }],
  ["clean"],
  ["link", "image"]
];
const handlers = {
  image: function image() {
    var self = this;
    var fileInput = this.container.querySelector("input.ql-image[type=file]");
    if (fileInput === null) {
      fileInput = document.createElement("input");
      fileInput.setAttribute("type", "file");
      // 设置图片参数名
      if (uploadConfig.name) {
        fileInput.setAttribute("name", uploadConfig.name);
      }
      // 可设置上传图片的格式
      fileInput.setAttribute("accept", uploadConfig.accept);
      fileInput.classList.add("ql-image");
      // 监听选择文件
      fileInput.addEventListener("change", function() {
        // 创建formData
        var formData = new FormData();
        formData.append(uploadConfig.name, fileInput.files[0]);
        axios.post("/api/common/editorUploadimage",formData,{
          headers:{'Content-Type':'multipart/form-data'}
        }).then(res=>{
          let length = self.quill.getSelection(true).index;
          //这里很重要，你图片上传成功后，img的src需要在这里添加，res.url就是你服务器返回的图片链接。
          self.quill.insertEmbed(length, "image", res.data.url);
          self.quill.setSelection(length + 1);
        }).catch(error=>{
          this.$message('图片上传失败', 'error')
        })
      });
      this.container.appendChild(fileInput);
    }
    fileInput.click();
  }
};
export default {
  components: {
    quillEditor
  },
  data() {
    return {
      content: '',
      quillOption:{
        placeholder: '',
        theme: 'snow',  // 主题
        modules: {
          toolbar: {
            container: toolOptions,  // 工具栏选项
            handlers: handlers  // 事件重写
          }
        }
      }
    }
  },
  props: ['editorcontent'],
  watch:{
    editorcontent(newvalue, oldvalue) {
      this.content = newvalue;
    }
  },
  methods:{
    onEditorReady(quill) {
    },
    onEditorChange({ quill, html, text }) {
      this.content = html
      this.$emit('editor', html)
    },
    onEditorBlur(e) {
      // this.$emit('editor', this.content)
    }
  }
}
</script>
<style scoped>
.ql-container .ql-snow{height:300px;}
</style>
