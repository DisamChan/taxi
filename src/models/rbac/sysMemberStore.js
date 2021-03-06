import { extend } from 'ModelUtils'
import { Select } from 'antd'

const Option = Select.Option
const moduleName = '用户'
const prefix = 'sysMember'
const queryPageUrl = `${prefix}/queryPage`
const addUrl = `${prefix}/insert`
const updateUrl = `${prefix}/update`
const deleteByIdUrl = `${prefix}/deleteById`

export default extend({
  namespace: `${prefix}Store`,
  state: {
    visible: {
      add: false,
      update: false,
    },
    page: {},
    [prefix]: {},
  },
  effects: {

    * init({}, { update, tableBindType, formBindType, select }) {
      const { init } = yield select(({ sysMemberStore }) => sysMemberStore)
      if (!init) {
        yield tableBindType({
          initPwd: text => {
            return +text === 1 ? '正常' : '未初始化'
          },
          locked: text => {
            return +text === 0 ? '锁定' : '正常'
          },
        })
        yield formBindType({

          initPwd: ({ showPlaceholder }) => {
            return {
              input: (
                <Select key="initPwd" allowClear placeholder={showPlaceholder || '请选择'}>
                  <Option key="initPwd0" value="true">正常</Option>
                  <Option key="initPwd1" value="false">未初始化</Option>
                </Select>
              ),
            }
          },

          locked: ({ showPlaceholder }) => {
            return {
              input: (
                <Select key="locked" allowClear placeholder={showPlaceholder || '请选择'}>
                  <Option key="locked0" value="true">正常</Option>
                  <Option key="locked1" value="false">锁定</Option>
                </Select>
              ),
            }
          },

          invalid: ({ showPlaceholder }) => {
            return {
              input: (
                <Select key="invalid" allowClear placeholder={showPlaceholder || '请选择'}>
                  <Option key="invalid0" value="true">有效</Option>
                  <Option key="invalid1" value="false">无效</Option>
                </Select>
              ),
            }
          },
        })
        yield update({ init: true })
      }
    },

    * queryPage(payload, { getMessage, update }) {
      const { result = {} } = yield getMessage(queryPageUrl, payload, `${moduleName}列表`)
      yield update({ page: result })
    },

    /**
     * 不提示刷新分页，增删改操作使用
     */
    * reload(payload, { get, update }) {
      const { result } = yield get(queryPageUrl, payload)
      yield update({ page: result })
    },

    * add(payload, { postConfirmLoading, put, select }) {
      const { pageNo, pageSize } = yield select(({ sysMemberStore }) => sysMemberStore.page)
      const { code = 0, msg = '' } = yield postConfirmLoading(addUrl, payload)
      if (code === 200) {
        ZMsg.success(msg)
        yield [
          put('reload', { pageNo, pageSize }), // 刷新列表
          put('hideVisible', { key: 'add' }), // 控制弹窗
        ]
      }
    },

    * update(payload, { postConfirmLoading, put, diff, select }) {
      const { sysMember, page: { pageNo, pageSize } } = yield select(({ sysMemberStore }) => sysMemberStore)
      const newSysMember = { ...sysMember, ...payload }
      if (diff(sysMember, newSysMember)) {
        const { code, msg } = yield postConfirmLoading(updateUrl, newSysMember)
        if (code === 200) {
          ZMsg.success(msg)
          yield [
            put('reload', { pageNo, pageSize }), // 刷新列表
            put('hideVisible', { key: 'update' }), // 控制弹窗
          ]
        }
      }
    },

    * deleteById({ id }, { getMessage, put }) {
      yield getMessage(deleteByIdUrl, { id: +id }, { successMsg: `删除${moduleName}成功`, errorMsg: `删除${moduleName}失败` })
      yield put('reload') // 刷新列表
    },

  },
  reducers: {},
  subscriptions: {
    setup({ dispatch, listen }) {
      listen(`/${prefix}`, () => {
        dispatch({
          type: 'init',
        })
        dispatch({
          type: 'queryPage',
        })
      })
    },
  },
})

