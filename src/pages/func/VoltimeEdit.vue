<template>
  <div style="font-size: 30px; margin: 10px 20px">
    <span> 志愿时长查询记录编辑 </span>
    <a href="/static/example.csv" style="font-size: 20px"> 样表下载 </a>
    <span style="float: right"><a href="#/func/voltime-edit">查询页面</a></span>
    <span style="float: right">/</span>
    <span style="float: right"><a href="#/func/voltime-edit">数据修改</a></span>
  </div>
  <div style="padding: 0 14px 14px">
    <a-input-search v-model:value="searchText" placeholder="搜索姓名或学号" style="width: 200px" allowClear
      @search="onSearch" />
  </div>
  <a-table size="middle" :columns="columns" :dataSource="lstRecords" :pagination="pagination" :loading="isLoading"
    row-key="id" @change="onTableChange">
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'operation'">
        <a @click="showInfoModal(record.id)">编辑</a>
      </template>
    </template>
  </a-table>
  <a-modal v-model:visible="infoModalVisible" title="修改记录">
    <template #footer>
      <a-button key="submit" type="danger" @click="editCurrentRecord">提交修改</a-button>
      <a-button key="ok" type="primary" @click="infoModalVisible = false">确定</a-button>
    </template>
    <a-row type="flex" align="middle">
      <a-col :span="4">ID</a-col>
      <a-col :span="8">
        <a-input :value="currentRecord.data.id" :disabled="true"></a-input>
      </a-col>
      <a-col :offset="1" :span="3">姓名</a-col>
      <a-col :span="8">
        <a-input :value="currentRecord.data.name" :disabled="true"></a-input>
      </a-col>
    </a-row>
    <a-row type="flex" align="middle" style="margin-top: 10px">
      <a-col :span="4">性别</a-col>
      <a-col :span="8">
        <a-input :value="currentRecord.data.sex" :disabled="true"></a-input>
      </a-col>
      <a-col :offset="1" :span="3">学号</a-col>
      <a-col :span="8">
        <a-input :value="currentRecord.data.stu_id" :disabled="true"></a-input>
      </a-col>
    </a-row>
    <a-row type="flex" align="middle" style="margin-top: 10px">
      <a-col :span="4">学院</a-col>
      <a-col :span="8">
        <a-input :value="currentRecord.data.faculty" :disabled="true"></a-input>
      </a-col>
      <a-col :offset="1" :span="3">时间</a-col>
      <a-col :span="8">
        <a-input v-model:value="currentRecord.data.date"></a-input>
      </a-col>
    </a-row>
    <a-row type="flex" align="middle" style="margin-top: 10px">
      <a-col :span="4">任务名称</a-col>
      <a-col :span="8">
        <a-input v-model:value="currentRecord.data.activity_name"></a-input>
      </a-col>
      <a-col :offset="1" :span="3">时长(h)</a-col>
      <a-col :span="8">
        <a-input v-model:value="currentRecord.data.duration"></a-input>
      </a-col>
    </a-row>
    <a-row type="flex" align="middle" style="margin-top: 10px">
      <a-col :span="4">组织学院</a-col>
      <a-col :span="8">
        <a-input v-model:value="currentRecord.data.duty_faculty"></a-input>
      </a-col>
      <a-col :offset="1" :span="3">队伍名称</a-col>
      <a-col :span="8">
        <a-input v-model:value="currentRecord.data.team"></a-input>
      </a-col>
    </a-row>
    <a-row type="flex" align="middle" style="margin-top: 10px">
      <a-col :span="4">组织人</a-col>
      <a-col :span="8">
        <a-input v-model:value="currentRecord.data.duty_person"></a-input>
      </a-col>
      <a-col :offset="1" :span="3">备注</a-col>
      <a-col :span="8">
        <a-input v-model:value="currentRecord.data.remark"></a-input>
      </a-col>
    </a-row>
  </a-modal>
</template>
<script>
import { defineComponent, computed, ref, reactive } from 'vue'
import { usePagination } from 'vue-request'
import axios from 'axios'
import { notification } from 'ant-design-vue'

export default defineComponent({
  setup() {
    const throwRequestError = (e) => {
      if (e.response.status == 463 || e.response.status == 401) {
        notification.error({
          message: '出错啦',
          description: '登录过期或权限不足，请重新登录',
        })
        setTimeout(() => {
          window.localStorage.removeItem('auth')
          router.push('/login')
        }, 1000)
      } else {
        notification.error({
          message: '出错啦',
          description: '获取信息失败，请联系管理员',
        })
      }
    }


    const searchText = ref('')
    const funService = (params) => axios.post('/voltime-man/', { ...params })
    const {
      data: dataAxios,
      loading: isLoading,
      current,
      pageSize,
      run,
    } = usePagination(funService, {
      formatResult: (res) => res.data.lstVoltimes,
    })

    // computed
    const lstRecords = computed(() => dataAxios.value) // ?. 是必需的
    const pagination = computed(() => ({
      total: dataAxios.value?.total,
      current: current.value,
      pageSize: pageSize.value,
      showSizeChanger: true,
      showQuickJumper: true,
    }))

    // methods
    const onTableChange = (pag, filters) =>
      run({ current: pag.current, pageSize: pag.pageSize, searchText: searchText.value, ...filters })

    let infoModalVisible = ref(false)
    let currentRecord = reactive({
      data: {
        id: '',
        name: '',
        sex: '',
        faculty: '',
        stu_id: '',
        duration: '',
        activity_name: '',
        duty_faculty: '',
        team: '',
        date: '',
        duty_person: '',
        remark: '',
      }
    })
    const showInfoModal = (id) => {
      infoModalVisible.value = true
      currentRecord.data = JSON.parse(JSON.stringify(dataAxios.value.find(val => val.id == id)))
    }
    const editCurrentRecord = () => {
      for (let key in currentRecord.data) {
        if (!currentRecord.data[key] && key != 'remark' && key != 'date_str') {
          notification.info({ message: '出错啦!', description: `${key} 不能为空!请重新填写` })
          return
        }
      }
      if (!/^(\d{1,3}|\d{1,3}\.\d+)$/.test(currentRecord.data.duration)) {
        notification.info({ message: '出错啦', description: '时长应是小数!' })
        return
      }
      if (!/^\d{4}\/\d{1,2}\/\d{1,2}$/.test(currentRecord.data.date)) {
        console.log(currentRecord.data.date)
        notification.info({ message: '出错啦!', description: '日期必须是 yyyy/mm/dd 的格式!比如 2022/10/30' })
        return
      }
      axios.post('/voltime-man/update', { ...currentRecord.data })
        .then((response) => {
          if (response.data.success) {
            notification.success({ message: '提示', description: '修改成功!' })
            onTableChange(1)
            infoModalVisible.value = false
          } else {
            notification.error({ message: '出错啦!', description: '无法完成修改, 请联系管理员' })
          }
        }).catch(e => throwRequestError(e))
    }

    return {
      searchText,
      isLoading,
      lstRecords,
      pagination,
      onTableChange,
      infoModalVisible,
      currentRecord,
      showInfoModal,
      editCurrentRecord
    }
  },
  data() {
    return {
      columns: [
        { title: 'ID', dataIndex: 'id' },
        { title: '姓名', dataIndex: 'name' },
        { title: '性别', dataIndex: 'sex' },
        { title: '学院', dataIndex: 'faculty' },
        { title: '学号', dataIndex: 'stu_id' },
        { title: '时长(h)', dataIndex: 'duration' },
        { title: '任务名称', dataIndex: 'activity_name' },
        { title: '组织学院', dataIndex: 'duty_faculty' },
        { title: '队伍名称', dataIndex: 'team' },
        { title: '时间', dataIndex: 'date' },
        { title: '组织人', dataIndex: 'duty_person' },
        { title: '备注', dataIndex: 'remark' },
        { title: '修改', key: 'operation' }
      ],
    }
  },
  methods: {
    onSearch() {
      this.pagination.current = 1
      this.onTableChange(this.pagination)
    },
  },
})
</script>
