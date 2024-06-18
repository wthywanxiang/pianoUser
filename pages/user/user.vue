<template>
  <view class="me">
    <!-- 用户信息卡片 -->
    <view class="user-info">
      <image class="hbg" src="@/static/hbg.png" mode="aspectFit" />
      <image
        class="user-info-content"
        src="@/static/ubg.png"
        mode="aspectFit"
      />
      <view class="user-content">
        <view class="user-imgbox">
          <view class="user-img" @tap="changeimg">
            <img :src="img" />
          </view>
        </view>

        <view class="user-text">
          <text class="user-name">{{ username }}</text>
          <view class="user-brief">
            <u-input
              class="user-input"
              placeholder="这个人有点懒，什么都没留下"
              border="surround"
              clearable
              v-model="sign"
              @change="ChangeInput"
            ></u-input>
          </view>
        </view>
      </view>

      <!-- 下面的半圆导航 -->
      <view class="view-circle" />
      <view class="user-tabs">
        <view class="tab-item left" @tap="GotoBooking">
          <image class="tab-svg" src="@/static/booking.png" mode="aspectFit" />
          <text class="tab-name">预约琴房</text>
        </view>
        <view class="tab-item" @tap="gotohistory">
          <image class="tab-svg" src="@/static/bell.png" mode="aspectFit" />
          <text class="tab-name">{{
            Isteacher ? "我管理的班级" : "我的预约记录"
          }}</text>
        </view>
      </view>
    </view>

    <view class="list">
      <view v-for="(item, index) in ReservationRoom" :key="index">
        <view
          @click="
            PopShow = true;
            ChooseRoom = index;
          "
          class="ReservationRoom"
        >
          <uni-card
            :border="false"
            :title="item.name + '号'"
            :sub-title="item.beginTime"
            :extra="getCondition(index)"
            :thumbnail="RoomAvatar"
          >
            <text class="uni-body"
              >请于
              <text style="color: orange; font-weight: bolder">{{
                cardTime(index)
              }}</text
              >前往<text style="color: orange; font-weight: bolder">{{
                item.name
              }}</text
              >号琴房进行长达
              <text style="color: orange; font-weight: bolder"
                >{{ item.LengthOfTime }}H</text
              >的练习
              <text style="color: orange; font-weight: bolder"
                >(点击卡片操作)</text
              ></text
            >
          </uni-card>
        </view>
      </view>
      <view class="AllInfo">
        <view class="Info" v-for="(item, index) of UserInfo" :key="index">
          <view class="icon">
            <view>
              <img :class="index" :src="item.url" alt="" />
            </view>
          </view>
          <view class="desc">
            <view>
              <text>{{ item.text }}</text>
            </view>
            <u-count-to
              class="Count"
              :decimals="index == 'AllOfTime' ? 2 : 0"
              :startVal="0"
              :endVal="item.number"
            ></u-count-to>
          </view>
        </view>
      </view>

      <view class="Popup">
        <u-modal
          :show="ReservateShow"
          title="是否取消预约"
          :buttonReverse="true"
          :showCancelButton="true"
          :closeOnClickOverlay="true"
          @cancel="ReservateClose"
          @confirm="CancelTheReservation"
          @close="ReservateShow = false"
        >
        </u-modal>
        <u-modal
          :show="PopShow"
          title="请选择操作"
          :closeOnClickOverlay="true"
          :showCancelButton="true"
          :buttonReverse="true"
          confirmText="扫码"
          cancelText="取消预约"
          @confirm="Scan"
          @cancel="
            PopShow = false;
            ReservateShow = true;
          "
          @close="PopShow = false"
        >
        </u-modal>
      </view>
    </view>
  </view>
</template>
<script>
import {
  UnfinishedReserve,
  GetUserDetail,
  CancelReserve,
  uploadImg,
  checkAvatar
} from "@/common/api.js";
import { baseUrl } from "../../common/config";
export default {
  onLoad() {
    this.init()
  },
  onShow() {
  	UnfinishedReserve().then((res) => {
  	  console.log("res", res);
  	  this.ReservationRoom = res.data;
  	});
  },
  data() {
    return {
      ChooseRoom: null,
      ReservationRoom: [],
      UserInfo: {
        AllOfTime: {
          url: "/static/iconfont/time.png",
          number: null,
          text: "练习总时长",
        },
        NumberOfReserves: {
          url: "/static/iconfont/yuyue.png",
          number: null,
          text: "预约总次数",
        },
        NumberOfLate: {
          url: "/static/iconfont/chidao.png",
          number: null,
          text: "迟到总次数",
        },
        NumberOfDefaults: {
          url: "/static/iconfont/weiyue.png",
          number: null,
          text: "违约总次数",
        },
      },
      RoomAvatar: "https://web-assets.dcloud.net.cn/unidoc/zh/unicloudlogo.png",
      Isteacher: false,
      sign: "",
      username: "",
      img: "/static/user.png",
      First: true,
      ReservateShow: false,
      PopShow: false,
    };
  },
  methods: {
	  init(){
	  	  GetUserDetail().then((res) => {
	  	    console.log("res", res);
	  	    this.username = getApp().globalData.username;
	  	    this.sign = res.data.Signature;
	  	    this.UserInfo.AllOfTime.number = res.data.lengthOfTime;
	  	    this.UserInfo.NumberOfReserves.number = res.data.reserveCount;
	  	    this.UserInfo.NumberOfLate.number = res.data.lateOfTime;
	  	    this.UserInfo.NumberOfDefaults.number = res.data.violationCount;
	  	  });
	  	  this.Isteacher = getApp().globalData.Isteacher;
	  	  this.username = getApp().globalData.username;
		  const number=getApp().globalData.number;
		  checkAvatar().then(res =>{
			  if(res.data===true)this.img="http://localhost:8088/EKKO-KING/upload/images/"+number+".jpg"
		  })
	  },	
    gotohistory() {
      uni.navigateTo({
        url: "/pages/history/history",
      });
    },
    changeimg() {
      uni.chooseImage({
        count: 1,
        success: (res) => {
          this.img = res.tempFilePaths[0];
		  let photo=new FormData()
		  photo.append('file',res.tempFiles[0])
		  uploadImg(res.tempFilePaths[0],photo).then(res=>{
			  this.init()
		  })
		  // uni.uploadFile({
			 //  url:'http://localhost:8088/EKKO-KING/api/upload/images',
			 //  filePath:res.tempFilePaths[0],
			 //  success:(res)=>{
				//   console.log('res',res);
			 //  }
		  // })
        },
      });
    },
    ChangeInput(e) {
      this.sign = e;
    },
    GotoBooking() {
      uni.navigateTo({
        url: "/pages/room/room",
      });
    },
    Reservate() {
      this.ReservateShow = true;
    },
    ReservateClose() {
      this.ReservateShow = false;
    },
    Scan() {
      this.PopShow = false;
	  getApp().globalData.reserve=this.ReservationRoom[this.ChooseRoom]
	  uni.navigateTo({
	  	url:'/pages/signIn/signIn'
	  })
      // #ifdef MP-WEIXIN
      uni.scanCode({
		  success:(res)=>{
			  
		  }
	  });
      // #endif
    },
    //取消对应的预约记录
    CancelTheReservation() {
		const beginTime=new Date(this.ReservationRoom[this.ChooseRoom].beginTime).getTime()
		const endTime=new Date(this.ReservationRoom[this.ChooseRoom].endTime).getTime()
      CancelReserve({
        beginTime: beginTime,
		endTime: endTime,	
        roomId: this.ReservationRoom[this.ChooseRoom].roomId,
      }).then(() => {
		  this.ReservateShow=false;
        //取消预约后调用后端接口更新预约信息
        UnfinishedReserve().then((res) => {
          console.log("res", res);
          this.ReservationRoom = res.data;
        });
      });
    },
    cardTime(index) {
      let n = new Date(this.ReservationRoom[index].beginTime);
      let month = n.getMonth() + 1;
      let day = n.getDate();
      let hour = n.getHours();
      let minutes = n.getMinutes();
      let arr = [
        "星期日",
        "星期一",
        "星期二",
        "星期三",
        "星期四",
        "星期五",
        "星期六",
      ];
      let num = n.getDay();
      return (
        month + "月" + day + "日" + hour + "时" + minutes + "分" + arr[num]
      );
    },
    getCondition(index) {
      let n = new Date(this.ReservationRoom[index].beginTime);
      let now = new Date();
      n = n.getTime();
      now = now.getTime();
      return now > n ? "进行中" : "未进行";
    },
  },
  computed: {},
};
</script>
<style lang="scss" scoped>
.test {
  background-color: #bfa;
}

// 用户信息
.user-info {
  position: relative;
  z-index: 1;
  display: flex;
  justify-content: center;
  width: 750rpx;
  height: 708rpx;
  background: linear-gradient(to top, #1d293c, #25354b);

  .hbg {
    position: absolute;
    width: 300rpx;
    height: 300rpx;
    top: 0;
    left: 0;
    z-index: 3;
  }

  .user-img {
    display: flex;
    position: absolute;
    top: 50rpx;
    left: 30rpx;

    .img {
      height: 150rpx;
      width: auto;
    }
  }

  .user-info-content {
    position: absolute;
    width: 620rpx;
    height: 568rpx;
    bottom: 0;
    z-index: 4;
  }

  .user-content {
    position: absolute;
    width: 620rpx;
    height: 568rpx;
    bottom: 0;
    z-index: 5;
    background-size: cover;
    border: none;
    border-radius: 20rpx 20rpx 0 0;
    font-size: 28rpx;
    padding: 0;
    text-align: center;
    line-height: 40rpx;
    font-weight: normal;
    font-style: normal;

    .user-text {
      text-align: left;
      width: 560rpx;
      height: 180rpx;
      position: absolute;
      top: 180rpx;
      left: 50rpx;
      z-index: 99;

      .user-name {
        font-weight: 400;
        font-size: 40rpx;
        color: #001432;
        font-style: normal;
        letter-spacing: 0;
        line-height: 60rpx;
        padding-bottom: 12rpx;
      }

      .user-brief {
        width: 550rpx;
        font-weight: 400;
        font-size: 24rpx;
        color: #757474;
        font-style: normal;
        line-height: 36rpx;
      }
    }

    .user-imgbox {
      height: 118rpx;
      margin-top: 70rpx;
      margin-bottom: 80rpx;

      .user-img {
        width: 118rpx;
        height: 118rpx;
        margin-left: 30rpx;
        overflow: hidden;
        border-radius: 30rpx;

        image {
          width: 118rpx;
          height: 118rpx;
        }
      }
    }
  }

  .view-circle {
    overflow: hidden;
    border-width: 0;
    border-style: solid;
    position: absolute;
    width: 750rpx;
    height: 300rpx;
    background: url(@/static/half-circle.png) no-repeat center;
    background-size: cover;
    bottom: 0;

    .view-circle-bg {
      width: 750rpx;
      height: 100%;
    }
  }

  .user-tabs {
    position: absolute;
    height: 120rpx;
    width: 610rpx;
    display: flex;
    z-index: 11;
    bottom: 120rpx;
    left: 90rpx;

    .tab-item {
      width: 284rpx;
      height: 112rpx;
      background-color: rgba(0, 20, 50, 0.04);
      border-radius: 8rpx;
      display: flex;
      justify-content: center;
      align-items: center;
      box-shadow: 10rpx 10rpx 20rpx rgba(0, 0, 0, 0.15),
        inset 15rpx 15rpx 10rpx rgba(255, 255, 255, 0.9),
        -10rpx -10rpx 20rpx rgba(255, 255, 255, 0.8),
        inset -2rpx -2rpx 10rpx rgba(0, 0, 0, 0.15);

      .badges {
        position: absolute;
        bottom: 70rpx;
        right: 215rpx;
        background-color: #f73c52;
        height: 36rpx;
        line-height: 36rpx;
        border-radius: 18rpx;
        padding: 0 14rpx;
        margin-left: 20rpx;
        color: #ffffff;
        font-size: 20rpx;

        &.left {
          right: 510rpx;
        }
      }

      .tab-svg {
        width: 40rpx;
        height: 40rpx;
        margin-right: 20rpx;
      }

      .tab-name {
        font-size: 32rpx;
        color: #001432;
        font-style: normal;
        letter-spacing: 0px;
        line-height: 20px;
        margin-left: 10rpx;

        &.left {
          margin-right: 10rpx;
        }
      }

      &.left {
        margin-right: 10rpx;
      }
    }
  }
}

.list {
  .ReservationRoom {
    width: 90%;
    margin-left: 5%;
    height: 20%;
    box-shadow: 15rpx 15rpx 30rpx rgba(0, 0, 0, 0.15),
      inset 15rpx 15rpx 10rpx rgba(255, 255, 255, 0.9),
      -15rpx -15rpx 30rpx rgba(255, 255, 255, 0.8),
      inset -2rpx -2rpx 10rpx rgba(0, 0, 0, 0.15);
  }

  .AllInfo {
    flex-wrap: wrap;
    margin: 25rpx;
    width: 700rpx;
    border-radius: 30rpx;
    box-shadow: 10rpx 10rpx 20rpx rgba(0, 0, 0, 0.15),
      inset 15rpx 15rpx 10rpx rgba(255, 255, 255, 0.9),
      -10rpx -10rpx 20rpx rgba(255, 255, 255, 0.8),
      inset -2rpx -2rpx 10rpx rgba(0, 0, 0, 0.15);
    border-radius: 10rpx;
    padding: 10rpx 0rpx;

    .Info {
      display: flex;
      width: 600rpx;
      align-items: center;
      justify-content: space-around;
      box-shadow: 15rpx 15rpx 30rpx rgba(0, 0, 0, 0.15),
        inset 15rpx 15rpx 10rpx rgba(255, 255, 255, 0.9),
        -15rpx -15rpx 30rpx rgba(255, 255, 255, 0.8),
        inset -2rpx -2rpx 10rpx rgba(0, 0, 0, 0.15);
      border-radius: 10rpx;
      margin: 30rpx 50rpx;
      padding: 20rpx;

      .icon {
        .AllOfTime {
          width: 120rpx;
          height: 120rpx;
        }

        .NumberOfReserves {
          width: 120rpx;
          height: 120rpx;
        }

        .NumberOfLate {
          width: 120rpx;
          height: 120rpx;
        }

        .NumberOfDefaults {
          width: 120rpx;
          height: 120rpx;
        }
      }

      .desc {
        color: rgba(0, 0, 0, 0.4);
        font-weight: bolder;
        font-size: 40rpx;
      }
    }
  }
}
</style>
