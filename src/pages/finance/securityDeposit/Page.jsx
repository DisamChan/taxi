import { connect } from 'dva';

import { Form, Input, Button, Icon, Popconfirm, Alert, Table, Upload, Modal } from 'antd';
import styles from './Page.css';
import Add from './Add.jsx';
import Update from './Update.jsx';
import Detail from './Detail.jsx';
import qs from 'qs';

const FormItem = Form.Item;
const { tokenSessionKey, resourceSessionKey } = constant;

let Index = (option) => {
  const { page, dispatch, form, res, register } = option;
  const { getFieldDecorator } = form;

  /* 详情 */
  function toDetail(securityDeposit) {
    dispatch({
      type: 'securityDepositStore/toEdit',
      res: 'detail',
      securityDeposit,
    });
  }
  /* 添加 */
  function toAdd(e) {
    dispatch({
      type: 'securityDepositStore/toRegister',
      res: 'add',
    });
  }
  /* 编辑 */
  function toEdit(securityDeposit) {
    dispatch({
      type: 'securityDepositStore/toEdit',
      res: 'update',
      securityDeposit,
    });
  }

  /* 删除 */
  function confirm(id) {
    dispatch({
      type: 'securityDepositStore/deleteById',
      id,
    });
  }

  const token = session.get(tokenSessionKey);
  /* 导出 */
  function toExport(e) {
    const carNo = form.getFieldValue('carNo');
    const plateNumber = form.getFieldValue('plateNumber');
    const params = {
      carNo,
      plateNumber,
    };
    // 删除空值、undefind
    Object.keys(params).map(v => params[v] || delete params[v]);
    const paramsForGet = (params && qs.stringify(params)) || '';
    window.location.href = `/securityDeposit/export.htm?token=${token}&${paramsForGet}`;
  }
  /**
   * 上传文件
   * @type {{name: string, action: string, headers: {authorization: string}, onChange: ((info))}}
   */
  const importCar = {
    name: 'file',
    action: `/securityDeposit/import.htm?token=${token}`,
    headers: {
      authorization: 'authorization-text',
    },
    onChange(info) {
      if (info.file.status !== 'uploading') {
        console.log('uploading');
      }
      if (info.file.status === 'done') {
        Modal.info({
          title: '导入结果',
          content: (
            info.file.response.msg
          ),
          onOk() {
            dispatch({
              type: 'securityDepositStore/queryPage',
            });
          },
        });
      } else if (info.file.status === 'error') {
        console.log('error');
      }
    },
  };

  /**
   * 条件查询
   */
  const query = (e) => {
    e.preventDefault();
    form.validateFields((err, values) => {
      dispatch({
        type: 'securityDepositStore/queryPage',
        ...values,
      });
    });
  };

  let a;
  if (res == 'add') {
    a = <Add key="add" />;
  } else if (res == 'update') {
    a = <Update key="update" />;
  } else if (res == 'detail') {
    a = <Detail key="detail" />;
  }

  const columns = [{
    title: '自编号',
    dataIndex: 'carNo',
    key: 'carNo',
  }, {
    title: '车牌号',
    dataIndex: 'plateNumber',
    key: 'plateNumber',
  }, {
    title: '姓名',
    dataIndex: 'userName',
    key: 'userName',
  }, {
    title: '资格证',
    dataIndex: 'qualificationNo',
    key: 'qualificationNo',
  }, {
    title: '安全保证金金额',
    dataIndex: 'amount',
    key: 'amount',
  }, {
    title: '安全保证金缴纳日期',
    dataIndex: 'payDate',
    key: 'payDate',
  }, {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    render: text => text == true ? '正常' : '退还',
  }, {
    title: '安全保证金退还日期',
    dataIndex: 'refundDate',
    key: 'refundDate',
  }, {
    title: '入职日期',
    dataIndex: 'entryDate',
    key: 'entryDate',
  }, {
    title: '操作',
    key: 'operation',
    render: (text, record) => (
      <span>
        <ZButton permission="finance:securityDeposit:query">
          <Button type="primary" onClick={() => toDetail(record)}>详情</Button>&nbsp;
        </ZButton>
        <ZButton permission="finance:securityDeposit:update">
          <Button type="primary" onClick={() => toEdit(record)}>编辑</Button>&nbsp;
        </ZButton>
      </span>
    ),
  }];

  return (
    <div>
      {
        register ? a
          :
        <div>
          <div>
            <ZButton permission="finance:securityDeposit:insert">
              <Button type="primary" icon="plus-circle-o" onClick={toAdd}>新增</Button>&nbsp;
            </ZButton>
            <ZButton permission="finance:securityDeposit:export">
              <Popconfirm title="是否确定要导出" onConfirm={toExport} >
                <Button type="primary" icon="export" >导出</Button>&nbsp;
              </Popconfirm>
            </ZButton>
            <ZButton permission="finance:securityDeposit:import">
              <Upload {...importCar}>
                <Button type="primary" icon="download" >导入</Button>
              </Upload>
            </ZButton>
          </div>
          <div className={styles.query}>
            <Form layout="inline" onSubmit={query}>
              <FormItem
                label={(<span>自编号&nbsp;</span>)}
              >
                {getFieldDecorator('carNo')(<Input />)}
              </FormItem>
              <FormItem
                label={(<span>车牌号&nbsp;</span>)}
              >
                {getFieldDecorator('plateNumber')(<Input />)}
              </FormItem>
              <Button type="primary" htmlType="submit">查询</Button>
            </Form>
          </div>
          <Table
            rowKey="id"
            dataSource={(page && page.dataList) || []}
            columns={columns}
            bordered
            pagination={{  // 分页
              total: (page && +page.totalCount) || 0, // 总数量
              pageSize: (page && +page.pageSize) || 10,  // 显示几条一页
              defaultPageSize: 10, // 默认显示几条一页
              showSizeChanger: true,  // 是否显示可以设置几条一页的选项
              onShowSizeChange(current, pageSize) {  // 当几条一页的值改变后调用函数，current：改变显示条数时当前数据所在页；pageSize:改变后的一页显示条数
                form.validateFields((err, values) => {
              　　dispatch({
                    type: 'securityDepositStore/queryPage',
                    pageNo: current,
                    pageSize,
                    ...values,
                  });
                });
              },
              onChange(page, pageSize) {  // 点击改变页数的选项时调用函数，current:将要跳转的页数
                form.validateFields((err, values) => {
                  dispatch({
                    type: 'securityDepositStore/queryPage',
                    pageNo: page,
                    pageSize,
                    ...values,
                  });
                });
              },
              showTotal() {  // 设置显示一共几条数据
                return `共 ${(page && page.totalCount) || 0} 条数据`;
              },
            }}
          />
        </div>
      }
    </div>
  );
};

function mapStateToProps({ securityDepositStore }) {
  return {
    register: securityDepositStore.register,
    res: securityDepositStore.res,
    page: securityDepositStore.page,
  };
}

Index = Form.create()(Index);
export default connect(mapStateToProps)(Index);
