<script setup>
import router from '@/router/index';
import { reactive, ref } from 'vue';
import { ElMessageBox } from 'element-plus';
import { getData,SetRafflePrize,SysStatusStart,UploadEmployees } from '@/api/home';
const tableData = reactive({
  rafflePrizes: [
    { id: 1, prizeName: '一等奖', prizeAmount: '', quantity: '', readonly: true },
    { id: 2, prizeName: '二等奖', prizeAmount: '', quantity: '', readonly: true },
    { id: 3, prizeName: '三等奖', prizeAmount: '', quantity: '', readonly: true },
  ],
});
const files = ref([]);
const uploadRef = ref();
const uploadMethod = ref('requestSuccessMethod');

// file 为等待上传的文件信息，用于提供给上传接口。file.raw 表示原始文件
const requestSuccessMethod = (file) => {
  console.log(file);
  return new Promise((resolve) => {
    // 上传进度控制示例
    let percent = 0;
    const percentTimer = setInterval(() => {
      if (percent + 10 < 99) {
        percent += 10;
        uploadRef.value.uploadFilePercent({ file, percent });
      } else {
        clearInterval(percentTimer);
      }
    }, 100);
    UploadEmployees(file.raw).then((res) => {

    })
    const timer = setTimeout(() => {
      // resolve 参数为关键代码
      resolve({ status: 'success', response: { url: 'https://tdesign.gtimg.com/site/avatar.jpg' } });

      clearTimeout(timer);
      clearInterval(percentTimer);
    }, 1000);
  });
};

const requestFailMethod = (file) => {
  console.log(file);
  return new Promise((resolve) => {
    // resolve 参数为关键代码
    resolve({ status: 'fail', error: '上传失败，请检查文件是否符合规范' });
  });
};

const handleRequestFail = (e) => {
  console.log(e);
};

const requestMethod = computed(() =>
  uploadMethod.value === 'requestSuccessMethod' ? requestSuccessMethod : requestFailMethod,
);
const add = () => {
  tableData.rafflePrizes.push({ id: 4, prizeName: '', prizeAmount: '', quantity: '', readonly: false, delete: true });
};
const deleteItem = (index) => {
  tableData.rafflePrizes.splice(index, 1);
};
const getTableData = async () => {
  getData().then((res) => {
    tableData.rafflePrizes = res.started_2.rafflePrizes;
  });
};
onMounted(() => {
  getTableData();
});
const start = () => {
  ElMessageBox.confirm(`确定开始抽奖吗`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
    draggable: true,
    closeOnClickModal: false,
  })
    .then(async () => {
      router.push('/pinia');
    })
    .catch(() => {});
};
</script>

<template>
  <div>
    <div class="flex">
      <t-button style="margin-right: 10px" @click="add">添加奖项</t-button>
      <t-upload ref="uploadRef" v-model="files" :request-method="requestMethod" :on-fail="handleRequestFail">
        <t-button theme="primary">导入员工</t-button>
      </t-upload>
    </div>
    <div v-for="(item, index) in tableData.rafflePrizes" class="box flex" :key="index">
      <div class="left">
        <t-input v-model="item.prizeName" placeholder="奖项名称" :readonly="item.readonly"></t-input>
      </div>
      <div class="right">
        <t-input v-model="item.prizeAmount" placeholder="奖项价格"></t-input>
        <t-input v-model="item.quantity" style="margin-top: 10px" placeholder="奖项数量"></t-input>
      </div>
      <div v-if="item.delete" class="right">
        <t-button @click="deleteItem(index)">删除</t-button>
      </div>
    </div>
    <t-button style="margin-top: 10px" @click="start">开始抽奖</t-button>
  </div>
</template>
<style lang="less" scoped>
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
.flex {
  display: flex;
}
</style>
