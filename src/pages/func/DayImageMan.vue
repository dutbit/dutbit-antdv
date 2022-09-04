<template>
  <a-modal v-model:visible="isMdNewDirVsb" title="创建文件夹" @ok="newDir()">
    <a-input v-model:value="nameDir_new" placeholder="文件夹名称" />
  </a-modal>
  <a-modal v-model:visible="isMdRenameDirVsb" :title="'重命名文件夹：' + nameDir_old" @ok="renameDir()">
    <a-input v-model:value="nameDir_new" placeholder="文件夹名称" />
  </a-modal>
  <a-layout style="background: #fff">
    <a-layout-sider width="220" style="background: #fff">
      <a-list item-layout="horizontal" :data-source="lstCata">
        <template #header>
          <div style="text-align: center; font-size: 18px">
            目录
            <a-button type="link" style="float: right" @click="isMdNewDirVsb = true">
              <template #icon><PlusOutlined /></template>
            </a-button>
          </div>
        </template>
        <template #renderItem="{ item }">
          <a-list-item>
            <a-button :type="whichBtnType(item)" @click="getCont(item)" block>{{ item }}</a-button>
            <template #actions>
              <a-button type="link" size="small" @click="renameDir_pre(item)">
                <template #icon><EditOutlined /></template>
              </a-button>
              <a-popconfirm title="确认删除该文件夹？" @confirm="delDir(item)">
                <a-button type="link" size="small">
                  <template #icon><DeleteOutlined /></template>
                </a-button>
              </a-popconfirm>
            </template>
          </a-list-item>
        </template>
      </a-list>
    </a-layout-sider>
    <a-layout-content style="padding: 10px">
      <a-upload
        v-model:file-list="lstFlie"
        :action="`${this.axiosBaseURL}/day-image/upload/${this.nameDir}`"
        list-type="picture"
        @change="getCont(this.nameDir)"
      >
        <a-button><UploadOutlined />上传</a-button>
      </a-upload>
      <hr />
      <a-empty v-if="lstCont.length == 0" />
      <a-row v-else :gutter="[16, 16]" align="bottom" style="margin: 12px 0; background-color: #ececec">
        <template v-for="item in lstCont" :key="item.id">
          <a-col :span="6">
            <a-card hoverable>
              <template #cover><a-image alt="example" :src="toUrlImg(item)" /></template>
              <a-card-meta>
                <template #title>
                  {{ item }}
                  <a-popconfirm title="确认删除该图片？" @confirm="delImg(item)">
                    <a-button type="link" style="float: right">
                      <template #icon><DeleteOutlined /></template>
                    </a-button>
                  </a-popconfirm>
                </template>
              </a-card-meta>
            </a-card>
          </a-col>
        </template>
      </a-row>
    </a-layout-content>
  </a-layout>
</template>

<script>
import { notification } from 'ant-design-vue'
export default {
  components: {},
  data() {
    return {
      lstCata: [],
      nameDir: '',
      lstCont: [],
      lstFlie: [],
      isMdNewDirVsb: false,
      isMdRenameDirVsb: false,
      nameDir_old: '',
      nameDir_new: '',
    }
  },
  inject: ['axiosBaseURL'],
  methods: {
    whichBtnType(nameDir) {
      return nameDir == this.nameDir ? 'primary' : 'text'
    },
    getCata(isGetCont) {
      this.$http.get('/day-image/cata').then((res) => {
        this.lstCata = res.data.lstCata.sort().reverse()
        if (isGetCont) this.getCont(this.lstCata[0])
      })
    },
    getCont(nameDir) {
      this.$http.get(`/day-image/cont/${nameDir}`).then((res) => {
        this.nameDir = nameDir
        this.lstCont = res.data.lstCont.sort()
      })
    },
    toUrlImg(filename) {
      return `/dayImage/${this.nameDir}/${filename}`
      // return `${this.axiosBaseURL}/day-image/img/${this.nameDir}/${filename}`
    },
    delImg(filename) {
      this.$http.get(`/day-image/delete/${this.nameDir}/${filename}`).then(() => {
        notification.success({ message: '已删除' })
        this.getCont(this.nameDir)
      })
    },
    newDir() {
      this.isMdNewDirVsb = false
      this.$http.get(`/day-image/new-dir/${this.nameDir_new}`).then(() => {
        this.nameDir_new = ''
        notification.success({ message: '已创建文件夹' })
        this.getCata()
      })
    },
    renameDir_pre(nameDir_old) {
      this.isMdRenameDirVsb = true
      this.nameDir_old = nameDir_old
    },
    renameDir() {
      this.isMdRenameDirVsb = false
      this.$http
        .post('/day-image/rename-dir', {
          nameDir_old: this.nameDir_old,
          nameDir_new: this.nameDir_new,
        })
        .then(() => {
          this.nameDir_old = ''
          this.nameDir_new = ''
          notification.success({ message: '已重命名文件夹' })
          this.getCata()
        })
    },
    delDir(nameDir) {
      this.$http.get(`/day-image/del-dir/${nameDir}`).then(() => {
        notification.success({ message: '已删除文件夹' })
        this.getCata(nameDir == this.nameDir)
      })
    },
  },
  mounted() {
    this.getCata(true)
  },
}
</script>

<style scoped>
:deep(.ant-card-body) {
  padding: 16px;
}
:deep(.ant-list-item-action) {
  margin-left: 20px;
}
:deep(.ant-upload-list-item) {
  float: left;
  width: 300px;
  margin-right: 8px;
}
</style>