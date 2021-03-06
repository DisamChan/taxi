import { extend } from 'ModelUtils'

const prefix = 'commonPraise'
const urlPrefix = '/driver/commonPraise'

export default extend({

  /**
   * 全局别名
   */
  namespace: `${prefix}Store`,

  /**
   * state 的每一个属性都应该有注释
   */
  state: {
    // 是否跳转页面
    register: false,
    // 跳转哪种页面(新增，修改，详情，分页  默认分页)
    res: 'page',

    // 分页查询结果, 是一个分页对象 Page
    page: {
      pageNo: 0,
      pageSize: 10,
      totalCount: 0,
      dataList: [],
    },

    // 条件查询 -- carNo and plateNumber
    carNo: [],
    plateNumber: [],

    // 运载的 普通表扬 信息
    commonPraise: {},
    /** 上传图片 */
    previewVisible: false,
    imgURLList: [],
  },

  /**
   * 这里的方法都是用来改变 state 属性
   * 只要 state 属性有注释，则很容易明白这些方法是干什么的
   */
  reducers: {
    // 页面跳转行为
    toRegister(state, action) {
      return { ...state, register: true, res: action.res }
    },
    toPage(state) {
      return { ...state, register: false }
    },
    // 分页 普通表扬 查询
    queryPageSuccess(state, { page = {
      pageNo: 0,
      pageSize: 10,
      totalCount: 0,
      dataList: [],
    } }) {
      return { ...state, page, register: false }
    },
    // 添加 普通表扬
    insertSuccess(state) {
      return { ...state }
    },
    // 修改 普通表扬 页面
    toEdit(state, action) {
      let imgURLList = []
      if (action.commonPraise.imgURL != null) {
        imgURLList = [{ uid: 0, url: UPLOAD_URL + action.commonPraise.imgURL, status: 'done' }]
      }
      return { ...state, register: true, res: action.res, commonPraise: action.commonPraise, imgURLList }
    },
    // 上传图片
    imgChange(state, { imgURLList }) {
      return { ...state, imgURLList, imgURLImage: imgURLList.length >= 1 ? imgURLList[0].response : '' }
    },
    // 预览图片
    lookPreview(state, { previewImage, previewVisible }) {
      return { ...state, previewImage, previewVisible }
    },
    // 删除图片
    unlookPreview(state) {
      return { ...state, previewVisible: false }
    },
    // 清除图片缓存
    cleanImage(state) {
      return { ...state, imgURLImage: '' }
    },

  },

  /**
   * 异步方法，可以做如下东西：
   * loading,
   * 弹窗、提示
   * 请求服务器（可以连续请求不同方法）
   * 调用 reducers 里的方法
   * 操作 session storage、local storage 等等
   */
  effects: {

    * init({}, { update, tableBindType, formBindType, select }) {
      const { init } = yield select(({ commonPraiseStore }) => commonPraiseStore)
      if (!init) {
        yield tableBindType({
        })

        yield formBindType({
        })
        yield update({ init: true })
      }
    },

    // 分页 查询
    * queryPage(playload, { get, put }) {
      const response = yield get(`${urlPrefix}/queryPage`, playload)
      yield put({ type: 'queryPageSuccess', page: response.result, register: false })
    },
    // 新增普通表扬
    * insert(playload, { post, put }) {
      const response = yield post(`${urlPrefix}/insert`, playload)
      if (+response.code === 200) {
        ZMsg.success(response.msg)
        yield put({ type: 'cleanImage' })
        yield put({ type: 'insertSuccess' })
        yield put({ type: 'queryPage' })
      } else { ZMsg.error(response.msg) }
    },
    // 修改 普通表扬 页面
    * update(playload, { post, put, select }) {
      const response = yield post(`${urlPrefix}/update`, playload)
      if (+response.code === 200) {
        ZMsg.success(response.msg)
        const page = yield select(state => state.commonPraiseStore.page)
        yield put({ type: 'cleanImage' })
        yield put({ type: 'insertSuccess' })
        yield put({ type: 'queryPage', pageNo: page.pageNo, pageSize: page.pageSize })
      } else { ZMsg.error(response.msg) }
    },

    // 删除 普通表扬
    * deleteById({ id }, { get, put, select }) {
      const response = yield get(`${urlPrefix}/deleteById`, id)
      if (+response.code === 200) {
        ZMsg.success(response.msg)
        const page = yield select(state => state.commonPraiseStore.page)
        yield put({ type: 'queryPage', pageNo: page.pageNo, pageSize: page.pageSize })
      } else { ZMsg.error(response.msg) }
    },

  },


  /**
   * 订阅：如果需要一进页面就进行数据查询，在这里完成
   * 如果想监听用户键盘操作，也在这里完成
   */
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

