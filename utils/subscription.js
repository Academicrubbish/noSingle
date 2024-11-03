const db = uniCloud.database() //创建数据库连接
import { nowtime } from './utils.js'
import store from '@/store'

//将token存入数据库，过期再申请
export function getToken() {
	uniCloud.callFunction({ name: 'getToken' }).then(res => {
		console.log(111)
		db.collection('Token').doc('649e6de8819ce829d30a0e72').update({ token: res.result.data.access_token })
	})
}

//好友申请
export async function friendRequest(info) {
	let getToken = await db.collection('Token').get()
	let access_token = getToken.result.data[0].token
	let data = {
		'touser': store.state.openid,
		'template_id': 'wGNuQrVoN_yVT_m-XRT7otrUqQ8iuMKkSiVf_oWyLSo',
		'data': {
			'thing1': { 'value': store.state.userData.userName },
			'time2': { 'value': nowtime('yyyy年MM月dd hh:mm') },
			'thing4': { 'value': '该用户近一月以来申请次数：20' },
			'thing5': { 'value': info.text }
		},
	}
	return uniCloud.callFunction({
		name: 'pushNotification',
		data: {
			access_token: access_token,
			data: data
		},
	})
}

//讨论区回复提醒
export async function template_two() {
	let getToken = await db.collection('Token').get()
	let access_token = getToken.result.data[0].token
	let data = {
		'touser': store.state.openid,
		'template_id': 'rsX6vl7VBaVVoOrg9Ud9quXH21xthSF7hNhJ0LrWuQk',
		'data': {
			'thing1': { 'value': store.state.userData.userName }, //文章标题
			'thing6': { 'value': '该用户近一月以来申请次数：20' }, //留言人
			'date4': { 'value': nowtime('yyyy年MM月dd hh:mm') }, //留言时间
			'thing5': { 'value': info.text } //留言内容
		},
	}
	return uniCloud.callFunction({
		name: 'pushNotification',
		data: {
			access_token: access_token,
			data: data
		},
	})
}

//系统通知
export async function template_thr() {
	let getToken = await db.collection('Token').get()
	let access_token = getToken.result.data[0].token
	let data = {
		'touser': store.state.openid,
		'template_id': 'IGqdyz6iY8JEsnXDeYnbBlDx4FJjQj42pV6knmcknlM',
		'data': {
			'thing1': { 'value': store.state.userData.userName }, //公告名称
			'time2': { 'value': nowtime('yyyy年MM月dd hh:mm') }, //发送时间
			'thing3': { 'value': '该用户近一月以来申请次数：20' }, //公告内容
			'thing4': { 'value': info.text } //温馨提示
		},
	}
	return uniCloud.callFunction({
		name: 'pushNotification',
		data: {
			access_token: access_token,
			data: data
		},
	})
}

//在用户必点的地方，调用订阅消息方法
export function clickSubscribeMessage() {
	let flag = uni.getStorageSync('checkFlag');
	//订阅消息
	if (flag) {
		uni.requestSubscribeMessage({
			tmplIds: [
				'wGNuQrVoN_yVT_m-XRT7otrUqQ8iuMKkSiVf_oWyLSo',
				'rsX6vl7VBaVVoOrg9Ud9quXH21xthSF7hNhJ0LrWuQk',
				'IGqdyz6iY8JEsnXDeYnbBlDx4FJjQj42pV6knmcknlM'
			],
			success(res) {
				uni.showToast({
					icon: 'none',
					title: '订阅成功',
					duration: 2000
				});
				console.log(res);
			},
			fail(err) {
				console.log(err);
			}
		})
	}
}