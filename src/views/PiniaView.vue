<template>
  <div>
    <div class="flex">奖项列表</div>
    <div v-for="(item, index) in tableData.rafflePrizes" :key="index" class="box flex">
      <div class="left" style="min-width: 100px">
        <t-card>{{ item.prizeName }}</t-card>
      </div>
      <div class="right">
        <t-card>金额：{{ item.prizeAmount }}</t-card>
      </div>
      <div class="right">
        <t-card>已抽次数：{{ item.drawnCount }}</t-card>
      </div>
      <div class="right">
        <t-card>可抽次数：{{ item.drawsLeft }}</t-card>
      </div>
      <div class="right">
        <t-button @click="start(item)">开始抽奖</t-button>
      </div>
    </div>
    <div class="flex top">中奖记录</div>
    <el-table :data="tableData.prizeRecords" style="width: 100%">
      <el-table-column prop="rafflePrizeName" label="奖项名称" width="150" />
      <el-table-column prop="prizeAmount" label="中奖金额" width="100" />
      <el-table-column prop="winnerId" label="中奖人工号" width="100" />
      <el-table-column prop="winnerName" label="中奖人姓名" width="100" />
      <el-table-column prop="winnerDepartment" label="中奖人部门" width="180" />
      <el-table-column prop="winTime" label="中奖时间" width="180" />
    </el-table>
    <div class="flex top">中奖金额汇总表</div>
    <el-table :data="tableData.winningAmountByDepartment" style="width: 100%">
      <el-table-column prop="department" label="部门" />
      <el-table-column prop="amount" label="金额" />
    </el-table>
    <div class="flex top">员工名字</div>
    <el-table :data="tableData.employees" style="width: 100%; height: 150px">
      <el-table-column prop="userId" label="工号" />
      <el-table-column prop="userName" label="姓名" />
      <el-table-column prop="department" label="部门" />
      <el-table-column width="180" label="是否已中奖">
        <template #default="scope">
          <span>{{ scope.row.hasWon ? '已中奖' : '未中奖' }}</span>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      fullscreen
      v-model="dialogTableVisible"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :show-close="false"
      :title="`${current?.rollingRafflePrize?.prizeName || ''} 已抽數量：${current?.rollingRafflePrize?.drawnCount || ''} 可抽數量：${current?.rollingRafflePrize?.drawsLeft || ''}`"
      width="90%"
    >
      <div class="flex content">
        <div class="left">
          <div class="font">工號：{{ currentPeople?.userId }}</div>
          <div class="font">姓名：{{ currentPeople?.userName }}</div>
          <div class="font">部門：{{ currentPeople?.department }}</div>
        </div>
        <div class="right"></div>
      </div>
      <!-- <template #footer> <el-button @click="onCancel" size="default">取消</el-button> </template> -->
    </el-dialog>
  </div>
</template>

<script setup>
import { computed, reactive, ref } from 'vue';
import { useCounterStore } from '@/store';
import { ElMessageBox } from 'element-plus';
import { getData, StartRoll } from '@/api/home';
const dialogTableVisible = ref(true);
//存放開始滾動消息
const current = ref({});
const currentPeople = ref({});
const tableData = reactive({
  rafflePrizes: [
    { id: 1, prizeName: '一等奖', prizeAmount: 1000, drawnCount: 3, drawsLeft: 3 },
    { id: 2, prizeName: '二等奖', prizeAmount: 500, drawnCount: 3, drawsLeft: 3 },
    { id: 3, prizeName: '三等奖', prizeAmount: 300, drawnCount: 3, drawsLeft: 3 },
  ],
  prizeRecords: [
    {
      id: 1,
      rafflePrizeName: '一等奖',
      prizeAmount: 1000,
      winnerId: 'G1659536',
      winnerName: '康',
      winnerDepartment: '开发部',
      winTime: '',
    },
    {
      id: 2,
      rafflePrizeName: '二等奖',
      prizeAmount: 500,
      winnerId: 'G1659536',
      winnerName: '康',
      winnerDepartment: '开发部',
      winTime: '',
    },
    {
      id: 3,
      rafflePrizeName: '三等奖',
      prizeAmount: 300,
      winnerId: 'G1659536',
      winnerName: '康',
      winnerDepartment: '开发部',
      winTime: '',
    },
  ],
  winningAmountByDepartment: [
    {
      id: 1,
      department: '系统开发部',
      amount: 1000,
    },
  ],
  employees: [
    {
      userId: 'G1659536',
      userName: '康康康',
      department: '开发部',
      hasWon: false,
    },
  ],
});
const start = async (item) => {
  StartRoll({ rafflePrizeId: item.id }).then((res) => {
    if (res) {
      current.value = res;
      ElMessageBox.confirm(
        `即將抽取${res.rollingRafflePrize.prizeName},已抽${res.rollingRafflePrize.drawnCount}個,剩余可抽${res.rollingRafflePrize.drawsLeft}個，確認開始？`,
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        },
      )
        .then(async () => {
          dialogTableVisible.value = true;
          
        })
        .catch(() => {});
    }
  });
};
const onCancel = () => {
  ElMessageBox.confirm(`確認退出抽獎？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      dialogTableVisible.value = false;
    })
    .catch(() => {});
};
const getTableData = async () => {
  getData().then((res) => {
    tableData.employees = res.started_2.employees;
    tableData.prizeRecords = res.started_2.prizeRecords;
    tableData.rafflePrizes = res.started_2.rafflePrizes;
    tableData.winningAmountByDepartment = res.started_2.winningAmountByDepartment;
  });
};
onMounted(() => {
  getTableData();
});
</script>

<style lang="less" scoped>
.content {
  .left {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    .font {
      font-size: 32px;
      margin-bottom: 20px;
    }
  }
  .right {
    flex: 1;
  }
}
.box {
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  .left {
  }
  .right {
    margin-left: 10px;
  }
}
.top {
  margin-top: 10px;
}
.flex {
  display: flex;
}
</style>
