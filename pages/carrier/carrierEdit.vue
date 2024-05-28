<template name="承运人管理审核编辑页面">
  <view>
    <scroll-view class="page">
      <!-- 承运人审核编辑 顶部 导航栏 -->
      <u-navbar
        :title="title"
        @leftClick="clickGoBack"
        :autoBack="true"
        placeholder
        border="true"
      >
      </u-navbar>
      <u-form :model="formEdit" ref="uForm">
        <!-- 提示信息 -->
        <u-toast ref="uToast" posinset="top" />
        <!-- 实名认证信息 -->
        <u-card :show-head="false">
          <view slot="body">
            <text>1.实名认证信息</text>
            <view class="upload-container">
              <view class="upload-box">
                <u-upload
                  :class="{
                    'disabled-upload':
                      (!isDisabled && fileList1 == '') || fileList1 == null,
                  }"
                  :multiple="false"
                  max-count="1"
                  @on-change="upload1"
                  :deletable="isDisabled"
                  :action="action"
                  width="280"
                  upload-text="上传身份证(人像面)"
                  :headers="headers"
                  :file-list="fileList1"
                ></u-upload>
              </view>
              <view class="upload-box">
                <u-upload
                  :class="{
                    'disabled-upload':
                      (!isDisabled && fileList2 == '') || fileList2 == null,
                  }"
                  :multiple="false"
                  max-count="1"
                  @on-change="upload2"
                  :deletable="isDisabled"
                  :action="action"
                  width="280"
                  upload-text="上传身份证(国徽面)"
                  :headers="headers"
                  :file-list="fileList2"
                ></u-upload>
              </view>
            </view>
            <u-form-item label-width="100" label="姓名"
              ><u-input :disabled="!isDisabled" v-model="formEdit.driverName"
            /></u-form-item>
            <u-form-item label-width="100" label="手机号"
              ><u-input :disabled="!isDisabled" v-model="formEdit.phone"
            /></u-form-item>
            <u-form-item label-width="150" label="身份证号"
              ><u-input
                :disabled="!isDisabled"
                v-model="formEdit.identificationNumber"
            /></u-form-item>
            <u-form-item label-width="100" label="性别">
              <u-radio-group v-model="formEdit.sex">
                <u-radio
                  :disabled="!isDisabled"
                  v-for="(item, index) in sexData"
                  :key="index"
                  :name="item.value"
                >
                  {{ item.label }}
                </u-radio>
              </u-radio-group>
            </u-form-item>
            <u-form-item label-width="100" label="民族"
              ><u-input :disabled="!isDisabled" v-model="formEdit.nation"
            /></u-form-item>
            <u-form-item label-width="120" label="生日日期">
              <u-cell-item
                :title="formEdit.birthday"
                @click="!isDisabled ? null : (isBirthDate = true)"
              >
              </u-cell-item>
              <u-picker
                @confirm="onBirthdayChange"
                start-year="1900"
                end-year="2099"
                v-model="isBirthDate"
                mode="time"
              ></u-picker>
            </u-form-item>
            <u-form-item label-width="200" label="身份证详细地址">
              <u-input
                :disabled="!isDisabled"
                type="textarea"
                v-model="formEdit.ocrAddress"
                auto-height
              />
            </u-form-item>
            <u-form-item label-width="200" label="身份证所在地区">
              <u-cell-item
                :title="areaName"
                @click="!isDisabled ? null : (isAreaShow = true)"
              >
              </u-cell-item>
              <u-picker
                @confirm="onAreaNameChange"
                mode="region"
                v-model="isAreaShow"
                :area-code="areaCode"
              ></u-picker>
            </u-form-item>
            <u-form-item label-width="200" label="身份证签发机关"
              ><u-input
                :disabled="!isDisabled"
                v-model="formEdit.issuingAuthority"
            /></u-form-item>
            <u-form-item label-width="240" label="身份证有效期(起)">
              <u-cell-item
                :title="formEdit.idCardStartDate"
                @click="!isDisabled ? null : (isIdStarDate = true)"
              >
              </u-cell-item>
              <u-picker
                @confirm="onIdCardStartChange"
                start-year="1900"
                end-year="2099"
                v-model="isIdStarDate"
                mode="time"
              ></u-picker>
            </u-form-item>
            <u-form-item label-width="240" label="身份证有效期(止)">
              <u-cell-item
                :title="formEdit.idCardEndDate"
                @click="!isDisabled ? null : (isIdEndDate = true)"
              >
              </u-cell-item>
              <u-picker
                @confirm="onIdCardEndChange"
                start-year="1900"
                end-year="2099"
                v-model="isIdEndDate"
                mode="time"
              ></u-picker>
              <!-- <u-radio-group v-model="isLongTerm">
                <u-radio :name="true">长期</u-radio>
              </u-radio-group> -->
            </u-form-item>
          </view>
        </u-card>
        <!-- 司机认证信息 -->
        <u-card :show-head="false">
          <view slot="body">
            <text>2.司机认证信息</text>
            <view class="uni-title">是否是驾驶员:</view>
            <u-radio-group v-model="formEdit.isDriver">
              <u-radio
                v-for="(item, index) in isDriverData"
                :key="index"
                :name="item.value"
              >
                {{ item.label }}
              </u-radio>
            </u-radio-group>
            <view v-show="formEdit.isDriver == 1">
              <view class="upload-container">
                <view class="upload-box">
                  <u-upload
                    :class="{
                      'disabled-upload':
                        (!isDisabled && fileList3 == '') || fileList3 == null,
                    }"
                    :multiple="false"
                    max-count="1"
                    @on-change="upload3"
                    :deletable="isDisabled"
                    :action="action"
                    width="280"
                    upload-text="上传身份证(人像面)"
                    :headers="headers"
                    :file-list="fileList3"
                  ></u-upload>
                </view>
                <view class="upload-box">
                  <u-upload
                    :class="{
                      'disabled-upload':
                        (!isDisabled && fileList4 == '') || fileList4 == null,
                    }"
                    :multiple="false"
                    max-count="1"
                    @on-change="upload4"
                    :deletable="isDisabled"
                    :action="action"
                    width="280"
                    upload-text="上传身份证(国徽面)"
                    :headers="headers"
                    :file-list="fileList4"
                  ></u-upload>
                </view>
              </view>
              <u-form-item label-width="150" label="驾驶证号">
                <u-input
                  :disabled="!isDisabled"
                  v-model="formEdit.licenseNumber"
                />
              </u-form-item>
              <u-form-item label-width="150" label="发证机关">
                <u-input
                  :disabled="!isDisabled"
                  v-model="formEdit.certificationAuthority"
                />
              </u-form-item>
              <u-form-item label-width="200" label="初次领证日期">
                <u-input
                  :disabled="!isDisabled"
                  v-model="formEdit.dateOfCertification"
                />
              </u-form-item>
              <u-form-item label-width="150" label="准驾车型">
                <u-picker
                  mode="selector"
                  @confirm="onAllowTypeIdChange"
                  v-model="isAllowDriving"
                  range-key="itemText"
                  :default-selector="[0]"
                  :range="LicensedData"
                ></u-picker>
                <u-cell-item
                  :title="formEdit.allowDrivingType"
                  @click="!isDisabled ? null : (isAllowDriving = true)"
                >
                </u-cell-item>
              </u-form-item>
              <u-form-item label-width="200" label="驾驶证有效期起">
                <u-cell-item
                  :title="formEdit.driverLicenseStartDate"
                  @click="isDriverLicenseStartDate = true"
                >
                </u-cell-item>
                <u-picker
                  @confirm="onDriverLicenseStart"
                  start-year="1900"
                  end-year="2099"
                  v-model="isDriverLicenseStartDate"
                  mode="time"
                ></u-picker>
              </u-form-item>
              <u-form-item label-width="200" label="驾驶证有效期止">
                <u-cell-item
                  @click="!isDisabled ? null : (isDriverLicenseExpDate = true)"
                  :title="formEdit.driverLicenseExpDate"
                >
                </u-cell-item>
                <u-picker
                  @confirm="onDriverLicenseExp"
                  start-year="1900"
                  end-year="2099"
                  v-model="isDriverLicenseExpDate"
                  mode="time"
                ></u-picker>
              </u-form-item>
              <u-form-item label-width="200" label="驾驶证档案编号">
                <u-input
                  :disabled="!isDisabled"
                  v-model="formEdit.driverLicenseFileId"
                />
              </u-form-item>
              <u-form-item label-width="100" label="记录">
                <u-input
                  :disabled="!isDisabled"
                  v-model="formEdit.driverRecord"
                />
              </u-form-item>
              <view class="upload-container">
                <view class="upload-box">
                  <u-upload
                    :class="{
                      'disabled-upload':
                        (!isDisabled && fileList5 == '') || fileList5 == null,
                    }"
                    :multiple="false"
                    max-count="1"
                    @on-change="upload5"
                    :deletable="isDisabled"
                    :action="action"
                    width="280"
                    upload-text="上传身份证(人像面)"
                    :headers="headers"
                    :file-list="fileList5"
                  ></u-upload>
                </view>
              </view>
              <u-form-item label-width="200" label="从业资格证号">
                <u-input
                  :disabled="!isDisabled"
                  v-model="formEdit.workCertificateNumber"
                />
              </u-form-item>
              <u-form-item label-width="200" label="资格证发证省份">
                <u-picker
                  mode="selector"
                  @confirm="onProvinceNameChange"
                  v-model="isProvinceName"
                  range-key="provinceName"
                  :default-selector="[0]"
                  :range="provinceData"
                ></u-picker>
                <u-cell-item
                  :title="formEdit.provinceName"
                  @click="!isDisabled ? null : (isProvinceName = true)"
                >
                </u-cell-item>
              </u-form-item>
              <u-form-item label-width="200" label="资格证有效期止">
                <u-cell-item
                  :title="formEdit.workCertificateExpDate"
                  @click="
                    !isDisabled ? null : (isWorkCertificateExpDate = true)
                  "
                >
                </u-cell-item>
                <u-picker
                  @confirm="onWorkCertificateExpDate"
                  start-year="1900"
                  end-year="2099"
                  v-model="isWorkCertificateExpDate"
                  mode="time"
                ></u-picker>
              </u-form-item>
              <u-form-item label-width="250" label="诚信考核到期日期">
                <u-cell-item
                  :title="formEdit.qualificationCertificateDate"
                  @click="
                    !isDisabled ? null : (isQualificationCertificateDate = true)
                  "
                >
                </u-cell-item>
                <u-picker
                  @confirm="onQualificationCertificateDate"
                  start-year="1900"
                  end-year="2099"
                  v-model="isQualificationCertificateDate"
                  mode="time"
                ></u-picker>
              </u-form-item>
            </view>
          </view>
        </u-card>
         <!-- 审核结果 -->
      <u-card :show-head="false" v-if="title == '承运人管理审核'">
        <view slot="body">
          <view>
            <text>3.审核结果</text>
            <view class="uni-padding-wrap">
              <view class="uni-title">实名认证:</view>
              <u-radio-group v-model="formEdit.auditStatus">
                <u-radio
                  v-for="(item, index) in realNameData"
                  :key="index"
                  :name="item.value"
                >
                  {{ item.label }}
                </u-radio>
              </u-radio-group>
            </view>
            <view class="uni-padding-wrap" v-if="formEdit.isDriver == 1">
              <view class="uni-title">司机认证:</view>
              <u-radio-group v-model="formEdit.attestationStatus">
                <u-radio
                  v-for="(item, index) in driverCertificationData"
                  :key="index"
                  :name="item.value"
                >
                  {{ item.label }}
                </u-radio>
              </u-radio-group>
            </view>
          </view>
        </view>
      </u-card>
        <view class="button-container">
          <u-button
            @click="onSubmit"
            v-if="title == '承运人管理审核'"
            size="medium"
            >确认</u-button
          >
          <u-button
            @click="onSubmitOK"
            v-if="title == '承运人管理编辑'"
            size="medium"
            >保存</u-button
          >
        </view>
      </u-form>
    </scroll-view>
  </view>
</template>

<script>
import {
  sexList,
  isDriverList,
  licensedDriver,
  provinceList,
  realNameList,
  driverCertificationList
} from "@/common/util/work.js";
export default {
  data() {
    return {
      title: "承运人管理编辑",
      areaCode: ["11", "1101", "110100"], //设置打开下拉身份证所在地区默认值
      areaName: "", //显示身份证所在地区
      isDisabled: false, //是否可以修改
      headers: {}, //用于图片上传
      sexData: sexList.data, //性别数据
      isDriverData: isDriverList.data, //是否是司机数据
      LicensedData: licensedDriver.data, //准驾车型数据
      provinceData: provinceList.data, //省数据
      realNameData: realNameList.data, //实名认证
      driverCertificationData: driverCertificationList.data,// 司机认证
      isBirthDate: false, //控制出生日期下拉
      isAreaShow: false, //控制身份证所在地区下拉
      isIdStarDate: false, //控制身份证有效期起下拉
      isIdEndDate: false, //控制身份证有效期止下拉
      isAllowDriving: false, //控制准驾车型下拉
      isDriverLicenseStartDate: false, //控制驾驶证有效期起下拉
      isDriverLicenseExpDate: false, //控制驾驶证有效期止下拉
      isProvinceName: false, //控制身份下拉
      isWorkCertificateExpDate: false, //控制资格证有效期止
      isQualificationCertificateDate: false, //控制诚信考核到期日期
      formEdit: {}, //表单数据isQualificationCertificateDate
      fileList1: [],
      fileList2: [],
      fileList3: [],
      fileList4: [],
      fileList5: [],
      action: "https://platform.zgtian.cn/jeecg-boot/oss/file/upload", //上传地址
    };
  },
  created() {
    this.initData();
  },
  methods: {
       /**
     * @onSubmit 审核
     */
     onSubmit() {
      let params = {
        id: this.formEdit.id,
        attestationStatus: this.formEdit.attestationStatus,
        auditStatus: this.formEdit.auditStatus,
        driverId: this.formEdit.driverId,
        isSkipAudit: 0,
      };
      this.$http.put("ntocc/tmsDriver/audit", params).then((res) => {
        if (res.data.success) {
          uni.showToast({
            title: "审核成功",
            icon: "success",
          });
          // 发送事件通知并返回上一页
          uni.$emit("backFromDriverManagement", { updated: true });
          uni.navigateBack();
        } else {
          uni.showToast({
            title: "审核出错",
            icon: "error",
          });
        }
      });
    },
    /**
     * @onSubmitOK 修改编辑功能
     */
    onSubmitOK() {
      let params = {
        ...this.formEdit,
      };
      this.$http.put("ntocc/tmsDriver/edit", params).then((res) => {
        if (res.data.success) {
          uni.showToast({
            title: "编辑成功",
            icon: "success",
          });
          // 发送事件通知并返回上一页
          uni.$emit("backFromDriverManagement", { updated: true });
          uni.navigateBack();
        } else {
          uni.showToast({
            title: "编辑出错",
            icon: "error",
          });
        }
      });
    },
    /**
     * @initData 页面数据
     * @param {String} token 用于头像上传
     * @param {Object} item  页面数据
     * @param {Bollean} isDisable  是否是审核  审核不能修改 编辑可以修改
     */
    initData() {
      //todo 用于判断标题
      if (this.$store.state.status == "examine") {
        this.isDisabled = false;
        this.title = "承运人管理审核";
      } else {
        this.isDisabled = true;
        this.title = "承运人管理编辑";
      }
      //todo 用于上传头像
      const token = this.$store.state.token;
      this.headers = { "X-Access-Token": token };
      //todo 用于页面数据
      let item = this.$store.state.currentItem;
      if (item) {
        this.formEdit = { ...item };
        this.setAvatar();
      }
    },
    /**
     * @setAvatar   设置图片
     */
    setAvatar(e) {
      if (this.formEdit.identificationBackImgUrl) {
        this.fileList1 = [
          {
            url: this.formEdit.identificationBackImgUrl,
          },
        ];
      }

      if (this.formEdit.identificationFrontImgUrl) {
        this.fileList2 = [
          {
            url: this.formEdit.identificationFrontImgUrl,
          },
        ];
      }
      if (this.formEdit.driverLicenseImgUrl) {
        this.fileList3 = [
          {
            url: this.formEdit.driverLicenseImgUrl,
          },
        ];
      }
      if (this.formEdit.driverLicenseFrontImgUrl) {
        this.fileList4 = [
          {
            url: this.formEdit.driverLicenseFrontImgUrl,
          },
        ];
      }
      if (this.formEdit.workCertificateImgUrl) {
        this.fileList5 = [
          {
            url: this.formEdit.workCertificateImgUrl,
          },
        ];
      }
    },
    /**
     * @onBirthdayChange
     * @param {Object} e 选中的数据
     */
    onBirthdayChange(e) {
      const dateObject = e;
      this.formEdit.birthday = `${dateObject.year}-${dateObject.month}-${dateObject.day}`;
    },
    /**
     * @onAreaNameChange
     * @param {Object} e 选中的数据
     */
    onAreaNameChange(e) {
      let areaName = "";
      areaName += e.province.label;
      areaName += e.city.label;
      areaName += e.area.label;
      this.areaName = areaName;
      this.formEdit.areaId = e.area.value;
    },
    /**
     * @onIdCardStartChange
     * @param {Object} e 选中的数据
     */
    onIdCardStartChange(e) {
      const dateObject = e;
      this.formEdit.idCardStartDate = `${dateObject.year}-${dateObject.month}-${dateObject.day}`;
    },
    /**
     * @onIdCardEndChange
     * @param {Object} e 选中的数据
     */
    onIdCardEndChange(e) {
      const dateObject = e;
      this.formEdit.idCardEndDate = `${dateObject.year}-${dateObject.month}-${dateObject.day}`;
    },
    /**
     * @onAllowTypeIdChange
     * @param {Object} e 选中的数据
     */
    onAllowTypeIdChange(e) {
      const idnex = e[0];
      this.formEdit.allowDrivingType = this.LicensedData[idnex].itemText;
      this.formEdit.allowDrivingTypeId = this.LicensedData[idnex].id;
    },
    /**
     * @onDriverLicenseStart
     * @param {Object} e 选中的数据
     */
    onDriverLicenseStart(e) {
      const dateObject = e;
      this.formEdit.driverLicenseStartDate = `${dateObject.year}-${dateObject.month}-${dateObject.day}`;
    },
    /**
     * @onDriverLicenseExp
     * @param {Object} e 选中的数据
     */
    onDriverLicenseExp(e) {
      const dateObject = e;
      this.formEdit.driverLicenseExpDate = `${dateObject.year}-${dateObject.month}-${dateObject.day}`;
    },
    /**
     * @onProvinceNameChange
     * @param {Object} e 选中的数据
     */
    onProvinceNameChange(e) {
      const idnex = e[0];
      this.formEdit.provinceName = this.provinceData[idnex].provinceName;
      this.formEdit.workCertificateAuthority =
        this.provinceData[idnex].provinceCode;
    },
    /**
     * @onWorkCertificateExpDate
     * @param {Object} e 选中的数据
     */
    onWorkCertificateExpDate(e) {
      const dateObject = e;
      this.formEdit.workCertificateExpDate = `${dateObject.year}-${dateObject.month}-${dateObject.day}`;
    },
    /**
     * @onQualificationCertificateDate
     * @param {Object} e 选中的数据
     */
    onQualificationCertificateDate(e) {
      const dateObject = e;
      this.formEdit.qualificationCertificateDate = `${dateObject.year}-${dateObject.month}-${dateObject.day}`;
    },
    handleUploadResponse(res, formObject, property) {
      let jsonData = JSON.parse(res.data);
      let resultValue = jsonData.result;
      formObject[property] = resultValue;
    },
    upload1(res, index, lists, name) {
      this.handleUploadResponse(res, this.formEdit, "identificationBackImgUrl");
    },

    upload2(res, index, lists, name) {
      this.handleUploadResponse(
        res,
        this.formEdit,
        "identificationFrontImgUrl"
      );
    },

    upload3(res, index, lists, name) {
      this.handleUploadResponse(res, this.formEdit, "driverLicenseImgUrl");
    },

    upload4(res, index, lists, name) {
      this.handleUploadResponse(res, this.formEdit, "driverLicenseFrontImgUrl");
    },
    upload5(res, index, lists, name) {
      this.handleUploadResponse(res, this.formEdit, "workCertificateImgUrl");
    },
  },
};
</script>
<style scoped>
page {
  background-color: #fff;
}

.upload-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  /* 确保内容从左侧开始排列 */
  align-items: flex-start;
  /* 对齐到顶部 */
}

.upload-box {
  margin-right: 5px;
  /* 右侧间距，保持盒子之间的距离 */
  margin-bottom: 5px;
  /* 下方间距，保持上下行之间的距离 */
}

.upload-label {
  margin-top: 8px;
}

.box /deep/ .label-text {
  font-size: 15px;
  font-weight: bold;
}

/* 在scoped样式中添加 */
.button-container {
  display: flex;
  justify-content: center;
  margin-top: 20px;
  padding-bottom: 20px;
}

.u-button {
  width: 90%;
  max-width: 400px;
}

.disabled-upload {
  pointer-events: none;
  opacity: 0.5;
}

input::placeholder,
textarea::placeholder {
  color: #cccccc;
  /* 设置你需要的颜色 */
  opacity: 1;
  /* 设置透明度 */
}

input:-ms-input-placeholder,
textarea:-ms-input-placeholder {
  /* IE10+ */
  color: #cccccc;
}

input::-ms-input-placeholder,
textarea::-ms-input-placeholder {
  /* Edge */
  color: #cccccc;
}

input::-webkit-input-placeholder,
textarea::-webkit-input-placeholder {
  /* Chrome, Safari, Opera */
  color: #cccccc;
}
</style>
