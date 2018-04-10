<template>
  <Form :model="dataInfo" :label-width="80">
    <Form-item label="数据集名">
      <Input v-model="dataInfo.name" placeholder="请输入数据集名称"></Input>
    </Form-item>
    <Form-item label="数据集描述">
      <Input v-model="dataInfo.desc" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入数据集描述"></Input>
    </Form-item>
    <Form-item label="数据集上传">
      <Upload
        type="drag"
        :action="uploadURL"
        :format="['csv','npz']"
        :data="dataInfo"
        :before-upload="checkInfo"
        :on-format-error="handleFormatError"
        :on-success="uploadSuccess">
        <div style="padding: 20px 0">
          <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
          <p>点击或将数据集拖拽到这里上传</p>
        </div>
      </Upload>
    </Form-item>
  </Form>
</template>

<script>
  import {baseURL} from '@/baseurl'

  export default {
    data: function () {
      return {
        dataInfo: {
          name: '',
          desc: ''
        },
        uploadURL: baseURL + '/data/uploaddata'
      }
    },
    methods: {
      checkInfo() {
        if (!this.dataInfo.name) {
          this.$Notice.warning({
            title: '上传失败',
            desc: '请填写数据集信息'
          });
          return false;
        }
        return true;
      },
      handleFormatError(file) {
        this.$Notice.warning({
          title: '文件格式不正确',
          desc: '文件 ' + file.name + ' 格式不正确，请上传csv格式文件。'
        });
      },
      uploadSuccess(file) {
        this.$Notice.success({
          title: '上传成功',
          desc: '文件 ' + this.dataInfo.name + ' 上传成功'
        });
        for (let i in this.dataInfo) {
          this.dataInfo[i] = '';
        }
      }
    }
  }
</script>
