<template>
	<view class="cu-modal show">
		<view class="cu-dialog" style="width: 70%">
			<view class="cu-list menu-avatar margin-top">
				<view class="cu-avatar round lg" :style="'background-image:url(' + info.userImg + ');'"></view>
				<view class="text-black text-lg text-bold" style="padding-top: 10rpx">{{ info.userName }}</view>
				<view class="text-grey text-md margin-top">
					{{ info.motto }}
				</view>
			</view>
			<view style="height: 120rpx" v-if="state === 'Add'">
				<view style="margin-top: 140rpx">{{ info.wec }}</view>
			</view>
			<view class="cu-bar justify-center" style="margin-top: 20rpx;">
				<button class="cu-btn bg-black round" @tap="hideModal">{{state === 'Add' ? '复制' : '申请添加好友'}}</button>
			</view>
		</view>
	</view>
</template>

<script>
	import { friendRequest, getToken } from '@/utils/subscription.js'
	export default {
		props: {
			info: {
				type: Object,
				default: function() {
					return {}
				}
			},
			state: {
				type: String,
				default: 'Info'
			}
		},
		data() {
			return { btnName: '申请添加好友', }
		},
		methods: {
			async hideModal() {
				if (this.state === 'Info') {
					let info = { text: '交个朋友咯', }
					let res = await friendRequest(info)
					console.log('结果：', res.result)
					if (res.result.data.errcode === 42001) { //token过期
						await getToken()
						this.hideModal()
					} else {
						uni.showToast({
							icon: 'none',
							title: '好友申请已发送',
							duration: 2000
						})
					}
				} else {
					uni.setClipboardData({ data: this.info.wec })
					console.log('复制成功')
				}
				this.$emit('close')
			}
		}
	}
</script>

<style>
</style>