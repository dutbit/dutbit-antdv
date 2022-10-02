<template>
  <h1>报名查询</h1>
  <a-row type="flex" align="middle">
    <a-col :span="3" :offset="1" style="text-align: right; padding-right: 10px">选择批次</a-col>
    <a-col :span="6">
      <a-select v-model:value="selectedTurn" style="width: 100%">
        <a-select-option value="-1">全部</a-select-option>
        <a-select-option v-for="item in turnData.data" :key="item.id" :value="item.id">
          {{ item.activated ? item.turnName + '(正在进行)' : item.turnName + '(已关闭)' }}
        </a-select-option>
      </a-select>
    </a-col>
    <a-col :span="3" style="text-align: right; padding-right: 10px">选择部门</a-col>
    <a-col :span="4">
      <a-select v-model:value="selectedDept" style="width: 100%">
        <a-select-option value="">全部</a-select-option>
        <a-select-option v-for="item in deptData.data" :key="item.id" :value="item.id">
          {{ item.deptName }}
        </a-select-option>
      </a-select>
    </a-col>
  </a-row>
  <a-row type="flex" align="middle" style="margin-top: 10px">
    <a-col :span="3" :offset="1" style="text-align: right; padding-right: 10px">检索</a-col>
    <a-col :span="6">
      <a-input v-model:value="filterText"></a-input>
    </a-col>
    <a-col :span="3" style="padding-right: 10px">
      <a-tooltip>
        <template #title>将查询字段中包括输入框中文本的报名信息，可以输入学号、姓名、部门名称等</template>
        <question-outlined />
      </a-tooltip>
    </a-col>
    <a-col>
      <a-button type="primary" @click="queryEnroll">查询</a-button>
    </a-col>
    <a-col>
      <a-button type="primary" @click="exportData" style="margin-left: 10px">导出报名表</a-button>
    </a-col>
    <a-col>
      <a-tooltip>
        <template #title>
          导出<b style="color: red">所选批次</b>的全部报名记录
          <br />
          注意：请先选择一个批次后再下载！
        </template>
        <question-outlined />
      </a-tooltip>
    </a-col>
  </a-row>
  <a-table :dataSource="queryData.data" :columns="columns" :scroll="{ x: '120%' }" style="margin-top: 10px">
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'allowAdjust'">
        {{ record.allowAdjust ? '是' : '否' }}
      </template>
      <template v-if="column.key === 'operation'">
        <a @click="handleInfo(record.id)">查看详情</a>
      </template>
    </template>
  </a-table>
  <a-modal v-model:visible="infoModalVisible" title="资料详情">
    <template #footer>
      <a-button key="ok" type="primary" @click="infoModalVisible = false">确定</a-button>
    </template>
    <a-descriptions title="报名信息" bordered :column="4">
      <a-descriptions-item label="姓名" :span="2">{{ queryData.data[recordIndex].name }}</a-descriptions-item>
      <a-descriptions-item label="学号" :span="2">{{ queryData.data[recordIndex].stuId }}</a-descriptions-item>
      <a-descriptions-item label="性别" :span="2">{{ queryData.data[recordIndex].sex }}</a-descriptions-item>
      <a-descriptions-item label="服从调剂" :span="2">
        {{ queryData.data[recordIndex].allowAdjust ? '是' : '否' }}
      </a-descriptions-item>
      <a-descriptions-item label="第一志愿" :span="4">
        {{ queryData.data[recordIndex].firstChoice }}
      </a-descriptions-item>
      <a-descriptions-item label="第二志愿" :span="4">
        {{ queryData.data[recordIndex].secondChoice }}
      </a-descriptions-item>
      <a-descriptions-item label="第三志愿" :span="4">
        {{ queryData.data[recordIndex].thirdChoice }}
      </a-descriptions-item>
      <a-descriptions-item label="学院" :span="4">{{ queryData.data[recordIndex].faculty }}</a-descriptions-item>
      <a-descriptions-item label="手机" :span="4">{{ queryData.data[recordIndex].tel }}</a-descriptions-item>
      <a-descriptions-item label="详细信息" :span="4">{{ queryData.data[recordIndex].info }}</a-descriptions-item>
    </a-descriptions>
  </a-modal>
</template>

<script>
import { notification } from 'ant-design-vue'
import axios from 'axios'
import { defineComponent, reactive, ref } from 'vue'

export default defineComponent({
  name: 'EnrollQuery',
  setup() {
    const turnData = reactive({ data: [] })
    // data里是对象数组 [{...}, {...}], 每个对象包括 id, turnName, activated
    const deptData = reactive({ data: [] })
    // data里是对象数组 [{...}, {...}], 每个对象包括 id, deptName
    const queryData = reactive({ data: [] })
    // 查询结果 queryData
    const enrollData = reactive({ data: [] })
    // 原始数据 enrollData
    const filterData = reactive({ data: [] })
    // 在queryData的基础上，进行筛选
    const selectedDept = ref('')
    const selectedTurn = ref('-1')
    const infoModalVisible = ref(false)
    const recordIndex = ref(0)
    const filterText = ref('')

    const columns = [
      { title: '学号', dataIndex: 'stuId', key: 'stuId', fixed: 'left', width: 120 },
      { title: '姓名', dataIndex: 'name', key: 'name', fixed: 'left', width: 100 },
      { title: '性别', dataIndex: 'sex', key: 'sex', width: 60 },
      { title: '第一志愿', dataIndex: 'firstChoice', key: 'firstChoice', width: 150 },
      { title: '第二志愿', dataIndex: 'secondChoice', key: 'secondChoice', width: 150 },
      { title: '第三志愿', dataIndex: 'thirdChoice', key: 'thirdChoice', width: 150 },
      { title: '服从调剂', dataIndex: 'allowAdjust', key: 'allowAdjust', width: 100 },
      { title: '学院', dataIndex: 'faculty', key: 'faculty', width: 150 },
      { title: '手机', dataIndex: 'tel', key: 'tel', width: 120 },
      { title: '详细信息', dataIndex: 'info', key: 'info', width: 200 },
      { title: '操作', key: 'operation', fixed: 'right', width: 120 },
    ]

    // 请求 deptList 与 turnList
    axios
      .get('/enroll/getDepts')
      .then((res) => {
        deptData.data = res.data.depts
      })
      .catch(() => {
        notification.error({ message: '出错啦', description: '无法获取部门列表，请联系管理员' })
      })
    axios
      .get('/enroll/getTurns')
      .then((res) => {
        turnData.data = res.data.turns
      })
      .catch(() => {
        notification.error({ message: '出错啦', description: '无法获取报名轮次，请联系管理员' })
      })

    const queryEnroll = () => {
      // 注意, selectedTurn已经在Flask中封装好, 如果为-1, 则返回所有批次,
      // 即selectedTurn将有后端进行校验, 因此只需关注 selectedTurn
      axios
        .post('/enroll/getEnrollList', { turnId: parseInt(selectedTurn.value) })
        .then((res) => {
          enrollData.data = res.data.enrollCandidates
          // 这段代码会抛出异常，原因不详，暂时用原来的代替
          // const deptName = deptData.data.find((p) =>  p.id === selectedDept.value).deptName
          // queryData.data = enrollData.data.filter((p) => {
          //   const test = deptName ? [p.firstChoice, p.secondChoice, p.thridChoice].includes(deptName) : true
          //   return Object.values(p).includes(filterText.value) && test
          // })
          let deptName = ''
          deptData.data.forEach((p) => {
            if (p.id === selectedDept.value) {
              deptName = p.deptName
            }
          })
          if (deptName) {
            // TODO: 这里代码要重写！！
            queryData.data = enrollData.data.filter((p) => {
              if (
                p.firstChoice === deptName ||
                p.secondChoice === deptName ||
                p.thridChoice === deptName
              ) {
                let keys = Object.keys(p)
                let str = ''
                keys.forEach((key) => {
                  str = str + '' + p[key]
                })
                if (str.indexOf(filterText.value) > -1) {
                  return p
                }
              }
            })
          } else {
            queryData.data = enrollData.data.filter((p) => {
              let keys = Object.keys(p)
              let str = ''
              keys.forEach((key) => {
                str = str + '' + p[key]
              })
              if (str.indexOf(filterText.value) > -1) {
                return p
              }
            })
          }
        })
        .catch(() => {
          notification.error({ message: '出错啦', description: '无法获取报名数据，请联系管理员' })
        })
    }
    const handleInfo = (id) => {
      queryData.data.forEach((p, index) => {
        if (p.id === id) recordIndex.value = index
      })
      infoModalVisible.value = !infoModalVisible.value
    }
    const exportData = () => {
      if (selectedTurn.value === '-1') {
        notification.info({ message: '提示', description: '请先选择一个批次！' })
        return
      }
      notification.info({
        message: '提示',
        description: '正在导出...',
      })
      axios
        .post('/enroll/getEnrollList', { turnId: parseInt(selectedTurn.value) })
        .then((response) => {
          const exportData = response.data.enrollCandidates
          const fields = {
            stuId: '学号',
            name: '姓名',
            sex: '性别',
            firstChoice: '第一志愿',
            secondChoice: '第二志愿',
            thirdChoice: '第三志愿',
            allowAdjust: '服从调剂',
            faculty: '学院',
            tel: '手机',
            info: '详细信息'
          }
          const head = Object.values(fields).map(item => {
            return `<td>${item}</td>`
          }).join('')
          const body = exportData.map(item => {
            let res = `<tr style="mso-number-format:'\@';">` // 为了不让表格显示科学计数法
            for (let key in fields) {
              if (key == 'allowAdjust') {
                res += `<td>${item[key] == 1 ? '是': '否'}</td>` 
                continue
              }
              res += `<td>${item[key] != undefined ? item[key] : ''}</td>`
            }
            return res + '</tr>'
          }).join('')

          const worksheet = turnData.data[selectedTurn.value].turnName
          const uri = 'data:application/vnd.ms-excel;base64,'
          const template = `<html xmlns:o="urn:schemas-microsoft-com:office:office"
          xmlns:x="urn:schemas-microsoft-com:office:excel"
          xmlns="http://www.w3.org/TR/REC-html40">
          <head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet>
          <x:Name>${worksheet}</x:Name>
          <x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet>
          </x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]-->
          </head><body><table><tr>${head}</tr>${body}</table></body></html>`
          let link = document.createElement('a')
          link.setAttribute('href', uri + window.btoa(unescape(encodeURIComponent(template))))
          link.setAttribute('download', worksheet + '.xls')
          link.click()
          link = null
          notification.success({
            message: '提示',
            description: `已启动下载进程，请查看浏览器下载内容!
            若提示“文件格式与扩展名不匹配...是否仍要打开？”，请点击“是”`
          })
        })


    }
    return {
      turnData,
      deptData,
      queryData,
      enrollData,
      filterData,
      selectedDept,
      selectedTurn,
      infoModalVisible,
      recordIndex,
      filterText,
      columns,
      queryEnroll,
      handleInfo,
      exportData,
    }
  },
})
</script>

<style scoped>
h1 {
  margin-bottom: 20px;
  padding: 10px;
  text-align: center;
}
</style>
