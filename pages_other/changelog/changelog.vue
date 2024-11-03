<template>
	<view class="changelog">

		<cu-custom bgColor="bg-black" :isBack="true">
			<view slot="backText">返回</view>
			<view slot="content">更新日志</view>
		</cu-custom>

		<view class="cu-timeline padding-left-sm" v-for="(item,index) in logList" :key="index">
			<view class="cu-time">{{item.date}}</view>
			<view class="cu-item">
				<view class="content">
					<view class="cu-capsule radius">
						<view class="cu-tag" :class="'bg-'+ item.color">{{item.period}}</view>
						<view class="cu-tag " :class="'line-'+ item.color">{{item.time}}</view>
					</view>
					<view class="margin-top">
						{{item.content}}
					</view>
				</view>
			</view>
		</view>

	</view>
</template>

<script>
	const db = uniCloud.database() //创建数据库连接
	export default {
		data() {
			return { logList: [] }
		},
		onLoad() {
			this.databaseFunc()
		},
		methods: {
			//云数据库用户表新增
			databaseFunc() {
				db.collection('changelog')
					.orderBy('date', 'desc') //按照时间，降序查询 参考文档https://uniapp.dcloud.net.cn/uniCloud/jql.html#order-by
					.get()
					.then(res => {
						res.result.data.forEach(item => {
							let product = item
							product.color = this.bgColor(item.period)
							this.logList.push(product)
						})
						console.log(this.logList)
					})
			},
			bgColor(period) {
				let color = ''
				switch (period) {
					case '上午':
						color = 'olive'
						break
					case '下午':
						color = 'cyan'
						break
					case '傍晚':
						color = 'blue'
						break
					case '凌晨':
						color = 'purple'
						break
				}
				return color
			}
		}
	}
</script>

<style>
	page {
		background-color: white;
	}
</style>