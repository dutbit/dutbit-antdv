<template>
  <h1>部门管理</h1>
  <a-table :dataSource="deptData.data" :columns="deptColumns">
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'operation'">
        <a @click="createNewDept">新建</a>
        <a-divider type="vertical" />
        <a @click="editCurrentDept(record.id)">编辑</a>
        <a-divider type="vertical" />
        <a-popconfirm
          title="你确定要删除该部门吗？"
          ok-text="是"
          cancel-text="否"
          @confirm="deleteCurrentDept(record.id)"
        >
          <a-tooltip placement="bottom">
            <template #title
              >注意！出于安全考虑，该部门<b style="color: red">不会被彻底删除</b
              >， 而是会被打上deleted标签，可以在恢复列表中找到该记录</template
            >
            <a href="#">删除</a>
          </a-tooltip>
        </a-popconfirm>
      </template>
    </template>
    <a-modal :visible="editDeptVisible" title="部门名称">
      <span>请输入新的部门名称:</span> <br />
      <a-input v-model:value="newDeptName" show-count :maxlength="10"></a-input>
      <template #footer>
        <a-button @click="handleEditCurrentDept">确定</a-button>
      </template>
    </a-modal>
  </a-table>
  <h1>批次管理</h1>
  <a-table
    :dataSource="turnData.data"
    :columns="turnColumns"
    style="margin-top: 10px"
  >
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'activated'">
        {{ record.activated ? '正在进行' : '已关闭' }}
      </template>
      <template v-if="column.key === 'operation'">
        <a @click="createNewTurn">新建</a>
        <a-divider type="vertical" />
        <a @click="editCurrentTurn(record.id)">编辑</a>
        <a-divider type="vertical" />
        <a @click="openCurrentTurn(record.id)">开启</a>
        <a-divider type="vertical" />
        <a @click="closeCurrentTurn(record.id)">关闭</a>
        <a-divider type="vertical" />
        <a-popconfirm
          title="你确定要删除该批次吗？"
          ok-text="是"
          cancel-text="否"
          @confirm="deleteCurrentTurn(record.id)"
        >
          <a-tooltip placement="bottom">
            <template #title
              >注意！出于安全考虑，该批次<b style="color: red">不会被彻底删除</b
              >， 而是会被打上deleted标签，可以在恢复列表中找到该记录</template
            >
            <a href="#">删除</a>
          </a-tooltip>
        </a-popconfirm>
      </template>
    </template>
  </a-table>
  <a-modal
    :visible="editTurnVisible"
    title="批次名称"
    @ok="handleEditCurrentTurn"
    @cancel="editTurnVisible = false"
    :destroyOnClose="true"
  >
    <span>请输入新的批次名称:</span>
    <a-input v-model:value="newTurnName" show-count :maxlength="20"></a-input>
  </a-modal>
  <a-modal
    :visible="createTurnVisible"
    title="批次名称"
    @ok="handleCreateNewTurn"
    @cancel="createTurnVisible = false"
    :destroyOnClose="true"
  >
    <span>请输入新的批次名称:</span>
    <a-input v-model:value="newTurnName" show-count :maxlength="20"></a-input>
  </a-modal>
  <a-modal
    :visible="editDeptVisible"
    title="部门名称"
    @ok="handleEditCurrentDept"
    @cancel="editDeptVisible = false"
    :destroyOnClose="true"
  >
    <span>请输入新的部门名称:</span>
    <a-input v-model:value="newDeptName" show-count :maxlength="10"></a-input>
  </a-modal>
  <a-modal
    :visible="createDeptVisible"
    title="部门名称"
    @ok="handleCreateNewDept"
    @cancel="createDeptVisible = false"
    :destroyOnClose="true"
  >
    <span>请输入新的部门名称:</span>
    <a-input v-model:value="newDeptName" show-count :maxlength="10"></a-input>
  </a-modal>
</template>

<script>
import { reactive, ref } from 'vue'
import axios from 'axios'
import { notification } from 'ant-design-vue'
export default {
  name: 'EnrollMan',
  setup() {
    const throwRequestError = () => {
      notification.error({
        message: '出错啦',
        description: '无法发送请求，请联系管理员',
      })
    }

    // 部门管理部分
    const deptColumns = [
      {
        title: '部门名称',
        dataIndex: 'deptName',
        key: 'deptName',
      },
      {
        title: '操作',
        key: 'operation',
        fixed: 'right',
      },
    ]
    let deptData = reactive({ data: [] })
    let editDeptVisible = ref(false)
    let createDeptVisible = ref(false)
    let newDeptName = ref('')
    let currentDeptId = -1

    const getDeptData = () => {
      axios
        .get('/enroll/getDepts')
        .then((response) => {
          deptData.data = response.data.depts
        })
        .catch(() => {
          notification.error({
            message: '出错啦',
            description: '无法获取部门列表，请联系管理员',
          })
        })
    }
    const getDeptById = (id) => {
      let dept = null
      deptData.data.forEach((p) => {
        if (p.id == id) {
          dept = p
        }
      })
      return dept
    }
    getDeptData()

    const createNewDept = () => {
      createDeptVisible.value = true
    }
    const handleCreateNewDept = () => {
      const dept = { deptName: newDeptName.value }
      axios
        .post('/enroll/createDept', { dept })
        .then((response) => {
          if (response.data.success) {
            notification.success({
              message: '提示',
              description: `已成功添加部门(${dept.deptName})`,
            })
          } else {
            notification.error({
              message: '出错啦',
              description: '添加部门失败，请联系管理员',
            })
          }
          getDeptData()
        })
        .catch(() => {
          throwRequestError()
        })
      createDeptVisible.value = false
    }
    const editCurrentDept = (id) => {
      currentDeptId = id
      editDeptVisible.value = true
    }
    const handleEditCurrentDept = () => {
      const dept = getDeptById(currentDeptId)
      dept.deptName = newDeptName.value
      axios
        .post('/enroll/setDept', { dept })
        .then((response) => {
          if (response.data.success) {
            notification.success({
              message: '提示',
              description: `已将部门名称变更为(${dept.deptName})!`,
            })
          } else {
            notification.error({
              message: '出错啦',
              description: '变更失败，请联系管理员',
            })
          }
          getDeptData()
        })
        .catch(() => {
          throwRequestError()
        })
      editDeptVisible.value = false
    }
    const deleteCurrentDept = (id) => {
      const dept = getDeptById(id)
      axios
        .post('/enroll/deleteDept', { dept })
        .then((response) => {
          if (response.data.success) {
            notification.success({
              message: '提示',
              description: `部门(${dept.deptName})已删除！若恢复请前往恢复空间`,
            })
          } else {
            notification.error({
              message: '出错啦',
              description: '删除失败，请联系管理员',
            })
          }
          getDeptData()
        })
        .catch(() => {
          throwRequestError()
        })
    }

    // 批次管理部分
    const turnColumns = [
      {
        title: '批次名称',
        dataIndex: 'turnName',
        key: 'turnName',
      },
      {
        title: '批次状态',
        dataIndex: 'activated',
        key: 'activated',
      },
      {
        title: '操作',
        key: 'operation',
        fixed: 'right',
      },
    ]
    let turnData = reactive({ data: [] })
    let editTurnVisible = ref(false)
    let createTurnVisible = ref(false)
    let newTurnName = ref('')
    let currentTurnId = -1

    const getTurnData = () => {
      axios
        .get('/enroll/getTurns')
        .then((response) => {
          turnData.data = response.data.turns
          console.log(response)
        })
        .catch(() => {
          notification.error({
            message: '出错啦',
            description: '无法获取报名轮次，请联系管理员',
          })
        })
    }
    const getTurnById = (id) => {
      let turn = null
      turnData.data.forEach((p) => {
        if (p.id == id) {
          turn = p
        }
      })
      return turn
    }
    getTurnData() // 获取 turnData 初始值

    const createNewTurn = () => {
      createTurnVisible.value = true
    }
    const handleCreateNewTurn = () => {
      const turn = { turnName: newTurnName.value }
      axios
        .post('/enroll/createTurn', { turn })
        .then((response) => {
          if (response.data.success) {
            notification.success({
              message: '提示',
              description: `已成功添加新批次(${turn.turnName})`,
            })
          } else {
            notification.error({
              message: '出错啦',
              description: '添加新批次失败，请联系管理员',
            })
          }
          getTurnData()
        })
        .catch(() => {
          throwRequestError()
        })
      createTurnVisible.value = false
    }
    const editCurrentTurn = (id) => {
      currentTurnId = id
      editTurnVisible.value = true
    }
    const handleEditCurrentTurn = () => {
      const turn = getTurnById(currentTurnId)
      turn.turnName = newTurnName.value
      axios
        .post('/enroll/setTurn', { turn })
        .then((response) => {
          if (response.data.success) {
            notification.success({
              message: '提示',
              description: `已将批次名称变更为(${turn.turnName})!`,
            })
          } else {
            notification.error({
              message: '出错啦',
              description: '变更失败，请联系管理员',
            })
          }
          getTurnData()
        })
        .catch(() => {
          throwRequestError()
        })
      editTurnVisible.value = false
    }
    const openCurrentTurn = (id) => {
      const turn = getTurnById(id)
      // 前端对批次进行校验，确保只有一个批次处于开启状态
      for (let i = 0; i < turnData.data.length; i++) {
        let p = turnData.data[i]
        if (p.activated && p.id != turn.id) {
          notification.info({
            message: '提示',
            description: `请先关闭批次(${p.turnName})，再开启新报名批次！`,
          })
          return
        }
      }
      if (turn.activated) {
        notification.info({
          message: '提示',
          description: `批次(${turn.turnName})已处于开放状态`,
        })
        return
      }
      turn.activated = 1
      axios
        .post('/enroll/setTurn', { turn })
        .then((response) => {
          if (response.data.success) {
            notification.success({
              message: '提示',
              description: `批次(${turn.turnName})已开放！`,
            })
          } else {
            notification.error({
              message: '出错啦',
              description: '变更失败，请联系管理员',
            })
          }
          getTurnData()
        })
        .catch(() => {
          throwRequestError()
        })
    }
    const closeCurrentTurn = (id) => {
      const turn = getTurnById(id)
      if (!turn.activated) {
        notification.info({
          message: '提示',
          description: `批次(${turn.turnName})已处于关闭状态`,
        })
        return
      }
      turn.activated = 0
      axios
        .post('/enroll/setTurn', { turn })
        .then((response) => {
          if (response.data.success) {
            notification.success({
              message: '提示',
              description: `批次(${turn.turnName})已关闭！`,
            })
          } else {
            notification.error({
              message: '出错啦',
              description: '变更失败，请联系管理员',
            })
          }
          getTurnData()
        })
        .catch(() => {
          throwRequestError()
        })
    }
    const deleteCurrentTurn = (id) => {
      const turn = getTurnById(id)
      axios
        .post('/enroll/deleteTurn', { turn })
        .then((response) => {
          if (response.data.success) {
            notification.success({
              message: '提示',
              description: `批次(${turn.turnName})已删除！若恢复请前往恢复空间`,
            })
          } else {
            notification.error({
              message: '出错啦',
              description: '删除失败，请联系管理员',
            })
          }
          getTurnData()
        })
        .catch(() => {
          throwRequestError()
        })
    }

    return {
      deptColumns,
      deptData,
      editDeptVisible,
      createDeptVisible,
      newDeptName,
      createNewDept,
      handleCreateNewDept,
      editCurrentDept,
      deleteCurrentDept,
      handleEditCurrentDept,

      turnColumns,
      turnData,
      editTurnVisible,
      createTurnVisible,
      newTurnName,
      createNewTurn,
      handleCreateNewTurn,
      editCurrentTurn,
      handleEditCurrentTurn,
      openCurrentTurn,
      closeCurrentTurn,
      deleteCurrentTurn,
    }
  },
}
</script>

<style scoped>
h1 {
  margin-bottom: 5px;
  padding: 10px;
  text-align: center;
}
</style>
