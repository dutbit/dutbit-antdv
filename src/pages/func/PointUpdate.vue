<template>
  <div style="font-size: 30px; margin: 10px 20px">
    <span> 积分查询-数据更新 </span>
    <a href="/example-point.csv" style="font-size: 20px"> 样表下载 </a>
  </div>
  <a-row align="bottom">
    <a-col :span="16">
      <div class="needToRead">
        <p>1. 请将表格保存为csv文件，并确保各个数据不含英文逗号和英文问号</p>
        <p>2. 文件中的所有空白字符会被删除</p>
        <p>3. 格式要求：学号为纯数字，积分为整数</p>
        <p>4. 文件不会被修改，请在数据更新之后手动清除“操作”一列的内容，避免重复更新</p>
      </div>
    </a-col>
    <a-col :span="8">
      <span style="float: right; margin-right: 20px; color: orange; font-size: 24px">当前行数：{{ nRowsTotal }}</span>
    </a-col>
  </a-row>

  <hr />
  <a-space size="small">
    <a-upload class="upload" :file-list="fileList" :remove="handleRemove" :before-upload="beforeUpload">
      <a-button><UploadOutlined />选择文件</a-button>
    </a-upload>
    <a-button :disabled="fileList.length == 0" @click="onRefresh">刷新</a-button>
    <a-button type="primary" :disabled="!isR4Upload" :loading="uploading" @click="handleUpload">
      {{ uploading ? '上传中' : '上传' }}
    </a-button>
    <a-button v-if="lstErrLines.length != 0" type="primary" danger @click="isSwDrawer = true">查看错误</a-button>
    <span style="color: red" v-if="lstErrLines.length != 0">
      <closeCircleOutlined /> {{ this.lstErrLines.length }}条数据存在格式错误
    </span>
  </a-space>
  <hr />
  <a-table
    :columns="columns"
    :dataSource="lstRecords"
    :pagination="pagination"
    row-key="iLine"
    @change="onTableChange"
  />
  <a-drawer v-model:visible="isSwDrawer" title="错误列表" placement="right" :width="800">
    <template v-for="errLine in lstErrLines" :key="errLine.id">
      <p>{{ errLine.msg }}</p>
      <p>{{ errLine.desc }}</p>
    </template>
  </a-drawer>
</template>

<script>
import { notification } from 'ant-design-vue'
export default {
  components: {},
  data() {
    return {
      fileList: [],
      encoding: '',
      uploading: false,
      lstRecords: [],
      nRowsTotal: '未知',
      columns: [
        { title: '行号', dataIndex: 'iLine' },
        { title: '姓名', dataIndex: 'name' },
        { title: '学号', dataIndex: 'stu_id' },
        { title: '积分', dataIndex: 'points' },
      ],
      pagination: { total: 0, current: 0, pageSize: 50 },
      lstErrLines: [],
      isSwDrawer: false,
    }
  },
  computed: {
    // isReadyForUpload
    isR4Upload() {
      return this.lstRecords.length !== 0 && this.lstErrLines.length === 0
    },
  },
  methods: {
    handleRemove(file) {
      const index = this.fileList.indexOf(file)
      const newFileList = this.fileList.slice()
      newFileList.splice(index, 1)
      this.fileList = newFileList
    },
    beforeUpload(file) {
      this.fileList[0] = file
      return false
    },
    handleUpload() {
      this.uploading = true // You can use any AJAX library you like
      this.$http
        .post('/point-man/update-by-array', this.lstRecords)
        .then((res) => {
          this.uploading = false
          notification.success({ message: res.data })
        })
        .catch(() => {
          this.uploading = false
        })
    },
    onRefresh() {
      this.encoding = ''
      this.lstRecords = []
      this.lstErrLines = []
      const reader = new FileReader()
      const file = /** @type {File} */ (this.fileList[0])
      if (!file.name.endsWith('.csv')) {
        notification.error({ message: '文件格式不是CSV' })
        return
      }
      reader.onload = () => {
        if (reader.result.indexOf('�') !== -1 || reader.result.indexOf('?') !== -1)
          if (this.encoding === '') {
            notification.warning({ message: '编码不是UTF-8，尝试GBK' })
            this.encoding = 'GBK'
            reader.readAsText(file, 'GBK')
          } else notification.error({ message: '编码不是UTF-8或GBK' })
        else this.csv2array(reader.result)
      }
      reader.onerror = () => {
        notification.error({ message: '浏览器FileReader错误', description: reader.error })
      }
      reader.readAsText(file)
    },
    /** @param {string} strCSV */
    csv2array(strCSV) {
      const lines = strCSV.split('\n')
      for (let iLine = 1; iLine < lines.length; iLine++) {
        if (!lines[iLine]) continue
        const splits = lines[iLine].replace(/\s*/g, '').split(',')
        const lstErrItems = []
        if (!/^\d+$/.test(splits[1])) lstErrItems.push('学号')
        if (!/^\d+$/.test(splits[2])) lstErrItems.push('积分')
        if (splits.length !== 4 || lstErrItems.length)
          this.lstErrLines.push({ msg: `行${iLine}格式错误：${lstErrItems.join('，')}`, desc: splits.join('，') })
        if (splits[3])
          this.lstRecords.push({
            iLine,
            name: splits[0],
            stu_id: parseInt(splits[1]),
            points: parseInt(splits[2]),
          })
      }
      if (!this.lstErrLines.length) notification.success({ message: `读取到${this.lstRecords.length}条数据` })
      else notification.error({ message: `${this.lstErrLines.length}条数据存在格式错误` })
      this.pagination.total = this.lstRecords.length
    },
    onTableChange(pagination, _filters, _sorter) {
      this.pagination = pagination
    },
  },
  mounted() {
    this.$http.get('/point-man/row-total').then((res) => {
      this.nRowsTotal = res.data.total
    })
  },
}
</script>

<style scoped>
.needToRead p {
  color: gray;
  margin: 5px;
}
.upload {
  display: inline-flex;
  align-items: center;
}
.upload :deep(.ant-upload-list) {
  min-width: 15em;
}
.upload :deep(.ant-upload-list-item) {
  margin: 4px;
}
.upload :deep(.ant-upload-list-item-info) {
  padding-right: 24px;
}
</style>
