<template name="承运人管理页面">
  <view>
    <!-- 承运人 顶部 导航栏 -->
    <u-navbar
      title="承运人管理"
      @leftClick="clickGoBack"
      :autoBack="true"
      placeholder
      border="true"
    >
    </u-navbar>
    <!-- 承运人 搜索框 -->
    <view style="background-color: #fff">
      <u-search
        @search="onSearch"
        @custom="setPouple"
        clearabled
        borderColor="#fff"
        style="margin: 5px 0"
        placeholder="请输入手机号"
        bgColor="#fff"
        v-model="formData.phone"
        actionText="筛选"
      >
      </u-search>
    </view>
    <!-- 滚动视图 包含下拉刷新功能 -->
    <scroll-view
      scroll-y
      :scroll-top="scrollTop"
      @scrolltolower="loadMore"
      :refresher-enabled="true"
      :refresher-threshold="50"
      :refresher-default-style="'black'"
      :refresher-background="'#f8f8f8'"
      :refresher-triggered="refresherTriggered"
      @refresherrefresh="refresh"
      style="height: calc(100vh - 100px)"
    >
      <!-- 适当调整100px以匹配搜索框和导航栏的总高度 -->
      <!-- 承运人 卡片 -->
      <view v-for="(item, index) in dataList" :key="item.id">
        <u-card :show-head="false">
          <view class="card-list" slot="body">
            <view class="info-box">
              <view class="info">
                <text class="label">{{ item.driverName }}:</text>
                <text class="value">{{ item.phone }}</text>
              </view>
              <view class="info">
                <text class="label">是否为驾驶员：</text>
                <text class="value" v-if="item.isDriver == 1">是</text>
                <text class="value" v-if="item.isDriver == 0">否</text>
              </view>
              <view class="info">
                <text class="label">实名认证：</text>
                <text
                  v-if="item.auditStatus == 0"
                  mode="light"
                  style="color: dimgray"
                  class="value status"
                  >未认证</text
                >
                <text
                  v-if="item.auditStatus == 1"
                  mode="light"
                  style="color: chocolate"
                  class="value status"
                  >等待审核</text
                >
                <text
                  v-if="item.auditStatus == 2"
                  mode="light"
                  style="color: forestgreen"
                  class="value status"
                  >认证成功</text
                >
                <text
                  v-if="item.auditStatus == 3"
                  mode="light"
                  style="color: red"
                  class="value status"
                  >认证失败</text
                >
              </view>
              <view class="info">
                <text class="label">司机认证：</text>
                <text
                  v-if="item.attestationStatus == 1"
                  style="color: chocolate"
                  class="value status"
                  >正在审核</text
                >
                <text
                  v-if="item.attestationStatus == 2"
                  style="color: forestgreen"
                  class="value status"
                  >认证成功</text
                >
                <text
                  v-if="item.attestationStatus == 3"
                  style="color: red"
                  class="value status"
                  >认证失败</text
                >
              </view>
            </view>
            <view class="buttons-box">
              <u-button
                type="primary"
                @click="goEdit(item, 'examine')"
                size="medium"
                >审核</u-button
              >
              <u-button
                type="primary"
                @click="goEdit(item, 'edit')"
                size="medium"
                >编辑</u-button
              >
            </view>
          </view>
        </u-card>
      </view>
      <view v-if="loadingMore" class="loading">加载中...</view>
      <view v-if="!hasMoreData" class="loading">没有更多数据</view>
    </scroll-view>
    <u-popup mode="bottom" v-model="isPouple" @close="isPouple = false">
      <u-form :model="formData" ref="uForm">
        <u-form-item label-width="150" label="是否驾驶员">
          <u-picker
            mode="selector"
            @confirm="onDriverChange"
            v-model="isDriverPicker"
            range-key="label"
            :default-selector="[0]"
            :range="driverData"
          ></u-picker>
          <u-cell-item :title="driverLabel" @click="isDriverPicker = true">
          </u-cell-item>
        </u-form-item>
        <u-form-item label-width="180" label="实名认证状态">
          <u-picker
            mode="selector"
            @confirm="onAttestationStatusChange"
            v-model="isAttestationStatus"
            range-key="label"
            :default-selector="[0]"
            :range="attestationStatusData"
          ></u-picker>
          <u-cell-item
            :title="attestationStatusLabel"
            @click="isAttestationStatus = true"
          >
          </u-cell-item>
        </u-form-item>
        <u-form-item label-width="180" label="司机认证状态">
          <u-picker
            mode="selector"
            @confirm="onAuditStatusChange"
            v-model="isauditStatus"
            range-key="label"
            :default-selector="[0]"
            :range="auditStatusData"
          ></u-picker>
          <u-cell-item
            :title="auditStatusLabel"
            @click="isauditStatus = true"
          >
          </u-cell-item
        ></u-form-item>
        <u-form-item label-width="150" label="承运人姓名"
          ><u-input
        /></u-form-item>
        <u-form-item label-width="120" label="手机号"><u-input /></u-form-item>
        <u-form-item label-width="150" label="身份证号码"
          ><u-input
        /></u-form-item>
      </u-form>
      <view class="confrim-btn">
        <u-button @click="onSearch" type="primary">查询</u-button>
        <u-button @click="onReset" >重置</u-button>
      </view>
    </u-popup>
  </view>
</template>

<script>
import {
  driverList,
  attestationStatusList,
  auditStatusList,
} from "@/common/util/work.js";
export default {
  data() {
    return {
      isDriverPicker: false, // 是否显示司机下拉
      isAttestationStatus: false, // 是否显示实名认证状态下拉
      isauditStatus: false, // 是否显示司机认证状态下拉
      isPouple: false, // 是否显示弹出层
      dataList: [], // 列表数据
      pageSize: 10, // 每页显示条数
      pageNo: 1, // 当前页码
      loadingMore: false, // 加载更多标识
      hasMoreData: true, // 是否还有更多数据
      scrollTop: 0, // 滚动高度
      refresherTriggered: false, // 下拉刷新标识
      loading: true, // 加载页标识
      formData: {
        driverName: "", // 承运人姓名
        phone: "", // 手机号
        identificationNumber: "", // 身份证号
        isDriver: "", // 是否是驾驶员
        attestationStatus: "", //实名认证状态
        auditStatus:'',//司机认证状态
      }, // 查询条件
      driverData: driverList.data, //是否是司机数据
      attestationStatusData: attestationStatusList.data, //实名认证状态数据
      auditStatusData: auditStatusList.data, //司机认证状态数据
      driverLabel: "全部", // 存储司机下拉框显示的label值
      attestationStatusLabel: "全部", // 存储实名认证状态下拉框显示的label值
      auditStatusLabel: "全部", // 存储司机认证状态下拉框显示的label值
      isFirstLoad: true, // 标记是否为第一次加载
    };
  },
  mounted() {
    this.initList();
  },
  methods: {
    /**
     * @onSearch 筛选查询功能
     */
    onSearch() {
      this.pageNo = 1;
      this.isPouple = false;
      this.getData(true, "查询成功");
    },
    /**
     * @onReset 筛选框重置按钮
     */
    onReset() {
      this.formData = {
        driverName: "", // 承运人姓名
        phone: "", // 手机号
        identificationNumber: "", // 身份证号
        isDriver: "", // 是否是驾驶员
      };
      this.driverLabel = "全部";
      this.isPouple = false;
      this.getData(true, "重置成功");
    },
    /**
     * @setPouple 是否显示筛选框
     * @param {boolean} isPouple 是否显示
     */
    setPouple() {
      this.isPouple = true;
    },
    /**
     * @clickGoBack 返回上一级页面
     * @todo 建议直接写死返回逻辑，避免嵌套返回出现问题
     */
    clickGoBack() {
      uni.navigateBack();
    },
    /**
     * @initList 初始化列表
     * 设置 loading 状态并获取数据
     */
    initList() {
      this.loading = true;
      this.pageNo = 1;
      this.getData(true);
    },
    /**
     * @getData  获取承运人列表数据
     * @param {boolean} isRefresh 是否为刷新操作
     * @param {string} successMessage 成功消息（可选）
     * @todo
     * 1. 使用 'ntocc/tmsDriver/queryListPC' 获取数据
     * 2. 请求参数：
     *    - isDriverQueryParam: 0
     *    - typeInfo: 3
     */
    getData(isRefresh = false, successMessage = "") {
      if (isRefresh) {
        this.loading = true;
      }
      const params = {
        pageSize: this.pageSize,
        pageNo: this.pageNo,
        isDriverQueryParam: this.formData.isDriver,
        typeInfo: 3,
        driverName: this.formData.driverName,
        phone: this.formData.phone,
        identificationNumber: this.formData.identificationNumber,
      };
      this.$http
        .get("ntocc/tmsDriver/queryListPC", { params })
        .then((res) => {
          if (res.data.success) {
            const records = res.data.result.records;
            if (isRefresh) {
              this.dataList = records;
              if (!this.isFirstLoad && successMessage) {
                uni.showToast({
                  title: successMessage,
                  icon: "success",
                });
              }
              this.isFirstLoad = false;
            } else {
              this.dataList = [...this.dataList, ...records];
            }
            // 检查是否还有更多数据
            this.hasMoreData = records.length >= this.pageSize;
          } else {
            uni.showToast({
              title: res.data.message,
              icon: "none",
            });
          }
        })
        .catch((error) => {
          uni.showToast({
            title: "请求失败，请重试",
            icon: "none",
          });
          console.error(error);
        })
        .finally(() => {
          this.loading = false;
          this.loadingMore = false;
          this.refresherTriggered = false;
        });
    },
    /**
     * @loadMore 加载更多数据
     * 增加页码并调用 getData 方法
     */
    loadMore() {
      if (this.loadingMore || !this.hasMoreData) return;
      this.loadingMore = true;
      this.pageNo += 1;
      this.getData();
    },
    /**
     * @refresh 下拉刷新
     * 重置页码并调用 getData 方法
     */
    refresh() {
      this.refresherTriggered = true;
      this.hasMoreData = true;
      this.pageNo = 1;
      this.getData(true);
    },
    /**
     * 编辑或审核的逻辑
     * @param {object} item 当前承运人信息
     * @param {string} status 动作类型（编辑或审核）
     */
    goEdit(item, status) {
      this.$store.dispatch("setCurrentItem", item);
      this.$store.dispatch("setDisabled", status);
      this.$Router.push({ name: "carrierEdit" });
    },
    /**
     * @onDriverChange 切换是否司机
     * @param {Number} selectedIndex  选择数据下标
     * @param {String} driverLabel 显示当前选择label
     * @param {String||Number} isDriver 选择的值
     */
    onDriverChange(e) {
      const selectedIndex = e[0];
      this.formData.isDriver = this.driverData[selectedIndex].value;
      this.driverLabel = this.driverData[selectedIndex].label;
      this.isDriverPicker = false;
    },
    /**
     * @onAttestationStatusChange 切换实名认证状态
     * @param {Number} selectedIndex  选择数据下标
     * @param {String} attestationStatusLabel 显示当前选择label
     * @param {String||Number} isDriver 选择的值
     */
    onAttestationStatusChange(e) {
      const selectedIndex = e[0];
      this.formData.attestationStatus =
        this.attestationStatusData[selectedIndex].value;
      this.attestationStatusLabel =
        this.attestationStatusData[selectedIndex].label;
      this.isAttestationStatus = false;
    },
    /**
     * @onAuditStatusChange 切换司机认证状态
     * @param {Number} selectedIndex  选择数据下标
     * @param {String} auditStatusLabel 显示当前选择label
     * @param {String||Number} isDriver 选择的值
     */
     onAuditStatusChange(e) {
      const selectedIndex = e[0];
      this.formData.auditStatus = this.auditStatusData[selectedIndex].value;
      this.auditStatusLabel = this.auditStatusData[selectedIndex].label;
      this.isauditStatus = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.info {
  margin: 5px 0;
}

.label {
  font-weight: bold;
}

.success {
  color: green;
}

.buttons-box {
  margin-top: 10rpx;
  display: flex;
  justify-content: space-around;
}

.button-separator {
  width: 10px;
  /* 调整这个值来设置按钮之间的间隔 */
}

.loading {
  text-align: center;
  padding: 10px;
}

.loading-page,
.empty-page {
  display: flex;
  justify-content: center;
  align-items: center;
  height: calc(100vh - 100px);
}

.loading-page {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.empty-page {
  position: absolute;
  width: 100%;
}
.buttons-box {
  margin-top: 20rpx;
  display: flex;
  justify-content: space-around;
}
</style>
