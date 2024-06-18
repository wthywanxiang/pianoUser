<template>
  <view class="components-form">
    <view class="Wapper">
      <view :style="{ paddingTop: vuex_custom_bar_height + 'px' }">
        <tn-form
          :model="model"
          ref="form"
          :errorType="errorType"
          :labelPosition="labelPosition"
          :labelWidth="labelWidth"
          :labelAlign="labelAlign"
        >
          <tn-form-item
            label="姓名"
            prop="name"
            leftIcon="identity"
            :required="true"
            :labelPosition="labelPosition"
            :labelAlign="labelAlign"
          >
            <tn-input
              v-model="model.name"
              type="text"
              placeholder="请输入姓名"
              :border="border"
            ></tn-input>
          </tn-form-item>
          <tn-form-item
            label="身份"
            prop="identity"
            :labelPosition="labelPosition"
            :labelAlign="labelAlign"
          >
            <tn-input
              v-model="model.identity"
              type="select"
              placeholder="点击选择"
              :border="border"
              :selectOpen="actionSheetShow"
              @click="actionSheetShow = true"
            ></tn-input>
          </tn-form-item>
          <tn-form-item
            label="身份编码"
            prop="number"
            rightIcon="number"
            :labelPosition="labelPosition"
            :labelAlign="labelAlign"
          >
            <tn-input
              v-model="model.number"
              type="number"
              placeholder="学生填学号,老师填工号"
              :border="border"
            >
            </tn-input>
          </tn-form-item>
    
        </tn-form>
        <tn-button
          backgroundColor="#01BEFF"
          fontColor="#FFFFFF"
          width="100%"
          @click="submit"
          >提交</tn-button
        >

        <!-- 身份选项 -->
        <tn-action-sheet
          v-model="actionSheetShow"
          :list="actionSheetList"
          @click="actionSheetClick"
        >
        </tn-action-sheet>
      </view>
    </view>
  </view>
</template>

<script>
import { TeacherLogin, StudentLogin } from "@/common/api.js";
import moudels from "@/common/config.js"
export default {
  data() {
    return {
      errorType: ["message", "border-bottom", "toast"],
      labelPosition: "left",
      labelAlign: "right",
      border: false,
      actionSheetShow: false,
      labelWidth: 140,
      checkboxWidth: "auto",
      checkboxWrap: false,
      radioWidth: "auto",
      radioWrap: false,
      pickerShow: false,
      selectShow: false,
      actionSheetList: [
        {
          text: "学生",
        },
        {
          text: "老师",
        },
      ],
      model: {
        name: "",
        identity: "",
        number: "",
      },
      rules: {
        name: [
          {
            required: true,
            message: "请输入姓名",
            trigger: "blur",
          },
          {
            min: 2,
            max: 5,
            message: "姓名长度在2到5个字符",
            trigger: ["change", "blur"],
          },
        ],
        identity: [
          {
            required: true,
            message: "请表明身份",
            trigger: "change",
          },
        ],
        number: [
          {
            required: true,
            message: "请输入身份编码",
            trigger: "change",
            type: "number",
          },
        ],
      },
    };
  },
  onReady() {
    this.$refs.form.setRules(this.rules);
  },
  methods: {
    // 表单提交
    submit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          getApp().globalData.username = this.model.name;
          let isteacher = this.model.identity == "学生" ? false : true;
          getApp().globalData.Isteacher = isteacher;
          let userid = getApp().globalData.userid;
		  getApp().globalData.number=this.model.number;
          if (isteacher) {
            TeacherLogin({
				tno:this.model.number,
				name:this.model.name
			}).then(res=>{
				console.log('res',res);
				this.$store.state.$token=res.data
				uni.reLaunch({
					url:'/pages/user/user'
				})
			})
          } else {
            StudentLogin({
				sno:this.model.number,
				name:this.model.name
			}).then(res=>{
				console.log('res',res);
				this.$store.state.$token=res.data
				uni.reLaunch({
					url:'/pages/user/user'
				})
			})
          }
		  
        } else {
        }
      });
    },
    // 点击actionSheet选择身份
    actionSheetClick(index) {
      uni.hideKeyboard();
      this.model.identity = this.actionSheetList[index].text;
    },
    imageUploadChange(lists) {
      this.model.photo = lists;
	  console.log(this.model.photo[0].url);
    },
  },
};
</script>

<style lang="scss" scoped>
.components-form {
  .Wapper {
    margin: 10% 5% 0% 5%;
    padding: 5%;
    box-shadow: 15rpx 15rpx 30rpx rgba(0, 0, 0, 0.15),
      inset 15rpx 15rpx 10rpx rgba(255, 255, 255, 0.9),
      -15rpx -15rpx 30rpx rgba(255, 255, 255, 0.8),
      inset -2rpx -2rpx 10rpx rgba(0, 0, 0, 0.15);
    width: 90%;
  }
}

.agreement {
  display: flex;
  align-items: center;
  margin: 40rpx 0;

  &-text {
    padding-left: 8rpx;
    color: $tn-font-sub-color;
  }
}
</style>
