<template>
	<view class="talk">

		<user-info v-if="index" :info="info" @close="closeInfo"></user-info>

		<view class="add-btn bg-gradual-blue" @click="add">
			<text class="cuIcon-add"></text>
		</view>

		<!-- 点击出现底部弹窗 -->
		<view :class="'cu-modal ' + (other_popup ? 'show' : '')" @tap="other_popup = false">
			<view class="cu-dialog" style="width: 70%" catchtap>
				<view class="cu-form-group" @tap="">发送好友申请 </view>
				<view class="cu-form-group" v-if="otherForm.openid == openid" @tap="delTalk"> 删除分享</view>
			</view>
		</view>

		<!-- 点击出现input框 -->
		<view class="inputbox" v-if="isShowInput">
			<input placeholder=" 打个招呼咯" v-model="replyInput" focus="auto" />
			<view style="height: 110rpx; width: 170rpx; display: flex; align-items: center; justify-content: center">
				<button size="mini" @tap="toReply">发送</button>
			</view>
		</view>

		<z-paging ref="paging" v-model="list" @query="queryList" @touchmove.stop>
			<cu-custom slot="top" bgColor="bg-custom-color">
				<view slot="content">讨论区</view>
			</cu-custom>
			<view v-for="(item, index) in list" :key="index">
				<view class="cu-card dynamic">
					<view class="cu-item shadow" style="margin-bottom: 0">
						<!-- 留言用户信息 -->
						<view class="cu-list menu-avatar">
							<view class="cu-item">
								<view class="cu-avatar round lg" :style="'background-image:url(' + item.userData.userImg + ');'"
									@click="showInfo(item.userData)"></view>
								<view class="content flex-sub">
									<view>{{ item.userData.userName }}</view>
									<view class="text-gray text-sm flex justify-between">
										{{ item.createTime }}
									</view>
								</view>
								<view class="action" style="padding-bottom: 40rpx;z-index: 99;" @click="otherPopup(item)">
									<text class="cuIcon-more text-gray" style="font-size: 40rpx;" />
								</view>
							</view>
						</view>
						<!-- 留言内容 -->
						<view class="text-content">
							{{ item.content }}
						</view>
						<!-- 图片展示 -->
						<view class="grid flex-sub padding-lr col-3 grid-square" v-if="item.contentImgList.length">
							<view class="bg-img" @click="ViewImage" :data-url="item.contentImgList" :id="index"
								v-for="(image, cindex) in item.contentImgList" :key="cindex">
								<image :src="image" mode="aspectFill">
							</view>
						</view>
						<!-- 点赞和回复 -->
						<view class="text-xxl text-right padding">
							<text :class=" 'text-' + (item.praiseList.indexOf(openid) !== -1 ? 'red' : 'gray') + 
								' cuIcon-' + (item.praiseList.indexOf(openid) !== -1  ? 'appreciatefill' : 'appreciate') + 
								' margin-right-lg'" @click="praise" :data-id="item._id" :data-list="item.praiseList" />
							<text class="text-gray cuIcon-comment margin-left-lg" @click="showInput" :data-id="item._id"
								:data-list="item.replyList" />
						</view>
						<!-- 点赞和回复简略数据展示 -->
						<view class="text-lg text-left padding solid-top">
							<view class="text-blue cuIcon-appreciatefill margin-right-xs">{{ item.praiseList.length }}</view>
							<view class="text-orange cuIcon-commentfill margin-right-xs" @click="replyStatus" :data-index="index"
								:data-id="item._id">
								{{item.replyList.length}}条评论回复
							</view>
						</view>
						<!-- 回复详情展示 -->
						<view class="cu-list menu-avatar comment solids-top" v-if="reply_status[index]">
							<!-- 长按弹窗 -->
							<view :class="'cu-modal ' + (reply_popup ? 'show' : '')" @tap="reply_popup = false">
								<view class="cu-dialog" style="width: 70%" catchtap>
									<view class="cu-form-group" @tap="showInput" :data-id="item._id" :data-list="item.replyList">
										@{{ reply_name }}
									</view>
									<view class="cu-form-group" v-if="reply_openid == openid" @tap="delReply" :data-list="item.replyList"
										:data-id="item._id">
										撤回</view>
								</view>
							</view>

							<view class="cu-item solid-top" v-for="(citem, cindex) in item.replyList" :key="cindex">
								<view class="cu-avatar round" :style="'background-image:url(' + citem.imageurl + ');'"></view>
								<view class="content" @longpress="longPress" :data-index="cindex" :data-openid="citem.openid"
									:data-name="citem.name">
									<view class="text-grey">{{ citem.name }}</view>
									<view class="text-gray text-content text-df">
										{{ citem.content }}
									</view>
									<view class="margin-top-sm flex justify-between">
										<view class="text-gray text-df">{{ citem.time }}</view>
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</z-paging>
	</view>
</template>

<script>
	import userInfo from '@/components/userInfo'
	const db = uniCloud.database() //创建数据库连接
	import store from '@/store'
	import { nowtime } from '@/utils/utils'
	export default {
		components: { userInfo },
		data() {
			return {
				index: 0,
				info: {},
				other_popup: false,
				otherForm: {
					id: '',
					openid: '',
					imgList: []
				},
				list: [],
				openid: store.state.openid,
				isShowInput: false,
				reply_popup: false,
				reply_id: '',
				replyInput: '',
				reply_list: [],
				reply_status: [],
				reply_name: '',
				reply_openid: '',
				reply_index: 0
			}
		},
		methods: {
			showInfo(data) {
				this.info = data
				this.index = 1
			},
			closeInfo() {
				this.index = 0
			},
			delTalk() {
				this.other_popup = false
				let that = this
				uni.showModal({
					title: '提示',
					content: '确定要删除分享吗？',
					success(res) {
						if (res.confirm) {
							if (that.otherForm.imgList.length) {
								uniCloud.callFunction({
									name: 'delImage',
									data: { imgList: that.otherForm.imgList }
								})
							}
							db.collection('talk')
								.doc(that.otherForm.id)
								.remove()
								.then(res => {
									that.$refs.paging.refresh()
								})
						}
					}
				})
			},
			otherPopup(item) {
				this.otherForm.id = item._id
				this.otherForm.imgList = item.contentImgList
				this.otherForm.openid = item._openid
				this.other_popup = true
			},
			add() {
				uni.navigateTo({ url: '/pages_other/editing/editing' })
			},
			queryList(pageNo, pageSize) {
				db.collection('talk')
					.orderBy('createTime', 'desc') //按照时间，降序查询 参考文档https://uniapp.dcloud.net.cn/uniCloud/jql.html#order-by
					.skip((pageNo - 1) * pageSize) //跳过多少条数据
					.limit(pageSize) //读取多少条数据					
					.get() //获取数据表的信息
					.then(res => {
						this.$refs.paging.complete(res.result.data)
						this.reply_status = new Array(res.result.data.length).fill(0)
					}).catch(err => {
						this.$refs.paging.complete(false)
					})
			},
			//展示图片
			ViewImage(e) {
				uni.previewImage({
					urls: e.currentTarget.dataset.url,
					current: e.currentTarget.dataset.url[e.currentTarget.id]
				})
			},
			//点赞
			praise(e) {
				let list = e.currentTarget.dataset.list
				//1.先判断用户是否点过赞，如果点过，就取消点赞；没点过就点赞
				if (list.indexOf(store.state.openid) === -1) { //没点过赞
					list = list.concat(store.state.openid)
				} else {
					list.splice(list.indexOf(store.state.openid), 1)
				}
				db.collection('talk')
					.where({ _id: e.currentTarget.dataset.id })
					.update({ praiseList: list })
					.then(res => {
						//刷新列表数据，但不重置。牛逼坏了，真的。参考文档地址：https://z-paging.zxlee.cn/api/methods/main.html#%E6%95%B0%E6%8D%AE%E5%88%B7%E6%96%B0-%E5%A4%84%E7%90%86%E6%96%B9%E6%B3%95
						this.$refs.paging.refresh()
					})
					.catch(err => {
						uni.showToast({
							title: '点赞失败，请稍后再试',
							icon: 'error',
							position: 'center',
							duration: 1000
						})
					})
			},
			//显示输入框
			showInput(e) {
				this.replyInput = ''
				this.reply_id = e.currentTarget.dataset.id
				this.reply_list = e.currentTarget.dataset.list
				if (this.reply_popup) {
					this.isShowInput = true
					this.replyInput = '@' + this.reply_name + ' '
					this.reply_popup = false
				} else {
					this.isShowInput = !this.isShowInput
				}
			},

			toReply() {
				if (this.replyInput.trim() === '') {
					uni.showToast({
						icon: 'none',
						title: '内容不能为空'
					})
				} else {
					this.isShowInput = false
					let product = {
						openid: store.state.openid,
						name: store.state.userData.userName,
						imageurl: store.state.userData.userImg,
						time: nowtime('yyyy-MM-dd hh:mm:ss'),
						content: this.replyInput.trim()
					}
					this.reply_list = this.reply_list.concat(product)
					db.collection('talk')
						.where({ _id: this.reply_id })
						.update({ replyList: this.reply_list })
						.then(res => {
							this.$refs.paging.refresh()
						})
				}
			},
			replyStatus(e) {
				if (this.reply_status[e.currentTarget.dataset.index]) {
					this.$set(this.reply_status, e.currentTarget.dataset.index, 0)
				} else {
					this.$set(this.reply_status, e.currentTarget.dataset.index, 1)
				}
			},
			longPress(e) {
				this.reply_popup = true
				this.reply_openid = e.currentTarget.dataset.openid
				this.reply_name = e.currentTarget.dataset.name
				this.reply_index = e.currentTarget.dataset.index
			},
			delReply(e) {
				this.reply_list = e.currentTarget.dataset.list
				this.reply_id = e.currentTarget.dataset.id
				uni.showModal({
					title: '提示',
					content: '确定要撤回吗？'
				}).then(res => {
					if (res.confirm) {
						this.reply_list.splice(this.reply_index, 1)
						db.collection('talk')
							.where({ _id: this.reply_id })
							.update({ replyList: this.reply_list })
							.then(res => {
								this.$refs.paging.refresh()
								this.reply_popup = false
							})
					}
				})
			},
		}
	}
</script>

<style lang="scss">
	.talk {
		height: 100vh;
		position: relative;

		.add-btn {
			height: 100rpx;
			width: 100rpx;
			border-radius: 50rpx;
			text-align: center;
			line-height: 100rpx;
			color: white;
			font-size: 50rpx;
			font-weight: bold;
			position: absolute;
			bottom: 80rpx;
			right: 50rpx;
			z-index: 99;
		}

		.item {
			padding: 50rpx;
			margin-top: 50rpx;
			background-color: white;
			text-align: center;
		}
	}

	.inputbox {
		position: fixed;
		bottom: 0;
		width: 100%;
		height: 100rpx;
		background-color: #fff;
		z-index: 99;
	}

	.inputbox input {
		position: absolute;
		width: 76%;
		height: 70rpx;
		left: 24rpx;
		top: 15rpx;
		background-color: #fff;
	}

	.inputbox button {
		position: absolute;
		width: 17%;
		height: 60rpx;
		right: 10rpx;
		top: 20rpx;
		background-color: #666666;
		color: white;
	}
</style>