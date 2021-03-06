import { extend } from 'ModelUtils'
import { Modal } from 'antd'

const prefix = 'annualVerification'

export default extend({

  namespace: `${prefix}Store`,

  state: {
    page: {
      pageNo: 0,
      pageSize: 10,
      totalCount: 0,
      dataList: [],
    },

    dataSource: [],
    // 是否跳转页面
    pageState: false,
    // 跳转哪种页面(新增，修改，详情，分页  默认分页)
    res: 'annualVerification',
    synthesizeFileList: [],
    drivingLicenseFileList: [],
    taximeterFileList: [],
  },

  reducers: {
    queryPageSuccess(state, { page = {
      pageNo: 0,
      pageSize: 10,
      totalCount: 0,
      dataList: [],
    } }) {
      return { ...state, page, pageState: false }
    },
    // 异步跳转页面
    toAdd(state, action) {
      return { ...state,
        pageState: true,
        res: action.res,
        synthesizeFileList: [],
        synthesizeFile: '',
        drivingLicenseFileList: [],
        drivingLicenseFile: '',
        taximeterFileList: [],
        taximeterFile: '' }
    },
    toEdit(state, action) {
      let plateList = []
      if (action.annualVerification.plateImage != null) {
        plateList = [{ uid: 0, url: UPLOAD_URL + action.annualVerification.plateImage, status: 'done' }]
      }
      let synthesizeList = []
      if (action.annualVerification.synthesizeFile != null) {
        synthesizeList = [{ uid: 0, url: UPLOAD_URL + action.annualVerification.synthesizeFile, status: 'done' }]
      }
      let drivingLicenseList = []
      if (action.annualVerification.drivingLicenseFile != null) {
        drivingLicenseList = [{ uid: 0, url: UPLOAD_URL + action.annualVerification.drivingLicenseFile, status: 'done' }]
      }
      let taximeterList = []
      if (action.annualVerification.taximeterFile != null) {
        taximeterList = [{ uid: 0, url: UPLOAD_URL + action.annualVerification.taximeterFile, status: 'done' }]
      }

      return { ...state,
        pageState: true,
        res: action.res,
        annualVerification: action.annualVerification,
        plateList,
        synthesizeFileList: synthesizeList,
        synthesizeFile: '',
        drivingLicenseFileList: drivingLicenseList,
        drivingLicenseFile: '',
        taximeterFileList: taximeterList,
        taximeterFile: '' }
    },
    toInfo(state, action) {
      let plateList = []
      if (action.annualVerification.plateImage != null) {
        plateList = [{ uid: 0, url: UPLOAD_URL + action.annualVerification.plateImage, status: 'done' }]
      }
      let synthesizeList = []
      if (action.annualVerification.synthesizeFile != null) {
        synthesizeList = [{ uid: 0, url: UPLOAD_URL + action.annualVerification.synthesizeFile, status: 'done' }]
      }
      let drivingLicenseList = []
      if (action.annualVerification.drivingLicenseFile != null) {
        drivingLicenseList = [{ uid: 0, url: UPLOAD_URL + action.annualVerification.drivingLicenseFile, status: 'done' }]
      }
      let taximeterList = []
      if (action.annualVerification.taximeterFile != null) {
        taximeterList = [{ uid: 0, url: UPLOAD_URL + action.annualVerification.taximeterFile, status: 'done' }]
      }
      return { ...state,
        pageState: true,
        res: action.res,
        annualVerification: action.annualVerification,
        plateList,
        synthesizeFileList: synthesizeList,
        drivingLicenseFileList: drivingLicenseList,
        taximeterFileList: taximeterList }
    },
    toPage(state, { dataSource }) {
      return { ...state, dataSource, pageState: false }
    },

    synthesizeFileChange(state, { synthesizeFileList }) {
      return { ...state, synthesizeFileList, synthesizeFile: synthesizeFileList.length >= 1 ? synthesizeFileList[0].response : '' }
    },
    drivingLicenseFileChange(state, { drivingLicenseFileList }) {
      return { ...state, drivingLicenseFileList, drivingLicenseFile: drivingLicenseFileList.length >= 1 ? drivingLicenseFileList[0].response : '' }
    },
    taximeterFileChange(state, { taximeterFileList }) {
      return { ...state, taximeterFileList, taximeterFile: taximeterFileList.length >= 1 ? taximeterFileList[0].response : '' }
    },
    lookPreview(state, { previewImage, previewVisible }) {
      return { ...state, previewImage, previewVisible }
    },
    unlookPreview(state) {
      return { ...state, previewVisible: false }
    },

  },

  effects: {
    * init({}, { update, tableBindType, formBindType, select }) {
      const { init } = yield select(({ annualVerificationStore }) => annualVerificationStore)
      if (!init) {
        yield tableBindType({
        })

        yield formBindType({
        })
        yield update({ init: true })
      }
    },
    *queryPage(playload, {get, put}) {  // eslint-disable-line
      const response = yield get(`${prefix}/queryPage`, playload)
      yield put({ type: 'queryPageSuccess', page: response.result, pageState: false })
    },
    * expireing(playload, { get, put }) {
      const response = yield get(`${prefix}/expireing`, playload)
      yield put({ type: 'queryPageSuccess', page: response.result, pageState: false })
    },
    * expired(playload, { get, put }) {
      const response = yield get(`${prefix}/expired`, playload)
      yield put({ type: 'queryPageSuccess', page: response.result, pageState: false })
    },
    * insert(playload, { post, put, select }) {
      const response = yield post(`${prefix}/insert`, playload)
      if (response.code === '200') {
        ZMsg.info(response.msg)
        const page = yield select(state => state.annualVerificationStore.page)
        yield put({ type: 'queryPage', pageNo: page.pageNo, pageSize: page.pageSize })
      } else {
        Modal.info({
          title: '温馨提示',
          content: (
            response.msg
          ),
        })
      }
    },
    * updateNotNull(playload, { post, put, select }) {
      const response = yield post(`${prefix}/update`, playload)
      if (response.code === '200') {
        ZMsg.info(response.msg)
        const page = yield select(state => state.annualVerificationStore.page)
        yield put({ type: 'queryPage', pageNo: page.pageNo, pageSize: page.pageSize })
      } else {
        Modal.info({
          title: '温馨提示',
          content: (
            response.msg
          ),
        })
      }
    },
    // 删除车辆信息
    * deleteById({ id }, { get, put, select }) {
      const response = yield get(`${prefix}/deleteById`, { id })
      ZMsg.info(response.msg)
      if (response.code === '200') {
        const page = yield select(state => state.annualVerificationStore.page)
        yield put({ type: 'queryPage', pageNo: page.pageNo, pageSize: page.pageSize })
      }
    },

  },

  subscriptions: {

    setup({ dispatch, listen }) {
      listen(`/${prefix}`, () => {
        dispatch({
          type: 'init',
        })
        dispatch({
          type: 'queryPage',
          pageNo: 1,
          pageSize: 10,
        })
      })
    },

  },


})
