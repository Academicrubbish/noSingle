<template>
	<view class="process" :class="!shadow? 'bg-black-plus' : 'bg-white'">

		<cu-custom :bgColor="!shadow? 'bg-black-plus' : 'bg-white'" :isBack="true">
			<view slot="backText"></view>
			<view slot="content"></view>
		</cu-custom>

		<view class="process_top margin-lr padding-tb-lg padding-lr-sm">
			<view class="flex-sub">
				<switch class="switch-sex" @change="SetShadow" style="transform:scale(1.2)" />
			</view>
			<view class="center-flex">
				<image src="../../static/open/me.jpg" />
				<text>吾先生12312312123123123</text>
			</view>
			<view class="flex-sub text-gray text-xl text-right">
				<text class="cuIcon-appreciatefill margin-lr-sm"></text>20
				<text class="cuIcon-messagefill margin-lr-sm"></text>30
			</view>
		</view>

		<swiper class="process_swiper" :indicator-dots="false" duration="500" @change="cardSwiper">
			<swiper-item v-for="(item,index) in contentList" :key="index" :class="cardCur==index?'cur':''">
				<view class="swiper_card margin-lr padding-lg shadow-lg" :class="!shadow? 'card_bg_moon' : 'card_bg_sun'">
					<view v-if="item.contentList[0] === '分享你的故事'" class="card_position">
						<text class="position_item">{{item.contentList[0]}}</text>
						<text class="cuIcon-add position_icon" @click="addStory"></text>
					</view>
					<view v-else class="card_item">
						<view v-if="item._id === '6481f95809e298a2391fe118'" class="text-center text-lg text-grey">
							关于No Singles</view>
						<view class="margin-top-sm text-content" v-for="(citem,cindex) in item.contentList" :key="cindex">
							<text v-if="citem === '(B站搜BV1BP4y1F7Z6)'" :selectable="true" :user-select="true">{{citem}}</text>
							<text v-else>{{citem}}</text>
						</view>
					</view>
				</view>
			</swiper-item>
		</swiper>

		<view class="process_bottom text-xs text-gray animation-slide-bottom">
			<view>
				致谢 B站 陈一枝
			</view>
		</view>

	</view>
</template>

<script>
	const db = uniCloud.database() //创建数据库连接
	export default {
		data() {
			return {
				shadow: false,
				contentList: [],
				cardCur: 0
			}
		},
		onLoad() {
			this.databaseFunc()
		},
		methods: {
			SetShadow(e) {
				this.shadow = e.detail.value
				if (this.shadow) {

				}
			},
			addStory() {
				console.log(111)
			},
			// cardSwiper
			cardSwiper(e) {
				this.cardCur = e.detail.current
			},
			//云数据库用户表新增
			databaseFunc() {
				db.collection('process')
					.get()
					.then(res => {
						let arr = res.result.data
						this.contentList = [...arr.slice(0, 2), ...arr.slice(2).reverse()]
					})
			}
		}
	}
</script>
<style lang="scss" scoped>
	.process {
		height: 100vh;

		.process_top {
			display: flex;
			align-items: center;

			.switch-sex::before {
				content: "\e67b";
			}

			.switch-sex::after {
				content: "\e67c";
			}

			.center-flex {
				flex: 2;
				overflow: hidden;
				white-space: nowrap;
				text-overflow: ellipsis;

				image {
					display: inline-block;
					vertical-align: middle;
					width: 60rpx;
					height: 60rpx;
					border-radius: 60rpx;
					margin-right: 20rpx;
				}

				text {
					line-height: 60rpx;
				}
			}
		}

		.process_swiper {
			height: 1120rpx;

			.card_bg_moon {
				background-image: linear-gradient(45deg, #3a3c39, #273539);
				color: #fff;
			}

			.card_bg_sun {
				background-image: linear-gradient(45deg, #CCFFFF, #99CCFF);
				color: #000;
			}

			.swiper_card {
				height: 100%;
				border-radius: 20rpx;

				.card_item {
					height: calc(100% - 40rpx);
					overflow: auto;
					margin: 20rpx 0;
				}

				.card_position {
					height: 100%;
					position: relative;

					.position_item {
						position: absolute;
						top: 30%;
						left: 50%;
						transform: translateX(-50%);
					}

					.position_icon {
						position: absolute;
						top: 50%;
						left: 50%;
						transform: translate(-50%, -50%);
						font-size: 160rpx;
					}
				}
			}
		}

		.process_bottom {
			animation-delay: 0.5s;
			position: fixed;
			bottom: 100rpx;
			width: 100%;
			text-align: center;
		}
	}
</style>