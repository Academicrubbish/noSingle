<template>
	<view class="">
		<view class="cu-list menu-avatar card-menu" :style="'margin-top: ' + CustomBar + 'px;'">
			<view class="cu-item" style="height: 180rpx">
				<view class="cu-avatar round lg" :style="'background-image:url(' + imageUrl + ');'"></view>
				<view class="content">
					<view class="text-bold text-black">{{ userData.userName }}</view>
					<view class="text-grey text-sm flex">
						<text class="text-cut margin-right-xs">- {{ userData.motto }} -</text>
					</view>
				</view>
				<view class="action" style="width: 120rpx">
					<button class="cu-btn round bg-gray shadow" @tap="go" id="0">编辑</button>
				</view>
			</view>
		</view>
		<view class="cu-list menu sm-border card-menu" style="margin-top: 50rpx;">
			<view class="cu-item arrow">
				<button class="cu-btn content" open-type="share">
					<text class="cuIcon-forwardfill text-red"></text>
					<text class="text-grey">推荐给小伙伴</text>
				</button>
			</view>
			<view class="cu-item arrow" @tap="go" id="1">
				<view class="content">
					<text class="cuIcon-favorfill text-orange"></text>
					<text class="text-grey">更新日志</text>
				</view>
			</view>
			<view class="cu-item arrow" @tap="go" id="2">
				<view class="content">
					<text class="cuIcon-group_fill text-yellow"></text>
					<text class="text-grey">开发人员</text>
				</view>
			</view>
			<view class="cu-item arrow">
				<button class="cu-btn content" open-type="contact">
					<text class="cuIcon-communityfill text-olive  "></text>
					<text class="text-grey">反馈</text>
				</button>
			</view>
		</view>

		<view class="cu-list menu sm-border card-menu" style="margin-top: 50rpx;">
			<view class="cu-item arrow" @tap="support">
				<view class="content">
					<text class="cuIcon-appreciatefill text-green"></text>
					<text class="text-grey">赞赏支持</text>
				</view>
			</view>
			<view class="cu-item arrow" @tap="go" id="3">
				<view class="content">
					<text class="cuIcon-activityfill text-cyan"></text>
					<text class="text-grey">关于 ~</text>
				</view>
			</view>
		</view>

		<!-- 赞赏弹窗 -->
		<modal v-if="modalHidden" @confirm="modalConfirm" @cancel="modalConfirm">
			<view>
				<image class="image"
					src="https://mp-5fc3399c-71f2-453e-9bd6-c6e3f1dfe625.cdn.bspapp.com/cloudstorage/20cdb702-45c6-4644-98bc-e5b949ff27fc.png">
				</image>
			</view>
		</modal>

		<view class="text-center text-grey text-sm animation-slide-bottom"
			style="position:fixed;bottom:25rpx;left: 0;right: 0;animation-delay: 0.75s;">
			<view>No Singles {{version}}</view>
			<view>信科院 软工1904班 袁创 个人作品</view>
		</view>
	</view>
</template>

<script>
	import { clickSubscribeMessage } from '@/utils/subscription.js'
	import store from '@/store'
	export default {
		data() {
			return {
				CustomBar: this.CustomBar,
				userData: store.state.userData,
				imageUrl: 'https://mp-9847d52b-c6c5-4f56-ab2e-f859c88cbb87.cdn.bspapp.com/cloudstorage/aafad545-f978-4dc2-a4c9-8c836f81da28.jpg',
				openPath: ['/pages_other/userData/userData', '/pages_other/changelog/changelog',
					'/pages_other/developer/developer', '/pages_other/process/process'
				],
				modalHidden: false,
				version: '1.0.0',
				tmplIds: [
					'wGNuQrVoN_yVT_m-XRT7otrUqQ8iuMKkSiVf_oWyLSo',
					'rsX6vl7VBaVVoOrg9Ud9quXH21xthSF7hNhJ0LrWuQk',
					'IGqdyz6iY8JEsnXDeYnbBlDx4FJjQj42pV6knmcknlM'
				]
			}
		},
		onLoad() {
			let that = this
			const accountInfo = uni.getAccountInfoSync()
			that.version = accountInfo.miniProgram.version
			if (store.state.userData.userImg !== '') {
				that.imageUrl = store.state.userData.userImg
			}
			uni.showModal({
				title: '授权提醒',
				content: '请授权消息订阅功能，以便为您提供消息推送服务',
				cancelText: '取消授权',
				confirmText: '确认授权',
				success(res) {
					if (res.confirm) {
						that.subScriptionMessage()
					}
				}
			})
		},
		methods: {
			//授权消息推送服务
			subScriptionMessage() {
				var that = this
				uni.requestSubscribeMessage({
					tmplIds: that.tmplIds,
					success(res) {
						if (JSON.stringify(res).indexOf('reject') != -1) {
							console.log('拒绝')
						}
						if (JSON.stringify(res).indexOf('accept') != -1) {
							console.log('接受')
							uni.getSetting({
								withSubscriptions: true,
								success(res) {
									let obj = Object.keys(res.subscriptionsSetting)
									if (!res.subscriptionsSetting.mainSwitch) {
										uni.showToast({
											icon: 'none',
											title: '请去 "设置-消息订阅" 开启消息通知',
											duration: 2000
										})
									} else {
										if (obj.includes(that.tmplIds[0]) && obj.includes(that.tmplIds[1]) && obj.includes(that
												.tmplIds[2])) {
											uni.showToast({
												icon: 'none',
												title: '您已经设置了总是提醒了哟',
												duration: 2000
											})
											uni.setStorageSync('checkFlag', true)
											return
										}
									}
								}
							})
						}
					},
					fail(res) {
						console.log(res)
					}
				})
			},
			//前往子页面
			go(option) {
				clickSubscribeMessage()
				uni.navigateTo({ url: this.openPath[option.currentTarget.id] })
			},
			/**
			 * 显示弹窗
			 */
			support() {
				clickSubscribeMessage()
				this.modalHidden = true
			},
			//点击确认和取消
			modalConfirm() {
				clickSubscribeMessage()
				this.modalHidden = false
			},
		}
	}
</script>

<style lang="scss">
	.cu-list.menu-avatar>.cu-item {
		background-color: #e7ebed;
	}

	page {
		background-color: #e7ebed;
	}

	.image {
		width: 600rpx;
		height: 817rpx;
	}
</style>