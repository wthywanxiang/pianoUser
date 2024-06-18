<template>
  <view class="wapper">
    <u-skeleton
      :loading="Loading"
      :animate="true"
      :rows="2"
      v-for="item in 11"
      :key="item"
    >
    </u-skeleton>
    <view class="Rank" v-if="!Loading">
      <view class="Subsection">
        <tn-subsection
          class="GradeList"
          buttonColor="#191D24"
          :list="GradeList"
          :bold="true"
          @change="GradeChange"
          inactiveColor="#5E625A"
          activeColor="#92974C"
        >
        </tn-subsection>
      </view>
      <view class="RankTop">
        <view v-for="(item, index) in TopData" :key="index">
          <view class="AdjustTopData" v-if="index === 0">
            {{ item }}
          </view>
          <view class="Avatar" v-else-if="index === 2">
            {{ item }}
          </view>
          <view class="TopData" v-else>
            {{ item }}
          </view>
        </view>
      </view>
      <view
        class="TopList"
        :style="'height:' + Height"
        :class="index % 2 == 0 ? 'TopO' : 'TopJ'"
        v-for="(item, index) in topten[Grade]"
        :key="index"
      >
        <view class="Student">
          <view class="Adjust" :style="'line-height:' + Height">
            <text>{{ index + 1 }}</text>
          </view>
			<view class="Attribute info">
				{{item.clazz}}
			</view>
			<view class="Avatar info">
				<text class="text">{{item.name}}</text>
				<tn-avatar
				  style="display: flex"
				  :src="getAvatar(item)"
				></tn-avatar>
			</view>
			<view class="Attribute info">
				<text>{{item.detail.violationCount?item.detail.violationCount:0}}</text>
			</view>
			<view class="Attribute info">
				<text>{{item.detail.lengthOfTime+'小时'}}</text>
			</view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { TopTen } from "@/common/api.js";
export default {
  onLoad() {
    uni.getSystemInfo({
      success: (res) => {
        this.ScreenHeight = res.screenHeight;
      },
    });
    TopTen().then((res) => {
      this.topten=res.data
	   this.Loading = false;
    });
  },
  data() {
    return {
      rankData: [
        {
          user: {
            nickname: "张三",
            avatar: "/static/logo.png",
          },
          data: 3,
        },
      ],
      Skeleton: true,
      Grade: 0,
      GradeList: ["全部年级", "2019级", "2020级", "2021级", "2022级"],
      Isteacher: false,
      topten: null,
      TopData: ["排名", "班级", "姓名", "违约", "时长"],
      ScreenHeight: 0,
	  Loading:true
    };
  },
  methods: {
    gotobooking() {
      uni.navigateTo({
        url: "/pages/room/room",
      });
    },
    GradeChange(index) {
      this.Grade = index.index;
      console.log("Grade", this.Grade);
    },
	getAvatar(item){
		if(item.avatar)return "http://localhost:8088/EKKO-KING/upload/images/"+item.sno+".jpg"
		return "https://tnuiimage.tnkjapp.com/avatar/xiaomai1.jpg"
	}
  },
  computed: {
    Height() {
      let height = this.ScreenHeight * 0.17;
      return height + "rpx;";
    },
  },
};
</script>

<style lang="scss">
.wapper {
  .Rank {
    .Subsection {
      background-color: #191d24;
    }

    .GradeList {
      background-color: #191d24;
    }

    .RankTop {
      display: flex;
      justify-content: space-around;
      background-color: #202831;
      color: #b2aea7;
      font-weight: 700;
      text-align: center;

      .TopData {
        border-right: 1rpx #202831 solid;
        width: 162rpx;
      }

      .Avatar {
        width: 184rpx;
      }

      .AdjustTopData {
        width: 80rpx;
      }
    }

    .TopList {
      .Student {
        display: flex;
        justify-content: space-around;
        color: rgb(255, 255, 255);
        text-align: center;
        box-shadow: 10rpx 10rpx 20rpx rgba(255, 255, 255, 0.15),
          inset 15rpx 15rpx 10rpx rgba(0, 0, 0, 0.9),
          -10rpx -10rpx 20rpx rgba(0, 0, 0, 0.8),
          inset -2rpx -2rpx 10rpx rgba(255, 255, 255, 0.15);
		.info{
			display: flex;
			align-items: center;
			justify-content: space-around;
		}
        .Attribute {
          width: 162rpx;
          overflow: hidden;
        }

        .Adjust {
          width: 80rpx;
          overflow: hidden;
        }

        .Avatar {
          width: 184rpx;
          overflow: auto;
		  .text{
			  width: 70rpx;
		  }
        }
      }
    }

    .TopO {
      background-color: #161a20;
    }

    .TopJ {
      background-color: #1a2026;
    }
  }
}
</style>
