<template>
	<view>
		<u-modal style="align-items: center;text-align: center;" show title="签到" content="点击确认返回主页" @confirm="confirm"></u-modal>
	</view>
</template>

<script>
	import {signIn} from '@/common/api.js'
	export default {
		onLoad() {
			const reserve=getApp().globalData.reserve
			signIn(reserve).then(res=>{
				console.log('res',res);
			})
		},
		data() {
			return {
			}
		},
		methods: {
			confirm(){
				uni.navigateBack()
			}	
		}
	}
</script>

<style>

</style>
