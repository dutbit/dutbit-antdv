<template>
  <div style="font-size: 30px; margin: 10px 20px">
    <span> 积分查询-记录展示 </span>
    <a href="/example-point.csv" style="font-size: 20px"> 样表下载 </a>
  </div>
  <div style="padding: 0 14px 14px">
    <a-input-search
      v-model:value="searchText"
      placeholder="搜索姓名或学号"
      style="width: 200px"
      allowClear
      @search="onSearch"
    />
  </div>
  <a-table
    size="middle"
    :columns="columns"
    :dataSource="lstRecords"
    :pagination="pagination"
    :loading="isLoading"
    row-key="id"
    @change="onTableChange"
  >
  <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'operation'">
        <a @click="showInfoModal(record.id)">编辑</a>
      </template>
    </template>
  </a-table>
  <a-modal v-model:visible="infoModalVisible">
    <template #footer>
      <a-button key="submit" type="danger" @click="editCurrentRecord">提交修改</a-button>
      <a-button key="ok" type="primary" @click="infoModalVisible = false">确定</a-button>
    </template>
    <a-row type="flex" align="middle">
      <a-col :span="4">ID</a-col>
      <a-col :span="8">
        <a-input v-model:value="currentRecord.data.id" :disabled="true"></a-input>
      </a-col>
      <a-col :offset="1" :span="3">姓名</a-col>
      <a-col :span="8">
        <a-input v-model:value="currentRecord.data.name" :disabled="true"></a-input>
      </a-col>
    </a-row>
    <a-row type="flex" align="middle" style="margin-top: 10px">
      <a-col :span="4">学号</a-col>
      <a-col :span="8">
        <a-input v-model:value="currentRecord.data.stu_id" :disabled="true"></a-input>
      </a-col>
      <a-col :offset="1" :span="3">积分</a-col>
      <a-col :span="8">
        <a-input v-model:value="currentRecord.data.points"></a-input>
      </a-col>
    </a-row>
    <a-row type="flex" align="middle" style="margin-top: 10px">
      <a-col :span="4">备注</a-col>
      <a-col :span="20">
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
    const funService = (params) => axios.post('/point-man/', { ...params })
    const {
      data: dataAxios,
      loading: isLoading,
      current,
      pageSize,
      run,
    } = usePagination(funService, { formatResult: (res) => res.data })

    // computed
    const lstRecords = computed(() => dataAxios.value?.lstPoints ) // ?. 是必需的
    const pagination = computed(() => ({
      total: dataAxios.value?.total,
      pageNum: current.value,
      pageSize: pageSize.value,
      showSizeChanger: true,
      showQuickJumper: true,
    }))

    // methods
    const onTableChange = (pag, filters) => {
      run({ pageNum: pag.current, pageSize: pag.pageSize, searchText: searchText.value, ...filters })
    }
    

    let infoModalVisible = ref(false)
    let currentRecord = reactive({
      data: {
        id: '',
        name: '',
        stu_id: '',
        points: '',
        remark: ''
      }
    })
    
    const showInfoModal = (id) => {
      console.log(dataAxios.value)
      Object.assign(currentRecord.data, dataAxios.value?.lstPoints.find(val => val.id == id))
      infoModalVisible.value = true
    }
    const editCurrentRecord = () => {
      if(!currentRecord.data.points || !/^\d+$/.test(currentRecord.data.points)) {
        notification.info({ message: '出错啦!', description: '积分必须是整数!' })
        return
      }
      axios.post('/point-man/upsert', { list: [{...currentRecord.data}] })
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
        { title: '学号', dataIndex: 'stu_id' },
        { title: '积分', dataIndex: 'points' },
        { title: '备注', dataIndex: 'remark' },
        { title: '操作', key: 'operation' }
      ],
    }
  },
  methods: {
    onSearch() {
      this.pagination.pageNum = 1
      this.onTableChange(this.pagination)
    },
  },
})
</script>
